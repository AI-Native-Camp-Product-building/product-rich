-- extensions-marketplace: 설치 요청 테이블
create table public.requests (
  id uuid default gen_random_uuid() primary key,
  site_url text not null,
  contact_channel text not null,
  requested_app_id text,
  requested_app_name text not null,
  desired_launch_window text,
  problem_statement text not null,
  source text default 'extensions.liveklass.com',
  status text default '접수' check (status in ('접수', '검토중', '적용중', '완료', '보류')),
  assigned_to text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: anon은 INSERT만 허용 (폼 제출), SELECT/UPDATE는 service_role만
alter table public.requests enable row level security;

create policy "anon_insert" on public.requests
  for insert to anon
  with check (true);

-- updated_at 자동 갱신 트리거
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.requests
  for each row
  execute function public.handle_updated_at();
