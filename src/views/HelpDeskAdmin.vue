<template>
  <div class="help-admin-page">
    <div class="main-container">
      <h1>Help Desk Intake Console</h1>
      <p class="subtitle">Manually collect email issues and publish FAQ items without command-line scripts.</p>

      <el-card class="mb16" shadow="hover">
        <div slot="header">
          <span>Connection Settings</span>
        </div>
        <el-form label-position="top">
          <el-form-item label="Help API Base URL">
            <el-input v-model="apiBase" placeholder="https://xxx.supabase.co/functions/v1/help-api" />
          </el-form-item>
          <el-form-item label="Admin Token (Bearer)">
            <el-input v-model="adminToken" show-password placeholder="HELP_API_ADMIN_TOKEN" />
          </el-form-item>
        </el-form>
        <div class="row-actions">
          <el-button type="primary" @click="saveSettings">Save Settings</el-button>
          <el-button @click="checkStats">Check API</el-button>
        </div>
      </el-card>

      <div v-if="lastError" class="error-box">
        <strong>Last Error:</strong> {{ lastError }}
      </div>

      <el-card class="mb16" shadow="hover">
        <div slot="header">
          <span>Manual Email Entry</span>
        </div>
        <el-form label-position="top">
          <el-form-item label="Sender">
            <el-input v-model="draftEmail.sender" placeholder="doctor@example.com" />
          </el-form-item>
          <el-form-item label="Subject">
            <el-input v-model="draftEmail.subject" placeholder="Cannot login to my account" />
          </el-form-item>
          <el-form-item label="Email Body">
            <el-input
              v-model="draftEmail.body"
              type="textarea"
              :rows="4"
              placeholder="Paste the user issue details here."
            />
          </el-form-item>
        </el-form>
        <div class="row-actions">
          <el-button type="primary" @click="addEmailToBatch">Add to Batch</el-button>
          <el-button @click="resetDraft">Clear Draft</el-button>
        </div>

        <el-table class="mt16" :data="emailBatch" border empty-text="No emails in batch yet">
          <el-table-column label="Sender" prop="sender" min-width="180" />
          <el-table-column label="Subject" prop="subject" min-width="220" />
          <el-table-column label="Body Preview" min-width="320">
            <template slot-scope="{ row }">
              {{ row.body.slice(0, 100) }}<span v-if="row.body.length > 100">...</span>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="110" align="center">
            <template slot-scope="{ $index }">
              <el-button type="text" @click="removeEmail($index)">Remove</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="row-actions mt16">
          <el-button :disabled="emailBatch.length === 0" type="success" @click="submitBatch">Submit Batch</el-button>
          <el-button :disabled="emailBatch.length === 0" @click="emailBatch = []">Clear Batch</el-button>
        </div>
      </el-card>

      <el-card class="mb16" shadow="hover">
        <div slot="header">
          <span>FAQ Candidate Builder</span>
        </div>
        <div class="row-actions">
          <el-input-number
            v-model="syncLimit"
            :min="1"
            :max="200"
            :step="1"
            size="mini"
            class="sync-limit-input"
          />
          <el-input
            v-model="syncSince"
            size="mini"
            class="sync-since-input"
            placeholder="Optional since, e.g. 2026-02-13T00:00:00.000Z"
          />
          <el-button type="warning" @click="syncGmailNow">Sync Gmail Now</el-button>
          <el-button type="primary" @click="generateCandidates">Generate Candidates</el-button>
          <el-button @click="loadCandidates">Refresh Candidate List</el-button>
        </div>

        <el-table class="mt16" :data="candidates" border empty-text="No candidates found">
          <el-table-column label="Category" prop="category" width="140" />
          <el-table-column label="Patterns" min-width="220">
            <template slot-scope="{ row }">
              <el-tag
                v-for="pattern in row.question_patterns.slice(0, 6)"
                :key="`${row.id}-${pattern}`"
                class="mr6 mb6"
                size="mini"
              >
                {{ pattern }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Draft Answer" min-width="340">
            <template slot-scope="{ row }">
              <el-input
                v-model="publishDrafts[row.id].answer"
                type="textarea"
                :rows="3"
                placeholder="Edit answer before publishing"
              />
            </template>
          </el-table-column>
          <el-table-column label="Source Count" prop="source_count" width="120" align="center" />
          <el-table-column label="Priority" width="100" align="center">
            <template slot-scope="{ row }">
              <el-input-number
                v-model="publishDrafts[row.id].priority"
                :min="1"
                :max="20"
                :step="1"
                size="mini"
                class="priority-input"
              />
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="250" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="publishCandidate(row)">Publish</el-button>
              <el-button type="text" @click="publishAndPreview(row)">Publish & Preview</el-button>
              <el-button type="text" class="danger-text" @click="rejectCandidate(row)">Reject</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog :visible.sync="previewDialogVisible" title="Bot Preview Tester" width="640px">
        <el-form label-position="top">
          <el-form-item label="Type a user question">
            <el-input
              v-model="previewQuestion"
              type="textarea"
              :rows="3"
              placeholder="Example: I cannot login, verification code is always invalid."
            />
          </el-form-item>
        </el-form>
        <div class="row-actions">
          <el-button type="primary" @click="runPreviewMatch">Run Match</el-button>
        </div>
        <div v-if="previewResult" class="preview-result">
          <p><strong>Matched FAQ ID:</strong> {{ previewResult.id || 'No direct match' }}</p>
          <p><strong>Matched Category:</strong> {{ previewResult.category || 'N/A' }}</p>
          <p><strong>Reply Preview:</strong></p>
          <div class="preview-answer">{{ previewResult.answer }}</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpDeskAdmin',
  data() {
    return {
      apiBase: process.env.VUE_APP_HELP_API_BASE_URL || '',
      adminToken: '',
      draftEmail: {
        sender: '',
        subject: '',
        body: ''
      },
      emailBatch: [],
      candidates: [],
      publishDrafts: {},
      previewDialogVisible: false,
      previewQuestion: '',
      previewResult: null,
      activeFaqCache: [],
      lastError: '',
      syncLimit: 50,
      syncSince: ''
    }
  },
  created() {
    this.adminToken = localStorage.getItem('help_admin_token') || ''
  },
  methods: {
    getHeaders(useAuth = false) {
      const headers = { 'Content-Type': 'application/json' }
      if (useAuth && this.adminToken) {
        headers.Authorization = `Bearer ${this.adminToken}`
      }
      return headers
    },
    getEndpoint(path) {
      const base = (this.apiBase || '').replace(/\/+$/, '')
      return `${base}${path}`
    },
    async requestJson(path, options = {}, useAuth = false) {
      const url = this.getEndpoint(path)
      const requestOptions = {
        ...options,
        headers: {
          ...this.getHeaders(useAuth),
          ...(options.headers || {})
        }
      }
      const resp = await fetch(url, requestOptions)
      const text = await resp.text()
      let payload = {}
      try {
        payload = text ? JSON.parse(text) : {}
      } catch (_error) {
        payload = { raw: text }
      }
      if (!resp.ok) {
        const message = payload.message || payload.raw || `HTTP ${resp.status}`
        throw new Error(`[${resp.status}] ${url} -> ${message}`)
      }
      return payload
    },
    showError(error, fallback = 'Request failed') {
      const message = (error && error.message) ? error.message : fallback
      this.lastError = message
      this.$message.error(message)
    },
    saveSettings() {
      localStorage.setItem('help_admin_token', this.adminToken || '')
      this.$message.success('Settings saved locally in this browser.')
    },
    async checkStats() {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      try {
        const payload = await this.requestJson('/v1/stats', {}, true)
        this.$alert(
          `Emails: ${payload.data.email_total}\nCandidates: ${payload.data.candidate_total}\nActive FAQ: ${payload.data.active_faq_total}`,
          'API Connected',
          { confirmButtonText: 'OK' }
        )
      } catch (error) {
        this.showError(error, 'API check failed')
      }
    },
    addEmailToBatch() {
      const sender = String(this.draftEmail.sender || '').trim()
      const subject = String(this.draftEmail.subject || '').trim()
      const body = String(this.draftEmail.body || '').trim()

      if (!subject || !body) {
        return this.$message.warning('Subject and body are required.')
      }
      this.emailBatch.push({
        message_id: `manual-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        sender,
        subject,
        body,
        received_at: new Date().toISOString()
      })
      this.resetDraft()
    },
    resetDraft() {
      this.draftEmail = { sender: '', subject: '', body: '' }
    },
    removeEmail(index) {
      this.emailBatch.splice(index, 1)
    },
    async submitBatch() {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      if (!this.adminToken) return this.$message.error('Please input admin token first.')

      try {
        const payload = await this.requestJson('/v1/email/ingest', {
          method: 'POST',
          body: JSON.stringify({ emails: this.emailBatch })
        }, true)
        this.$message.success(`Submitted. Ingested: ${payload.ingested}, deduplicated: ${payload.deduplicated}`)
        this.emailBatch = []
      } catch (error) {
        this.showError(error, 'Submit failed')
      }
    },
    async generateCandidates() {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      if (!this.adminToken) return this.$message.error('Please input admin token first.')

      try {
        const payload = await this.requestJson('/v1/faq/candidates/generate', {
          method: 'POST',
        }, true)
        this.$message.success(`Generated ${payload.generated} candidates.`)
        await this.loadCandidates()
      } catch (error) {
        this.showError(error, 'Generate failed')
      }
    },
    async syncGmailNow() {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      if (!this.adminToken) return this.$message.error('Please input admin token first.')

      const payloadBody = {
        provider: 'gmail',
        limit: Number(this.syncLimit) || 50,
        generateCandidates: true
      }
      if (this.syncSince && String(this.syncSince).trim()) {
        payloadBody.since = String(this.syncSince).trim()
      }

      try {
        const payload = await this.requestJson('/v1/jobs/sync-mails', {
          method: 'POST',
          body: JSON.stringify(payloadBody)
        }, true)
        this.$message.success(
          `Synced Gmail. fetched=${payload.fetched}, inserted=${payload.inserted}, deduplicated=${payload.deduplicated}, generated=${payload.generatedCandidates || 0}`
        )
        await this.loadCandidates()
      } catch (error) {
        this.showError(error, 'Sync Gmail failed')
      }
    },
    async loadCandidates() {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      if (!this.adminToken) return this.$message.error('Please input admin token first.')

      try {
        const payload = await this.requestJson('/v1/faq/candidates', {}, true)
        this.candidates = payload.data || []
        this.candidates.forEach((item) => {
          if (!this.publishDrafts[item.id]) {
            this.$set(this.publishDrafts, item.id, {
              answer: item.answer_draft || '',
              priority: 8
            })
          }
        })
      } catch (error) {
        this.showError(error, 'Load failed')
      }
    },
    async publishCandidate(candidate) {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      if (!this.adminToken) return this.$message.error('Please input admin token first.')
      const draft = this.publishDrafts[candidate.id] || { answer: candidate.answer_draft, priority: 8 }

      try {
        await this.requestJson(`/v1/faq/${candidate.id}/publish`, {
          method: 'POST',
          body: JSON.stringify({
            answer: draft.answer,
            priority: draft.priority
          })
        }, true)
        this.$message.success('Candidate published to FAQ library.')
        await this.loadCandidates()
        return true
      } catch (error) {
        this.showError(error, 'Publish failed')
        return false
      }
    },
    async publishAndPreview(candidate) {
      const ok = await this.publishCandidate(candidate)
      if (!ok) return
      this.previewQuestion = candidate.question_patterns && candidate.question_patterns[0]
        ? `How can I solve: ${candidate.question_patterns[0]}?`
        : ''
      this.previewDialogVisible = true
      await this.runPreviewMatch()
    },
    async rejectCandidate(candidate) {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      if (!this.adminToken) return this.$message.error('Please input admin token first.')

      try {
        await this.$confirm('Reject this draft candidate and hide it from future generate results?', 'Confirm', {
          confirmButtonText: 'Reject',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
      } catch (_error) {
        return
      }

      try {
        await this.requestJson(`/v1/faq/${candidate.id}/reject`, {
          method: 'POST'
        }, true)
        this.$message.success('Draft candidate rejected.')
        await this.loadCandidates()
      } catch (error) {
        this.showError(error, 'Reject failed')
      }
    },
    async runPreviewMatch() {
      if (!this.apiBase) return this.$message.error('Please input API base URL first.')
      if (!this.previewQuestion) return this.$message.warning('Please enter a preview question.')

      try {
        if (!this.activeFaqCache || this.activeFaqCache.length === 0) {
          await this.loadActiveFaq()
        }
        const normalized = this.previewQuestion.toLowerCase()
        const matched = this.activeFaqCache.find((item) =>
          Array.isArray(item.question_patterns)
            && item.question_patterns.some((pattern) => normalized.includes(String(pattern).toLowerCase()))
        )

        this.previewResult = matched
          ? {
              id: matched.id,
              category: matched.category,
              answer: matched.answer
            }
          : {
              id: '',
              category: '',
              answer: 'No exact pattern match found. The chatbot may return fallback guidance.'
            }
      } catch (error) {
        this.showError(error, 'Preview failed')
      }
    },
    async loadActiveFaq() {
      const payload = await this.requestJson('/v1/faq/active')
      this.activeFaqCache = payload.data || []
    }
  }
}
</script>

<style lang="scss" scoped>
.help-admin-page {
  padding: 96px 0 40px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f7fbff;
}

h1 {
  margin: 0;
  font-size: 28px;
  color: #123251;
}

.subtitle {
  margin: 8px 0 18px;
  color: #567086;
}

.mb16 {
  margin-bottom: 16px;
}

.mt16 {
  margin-top: 16px;
}

.mr6 {
  margin-right: 6px;
}

.mb6 {
  margin-bottom: 6px;
}

.row-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.preview-result {
  margin-top: 14px;
  padding: 12px;
  border-radius: 8px;
  background: #f5faff;
  border: 1px solid #d9eafb;
  color: #1f4566;
}

.preview-answer {
  white-space: pre-wrap;
  line-height: 1.6;
}

.danger-text {
  color: #d14343;
}

.priority-input {
  width: 88px;
}

.priority-input ::v-deep .el-input-number__decrease,
.priority-input ::v-deep .el-input-number__increase {
  width: 24px;
}

.priority-input ::v-deep .el-input__inner {
  padding-left: 26px;
  padding-right: 26px;
}

.sync-limit-input {
  width: 90px;
}

.sync-since-input {
  width: 320px;
}

.error-box {
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid #ffd6d6;
  background: #fff5f5;
  color: #9b3030;
  border-radius: 8px;
  font-size: 13px;
}
</style>
