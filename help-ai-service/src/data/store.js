const fs = require('fs')
const path = require('path')
const defaultFaq = require('./defaultFaq')

const storageRoot = path.resolve(__dirname, '../../storage')

const FILES = {
  faqItems: path.join(storageRoot, 'faq-items.json'),
  emails: path.join(storageRoot, 'emails.json'),
  candidates: path.join(storageRoot, 'faq-candidates.json'),
  feedback: path.join(storageRoot, 'feedback.json')
}

function ensureStorageFiles() {
  if (!fs.existsSync(storageRoot)) {
    fs.mkdirSync(storageRoot, { recursive: true })
  }

  if (!fs.existsSync(FILES.faqItems)) {
    writeJson(FILES.faqItems, defaultFaq)
  }

  if (!fs.existsSync(FILES.emails)) {
    writeJson(FILES.emails, [])
  }

  if (!fs.existsSync(FILES.candidates)) {
    writeJson(FILES.candidates, [])
  }

  if (!fs.existsSync(FILES.feedback)) {
    writeJson(FILES.feedback, [])
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8')
}

function getFaqItems() {
  return readJson(FILES.faqItems)
}

function saveFaqItems(items) {
  writeJson(FILES.faqItems, items)
}

function getEmails() {
  return readJson(FILES.emails)
}

function saveEmails(emails) {
  writeJson(FILES.emails, emails)
}

function getCandidates() {
  return readJson(FILES.candidates)
}

function saveCandidates(candidates) {
  writeJson(FILES.candidates, candidates)
}

function getFeedback() {
  return readJson(FILES.feedback)
}

function saveFeedback(entries) {
  writeJson(FILES.feedback, entries)
}

module.exports = {
  ensureStorageFiles,
  getFaqItems,
  saveFaqItems,
  getEmails,
  saveEmails,
  getCandidates,
  saveCandidates,
  getFeedback,
  saveFeedback
}
