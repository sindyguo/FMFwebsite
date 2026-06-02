<template>
  <el-dialog
    :visible="visible"
    title="Payment Information"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :destroy-on-close="true"
    v-loading="loading"
    element-loading-text="Please wait..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    element-loading-custom-class="payment-loading"
    class="payment"
    :width="dialogWidth"
    :fullscreen="dialogFullscreen"
    :top="dialogTop"
    @close="handleClose">

    <!-- Payment Method Selector -->
    <div class="payment-method-wrapper">
      <span class="method-label">Payment Methods</span>
      <div class="method-options">
        <div
          class="method-option"
          :class="{ 'method-option--active': selectedMethod === 'paymentsense' }"
          @click="switchToMethod('paymentsense')">
          <div class="hcontainer vcenter method-inner">
            <span class="paymentsense-icon">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="url(#ps_grad)"/>
                <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="22" font-weight="bold" font-family="Arial">P</text>
                <defs>
                  <linearGradient id="ps_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FF6B35"/>
                    <stop offset="100%" stop-color="#E8350A"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span class="method-name">Paymentsense</span>
          </div>
          <i v-if="selectedMethod === 'paymentsense'" class="el-icon-check method-check"></i>
        </div>
        <!-- <div
          class="method-option"
          :class="{ 'method-option--active': selectedMethod === 'stripe' }"
          @click="switchToMethod('stripe')">
          <div class="hcontainer vcenter method-inner">
            <span class="stripe-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="17" viewBox="0 0 60 25">
                <text x="0" y="20" font-size="22" font-style="italic" font-weight="600" font-family="Arial" fill="#635BFF">stripe</text>
              </svg>
            </span>
            <span class="method-name">Stripe</span>
          </div>
          <i v-if="selectedMethod === 'stripe'" class="el-icon-check method-check"></i>
        </div> -->
      </div>
    </div>

    <!-- Paymentsense Container -->
    <div
      v-show="selectedMethod === 'paymentsense'"
      id="paymentsense-container"
      class="vcontainer vcenter hcenter paymentsense-content">
      <span v-if="showErrMsg" class="fill hcontainer vcenter hcenter err-msg">
        {{ errMsgText }}
      </span>
    </div>

    <!-- Stripe Container -->
    <div v-show="selectedMethod === 'stripe'" class="stripe-content">
      <!-- Absolute overlay: loading or error (keeps cardElement alive in DOM at all times) -->
      <div v-if="stripeLoading || stripeErrMsg" class="stripe-overlay">
        <template v-if="stripeLoading">
          <i class="el-icon-loading stripe-spin"></i>
          <span class="stripe-loading-text">Loading payment...</span>
        </template>
        <template v-else>
          <i class="el-icon-warning" style="font-size: 32px; color: #F56C6C;"></i>
          <span style="font-size: 14px; color: #606266; text-align: center; max-width: 320px;">{{ stripeErrMsg }}</span>
          <el-button size="small" type="primary" style="margin-top: 8px;" @click="retryStripe">Retry</el-button>
        </template>
      </div>
      <!-- Stripe embedded checkout always lives here -->
      <div ref="cardElement" class="card-element"></div>
    </div>

    <!-- Footer -->
    <div slot="footer" class="hcontainer vcenter hcenter footer">
      <el-button class="w-150" @click="handleClose">Cancel</el-button>
      <el-button
        v-if="selectedMethod === 'paymentsense'"
        class="footer-btn w-150"
        :disabled="loading || showErrMsg"
        @click="paymentExecuteFn">Confirm Pay</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { MessageBox } from 'element-ui'

/** 通过 CDN script 标签加载 Stripe.js，避免 webpack 4 处理 ESM 包的 require 兼容问题 */
function loadStripeFromCDN() {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(window.Stripe)
      return
    }
    const existing = document.querySelector('script[src="https://js.stripe.com/v3/"]')
    if (existing) {
      // 脚本已在加载中，轮询等待
      const timer = setInterval(() => {
        if (window.Stripe) {
          clearInterval(timer)
          resolve(window.Stripe)
        }
      }, 100)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = () => resolve(window.Stripe)
    script.onerror = () => reject(new Error('Failed to load Stripe.js from CDN'))
    document.head.appendChild(script)
  })
}

export default {
  name: 'PaymentDialog',
  props: {
    /** Paymentsense token */
    paymentToken: {
      type: String,
      default: ''
    },
    /** Props passed in to let the dialog create a Stripe session on its own */
    stripeOrderId: {
      type: [String, Number],
      default: null
    },
    /** Number of attendees: 1 for individual, group.registrationList.length for batch */
    stripeQuantity: {
      type: Number,
      default: 1
    },
    stripePayType: {
      type: String,
      default: 'debit'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedMethod: 'paymentsense',
      // Paymentsense
      connectE: null,
      loading: false,
      showErrMsg: false,
      errMsgText: 'Payment system load fail, please close and try again',
      retryConfig: {
        maxRetries: 5,
        currentRetry: 0,
        baseInterval: 3000,
        maxInterval: 30000,
        backoffFactor: 2,
        retryableStatusCodes: [500, 502, 503, 504],
        rateLimitStatusCodes: [429]
      },
      retryAfter: 0,
      // Stripe
      publishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
      stripeObj: null,
      stripeClientSecret: '',
      stripeCardElement: null,
      stripeLoading: false,
      stripeErrMsg: '',
      dialogWidth: '600px',
      dialogFullscreen: false,
      dialogTop: '8vh'
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.updateDialogLayout()
      }
      if (newVal && this.paymentToken) {
        // Reset to Paymentsense on each open
        this.selectedMethod = 'paymentsense'
        this.loading = false
        this.showErrMsg = false
        this.errMsgText = 'Payment system load fail, please close and try again'
        this.retryConfig.currentRetry = 0
        this.retryAfter = 0
        this.stripeClientSecret = ''
        this.stripeErrMsg = ''
        this.stripeLoading = false
        this.$nextTick(() => {
          this.initPaymentsense()
        })
      }
    }
  },
  mounted() {
    this.updateDialogLayout()
    window.addEventListener('resize', this.updateDialogLayout)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateDialogLayout)
  },
  methods: {
    updateDialogLayout() {
      if (typeof window === 'undefined') return
      const w = window.innerWidth
      if (w <= 576) {
        this.dialogFullscreen = true
        this.dialogWidth = '100%'
        this.dialogTop = '0'
      } else {
        this.dialogFullscreen = false
        this.dialogTop = w <= 768 ? '2vh' : '8vh'
        if (w <= 768) this.dialogWidth = '94%'
        else if (w <= 1100) this.dialogWidth = '92%'
        else this.dialogWidth = '600px'
      }
    },
    // ── Method Switching ───────────────────────────────────────────────────
    switchToMethod(method) {
      if (method === this.selectedMethod) return

      if (method === 'stripe') {
        this.selectedMethod = 'stripe'
        this.stripeErrMsg = ''

        if (this.stripeCardElement) {
          // Already mounted (user switched back from Paymentsense) – just show it
          return
        }
        // Start the full Stripe flow: create session → init SDK → mount
        this.stripeLoading = true
        this.createStripeSessionAndInit()

      } else {
        // Switch back to Paymentsense (do NOT destroy Stripe – keep iframe alive)
        this.selectedMethod = 'paymentsense'
        if (!this.connectE) {
          // Re-init Paymentsense if it was destroyed
          this.$nextTick(() => {
            const container = document.getElementById('paymentsense-container')
            if (container) container.innerHTML = ''
            this.showErrMsg = false
            this.retryConfig.currentRetry = 0
            this.initPaymentsense()
          })
        }
      }
    },

    retryStripe() {
      this.stripeErrMsg = ''
      this.stripeLoading = true
      this.createStripeSessionAndInit()
    },

    // ── Stripe ─────────────────────────────────────────────────────────────
    async createStripeSessionAndInit() {
      try {
        console.log('[Stripe] Creating payment session... orderId:', this.stripeOrderId, 'quantity:', this.stripeQuantity, 'payType:', this.stripePayType)
        const res = await this.$api.createPaySession({
          quantity: this.stripeQuantity,
          payType: this.stripePayType,
          orderId: this.stripeOrderId,
          transactionType: 'SALE'
        })
        console.log('[Stripe] createPaySession response:', res)

        if ((res.code === 200 || res.code === 0) && res.data && res.data.clientSecret) {
          this.stripeClientSecret = res.data.clientSecret
          await this.initStripe()
        } else {
          throw new Error(res.msg || 'No clientSecret in response')
        }
      } catch (error) {
        console.error('[Stripe] Session creation failed:', error)
        this.stripeLoading = false
        this.stripeErrMsg = 'Failed to create payment session. Please try again.'
      }
    },

    async initStripe() {
      // stripeLoading is already true from createStripeSessionAndInit
      try {
        console.log('[Stripe] Loading Stripe.js...')
        const StripeConstructor = await loadStripeFromCDN()
        if (!StripeConstructor) throw new Error('Stripe.js CDN load failed')
        this.stripeObj = StripeConstructor(this.publishableKey)
        if (!this.stripeObj) throw new Error('Stripe initialization failed')

        console.log('[Stripe] Initializing embedded checkout, secret prefix:', this.stripeClientSecret.slice(0, 20))
        this.stripeCardElement = await this.stripeObj.initEmbeddedCheckout({
          clientSecret: this.stripeClientSecret
        })

        await this.$nextTick()
        if (!this.$refs.cardElement) throw new Error('Mount target element not found')

        console.log('[Stripe] Mounting to cardElement...')
        this.stripeCardElement.mount(this.$refs.cardElement)
        console.log('[Stripe] Mounted successfully')
      } catch (error) {
        console.error('[Stripe] Init failed:', error)
        this.stripeErrMsg = 'Payment initiation failed. Please try again.'
        if (this.stripeCardElement) {
          try { this.stripeCardElement.unmount() } catch (e) { console.warn('unmount error', e) }
          this.stripeCardElement = null
        }
      } finally {
        this.stripeLoading = false
      }
    },

    cleanupStripe() {
      if (this.stripeCardElement) {
        try { this.stripeCardElement.unmount() } catch (e) { console.warn('unmount error', e) }
        this.stripeCardElement = null
      }
      this.stripeObj = null
      this.stripeClientSecret = ''
      this.stripeLoading = false
      this.stripeErrMsg = ''
    },

    // ── Paymentsense ───────────────────────────────────────────────────────
    initPaymentsense() {
      this.loading = true
      const self = this
      const payConfig = {
        paymentDetails: {
          paymentToken: this.paymentToken
        },
        containerId: 'paymentsense-container',
        fontCss: ['https://fonts.googleapis.com/css?family=Do+Hyeon'],
        styles: {
          base: {
            default: {
              color: 'black',
              textDecoration: 'none',
              fontFamily: "'Do Hyeon', sans-serif",
              boxSizing: 'border-box',
              padding: '.375rem .75rem',
              boxShadow: 'none',
              fontSize: '1rem',
              borderRadius: '.25rem',
              lineHeight: '1.5',
              backgroundColor: '#fff',
            },
            focus: { color: '#495057', borderColor: '#80bdff' },
            error: { color: '#B00', borderColor: '#B00' },
            valid: { color: 'green', borderColor: 'green' },
          },
        },
        onIframeLoaded: () => { self.loading = false },
        onIframeLoadFailed: (err) => {
          console.log('Paymentsense iframe load failed:', err)
          self.loading = false
          self.showErrMsg = true
        }
      }

      this.connectE = new window.Connect.ConnectE(payConfig, (err) => {
        console.log('ConnectE displayErrorsCallback:', err)
      }, (data) => {
        console.log('ConnectE onSubmitTriggered:', data)
      })
    },

    async paymentExecuteFn() {
      if (this.connectE) {
        try {
          this.loading = true
          this.retryConfig.currentRetry = 0
          this.retryAfter = 0
          const paymentResult = await this.connectE.executePayment().catch(err => err)
          console.log('Payment Result:', paymentResult)
          if (!paymentResult || (paymentResult.statusCode != 0 && paymentResult.statusCode != 3)) {
            this.loading = false
            MessageBox.confirm('Payment failed, please try again.', '', {
              confirmButtonText: 'OK',
              showCancelButton: false,
              type: 'none'
            }).then(() => {}).catch(() => {})
            return
          }
          this.getPaymentStatusFn(paymentResult.statusCode == 3)
        } catch (error) {
          this.loading = false
          console.log('Payment failed:', error)
          this.$message.error('Payment execution failed, please try again later.')
        }
      } else {
        console.error('Payment SDK not properly initialized')
        this.$message.error('Payment system is not ready. Please try again.')
      }
    },

    paySuccess() {
      this.loading = false
      this.showErrMsg = false
      MessageBox.confirm(
        'Your payment is being processed. We\'ll confirm your registration by email once it\'s completed.',
        'Payment',
        { confirmButtonText: 'OK', showCancelButton: false, type: 'none' }
      ).then(() => { this.$emit('success') }).catch(() => {})
    },

    async getPaymentStatusFn(isAuthorizing) {
      const { maxRetries, currentRetry, baseInterval, retryableStatusCodes, rateLimitStatusCodes } = this.retryConfig
      console.log(`[Payment Status] Query attempt ${currentRetry + 1}/${maxRetries}`)

      try {
        const resp = await this.$api.getPaymentStatus(this.paymentToken)

        if (resp && (resp.code == 200 || resp.code == 0) && resp.data.success) {
          this.resetRetryConfig()
          this.loading = false
          this.$emit('success')
          return
        }
        if (!isAuthorizing) { this.paySuccess(); return }
        this.handleNonSuccessResponse(resp, isAuthorizing)

      } catch (error) {
        console.error('[Payment Status] Request failed:', error)
        const statusCode = error.response?.status || error.status || 0
        if (rateLimitStatusCodes.includes(statusCode)) {
          this.handleRateLimitError(isAuthorizing, error.response)
        } else if (retryableStatusCodes.includes(statusCode) && currentRetry < maxRetries) {
          this.scheduleRetry(isAuthorizing, baseInterval * (currentRetry + 1))
        } else {
          this.handleFinalFailure()
        }
      }
    },

    handleRateLimitError(isAuthorizing, response) {
      const { currentRetry, maxRetries, backoffFactor, maxInterval } = this.retryConfig
      const retryAfterSeconds = parseInt(response?.headers?.['retry-after']) || 0
      this.retryAfter = retryAfterSeconds > 0
        ? retryAfterSeconds * 1000
        : this.retryConfig.baseInterval * Math.pow(backoffFactor, currentRetry)
      this.retryAfter = Math.min(this.retryAfter, maxInterval)
      if (currentRetry < maxRetries) {
        this.scheduleRetry(isAuthorizing, this.retryAfter)
      } else {
        this.handleFinalFailure('Payment request limit exceeded. Please try again in a few minutes.')
      }
    },

    handleNonSuccessResponse(resp, isAuthorizing) {
      const { currentRetry, maxRetries } = this.retryConfig
      if (isAuthorizing && currentRetry < maxRetries) {
        this.scheduleRetry(isAuthorizing, this.retryConfig.baseInterval * (currentRetry + 1))
      } else {
        this.handleFinalFailure()
      }
    },

    scheduleRetry(isAuthorizing, delay) {
      this.retryConfig.currentRetry += 1
      setTimeout(() => { this.getPaymentStatusFn(isAuthorizing) }, delay)
    },

    handleFinalFailure(customMsg = 'Payment failed, please try again.') {
      this.resetRetryConfig()
      this.loading = false
      MessageBox.confirm(customMsg, '', {
        confirmButtonText: 'OK', showCancelButton: false, type: 'none'
      }).then(() => {}).catch(() => {})
    },

    resetRetryConfig() {
      this.retryConfig.currentRetry = 0
      this.retryAfter = 0
    },

    handleClose() {
      this.resetRetryConfig()
      this.cleanupStripe()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.payment {
  .payment-method-wrapper {
    border: 1px solid #DCDFE6;
    border-radius: 6px;
    padding: 14px 16px 16px;
    margin-bottom: 16px;

    .method-label {
      display: block;
      font-size: 13px;
      color: #8A9094;
      margin-bottom: 12px;
    }

    .method-options {
      display: flex;
      gap: 12px;
    }

    .method-option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border: 1px solid #DCDFE6;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      background: #fff;
      user-select: none;

      &:hover { border-color: #036FC0; }

      &--active {
        border-color: #036FC0;
        background: #F4FAFF;
      }

      .method-inner { gap: 10px; }

      .paymentsense-icon,
      .stripe-icon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .method-name {
        font-size: 14px;
        font-weight: 600;
        color: #0E3045;
      }

      .method-check {
        color: #036FC0;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .paymentsense-content {
    min-height: 280px;
    overflow-y: auto;
  }

  .stripe-content {
    position: relative;
    min-height: 300px;

    .stripe-overlay {
      position: absolute;
      inset: 0;
      min-height: 300px;
      z-index: 10;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;

      .stripe-spin {
        font-size: 28px;
        color: #036FC0;
        animation: stripe-rotate 1s linear infinite;
      }

      .stripe-loading-text {
        font-size: 14px;
        color: #8A9094;
      }
    }

    .card-element {
      width: 100%;
      min-height: 300px;
    }
  }

  .footer {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    .footer-btn {
      background-color: #036fc0;
      color: #ffffff;
    }
    ::v-deep .el-button {
      max-width: 100%;
    }
  }

  .err-msg {
    color: #F56C6C;
    font-size: 14px;
    text-align: center;
  }
}

::v-deep .payment.el-dialog {
  display: flex;
  flex-direction: column;
  max-height: 92vh;
  margin-bottom: 0;
  box-sizing: border-box;
}

::v-deep .payment.el-dialog.is-fullscreen {
  max-height: 100vh;
  height: 100% !important;
  margin-top: 0 !important;
  margin-bottom: 0;
  border-radius: 0;
}

::v-deep .payment .el-dialog__header {
  background-color: #ECF1F5;
  color: #0E3045;
  font-size: 14px;
  padding: 10px 20px;
  flex-shrink: 0;
}

::v-deep .payment .el-dialog__title {
  font-size: 14px;
  font-weight: bold;
  word-break: break-word;
  padding-right: 8px;
}

::v-deep .payment .el-dialog__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px 20px;
  box-sizing: border-box;
}

::v-deep .payment.is-fullscreen .el-dialog__body {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}

::v-deep .payment.is-fullscreen .el-dialog__body > .payment-method-wrapper {
  flex-shrink: 0;
}

::v-deep .payment.is-fullscreen .paymentsense-content,
::v-deep .payment.is-fullscreen .stripe-content {
  flex: 1 1 auto;
  min-height: 0;
}

::v-deep .payment .el-dialog__footer {
  flex-shrink: 0;
  padding: 12px 20px 16px;
  box-sizing: border-box;
}

::v-deep .payment.is-fullscreen .paymentsense-content {
  overflow-y: auto;
}

@media (max-width: 768px) {
  .payment .payment-method-wrapper {
    padding: 12px 12px 14px;
  }

  .payment .footer {
    flex-direction: column;
    align-items: stretch;
    ::v-deep .el-button {
      width: 100%;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }

  .payment .paymentsense-content {
    min-height: 240px;
  }

  .payment .stripe-content {
    min-height: 260px;
    .stripe-overlay {
      min-height: 260px;
    }
    .card-element {
      min-height: 260px;
    }
  }
}

@media (max-width: 576px) {
  ::v-deep .payment .el-dialog__body {
    padding: 12px 14px;
  }

  ::v-deep .payment .el-dialog__header {
    padding: 10px 14px;
  }

  ::v-deep .payment .el-dialog__footer {
    padding: 10px 14px 14px;
  }

  .payment .paymentsense-content {
    min-height: 220px;
  }
}

@keyframes stripe-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>

<style lang="scss">
/* Center payment dialog (Element UI inline marginTop + flex .el-dialog breaks default centering) */
.el-dialog__wrapper:has(> .payment:not(.is-fullscreen)) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  box-sizing: border-box;
}

.el-dialog.payment:not(.is-fullscreen) {
  margin: 0 auto !important;
}

@supports not (selector(:has(*))) {
  .el-dialog.payment:not(.is-fullscreen) {
    margin-top: 8vh !important;
  }
}

.payment-loading {
  .el-loading-spinner { top: 40%; }
  .el-icon-loading { font-size: 60px; }
  .el-loading-text { font-size: 40px; }
}

@media (max-width: 576px) {
  .payment-loading {
    .el-icon-loading { font-size: 40px; }
    .el-loading-text { font-size: 18px; }
  }
}
</style>
