-- Automation upgrade for Help AI MVP

create table if not exists public.integration_state (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_support_emails_message_id_unique
  on public.support_emails(message_id)
  where message_id is not null;
