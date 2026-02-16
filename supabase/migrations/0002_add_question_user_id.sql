alter table questions
add column if not exists user_id uuid references auth.users(id);

create index if not exists questions_user_id_idx on questions (user_id);
