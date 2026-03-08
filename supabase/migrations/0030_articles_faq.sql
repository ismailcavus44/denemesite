-- FAQ alanı: [{ "question": "...", "answer": "..." }, ...]
alter table public.articles add column if not exists faq jsonb default '[]'::jsonb;
