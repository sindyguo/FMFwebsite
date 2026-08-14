insert into public.faq_items (category, question_patterns, answer, priority, status, source)
select
  'congress',
  '["congress payment failed","registration payment failed","payment failed","my congress payment failed","register congress payment issue"]'::jsonb,
  'You do not need to restart the registration process from the beginning. You can find the pending order under the "My Order" tab on your Own Page, click Pay, and complete the payment.',
  95,
  'active',
  'manual'
where not exists (
  select 1
  from public.faq_items
  where category = 'congress'
    and status = 'active'
    and answer = 'You do not need to restart the registration process from the beginning. You can find the pending order under the "My Order" tab on your Own Page, click Pay, and complete the payment.'
);
