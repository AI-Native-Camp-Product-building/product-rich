-- extensions-marketplace: 피드백 테이블
create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  app_id text not null,
  app_name text not null,
  message text not null,
  contact text,
  source text default 'extensions.liveklass.com',
  created_at timestamptz default now()
);

-- RLS: anon은 INSERT만 허용
alter table public.feedback enable row level security;

create policy "anon_insert" on public.feedback
  for insert to anon
  with check (true);
