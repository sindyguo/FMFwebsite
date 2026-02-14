const express = require('express')
const { v4: uuidv4 } = require('uuid')
const {
  getFaqItems,
  saveFaqItems,
  getEmails,
  saveEmails,
  getCandidates,
  saveCandidates
} = require('../data/store')
const { classifyText, summarizeText } = require('../services/classifier')
const { buildCandidatesFromEmails } = require('../services/candidateBuilder')

const router = express.Router()

router.post('/email/ingest', (req, res) => {
  const { emails = [] } = req.body || {}

  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ message: 'emails array is required' })
  }

  const current = getEmails()

  const normalized = emails.map((item) => {
    const subject = String(item.subject || '')
    const body = String(item.body || '')
    const merged = `${subject}\n${body}`
    const classified = classifyText(merged)

    return {
      id: `email_${uuidv4()}`,
      message_id: item.message_id || null,
      sender: item.sender || null,
      subject,
      body,
      summary: summarizeText(body),
      category: classified.category,
      matched_keywords: classified.keywords,
      confidence: classified.confidence,
      status: 'processed',
      received_at: item.received_at || new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  })

  saveEmails([...normalized, ...current].slice(0, 10000))

  return res.status(201).json({
    ok: true,
    ingested: normalized.length,
    categories: normalized.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})
  })
})

router.post('/faq/candidates/generate', (_req, res) => {
  const emails = getEmails()
  const candidates = buildCandidatesFromEmails(emails)
  saveCandidates(candidates)

  return res.json({
    ok: true,
    generated: candidates.length,
    data: candidates
  })
})

router.get('/faq/candidates', (_req, res) => {
  return res.json({ data: getCandidates() })
})

router.post('/faq/:candidateId/publish', (req, res) => {
  const { candidateId } = req.params
  const { answer, priority = 7 } = req.body || {}

  const candidates = getCandidates()
  const target = candidates.find((item) => item.id === candidateId)

  if (!target) {
    return res.status(404).json({ message: 'Candidate not found' })
  }

  const faqItems = getFaqItems()
  const now = new Date().toISOString()

  faqItems.unshift({
    id: `faq_${uuidv4()}`,
    category: target.category,
    question_patterns: target.question_patterns,
    answer: answer || target.answer_draft,
    priority: Number(priority),
    status: 'active',
    source: 'candidate',
    updated_at: now
  })

  target.status = 'published'
  target.published_at = now

  saveFaqItems(faqItems)
  saveCandidates(candidates)

  return res.json({ ok: true })
})

router.get('/stats', (_req, res) => {
  const emails = getEmails()
  const candidates = getCandidates()
  const faqItems = getFaqItems()

  return res.json({
    data: {
      email_total: emails.length,
      candidate_total: candidates.length,
      active_faq_total: faqItems.filter((item) => item.status === 'active').length
    }
  })
})

module.exports = router
