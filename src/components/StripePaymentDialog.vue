<template>
  <el-dialog
    :visible="visible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="!isProcessing"
    :append-to-body="true"
    :destroy-on-close="true"
    v-loading="isProcessing"
    element-loading-text="Please wait..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    element-loading-custom-class="payment-loading"
    class="stripepayment"
    width="800px"
    @close="handleClose">
    <div class="vcontainer vcenter hcenter content">
      <div id="card-element" ref="cardElement" class="card-element"></div>
      <div v-if="errMsg" class="fill hcontainer vcenter hcenter err-msg">{{ errMsg }}</div>
    </div>
    <!-- <div slot="footer" class="hcontainer vcenter hcenter footer">
      <el-button
        class="w-150"
        :disabled="isProcessing"
        @click="handleClose">
        Cancel
      </el-button>
      <el-button class="footer-btn w-150"
        :disabled="!stripe || !elements || isProcessing"
        @click="paymentExecuteFn">
        Confirm Pay
      </el-button>
    </div> -->
  </el-dialog>
</template>

<script>
// 动态加载Stripe.js，避免全局污染
const loadStripe = () => {
  return import('@stripe/stripe-js').then(module => module.loadStripe)
}

export default {
  name: 'StripePaymentDialog',
  props: {
    paymentToken: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      publishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
      stripe: null,
      elements: null,
      cardElement: null,
      isProcessing: false,
      errMsg: ''
    }
  },
  computed: {
    dialogTitle() {
      return this.isProcessing ? 'Payment processing...' : 'Payment'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.errMsg = ''
        this.initializeStripe()
      } else {
        this.cleanup()
      }
    }
  },
  methods: {
    async initializeStripe() {
      try {
        // 动态加载Stripe
        const loadStripeFn = await loadStripe()
        this.stripe = await loadStripeFn(this.publishableKey)
        if (!this.stripe) {
          throw new Error('Stripe initialization failed')
        }
        this.isProcessing = true

        // note: 使用elements.create创建调用confirmCardPayment会失败，目前只能使用嵌入式initEmbeddedCheckout完全交由stripe控制
        // 初始化Elements
        // this.elements = this.stripe.elements()
        // console.log('elements:', this.elements)
        // // 创建卡元素
        // this.cardElement = this.elements.create('card', { 
        //   style: {
        //     base: {
        //       color: '#32325d',
        //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        //       fontSmoothing: 'antialiased',
        //       fontSize: '16px',
        //       '::placeholder': {
        //         color: '#aab7c4'
        //       }
        //     },
        //     invalid: {
        //       color: '#fa755a',
        //       iconColor: '#fa755a'
        //     }
        //   },
        //   hidePostalCode: true // 隐藏邮政编码（根据业务需要）
        // })
        
        this.cardElement = await this.stripe.initEmbeddedCheckout({clientSecret: this.paymentToken})
        // console.log('cardElement:',this.cardElement)
        // // 挂载卡元素到DOM
        await this.$nextTick()
        this.cardElement.mount(this.$refs.cardElement)
        // 监听验证错误
        // this.cardElement.on('change', (event) => {
        //   this.errMsg = event.error ? event.error.message : ''
        // })
      } catch (error) {
        console.error('Stripe initiation failed:', error)
        this.$message.error('Payment initiation failed, please refresh and try again')
      } finally {
        this.isProcessing = false
      }
    },
    async paymentExecuteFn() {
      if (!this.stripe || !this.elements || !this.paymentToken) {
        this.$message.warning('Payment system is not ready.')
        return
      }
      try {
        this.isProcessing = true
        // 确认支付
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(
          this.paymentToken,
          {
            payment_method: {
              card: this.cardElement,
            }
          }
        )
        if (error) {
          // 支付失败
          this.handlePaymentError(error)
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          // 支付成功
          this.handlePaymentSuccess(paymentIntent)
        } else {
          // 其他状态
          this.handlePaymentStatus(paymentIntent)
        }
      } catch (error) {
        console.error('Payment error:', error)
        this.$message.error('Payment error:', error)
      } finally {
        this.isProcessing = false
      }
    },
    handlePaymentSuccess(paymentIntent) {
      console.log('pay success:', paymentIntent)
      this.$message.success('Payment successful')
      this.cleanup()
      this.$emit('success')
    },
    handlePaymentError(error) {
      console.error('Payment failed :', error)
      let errorMessage = 'Payment failed'
      switch (error.type) {
        case 'card_error':
          errorMessage = `Card error: ${error.message}`
          break
        case 'validation_error':
          errorMessage = 'Payment validation error'
          break
        case 'api_error':
          errorMessage = 'Payment api error, please try again later'
          break
        default:
          errorMessage = error.message || 'Unknown error'
      }
      this.$message.error(errorMessage)
    },
    handlePaymentStatus(paymentIntent) {
      console.log('Payment status:', paymentIntent)
      switch (paymentIntent?.status) {
        case 'requires_action':
        case 'requires_confirmation':
          this.$message.info('Please complete payment')
          break
        case 'processing':
          this.$message.info('Payment processing...')
          break
        default:
          this.$message.warning(`Payment status: ${paymentIntent?.status}`)
      }
    },
    handleClose() {
      if (this.isProcessing) {
        this.$message.warning('Payment is processing...')
        return
      }
      this.cleanup()
      this.$emit('close')
    },
    cleanup() {
      if (this.cardElement) {
        this.cardElement.unmount()
        this.cardElement = null
      }
      this.isProcessing = false
    }
  },
  beforeDestroy() {
    this.cleanup()
  }
}
</script>

<style lang="scss" scoped>
  .stripepayment {
    .content {
      min-height: 400PX;
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #e6ebf5;
      border-radius: 4px;
      background-color: #f8f9fa;
      .card-element {
        width: 100%;
        height: 100%;
      }
      .StripeElement {
        width: 100%;
        height: 100%;
        padding: 10px;
      }
    }
    .footer {
      margin-top: 20px;
      .footer-btn {
        background-color: #036fc0;
        color: #ffffff;
      }
    }
    .err-msg {
      color: #F56C6C;
      font-size: 14px;
      text-align: center;
    }
  }
  ::v-deep .el-dialog__header {
    background-color: #ECF1F5;
    color: #0E3045;
    font-size: 14px;
    padding: 10px 20px;
  }
  ::v-deep .el-dialog__title {
    font-size: 14px;
    font-weight: bold;
  }
</style>

<style lang="scss">
  .payment-loading {
    .el-loading-spinner {
      top: 40%;
    }
    .el-icon-loading {
      font-size: 60px;
    }
    .el-loading-text {
      font-size: 40px;
    }
  }
</style>