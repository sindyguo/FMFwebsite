<template>
  <el-dialog
    :visible="visible"
    :title="dialogTitle"
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
    width="800px"
    @close="handleClose">
    <div id="paymentsense-container" class="vcontainer vcenter hcenter content">
      <!-- 优化错误提示：区分加载失败和支付查询失败 -->
      <span v-if="showErrMsg" class="fill hcontainer vcenter hcenter err-msg">
        {{ errMsgText }}
      </span>
    </div>
    <div slot="footer" class="hcontainer vcenter hcenter footer">
      <el-button class="w-150" @click="handleClose">Cancel</el-button>
      <el-button class="footer-btn w-150" :disabled="loading || showErrMsg" @click="paymentExecuteFn">Confirm Pay</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { MessageBox } from 'element-ui'

  export default {
    name: 'PaymentDialog',
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
        dialogTitle: 'Card Information',
        connectE: null,
        loading: false,
        showErrMsg: false,
        errMsgText: 'Payment system load fail, please close and try again', // 错误提示文本
        // 重试相关配置
        retryConfig: {
          maxRetries: 5, // 最大重试次数
          currentRetry: 0, // 当前重试次数
          retryInterval: 3000 // 重试间隔（毫秒）
        }
      }
    },
    watch: {
      visible(newVal) {
        if (newVal && this.paymentToken) {
          this.loading = false
          this.showErrMsg = false
          this.errMsgText = 'Payment system load fail, please close and try again'
          // 重置重试计数器
          this.retryConfig.currentRetry = 0
          this.$nextTick(() => {
            this.initPaymentsense()
          })
        }
      }
    },
    methods: {
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
              focus: {
                color: '#495057',
                borderColor: '#80bdff',
              },
              error: {
                color: '#B00',
                borderColor: '#B00'
              },
              valid: {
                color: 'green',
                borderColor: 'green'
              },
            },
          },
          onIframeLoaded: () => {
            self.loading = false
          },
          onIframeLoadFailed: (err) => {
            console.log('iframe load failed:', err)
            self.loading = false
            self.showErrMsg = true
          }
        }

        this.connectE = new window.Connect.ConnectE(payConfig, (err) => {
          console.log('connect displayErrorsCallback: ', err)
        }, (data) => {
          console.log('connectE onSubmitTriggered:', data)
        })
      },
      async paymentExecuteFn() {
        if (this.connectE) {
          try {
            this.loading = true
            // 重置重试计数器
            this.retryConfig.currentRetry = 0
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
            // 调用带重试的支付状态查询
            this.getPaymentStatusFn(paymentResult.statusCode == 3)
          } catch (error) {
            this.loading = false
            console.log('Payment failed:', error)
          }
        } else {
          console.error('Payment SDK not properly initialized');
          this.$message.error('Payment system is not ready. Please try again.');
        }
      },
      paySuccess() {
        this.isLoading = false
        this.showErrMsg = false
        MessageBox.confirm('Your payment is being processed. We’ll confirm your registration by email once it’s completed.', 'Payment', {
          confirmButtonText: 'OK',
          showCancelButton: false,
          type: 'none'
        }).then(() => {
          self.$emit('success')
        }).catch(() => {})
      },
      // 重构：带自动重试的支付状态查询
      async getPaymentStatusFn(isAuthorizing) {
        const { maxRetries, currentRetry, retryInterval } = this.retryConfig
        
        // 打印重试日志，便于调试
        console.log(`[Payment Status] Query attempt ${currentRetry + 1}/${maxRetries}`)

        const resp = await this.$api.getPaymentStatus(this.paymentToken).catch(err => err)
        if (resp && (resp.code == 200 || resp.code == 0) && resp.data.success) {
          this.retryConfig.currentRetry = 0
          this.loading = false
          this.$emit('success')
        } else {
          if (!isAuthorizing) {
            this.paySuccess()
            return
          } else if (currentRetry < maxRetries) {
            this.retryConfig.currentRetry += 1
            console.log(`[Payment Status] 500 error, retrying in ${retryInterval/1000}s (${this.retryConfig.currentRetry}/${maxRetries})`)
            
            // 延迟重试
            setTimeout(() => {
              this.getPaymentStatusFn(isAuthorizing)
            }, retryInterval)
          } else {
            // 重试耗尽或非500错误，终止并提示
            this.loading = false
            this.retryConfig.currentRetry = 0 // 重置计数器

            MessageBox.confirm('Payment failed, please try again.', '', {
              confirmButtonText: 'OK',
              showCancelButton: false,
              type: 'none'
            }).then(() => {}).catch(() => {})
          }
        }
      },
      handleClose() {
        // 关闭时重置重试计数器
        this.retryConfig.currentRetry = 0
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .payment {
    .content {
      height: 300PX;
      overflow-y: auto;
    }
    .footer {
      .footer-btn {
        background-color: #036fc0;
        color: #ffffff;
      }
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