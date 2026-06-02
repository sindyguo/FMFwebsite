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
        showErrMsg: false,
        lastPaymentAttempt: 0,
        paymentCooldown: 5000, // 5 seconds cooldown between payment attempts
        consecutiveFailures: 0, // Track consecutive failures
        maxConsecutiveFailures: 3 // Max failures before disabling
      }
    },
    computed: {
      isPaymentDisabled() {
        return this.loading || this.showErrMsg || this.consecutiveFailures >= this.maxConsecutiveFailures;
      }
    },
    watch: {
      visible(newVal) {
        if (newVal && this.paymentToken) {
          this.resetState();
          this.$nextTick(() => {
            this.initPaymentsense()
          })
        }
      }
    },
    methods: {
      resetState() {
        this.loading = false;
        this.showErrMsg = false;
        this.consecutiveFailures = 0;
      },
      
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
        // Check if we've reached max failures
        if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
          this.$message.error('Too many failed payment attempts. Please refresh the page or contact support.');
          return;
        }
        
        const now = Date.now();
        const timeSinceLastAttempt = now - this.lastPaymentAttempt;
        
        if (timeSinceLastAttempt < this.paymentCooldown) {
          const remainingTime = Math.ceil((this.paymentCooldown - timeSinceLastAttempt) / 1000);
          this.$message.warning(`Please wait ${remainingTime} seconds before next payment attempt`);
          return;
        }
        
        if (this.isPaymentDisabled || !this.connectE) {
          return;
        }
        
        this.lastPaymentAttempt = now;
        
        try {
          this.loading = true;
          const paymentResult = await this.connectE.executePayment();
          console.log('Payment Result:', paymentResult);
          
          // Reset failure counter on successful execution
          this.consecutiveFailures = 0;
          
          this.getPaymentStatusFn();
        } catch (error) {
          this.loading = false;
          this.handlePaymentError(error);
        }
      },
      
      handlePaymentError(error) {
        // Increment failure counter
        this.consecutiveFailures++;
        
        if (this.isErrorRateLimit(error)) {
          this.$message.error('Payment system is temporarily overloaded. Please wait before trying again.');
        } else if (Array.isArray(error) && error.length > 0) {
          this.$message.warning(error[0].message);
        } else {
          this.$message.error('Payment processing failed. Please try again.');
        }
        
        // If we've reached max failures, show special message
        if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
          this.$message.error('Maximum number of payment attempts exceeded. Please refresh the page or contact support.');
        }
      },
      
      isErrorRateLimit(error) {
        // Check if the error is related to rate limiting
        if (error.status === 429) {
          return true;
        }
        
        if (Array.isArray(error) && error.some(e => 
          e.message && e.message.toLowerCase().includes('too many requests'))) {
          return true;
        }
        
        // Also check if error has response property with status 429
        if (error.response && error.response.status === 429) {
          return true;
        }
        
        return false;
      },
      
      async getPaymentStatusFn() {
        const maxRetries = 3;
        let attempts = 0;
        
        while (attempts < maxRetries) {
          try {
            this.loading = true;
            const resp = await this.$api.getPaymentStatus(this.paymentToken);
            
            if ((resp.code === 200 || resp.code === 0) && resp.data && resp.data.success) {
              this.$emit('success');
              return;
            } else {
              this.$message.error('Payment Failed');
              return;
            }
          } catch (err) {
            attempts++;
            
            if (this.isErrorRateLimit(err) && attempts < maxRetries) {
              // Calculate delay with exponential backoff (with jitter)
              const delay = Math.min(1000 * Math.pow(2, attempts), 10000) + Math.random() * 1000;
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            } else if (this.isErrorRateLimit(err)) {
              this.$message.warning('Server is busy. Please try again later.');
              break;
            } else {
              console.log('Payment status check error:', err);
              this.$message.error('Payment verification failed. Please try again.');
              break;
            }
          } finally {
            if (attempts >= maxRetries) {
              this.loading = false;
            }
          }
        }
        
        this.loading = false;
      },
      
      handleClose() {
        this.$emit('close');
        // Reset state when closing
        this.resetState();
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