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
            const paymentResult = await this.connectE.executePayment()
            console.log('Payment Result:', paymentResult)
            // 调用带重试的支付状态查询
            this.getPaymentStatusFn()
          } catch (error) {
            this.loading = false
            console.log('Payment failed:', error)
            if (Array.isArray(error) && error.length > 0) {
              this.$message.warning(error[0].message)
            }
          }
        } else {
          console.error('Payment SDK not properly initialized');
          this.$message.error('Payment system is not ready. Please try again.');
        }
      },
      // 重构：带自动重试的支付状态查询
      getPaymentStatusFn() {
        const { maxRetries, currentRetry, retryInterval } = this.retryConfig
        
        // 打印重试日志，便于调试
        console.log(`[Payment Status] Query attempt ${currentRetry + 1}/${maxRetries}`)

        this.$api.getPaymentStatus(this.paymentToken).then(resp => {
          this.loading = false
          // 重置重试计数器（成功后）
          this.retryConfig.currentRetry = 0
          
          if ((resp.code === 200 || resp.code === 0) && resp.data && resp.data.success) {
            this.$emit('success')
          } else {
            this.$message.error('Payment Failed')
          }
        }).catch(err => {
          console.log('Payment status query error:', err)
          
          // 判断是否是500错误（根据实际err结构调整，以下是通用写法）
          const is500Error = err.response?.status === 500 || 
                            err.code === 500 || 
                            err.message?.includes('INTERNAL_SERVER_ERROR')

          // 重试逻辑
          if (is500Error && currentRetry < maxRetries) {
            this.retryConfig.currentRetry += 1
            console.log(`[Payment Status] 500 error, retrying in ${retryInterval/1000}s (${this.retryConfig.currentRetry}/${maxRetries})`)
            
            // 延迟重试
            setTimeout(() => {
              this.getPaymentStatusFn()
            }, retryInterval)
          } else {
            // 重试耗尽或非500错误，终止并提示
            this.loading = false
            this.retryConfig.currentRetry = 0 // 重置计数器
            
            if (is500Error) {
              // 500重试耗尽的提示
              this.$message.error('Payment status inquiry failed after multiple attempts. Please check your payment status later or contact customer service.')
            } else {
              // 其他错误提示
              this.$message.error('Payment Failed')
            }
          }
        })
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