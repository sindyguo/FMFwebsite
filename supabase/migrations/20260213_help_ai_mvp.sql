-- Help AI MVP schema for Supabase
create extension if not exists pgcrypto;

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('login', 'password', 'course', 'exam', 'congress', 'other')),
  question_patterns jsonb not null default '[]'::jsonb,
  answer text not null,
  priority int not null default 5,
  status text not null default 'active' check (status in ('active', 'archived')),
  source text not null default 'seed',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.support_emails (
  id uuid primary key default gen_random_uuid(),
  message_id text,
  sender text,
  subject text not null default '',
  body text not null default '',
  summary text not null default '',
  category text not null default 'other' check (category in ('login', 'password', 'course', 'exam', 'congress', 'other')),
  matched_keywords jsonb not null default '[]'::jsonb,
  confidence numeric(4,3) not null default 0.35,
  status text not null default 'processed',
  received_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.faq_candidates (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('login', 'password', 'course', 'exam', 'congress', 'other')),
  question_patterns jsonb not null default '[]'::jsonb,
  answer_draft text not null,
  source_count int not null default 0,
  source_email_ids jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'rejected')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.help_feedback (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  matched_faq_id uuid,
  route_path text,
  helpful boolean,
  created_at timestamptz not null default now()
);

create index if not exists idx_faq_items_status_priority on public.faq_items(status, priority desc);
create index if not exists idx_support_emails_category on public.support_emails(category);
create index if not exists idx_faq_candidates_status on public.faq_candidates(status);
create index if not exists idx_help_feedback_created_at on public.help_feedback(created_at desc);

insert into public.faq_items (category, question_patterns, answer, priority, status, source)
select * from (
  values
  ('login', '["login failed","cannot login","verification code invalid","account not found"]'::jsonb,
   'For login issues, verify your email/username and password, refresh the page, and request a new verification code. If your account cannot be found, please register first or contact support.', 10, 'active', 'seed'),
  ('password', '["forgot password","reset password","password reset email not received"]'::jsonb,
   'To reset password: open Login, click Forgot Password, complete email/phone verification, then set your new password.', 9, 'active', 'seed'),
  ('course', '["course progress not updated","where to start course","course materials"]'::jsonb,
   'Open the Course page, complete chapters in order, and refresh or re-login if progress does not update.', 8, 'active', 'seed'),
  ('exam', '["exam entry","exam retake","where to check score"]'::jsonb,
   'Complete required chapters first, then take the exam and check your score and status in your account center.', 8, 'active', 'seed'),
  ('congress', '["congress registration","payment confirmation","invoice download"]'::jsonb,
   'For congress registration, review event details, complete registration and payment, then check confirmation and invoice in your email or account center.', 8, 'active', 'seed')
) as seed_data(category, question_patterns, answer, priority, status, source)
where not exists (select 1 from public.faq_items fi where fi.source = 'seed');
