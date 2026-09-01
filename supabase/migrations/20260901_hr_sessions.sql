-- Histórico de sessões de monitoramento de frequência cardíaca via Bluetooth
-- (braceletes COOSPO e monitores BLE compatíveis), usado tanto no modo
-- individual quanto no modo turma/equipe.
--
-- Ajuste os tipos de tenant_id/student_id caso as tabelas `tenants` e
-- `students` do projeto usem um tipo de id diferente de uuid.

create table if not exists public.hr_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  mode text not null default 'individual', -- individual | team
  room_code text,
  device_name text,
  avg_bpm integer,
  max_bpm integer,
  min_bpm integer,
  calories integer,
  duration_sec integer,
  created_at timestamptz not null default now()
);

create index if not exists hr_sessions_student_idx on public.hr_sessions (student_id, created_at desc);
create index if not exists hr_sessions_tenant_idx on public.hr_sessions (tenant_id, created_at desc);

alter table public.hr_sessions enable row level security;

-- Replique aqui o mesmo padrão de policy usado nas demais tabelas do projeto
-- (ex: acesso liberado para a anon key, já que a autenticação é feita por
-- e-mail na camada da aplicação). Exemplo permissivo para começar:
create policy "hr_sessions_all" on public.hr_sessions
  for all using (true) with check (true);
