# Supabase Deployment for Help AI MVP

This package deploys the independent Help AI backend to Supabase.

## 1) Prerequisites

- Supabase CLI installed
- Existing Supabase project

## 2) Link project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

## 3) Apply database migration

```bash
supabase db push
```

This creates tables:
- `faq_items`
- `support_emails`
- `faq_candidates`
- `help_feedback`

## 4) Set function secrets

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are built-in for Supabase Edge Functions.
Set only app secrets below:

```bash
supabase secrets set HELP_API_ADMIN_TOKEN=<a-random-long-token>
supabase secrets set OUTLOOK_CLIENT_ID=<azure-app-client-id>
supabase secrets set OUTLOOK_CLIENT_SECRET=<azure-app-client-secret>
supabase secrets set OUTLOOK_TENANT_ID=<tenant-id-or-common>
supabase secrets set OUTLOOK_REFRESH_TOKEN=<microsoft-refresh-token>
supabase secrets set OUTLOOK_USER_EMAIL=<your-mailbox@outlook.com>

# Optional legacy Gmail support
supabase secrets set GMAIL_CLIENT_ID=<google-oauth-client-id>
supabase secrets set GMAIL_CLIENT_SECRET=<google-oauth-client-secret>
supabase secrets set GMAIL_REFRESH_TOKEN=<google-oauth-refresh-token>
supabase secrets set GMAIL_USER_EMAIL=<your-mailbox@gmail.com>
```

## 5) Deploy API function

```bash
supabase functions deploy help-api --no-verify-jwt
```

## 6) Function base URL

```txt
https://<your-project-ref>.supabase.co/functions/v1/help-api
```

Use this in frontend env:

```bash
VUE_APP_HELP_API_BASE_URL=https://<your-project-ref>.supabase.co/functions/v1/help-api
```

## 7) API routes

- `GET /v1/faq/active`
- `POST /v1/help/feedback`
- `POST /v1/email/ingest`
- `POST /v1/faq/candidates/generate`
- `GET /v1/faq/candidates`
- `POST /v1/faq/:candidateId/reject` (mark as rejected and skip in future generate)
- `DELETE /v1/faq/:candidateId` (draft only)
- `POST /v1/faq/:candidateId/publish`
- `GET /v1/stats`
- `POST /v1/jobs/sync-mails` (default provider: `outlook`)
- `POST /v1/jobs/sync-gmail`
- `POST /v1/jobs/run-daily`

All admin routes require:

```http
Authorization: Bearer <HELP_API_ADMIN_TOKEN>
```

## 8) Smoke test

```bash
curl "https://<your-project-ref>.supabase.co/functions/v1/help-api/v1/faq/active"
```

## 9) Run daily automation

1) Manual run:

```bash
curl -X POST "https://<your-project-ref>.supabase.co/functions/v1/help-api/v1/jobs/run-daily" \
  -H "Authorization: Bearer <HELP_API_ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"provider":"outlook","limit":30}'
```

2) Supabase Scheduled Function:
- In Dashboard -> Edge Functions -> `help-api` -> Schedules
- Add cron like `*/30 * * * *`
- Path: `/v1/jobs/run-daily`
- Method: `POST`
- Header: `Authorization: Bearer <HELP_API_ADMIN_TOKEN>`
