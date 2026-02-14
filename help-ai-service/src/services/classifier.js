const CATEGORY_RULES = [
  {
    category: 'login',
    keywords: ['login', 'sign in', 'signin', 'verification code', 'account locked', 'account not found']
  },
  {
    category: 'password',
    keywords: ['forgot password', 'reset password', 'password reset', 'password link', 'password']
  },
  {
    category: 'course',
    keywords: ['course', 'lesson', 'chapter', 'learning', 'material', 'video', 'progress']
  },
  {
    category: 'exam',
    keywords: ['exam', 'test', 'score', 'result', 'certificate', 'retake']
  },
  {
    category: 'congress',
    keywords: ['congress', 'registration', 'register', 'invoice', 'payment', 'attendee']
  }
]

function classifyText(rawText) {
  const text = String(rawText || '').toLowerCase()

  for (const rule of CATEGORY_RULES) {
    const hits = rule.keywords.filter((keyword) => text.includes(keyword))
    if (hits.length > 0) {
      return {
        category: rule.category,
        keywords: hits,
        confidence: Math.min(0.99, 0.55 + hits.length * 0.12)
      }
    }
  }

  return {
    category: 'other',
    keywords: [],
    confidence: 0.35
  }
}

function summarizeText(rawText) {
  const text = String(rawText || '').replace(/\s+/g, ' ').trim()
  if (!text) return 'No useful content extracted.'
  return text.slice(0, 220)
}

module.exports = {
  classifyText,
  summarizeText
}
