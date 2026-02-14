import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Json = Record<string, unknown>
type MailProvider = 'outlook' | 'gmail'
type Category = 'login' | 'password' | 'course' | 'exam' | 'congress' | 'other'

type Classified = {
  category: Category
  keywords: string[]
  confidence: number
}

type EmailRow = {
  message_id: string | null
  sender: string | null
  subject: string
  body: string
  summary: string
  category: Category
  matched_keywords: string[]
  confidence: number
  status: string
  received_at: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const adminToken = Deno.env.get('HELP_API_ADMIN_TOKEN') ?? ''

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const db = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

const categoryRules: Array<{ category: Classified['category']; keywords: string[] }> = [
  { category: 'login', keywords: ['login', 'sign in', 'signin', 'verification code', 'account locked', 'account not found'] },
  { category: 'password', keywords: ['forgot password', 'reset password', 'password reset', 'password link', 'password'] },
  { category: 'course', keywords: ['course', 'lesson', 'chapter', 'learning', 'material', 'video', 'progress'] },
  { category: 'exam', keywords: ['exam', 'test', 'score', 'result', 'certificate', 'retake'] },
  { category: 'congress', keywords: ['congress', 'registration', 'register', 'invoice', 'payment', 'attendee'] }
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { pathname } = new URL(req.url)
    const routePath = normalizePath(pathname)

    if (req.method === 'GET' && routePath === '/v1/faq/active') return await getActiveFaq()
    if (req.method === 'POST' && routePath === '/v1/help/feedback') return await addFeedback(req)

    if (req.method === 'POST' && routePath === '/v1/email/ingest') return await guardAdmin(req, () => ingestEmails(req))
    if (req.method === 'POST' && routePath === '/v1/faq/candidates/generate') return await guardAdmin(req, () => generateCandidates())
    if (req.method === 'GET' && routePath === '/v1/faq/candidates') return await guardAdmin(req, () => listCandidates())
    if (req.method === 'GET' && routePath === '/v1/stats') return await guardAdmin(req, () => getStats())

    if (req.method === 'POST' && routePath === '/v1/jobs/sync-mails') return await guardAdmin(req, () => syncMails(req))
    if (req.method === 'POST' && routePath === '/v1/jobs/sync-gmail') return await guardAdmin(req, () => syncGmailCompatibility(req))
    if (req.method === 'POST' && routePath === '/v1/jobs/run-daily') return await guardAdmin(req, () => runDailyPipeline(req))

    const publishMatch = routePath.match(/^\/v1\/faq\/([0-9a-f-]{36})\/publish$/)
    const rejectMatch = routePath.match(/^\/v1\/faq\/([0-9a-f-]{36})\/reject$/)
    const candidateMatch = routePath.match(/^\/v1\/faq\/([0-9a-f-]{36})$/)
    if (req.method === 'POST' && publishMatch) {
      return await guardAdmin(req, () => publishCandidate(req, publishMatch[1]))
    }
    if (req.method === 'POST' && rejectMatch) {
      return await guardAdmin(req, () => rejectCandidate(rejectMatch[1]))
    }
    if (req.method === 'DELETE' && candidateMatch) {
      return await guardAdmin(req, () => deleteDraftCandidate(candidateMatch[1]))
    }

    return json({ message: `Route not found: ${routePath}` }, 404)
  } catch (error) {
    console.error('[help-api] unexpected error', error)
    return json({ message: 'Internal server error' }, 500)
  }
})

function normalizePath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean.startsWith('/help-api/')) return clean.slice('/help-api'.length)
  if (clean === '/help-api') return '/'
  return clean
}

async function guardAdmin(req: Request, handler: () => Promise<Response>): Promise<Response> {
  if (!isAdminAuthorized(req)) return json({ message: 'Unauthorized' }, 401)
  return await handler()
}

function isAdminAuthorized(req: Request): boolean {
  if (!adminToken) return true
  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return false
  return auth.slice('Bearer '.length).trim() === adminToken
}

function parseProvider(value: unknown): MailProvider {
  if (String(value || '').toLowerCase() === 'gmail') return 'gmail'
  return 'outlook'
}

function syncStateKey(provider: MailProvider): string {
  return `${provider}_sync`
}

async function getActiveFaq(): Promise<Response> {
  const { data, error } = await db
    .from('faq_items')
    .select('id, category, question_patterns, answer, priority, status, updated_at')
    .eq('status', 'active')
    .order('priority', { ascending: false })

  if (error) return json({ message: error.message }, 500)
  return json({ data: data ?? [], meta: { total: data?.length ?? 0 } })
}

async function addFeedback(req: Request): Promise<Response> {
  const body = (await safeJson(req)) as Json
  const question = String(body.question ?? '').trim()
  if (!question) return json({ message: 'question is required' }, 400)

  const payload = {
    question,
    matched_faq_id: toUuidOrNull(body.matchedFaqId),
    route_path: typeof body.routePath === 'string' ? body.routePath : null,
    helpful: typeof body.helpful === 'boolean' ? body.helpful : null
  }

  const { error } = await db.from('help_feedback').insert(payload)
  if (error) return json({ message: error.message }, 500)
  return json({ ok: true }, 201)
}

async function ingestEmails(req: Request): Promise<Response> {
  const body = (await safeJson(req)) as Json
  const emails = Array.isArray(body.emails) ? body.emails : []
  if (emails.length === 0) return json({ message: 'emails array is required' }, 400)

  const rows = emails.map((item) => normalizeInboundEmail(item))
  const inserted = await upsertEmails(rows)

  return json({
    ok: true,
    ingested: inserted.inserted,
    deduplicated: inserted.deduplicated,
    categories: summarizeCategories(rows)
  }, 201)
}

async function syncGmailCompatibility(req: Request): Promise<Response> {
  const body = (await safeJson(req)) as Json
  const limit = clamp(Number(body.limit ?? 20), 1, 100)
  const since = typeof body.since === 'string' ? body.since : ''
  const generateCandidates = Boolean(body.generateCandidates ?? false)

  return await syncProviderAndRespond({
    provider: 'gmail',
    limit,
    since,
    generateCandidates
  })
}

async function syncMails(req: Request): Promise<Response> {
  const body = (await safeJson(req)) as Json
  const provider = parseProvider(body.provider)
  const limit = clamp(Number(body.limit ?? 20), 1, 100)
  const since = typeof body.since === 'string' ? body.since : ''
  const generateCandidates = Boolean(body.generateCandidates ?? false)

  return await syncProviderAndRespond({ provider, limit, since, generateCandidates })
}

async function syncProviderAndRespond(options: {
  provider: MailProvider
  limit: number
  since: string
  generateCandidates: boolean
}): Promise<Response> {
  try {
    const syncResult = await syncProviderInternal({
      provider: options.provider,
      limit: options.limit,
      since: options.since
    })

    let generatedCandidates = 0
    if (options.generateCandidates) {
      const generated = await generateCandidatesInternal()
      generatedCandidates = generated.generated
    }

    return json({
      ok: true,
      provider: options.provider,
      ...syncResult,
      generatedCandidates
    })
  } catch (error) {
    const message = String(error)
    if (
      message.includes('OAuth is not configured')
      || message.includes('Failed to list')
      || message.includes('token error')
    ) {
      return json({ message }, 400)
    }
    return json({ message }, 500)
  }
}

async function runDailyPipeline(req: Request): Promise<Response> {
  const body = (await safeJson(req)) as Json
  const provider = parseProvider(body.provider)
  const limit = clamp(Number(body.limit ?? 30), 1, 200)

  try {
    const syncResult = await syncProviderInternal({ provider, limit, since: '' })
    const generated = await generateCandidatesInternal()

    return json({
      ok: true,
      pipeline: {
        provider,
        sync: syncResult,
        candidates: generated
      }
    })
  } catch (error) {
    const message = String(error)
    if (
      message.includes('OAuth is not configured')
      || message.includes('Failed to list')
      || message.includes('token error')
    ) {
      return json({ message }, 400)
    }
    return json({ message }, 500)
  }
}

async function syncProviderInternal(options: {
  provider: MailProvider
  limit: number
  since: string
}): Promise<Json> {
  const state = await getState(syncStateKey(options.provider))
  const since = options.since || String((state?.last_sync_at as string) || '')

  const rows = options.provider === 'gmail'
    ? await fetchGmailRows({ limit: options.limit, since })
    : await fetchOutlookRows({ limit: options.limit, since })

  const inserted = await upsertEmails(rows)
  await setState(syncStateKey(options.provider), {
    last_sync_at: new Date().toISOString(),
    last_fetched: rows.length,
    provider: options.provider
  })

  return {
    fetched: rows.length,
    inserted: inserted.inserted,
    deduplicated: inserted.deduplicated,
    categories: summarizeCategories(rows)
  }
}

async function fetchGmailRows(options: { limit: number; since: string }): Promise<EmailRow[]> {
  const gmailUser = Deno.env.get('GMAIL_USER_EMAIL') || 'me'
  const token = await getGmailAccessToken()
  if (!token) throw new Error('Gmail OAuth is not configured. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN.')

  const query = buildGmailQuery(options.since)
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(gmailUser)}/messages?maxResults=${options.limit}&q=${encodeURIComponent(query)}`
  const listResp = await fetch(listUrl, { headers: { Authorization: `Bearer ${token}` } })
  if (!listResp.ok) throw new Error(`Failed to list Gmail messages: ${await listResp.text()}`)

  const listData = await listResp.json() as { messages?: Array<{ id: string }> }
  const ids = (listData.messages || []).map((m) => m.id)
  const rows: EmailRow[] = []

  for (const id of ids) {
    const parsed = await fetchAndParseGmailMessage(gmailUser, token, id)
    if (parsed) rows.push(parsed)
  }

  return rows
}

async function fetchOutlookRows(options: { limit: number; since: string }): Promise<EmailRow[]> {
  const user = Deno.env.get('OUTLOOK_USER_EMAIL') || 'me'
  const token = await getOutlookAccessToken()
  if (!token) {
    throw new Error('Outlook OAuth is not configured. Set OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET, OUTLOOK_REFRESH_TOKEN.')
  }

  const filter = buildOutlookFilter(options.since)
  const select = '$select=id,subject,from,receivedDateTime,bodyPreview'
  const order = '$orderby=receivedDateTime desc'
  const top = `$top=${options.limit}`
  const filterPart = filter ? `&$filter=${encodeURIComponent(filter)}` : ''
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(user)}/messages?${select}&${order}&${top}${filterPart}`

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Prefer: 'outlook.body-content-type="text"'
    }
  })

  if (!resp.ok) throw new Error(`Failed to list Outlook messages: ${await resp.text()}`)

  const data = await resp.json() as {
    value?: Array<{
      id?: string
      subject?: string
      bodyPreview?: string
      receivedDateTime?: string
      from?: { emailAddress?: { address?: string } }
    }>
  }

  const rows: EmailRow[] = []
  for (const item of data.value || []) {
    const subject = String(item.subject || '')
    const body = String(item.bodyPreview || '')
    const sender = String(item.from?.emailAddress?.address || '')
    const classified = classifyText(`${subject}\n${body}`)

    rows.push({
      message_id: item.id ? `outlook:${item.id}` : null,
      sender: sender || null,
      subject,
      body,
      summary: summarize(body),
      category: classified.category,
      matched_keywords: classified.keywords,
      confidence: classified.confidence,
      status: 'processed',
      received_at: parseDate(item.receivedDateTime || '')
    })
  }

  return rows
}

async function getGmailAccessToken(): Promise<string | null> {
  const clientId = Deno.env.get('GMAIL_CLIENT_ID') || ''
  const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET') || ''
  const refreshToken = Deno.env.get('GMAIL_REFRESH_TOKEN') || ''
  if (!clientId || !clientSecret || !refreshToken) return null

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  })

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  })

  if (!resp.ok) {
    console.error('gmail token error:', await resp.text())
    return null
  }

  const data = await resp.json() as { access_token?: string }
  return data.access_token || null
}

async function getOutlookAccessToken(): Promise<string | null> {
  const clientId = Deno.env.get('OUTLOOK_CLIENT_ID') || ''
  const clientSecret = Deno.env.get('OUTLOOK_CLIENT_SECRET') || ''
  const refreshToken = Deno.env.get('OUTLOOK_REFRESH_TOKEN') || ''
  const tenantId = Deno.env.get('OUTLOOK_TENANT_ID') || 'common'

  if (!clientId || !clientSecret || !refreshToken) return null

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: 'offline_access Mail.Read'
  })

  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`
  const resp = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  })

  if (!resp.ok) {
    console.error('outlook token error:', await resp.text())
    return null
  }

  const data = await resp.json() as { access_token?: string }
  return data.access_token || null
}

function buildGmailQuery(lastSyncAt: string): string {
  if (!lastSyncAt) return 'in:inbox newer_than:7d'

  const unix = Math.floor(new Date(lastSyncAt).getTime() / 1000)
  if (Number.isNaN(unix) || unix <= 0) return 'in:inbox newer_than:7d'

  return `in:inbox after:${Math.max(0, unix - 120)}`
}

function buildOutlookFilter(lastSyncAt: string): string {
  if (!lastSyncAt) return ''

  const ts = new Date(lastSyncAt).toISOString()
  if (!ts || ts === 'Invalid Date') return ''

  return `receivedDateTime ge ${ts}`
}

async function fetchAndParseGmailMessage(user: string, token: string, messageId: string): Promise<EmailRow | null> {
  const msgUrl = `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(user)}/messages/${encodeURIComponent(messageId)}?format=full`
  const msgResp = await fetch(msgUrl, { headers: { Authorization: `Bearer ${token}` } })
  if (!msgResp.ok) return null

  const msg = await msgResp.json() as Record<string, unknown>
  const payload = (msg.payload || {}) as Record<string, unknown>
  const headers = Array.isArray(payload.headers) ? payload.headers as Array<{ name: string; value: string }> : []

  const subject = findHeader(headers, 'Subject')
  const sender = findHeader(headers, 'From')
  const dateHeader = findHeader(headers, 'Date')
  const body = extractPlainBody(payload) || String(msg.snippet || '')
  const classified = classifyText(`${subject}\n${body}`)

  return {
    message_id: msg.id ? `gmail:${String(msg.id)}` : `gmail:${messageId}`,
    sender: sender || null,
    subject,
    body,
    summary: summarize(body),
    category: classified.category,
    matched_keywords: classified.keywords,
    confidence: classified.confidence,
    status: 'processed',
    received_at: parseDate(dateHeader)
  }
}

async function upsertEmails(rows: EmailRow[]): Promise<{ inserted: number; deduplicated: number }> {
  if (rows.length === 0) return { inserted: 0, deduplicated: 0 }

  const withIds = rows.map((row) => row.message_id).filter((x): x is string => Boolean(x))

  let existingIds = new Set<string>()
  if (withIds.length > 0) {
    const { data, error } = await db
      .from('support_emails')
      .select('message_id')
      .in('message_id', withIds)

    if (error) throw new Error(error.message)
    existingIds = new Set((data || []).map((x) => String(x.message_id)))
  }

  const deduplicatedRows = rows.filter((row) => !(row.message_id && existingIds.has(row.message_id)))
  if (deduplicatedRows.length === 0) {
    return { inserted: 0, deduplicated: rows.length }
  }

  const { error } = await db
    .from('support_emails')
    .insert(deduplicatedRows)

  if (error) throw new Error(error.message)

  const inserted = deduplicatedRows.length
  const deduplicated = Math.max(0, rows.length - deduplicatedRows.length)
  return { inserted, deduplicated }
}

function summarizeCategories(rows: Array<{ category: string }>): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1
    return acc
  }, {})
}

function normalizeInboundEmail(rawItem: unknown): EmailRow {
  const raw = (rawItem || {}) as Record<string, unknown>
  const subject = String(raw.subject ?? '')
  const textBody = String(raw.body ?? '')
  const classified = classifyText(`${subject}\n${textBody}`)

  return {
    message_id: typeof raw.message_id === 'string' ? raw.message_id : null,
    sender: typeof raw.sender === 'string' ? raw.sender : null,
    subject,
    body: textBody,
    summary: summarize(textBody),
    category: classified.category,
    matched_keywords: classified.keywords,
    confidence: classified.confidence,
    status: 'processed',
    received_at: typeof raw.received_at === 'string' ? raw.received_at : new Date().toISOString()
  }
}

async function generateCandidates(): Promise<Response> {
  try {
    const result = await generateCandidatesInternal()
    return json({ ok: true, generated: result.generated, data: result.data })
  } catch (error) {
    return json({ message: String(error) }, 500)
  }
}

async function generateCandidatesInternal(): Promise<{ generated: number; data: unknown[] }> {
  const { data: emails, error } = await db
    .from('support_emails')
    .select('id, category, subject, summary')
    .order('created_at', { ascending: false })
    .limit(5000)

  if (error) throw new Error(error.message)

  const { data: rejectedRows, error: rejectedError } = await db
    .from('faq_candidates')
    .select('category, question_patterns')
    .eq('status', 'rejected')

  if (rejectedError) throw new Error(rejectedError.message)

  const rejectedSignatures = new Set(
    (rejectedRows || []).map((row) => candidateSignature(row.category || 'other', row.question_patterns || []))
  )

  const grouped = new Map<string, Array<{ id: string; subject: string; summary: string }>>()
  for (const row of emails ?? []) {
    const category = row.category || 'other'
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category)!.push({ id: row.id, subject: row.subject, summary: row.summary })
  }

  const candidates = Array.from(grouped.entries())
    .map(([category, rows]) => ({
      category,
      question_patterns: extractPatterns(rows),
      answer_draft: answerDraft(category),
      source_count: rows.length,
      source_email_ids: rows.map((x) => x.id),
      status: 'draft',
      updated_at: new Date().toISOString()
    }))
    .filter((candidate) => {
      const signature = candidateSignature(candidate.category, candidate.question_patterns)
      return !rejectedSignatures.has(signature)
    })

  if (candidates.length === 0) return { generated: 0, data: [] }

  const { error: clearError } = await db.from('faq_candidates').delete().in('status', ['draft'])
  if (clearError) throw new Error(clearError.message)

  const { data: inserted, error: insertError } = await db
    .from('faq_candidates')
    .insert(candidates)
    .select('id, category, question_patterns, answer_draft, source_count, status, updated_at')

  if (insertError) throw new Error(insertError.message)
  return { generated: inserted?.length ?? 0, data: inserted ?? [] }
}

async function listCandidates(): Promise<Response> {
  const { data, error } = await db
    .from('faq_candidates')
    .select('id, category, question_patterns, answer_draft, source_count, source_email_ids, status, updated_at, created_at')
    .eq('status', 'draft')
    .order('created_at', { ascending: false })

  if (error) return json({ message: error.message }, 500)
  return json({ data: data ?? [] })
}

async function deleteDraftCandidate(candidateId: string): Promise<Response> {
  const { data: found, error: findError } = await db
    .from('faq_candidates')
    .select('id, status')
    .eq('id', candidateId)
    .maybeSingle()

  if (findError) return json({ message: findError.message }, 500)
  if (!found) return json({ message: 'Candidate not found' }, 404)
  if (found.status !== 'draft') {
    return json({ message: 'Only draft candidates can be deleted' }, 400)
  }

  const { error } = await db
    .from('faq_candidates')
    .delete()
    .eq('id', candidateId)

  if (error) return json({ message: error.message }, 500)
  return json({ ok: true })
}

async function rejectCandidate(candidateId: string): Promise<Response> {
  const { data: found, error: findError } = await db
    .from('faq_candidates')
    .select('id, status')
    .eq('id', candidateId)
    .maybeSingle()

  if (findError) return json({ message: findError.message }, 500)
  if (!found) return json({ message: 'Candidate not found' }, 404)
  if (found.status !== 'draft') {
    return json({ message: 'Only draft candidates can be rejected' }, 400)
  }

  const { error } = await db
    .from('faq_candidates')
    .update({
      status: 'rejected',
      updated_at: new Date().toISOString()
    })
    .eq('id', candidateId)

  if (error) return json({ message: error.message }, 500)
  return json({ ok: true })
}

async function publishCandidate(req: Request, candidateId: string): Promise<Response> {
  const body = (await safeJson(req)) as Json
  const priority = Number(body.priority ?? 7)

  const { data: candidate, error: findError } = await db
    .from('faq_candidates')
    .select('id, category, question_patterns, answer_draft')
    .eq('id', candidateId)
    .maybeSingle()

  if (findError) return json({ message: findError.message }, 500)
  if (!candidate) return json({ message: 'Candidate not found' }, 404)

  const answer = typeof body.answer === 'string' && body.answer.trim().length > 0
    ? body.answer.trim()
    : candidate.answer_draft

  const { error: insertError } = await db.from('faq_items').insert({
    category: candidate.category,
    question_patterns: candidate.question_patterns,
    answer,
    priority,
    status: 'active',
    source: 'candidate',
    updated_at: new Date().toISOString()
  })

  if (insertError) return json({ message: insertError.message }, 500)

  const { error: updateError } = await db
    .from('faq_candidates')
    .update({ status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', candidateId)

  if (updateError) return json({ message: updateError.message }, 500)
  return json({ ok: true })
}

async function getStats(): Promise<Response> {
  const [emailResp, candidateResp, faqResp] = await Promise.all([
    db.from('support_emails').select('*', { count: 'exact', head: true }),
    db.from('faq_candidates').select('*', { count: 'exact', head: true }),
    db.from('faq_items').select('*', { count: 'exact', head: true }).eq('status', 'active')
  ])

  if (emailResp.error) return json({ message: emailResp.error.message }, 500)
  if (candidateResp.error) return json({ message: candidateResp.error.message }, 500)
  if (faqResp.error) return json({ message: faqResp.error.message }, 500)

  return json({
    data: {
      email_total: emailResp.count ?? 0,
      candidate_total: candidateResp.count ?? 0,
      active_faq_total: faqResp.count ?? 0
    }
  })
}

async function getState(key: string): Promise<Record<string, unknown> | null> {
  const { data, error } = await db
    .from('integration_state')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    console.error('getState error', error)
    return null
  }

  return data?.value || null
}

async function setState(key: string, value: Record<string, unknown>): Promise<void> {
  const { error } = await db
    .from('integration_state')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) throw new Error(error.message)
}

function classifyText(rawText: string): Classified {
  const text = String(rawText || '').toLowerCase()
  for (const rule of categoryRules) {
    const hits = rule.keywords.filter((keyword) => text.includes(keyword))
    if (hits.length > 0) {
      return {
        category: rule.category,
        keywords: hits,
        confidence: Math.min(0.99, 0.55 + hits.length * 0.12)
      }
    }
  }

  return { category: 'other', keywords: [], confidence: 0.35 }
}

function summarize(rawText: string): string {
  const text = String(rawText || '').replace(/\s+/g, ' ').trim()
  if (!text) return 'No useful content extracted.'
  return text.slice(0, 220)
}

function extractPatterns(rows: Array<{ subject: string; summary: string }>): string[] {
  const words = new Set<string>()
  for (const row of rows) {
    `${row.subject} ${row.summary}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 4)
      .slice(0, 25)
      .forEach((w) => words.add(w))
  }
  return Array.from(words).slice(0, 10)
}

function answerDraft(category: string): string {
  const map: Record<string, string> = {
    login: 'Please verify your login credentials, refresh the page, request a new verification code, and try again.',
    password: 'Use Forgot Password on the login page, verify your email/phone, then set a new password.',
    course: 'Open the Course page, confirm chapter completion order, and refresh/re-login if progress is not updated.',
    exam: 'Complete required chapters first, take the exam, and check your score/status in your account center.',
    congress: 'Go to Congress page, complete registration and payment, then check confirmation and invoice.',
    other: 'Please contact support with your account email and a screenshot of the issue for further assistance.'
  }
  return map[category] ?? map.other
}

function candidateSignature(category: string, patterns: unknown): string {
  const list = Array.isArray(patterns) ? patterns.map((x) => String(x).toLowerCase().trim()).filter(Boolean) : []
  const normalized = Array.from(new Set(list)).sort().join('|')
  return `${String(category || 'other').toLowerCase().trim()}::${normalized}`
}

function extractPlainBody(payload: Record<string, unknown>): string {
  const body = payload.body as Record<string, unknown> | undefined
  const data = typeof body?.data === 'string' ? decodeBase64Url(body.data) : ''
  if (data) return data

  const parts = Array.isArray(payload.parts) ? payload.parts as Array<Record<string, unknown>> : []
  for (const part of parts) {
    const mimeType = String(part.mimeType || '')
    if (mimeType === 'text/plain') {
      const partBody = part.body as Record<string, unknown> | undefined
      const partData = typeof partBody?.data === 'string' ? decodeBase64Url(partBody.data) : ''
      if (partData) return partData
    }

    const nested = extractPlainBody(part)
    if (nested) return nested
  }

  return ''
}

function decodeBase64Url(raw: string): string {
  try {
    const normalized = raw.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4)
    return atob(padded)
  } catch (_error) {
    return ''
  }
}

function parseDate(input: string): string {
  const dt = new Date(input)
  if (Number.isNaN(dt.getTime())) return new Date().toISOString()
  return dt.toISOString()
}

function findHeader(headers: Array<{ name: string; value: string }>, headerName: string): string {
  const found = headers.find((x) => x.name.toLowerCase() === headerName.toLowerCase())
  return found?.value || ''
}

function toUuidOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)
    ? trimmed
    : null
}

async function safeJson(req: Request): Promise<unknown> {
  try {
    return await req.json()
  } catch (_error) {
    return {}
  }
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.max(min, Math.min(max, value))
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
