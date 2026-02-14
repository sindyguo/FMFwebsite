const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { getFaqItems, getFeedback, saveFeedback } = require('../data/store')

const router = express.Router()

router.get('/faq/active', (_req, res) => {
  const items = getFaqItems()
    .filter((item) => item.status === 'active')
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))

  res.json({
    data: items,
    meta: { total: items.length }
  })
})

router.post('/help/feedback', (req, res) => {
  const { question = '', matchedFaqId = '', routePath = '', helpful = null } = req.body || {}

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ message: 'question is required' })
  }

  const all = getFeedback()
  all.unshift({
    id: `feedback_${uuidv4()}`,
    question,
    matchedFaqId,
    routePath,
    helpful,
    created_at: new Date().toISOString()
  })

  saveFeedback(all.slice(0, 5000))

  return res.status(201).json({ ok: true })
})

module.exports = router
