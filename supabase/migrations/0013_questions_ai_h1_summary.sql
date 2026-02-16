alter table questions
  add column if not exists ai_h1_summary text,
  add column if not exists ai_h1_enabled boolean default false,
  add column if not exists ai_h1_updated_at timestamptz;
