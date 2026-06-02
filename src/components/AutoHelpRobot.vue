<template>
  <div
    class="auto-help-robot"
    :class="{ 'is-dragging': isDragging, 'panel-open': isOpen }"
    :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
  >
    <button
      class="robot-trigger"
      type="button"
      :aria-expanded="String(isOpen)"
      aria-controls="auto-help-panel"
      @mousedown="startDrag"
      @touchstart.passive="startDragTouch"
      @click="togglePanel"
    >
      <i class="el-icon-service"></i>
      <span class="trigger-label">Help</span>
    </button>

    <transition name="panel-fade">
      <section v-if="isOpen" id="auto-help-panel" class="robot-panel" :style="panelStyle">
        <header class="panel-header">
          <div>
            <h3>Smart Help Assistant</h3>
            <p>Quick support for login, password, courses, exams, and congress registration.</p>
          </div>
          <button class="close-btn" type="button" aria-label="Close help panel" @click="isOpen = false">×</button>
        </header>

        <div class="category-list">
          <button
            v-for="item in categories"
            :key="item.key"
            type="button"
            class="category-btn"
            :class="{ active: activeCategory === item.key }"
            @click="activeCategory = item.key"
          >
            {{ item.label }}
          </button>
        </div>

        <div ref="messageBox" class="message-box">
          <div
            v-for="(message, index) in messages"
            :key="`${message.role}-${index}`"
            class="message-item"
            :class="message.role"
          >
            {{ message.text }}
          </div>
        </div>

        <div class="quick-questions">
          <button
            v-for="question in currentQuickQuestions"
            :key="question"
            type="button"
            class="quick-btn"
            @click="handleQuestion(question)"
          >
            {{ question }}
          </button>
        </div>

        <form class="input-row" @submit.prevent="submitCustomQuestion">
          <input
            v-model.trim="inputText"
            type="text"
            placeholder="Type your question, e.g. How can I reset my password?"
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </transition>
  </div>
</template>

<script>
const LOCAL_FAQ_MAP = [
  {
    keywords: ['login', 'sign in', 'cannot login', 'can not login', 'verification code', 'account'],
    answer: 'For login issues, first confirm your email/username and password are correct, then refresh and try again. If it still fails, request a new verification code on the login page. If your account is not found, please register first or contact support for account validation.'
  },
  {
    keywords: ['forgot password', 'reset password', 'password reset', 'password'],
    answer: 'Password reset flow: 1) Open the login page; 2) Click "Forgot password / Reset password"; 3) Enter your registered email or phone number; 4) Complete verification from email or SMS; 5) Sign in with your new password.'
  },
  {
    keywords: ['course', 'learning', 'study', 'watch', 'materials', 'progress'],
    answer: 'For course learning, go to the "Course" page, choose your course, and complete each chapter in sequence. If progress does not update, refresh the page or sign out and sign in again.'
  },
  {
    keywords: ['exam', 'test', 'score', 'result', 'pass', 'certificate'],
    answer: 'For exam issues, make sure required course chapters are completed first, then enter the exam page and submit your answers. After submission, you can check your score and status in your account. If you did not pass, you can usually retake according to platform rules.'
  },
  {
    keywords: ['congress', 'registration', 'register', 'payment', 'invoice'],
    answer: 'Congress registration flow: 1) Open the Congress page and review event details; 2) Go to the registration page and complete your profile; 3) Finish payment; 4) Check your confirmation letter and invoice in your email or account center.'
  }
]

export default {
  name: 'AutoHelpRobot',
  data() {
    return {
      isOpen: false,
      inputText: '',
      activeCategory: 'login',
      messages: [],
      faqMap: [...LOCAL_FAQ_MAP],
      categories: [
        { key: 'login', label: 'Login Issues' },
        { key: 'password', label: 'Password Reset' },
        { key: 'course', label: 'Course Learning' },
        { key: 'exam', label: 'Exam Questions' },
        { key: 'congress', label: 'Congress Registration' }
      ],
      quickQuestionMap: {},
      pos: { x: 0, y: 0 },
      isDragging: false,
    }
  },
  mounted() {
    this.pos = {
      x: window.innerWidth - 18 - 44,
      y: window.innerHeight - 18 - 44 - 120,
    }
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this._onDragMove)
    document.removeEventListener('mouseup', this._onDragEnd)
    document.removeEventListener('touchmove', this._onDragMoveTouch)
    document.removeEventListener('touchend', this._onDragEndTouch)
  },
  created() {
    this.buildQuickQuestions()
    this.loadRemoteFaq()
  },
  computed: {
    currentQuickQuestions() {
      return this.quickQuestionMap[this.activeCategory] || []
    },
    panelStyle() {
      const gap = 8
      const triggerH = 44
      const isAbove = this.pos.y > window.innerHeight / 2
      const style = { right: '18px' }
      if (isAbove) {
        style.bottom = (window.innerHeight - this.pos.y + gap) + 'px'
        style.top = 'auto'
      } else {
        style.top = (this.pos.y + triggerH + gap) + 'px'
        style.bottom = 'auto'
      }
      return style
    },
  },
  watch: {
    isOpen(opened) {
      if (opened && this.messages.length === 0) {
        this.pushBotMessage('Hi, I am your automated help assistant. You can click a category above or type your question directly.')
      }
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    activeCategory() {
      this.pushBotMessage(this.getCategoryGuide(this.activeCategory))
    }
  },
  methods: {
    togglePanel() {
      if (this._wasDragged) {
        this._wasDragged = false
        return
      }
      this.isOpen = !this.isOpen
    },
    startDrag(e) {
      if (e.button !== 0) return
      const rect = this.$el.getBoundingClientRect()
      this._dragState = {
        startX: e.clientX,
        startY: e.clientY,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      }
      this._wasDragged = false
      document.addEventListener('mousemove', this._onDragMove)
      document.addEventListener('mouseup', this._onDragEnd)
    },
    startDragTouch(e) {
      const touch = e.touches[0]
      const rect = this.$el.getBoundingClientRect()
      this._dragState = {
        startX: touch.clientX,
        startY: touch.clientY,
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      }
      this.isDragging = false
      document.addEventListener('touchmove', this._onDragMoveTouch, { passive: false })
      document.addEventListener('touchend', this._onDragEndTouch)
    },
    _onDragMove(e) {
      if (!this._dragState) return
      const dx = e.clientX - this._dragState.startX
      const dy = e.clientY - this._dragState.startY
      if (Math.abs(dx) + Math.abs(dy) < 4) return
      if (!this.isDragging) {
        this.isDragging = true
        document.body.style.cursor = 'grabbing'
      }
      let x = e.clientX - this._dragState.offsetX
      let y = e.clientY - this._dragState.offsetY
      const elW = this.$el.offsetWidth
      const elH = this.$el.offsetHeight
      x = Math.max(0, Math.min(x, window.innerWidth - elW))
      y = Math.max(0, Math.min(y, window.innerHeight - elH))
      this.pos = { x, y }
    },
    _onDragMoveTouch(e) {
      if (!this._dragState) return
      const touch = e.touches[0]
      const dx = touch.clientX - this._dragState.startX
      const dy = touch.clientY - this._dragState.startY
      // 10px threshold to distinguish tap from drag on touch screens
      if (Math.abs(dx) + Math.abs(dy) < 10) return
      e.preventDefault()
      if (!this.isDragging) {
        this.isDragging = true
      }
      let x = touch.clientX - this._dragState.offsetX
      let y = touch.clientY - this._dragState.offsetY
      const elW = this.$el.offsetWidth
      const elH = this.$el.offsetHeight
      x = Math.max(0, Math.min(x, window.innerWidth - elW))
      y = Math.max(0, Math.min(y, window.innerHeight - elH))
      this.pos = { x, y }
    },
    _onDragEndTouch(e) {
      // Always preventDefault to block the browser's synthetic ghost click
      e.preventDefault()
      const wasDragging = this.isDragging
      this.isDragging = false
      this._dragState = null
      document.removeEventListener('touchmove', this._onDragMoveTouch)
      document.removeEventListener('touchend', this._onDragEndTouch)
      // Only toggle panel when it was a tap (not a drag)
      if (!wasDragging) {
        this.isOpen = !this.isOpen
      }
    },
    _onDragEnd() {
      if (this.isDragging) {
        this._wasDragged = true
      }
      this.isDragging = false
      this._dragState = null
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', this._onDragMove)
      document.removeEventListener('mouseup', this._onDragEnd)
    },
    submitCustomQuestion() {
      if (!this.inputText) return
      const question = this.inputText
      this.handleQuestion(question)
      this.inputText = ''
    },
    handleQuestion(question) {
      this.pushUserMessage(question)
      const normalized = String(question || '').toLowerCase()
      const matched = this.faqMap.find((item) =>
        item.keywords.some((keyword) => normalized.includes(String(keyword).toLowerCase()))
      )
      const answer = matched
        ? matched.answer
        : 'I could not match that question yet. Try keywords like login issues, password reset, course learning, exam, or congress registration. You can also contact support@refractionx.com.'
      this.pushBotMessage(answer)
      this.trySmartNavigation(normalized)
      this.sendFeedback({ question, matchedFaqId: matched ? matched.id : '' })
    },
    getCategoryGuide(category) {
      const guideMap = {
        login: 'Common login troubleshooting: verify account/password, refresh page, request a new code, and check network/browser cache.',
        password: 'Recommended password reset order: Login page -> Forgot password -> Email/phone verification -> Set new password.',
        course: 'For course issues, check the Course page for enrollment status, chapter availability, and progress updates.',
        exam: 'For exam questions, confirm prerequisite chapters are complete, then submit in the exam page and review results in your account.',
        congress: 'For congress registration, review the Congress details first, then complete registration and payment, and finally check your confirmation letter.'
      }
      return guideMap[category] || 'Please tell me what problem you are facing, and I will help you troubleshoot it.'
    },
    trySmartNavigation(normalizedQuestion) {
      console.log('normalizedQuestion:', normalizedQuestion)
      if (!normalizedQuestion) return
      if (
        normalizedQuestion.includes('password')
        || normalizedQuestion.includes('reset')
        || normalizedQuestion.includes('forgot')
      ) {
        this.pushBotMessage('You can go to the password reset page now.')
        this.pushActionMessage('Go to Password Reset', '/resetPwd')
        return
      }
      if (normalizedQuestion.includes('login') || normalizedQuestion.includes('account') || normalizedQuestion.includes('sign in')) {
        this.pushActionMessage('Go to Login', '/login')
        return
      }
      if (normalizedQuestion.includes('course') || normalizedQuestion.includes('learning') || normalizedQuestion.includes('study')) {
        this.pushActionMessage('Go to Courses', '/course')
        return
      }
      // if (normalizedQuestion.includes('exam') || normalizedQuestion.includes('test') || normalizedQuestion.includes('score')) {
      //   this.pushActionMessage('Go to Exam', '/exam')
      //   return
      // }
      if (
        normalizedQuestion.includes('congress')
        || normalizedQuestion.includes('registration')
        || normalizedQuestion.includes('register')
      ) {
        this.pushActionMessage('Go to Congress', '/congress')
      }
    },
    pushActionMessage(label, routePath) {
      this.pushBotMessage(`${label}: ${routePath}`)
      this.$confirm(`${label} now?`, 'Quick Navigation', {
        confirmButtonText: 'Go now',
        cancelButtonText: 'Later',
        type: 'info'
      }).then(() => {
        if (this.$route.path !== routePath) {
          this.$router.push(routePath)
        }
      }).catch(() => {})
    },
    buildQuickQuestions() {
      const map = this.categories.reduce((acc, item) => {
        acc[item.key] = []
        return acc
      }, {})

      this.faqMap.forEach((item) => {
        const key = item.category
        if (!map[key]) return
        const questions = (item.question_patterns || [])
          .slice(0, 3)
          .map((pattern) => `How to handle: ${pattern}?`)
        map[key].push(...questions)
      })

      Object.keys(map).forEach((key) => {
        if (!map[key] || map[key].length === 0) {
          map[key] = this.defaultQuickQuestions(key)
        } else {
          map[key] = map[key].slice(0, 3)
        }
      })

      this.quickQuestionMap = map
    },
    defaultQuickQuestions(category) {
      const fallback = {
        login: ['What should I do if login fails?', 'Why is my verification code invalid?', 'What if my account cannot be found?'],
        password: ['How do I reset a forgotten password?', 'What if I did not receive the reset email?', 'What if my reset link has expired?'],
        course: ['Where can I start learning courses?', 'Why is my learning progress not updated?', 'Where can I download course materials?'],
        exam: ['Where is the exam entry?', 'What if I did not pass the exam?', 'Where can I check my score?'],
        congress: ['Where is the congress registration entry?', 'How do I confirm my registration was successful?', 'Where can I download my invoice?']
      }
      return fallback[category] || []
    },
    normalizeRemoteFaq(items) {
      return items.map((item) => ({
        id: item.id,
        category: item.category || 'other',
        keywords: Array.isArray(item.question_patterns) ? item.question_patterns : [],
        answer: item.answer || 'Please contact support@refractionx.com for assistance.'
      }))
    },
    async loadRemoteFaq() {
      const apiBase = process.env.VUE_APP_HELP_API_BASE_URL
      if (!apiBase) return

      try {
        const response = await fetch(`${apiBase}/v1/faq/active`)
        if (!response.ok) return
        const payload = await response.json()
        const items = Array.isArray(payload.data) ? payload.data : []
        if (items.length === 0) return
        this.faqMap = this.normalizeRemoteFaq(items)
        this.buildQuickQuestions()
      } catch (error) {
        console.log('[AutoHelpRobot] failed to load remote faq:', error)
      }
    },
    async sendFeedback({ question, matchedFaqId = '' }) {
      const apiBase = process.env.VUE_APP_HELP_API_BASE_URL
      if (!apiBase) return

      try {
        await fetch(`${apiBase}/v1/help/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question,
            matchedFaqId,
            routePath: this.$route.path
          })
        })
      } catch (error) {
        console.log('[AutoHelpRobot] feedback failed:', error)
      }
    },
    pushUserMessage(text) {
      this.messages.push({ role: 'user', text })
      this.scrollToBottom()
    },
    pushBotMessage(text) {
      this.messages.push({ role: 'bot', text })
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      const box = this.$refs.messageBox
      if (box) {
        box.scrollTop = box.scrollHeight
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auto-help-robot {
  position: fixed;
  z-index: 3000;
  user-select: none;
}

.robot-trigger {
  border: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #0079cf, #0f5aa4);
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  box-shadow: 0 4px 16px rgba(15, 90, 164, 0.35);
  cursor: grab;
  overflow: hidden;
  transition: width 0.22s ease, border-radius 0.22s ease, gap 0.22s ease, padding 0.22s ease;
  white-space: nowrap;
}

.robot-trigger .trigger-label {
  font-size: 13px;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 0.22s ease, opacity 0.18s ease;
  pointer-events: none;
}

.robot-trigger:hover .trigger-label,
.auto-help-robot.panel-open .robot-trigger .trigger-label {
  max-width: 60px;
  opacity: 1;
}

.robot-trigger:hover,
.auto-help-robot.panel-open .robot-trigger {
  width: auto;
  padding: 0 14px 0 10px;
  border-radius: 24px;
  gap: 6px;
}

.auto-help-robot.is-dragging .robot-trigger {
  cursor: grabbing;
}

.robot-panel {
  position: fixed;
  width: 360px;
  max-width: calc(100vw - 36px);
  background: #fff;
  border-radius: 14px;
  border: 1px solid #d9e6f5;
  box-shadow: 0 18px 38px rgba(3, 26, 58, 0.2);
  overflow: hidden;
  z-index: 3001;
}

.panel-header {
  background: #f3f8ff;
  color: #163454;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #d9e6f5;
}

.panel-header h3 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
}

.panel-header p {
  margin: 0;
  color: #52667b;
  font-size: 12px;
  line-height: 1.4;
}

.close-btn {
  border: none;
  background: transparent;
  color: #47617b;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.category-list {
  padding: 10px 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn {
  border: 1px solid #cae0f4;
  background: #fff;
  color: #164a7c;
  font-size: 12px;
  border-radius: 18px;
  padding: 6px 10px;
  cursor: pointer;
}

.category-btn.active {
  background: #0f5aa4;
  color: #fff;
  border-color: #0f5aa4;
}

.message-box {
  height: 220px;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fbfdff;
}

.message-item {
  max-width: 88%;
  padding: 9px 10px;
  border-radius: 10px;
  line-height: 1.5;
  font-size: 13px;
  word-break: break-word;
}

.message-item.bot {
  align-self: flex-start;
  background: #eef5ff;
  color: #1a3958;
}

.message-item.user {
  align-self: flex-end;
  background: #0f5aa4;
  color: #fff;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px 12px;
  border-top: 1px solid #e7eef7;
}

.quick-btn {
  border: 1px solid #d4e4f6;
  background: #fff;
  color: #22507b;
  border-radius: 16px;
  font-size: 12px;
  padding: 5px 10px;
  cursor: pointer;
}

.input-row {
  border-top: 1px solid #e7eef7;
  padding: 10px;
  display: flex;
  gap: 8px;
  background: #fff;
}

.input-row input {
  flex: 1;
  border: 1px solid #cfe1f4;
  border-radius: 8px;
  font-size: 13px;
  padding: 8px 10px;
  color: #1a3958;
}

.input-row button {
  border: none;
  border-radius: 8px;
  background: #0f5aa4;
  color: #fff;
  padding: 0 14px;
  cursor: pointer;
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.panel-fade-enter,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 768px) {
  .robot-panel {
    width: min(360px, calc(100vw - 12px));
  }
}
</style>
