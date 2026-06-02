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
      <span v-if="showErrMsg" class="fill hcontainer vcenter hcenter err-msg">Payment system load fail, please close and try again</span>
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
        showErrMsg: false
      }
    },
    watch: {
      visible(newVal) {
        if (newVal && this.paymentToken) {
          this.loading = false
          this.showErrMsg = false
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
            const paymentResult = await this.connectE.executePayment()
            console.log('Payment Result:', paymentResult)
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
      getPaymentStatusFn() {
        this.$api.getPaymentStatus(this.paymentToken).then(resp => {
          this.loading = false
          if ((resp.code === 200 || resp.code === 0) && resp.data && resp.data.success) {
            this.$emit('success')
          } else {
            this.$message.error('Payment Failed')
          }
        }).catch(err => {
          this.loading = false
          console.log('err:', err)
        })
      },
      handleClose() {
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
