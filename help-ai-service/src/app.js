const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const faqRoutes = require('./routes/faqRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'help-ai-service' })
})

app.use('/v1', faqRoutes)
app.use('/v1', adminRoutes)

app.use((err, _req, res, _next) => {
  console.error('[help-ai-service] unexpected error:', err)
  res.status(500).json({
    message: 'Internal server error'
  })
})

module.exports = app
