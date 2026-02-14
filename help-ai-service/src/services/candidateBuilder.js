const { v4: uuidv4 } = require('uuid')

function buildCandidatesFromEmails(emails = []) {
  const grouped = emails.reduce((acc, email) => {
    const key = email.category || 'other'
    if (!acc[key]) acc[key] = []
    acc[key].push(email)
    return acc
  }, {})

  const now = new Date().toISOString()

  return Object.entries(grouped).map(([category, list]) => {
    const phrases = extractQuestionPatterns(list)
    return {
      id: `cand_${uuidv4()}`,
      category,
      question_patterns: phrases,
      answer_draft: draftAnswerByCategory(category),
      source_count: list.length,
      source_email_ids: list.map((item) => item.id),
      status: 'draft',
      updated_at: now
    }
  })
}

function extractQuestionPatterns(emailList) {
  const words = new Set()

  for (const email of emailList) {
    const source = `${email.subject || ''} ${email.summary || ''}`.toLowerCase()
    source
      .split(/[^a-z0-9]+/)
      .filter((item) => item.length >= 4)
      .slice(0, 25)
      .forEach((word) => words.add(word))
  }

  return Array.from(words).slice(0, 10)
}

function draftAnswerByCategory(category) {
  const map = {
    login: 'Please verify your login credentials, refresh the page, request a new verification code, and try again.',
    password: 'Use Forgot Password on the login page, verify your email/phone, then set a new password.',
    course: 'Open the Course page, confirm chapter completion order, and refresh/re-login if progress is not updated.',
    exam: 'Complete required chapters first, take the exam, and check your score/status in your account center.',
    congress: 'Go to Congress page, complete registration and payment, then check confirmation and invoice.',
    other: 'Please contact support with your account email and a screenshot of the issue for further assistance.'
  }
  return map[category] || map.other
}

module.exports = {
  buildCandidatesFromEmails
}
