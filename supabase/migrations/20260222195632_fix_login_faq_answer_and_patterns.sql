update public.faq_items
set
  question_patterns = '[
    "login failed",
    "login fails",
    "what should i do if login fails",
    "cannot login",
    "can not login",
    "cannot sign in",
    "verification code invalid",
    "account not found"
  ]'::jsonb,
  answer = 'Please make sure the email you use is the one registered for your previous account. You can try resetting your password with that registered email, or log in (or create a new account) using your email and a verification code. For further assistance, contact education@fetalmedicine.org.',
  priority = 100,
  updated_at = now()
where category = 'login' and status = 'active';
