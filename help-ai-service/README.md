# help-ai-service (Independent MVP)

Independent backend service for:
- Collecting help-related emails
- Classifying and grouping issues
- Generating FAQ candidates
- Publishing active FAQ for website chatbot

## 1. Run locally

```bash
cd help-ai-service
npm install
cp .env.example .env
npm run dev
```

Service base URL (default): `http://localhost:3080`

## 2. API overview

### Public (for website chatbot)
- `GET /health`
- `GET /v1/faq/active`
- `POST /v1/help/feedback`

### Admin/Internal
- `POST /v1/email/ingest`
- `POST /v1/faq/candidates/generate`
- `GET /v1/faq/candidates`
- `POST /v1/faq/:candidateId/publish`
- `GET /v1/stats`

## 3. Quick test flow

### 1) Ingest sample emails
```bash
curl -X POST http://localhost:3080/v1/email/ingest \
  -H 'Content-Type: application/json' \
  -d '{
    "emails": [
      {
        "sender": "doctor1@example.com",
        "subject": "Cannot login to my account",
        "body": "I cannot login and verification code always fails."
      },
      {
        "sender": "doctor2@example.com",
        "subject": "Forgot password",
        "body": "I did not receive the reset email."
      }
    ]
  }'
```

### 2) Generate candidates
```bash
curl -X POST http://localhost:3080/v1/faq/candidates/generate
```

### 3) Review candidates
```bash
curl http://localhost:3080/v1/faq/candidates
```

### 4) Publish one candidate
```bash
curl -X POST http://localhost:3080/v1/faq/<candidateId>/publish \
  -H 'Content-Type: application/json' \
  -d '{"priority": 8}'
```

### 5) Frontend fetches active FAQ
```bash
curl http://localhost:3080/v1/faq/active
```

## 4. Storage

MVP uses local JSON files in `storage/`:
- `faq-items.json`
- `emails.json`
- `faq-candidates.json`
- `feedback.json`

For production, replace `src/data/store.js` with PostgreSQL adapter.
