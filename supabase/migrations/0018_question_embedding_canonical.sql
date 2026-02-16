-- Benzer soru tespiti: embedding + canonical yönlendirme
create extension if not exists vector;

alter table questions
  add column if not exists embedding vector(1536),
  add column if not exists canonical_question_id uuid references questions(id) on delete set null;

create index if not exists questions_canonical_id_idx on questions (canonical_question_id) where canonical_question_id is not null;

comment on column questions.embedding is 'OpenAI text-embedding-3-small; soru metni benzerliği için';
comment on column questions.canonical_question_id is 'Bu soru ana soruya yönlendiriliyorsa, ana sorunun id''si';

-- Benzer soruları döndürür (cosine similarity). Sadece yayında ve embedding dolu olanlar.
create or replace function match_similar_questions(
  p_query_embedding vector(1536),
  p_exclude_id uuid default null,
  p_match_count int default 10,
  p_min_similarity float default 0.5
)
returns table (
  id uuid,
  title text,
  slug text,
  category_slug text,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    q.id,
    q.title,
    q.slug,
    c.slug as category_slug,
    (1 - (q.embedding <=> p_query_embedding))::float as similarity
  from questions q
  join categories c on c.id = q.category_id
  where q.status = 'published'
    and q.embedding is not null
    and (p_exclude_id is null or q.id != p_exclude_id)
    and (1 - (q.embedding <=> p_query_embedding)) >= p_min_similarity
  order by q.embedding <=> p_query_embedding
  limit least(p_match_count, 20);
$$;

-- Embedding güncellemesi (REST ile vector göndermek bazen sorun çıkarır)
create or replace function set_question_embedding(p_question_id uuid, p_embedding vector(1536))
returns void
language sql
security definer
set search_path = public
as $$
  update questions set embedding = p_embedding where id = p_question_id;
$$;
