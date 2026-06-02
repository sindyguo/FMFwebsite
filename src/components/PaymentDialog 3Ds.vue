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
    <div class="vcontainer vcenter hcenter content">
      <!-- 1. 支付表单容器（始终存在） -->
      <div 
        id="paymentsense-container" 
        v-show="!show3DSVerify && !showErrMsg"
        class="payment-form-container">
      </div>

      <!-- 2. 3DS验证页面（银行端） -->
      <div v-if="show3DSVerify" class="hcontainer vcenter hcenter">
        <!-- 银行验证iframe（优先） -->
        <iframe
          v-if="threeDSVerifyUrl"
          :src="threeDSVerifyUrl"
          frameborder="0"
          class="three-ds-iframe"
          @load="handle3DSIframeLoad"
          @error="handle3DSIframeError">
        </iframe>

        <!-- 跳转引导（iframe不支持时） -->
        <div v-else class="redirect-guide">
          <p>3D Secure verification is required. Please verify via your bank:</p>
          <el-button 
            type="primary" 
            @click="open3DSVerifyPage"
            class="mt-10">
            Go to 3DS Verification Page
          </el-button>
          <p class="mt-10 tip">After verification, this window will update automatically.</p>
        </div>
      </div>

      <!-- 错误提示区域 -->
      <span v-if="showErrMsg" class="fill hcontainer vcenter hcenter err-msg">
        {{ errMsgText }}
      </span>
    </div>
    <div slot="footer" class="hcontainer vcenter hcenter footer">
      <el-button class="w-150" @click="handleClose">Cancel</el-button>
      <!-- 3DS验证中禁用支付按钮 -->
      <el-button 
        class="footer-btn w-150" 
        :disabled="loading || showErrMsg || show3DSVerify" 
        @click="paymentExecuteFn">
        Confirm Pay
      </el-button>
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
      dialogTitle: 'Card Information (3DS Enabled)',
      connectE: null,
      loading: false,
      showErrMsg: false,
      errMsgText: 'Payment system load fail, please close and try again',
      // 3DS验证相关状态
      show3DSVerify: false, // 是否显示3DS验证页面
      threeDSVerifyUrl: '', // 3DS验证页面地址
      verifyPollingTimer: null, // 3DS验证结果轮询定时器
      // 重试配置
      retryConfig: {
        maxRetries: 5,
        currentRetry: 0,
        retryInterval: 3000,
        verifyPollingInterval: 5000 // 3DS验证轮询间隔
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.paymentToken) {
        this.resetAllStates();
        this.$nextTick(() => {
          // 确保DOM渲染完成后初始化
          setTimeout(() => {
            this.initPaymentsense();
          }, 100);
        });
      } else {
        this.clearAllTimers();
      }
    }
  },
  beforeDestroy() {
    this.clearAllTimers();
    this.destroySdkInstance();
  },
  methods: {
    /**
     * 重置所有状态
     */
    resetAllStates() {
      this.loading = false;
      this.showErrMsg = false;
      this.errMsgText = 'Payment system load fail, please close and try again';
      this.show3DSVerify = false;
      this.threeDSVerifyUrl = '';
      this.retryConfig.currentRetry = 0;
      this.clearAllTimers();
      this.destroySdkInstance();
    },

    /**
     * 清除所有定时器
     */
    clearAllTimers() {
      if (this.verifyPollingTimer) {
        clearInterval(this.verifyPollingTimer);
        this.verifyPollingTimer = null;
      }
    },

    /**
     * 销毁SDK实例
     */
    destroySdkInstance() {
      if (this.connectE) {
        try {
          this.connectE.destroy?.();
        } catch (err) {
          console.debug('Destroy ConnectE error:', err);
        }
        this.connectE = null;
      }
    },

    /**
     * 初始化支付SDK（适配3DS）
     */
    initPaymentsense() {
      const container = document.getElementById('paymentsense-container');
      if (!container) {
        this.loading = false;
        this.showErrMsg = true;
        this.errMsgText = 'Payment container not found, please refresh';
        return;
      }

      this.loading = true;
      const self = this;
      const payConfig = {
        paymentDetails: { paymentToken: this.paymentToken },
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
          self.loading = false;
        },
        onIframeLoadFailed: (err) => {
          console.error('Payment iframe load failed:', err);
          self.loading = false;
          self.showErrMsg = true;
          self.errMsgText = 'Payment system load failed';
        },
        // 3DS验证触发回调（SDK返回验证页面地址）
        on3DSecureRequired: (verifyData) => {
          console.log('3DS verification triggered:', verifyData);
          self.loading = false;
          self.show3DSVerify = true;
          self.threeDSVerifyUrl = verifyData.url;
          // 启动3DS验证结果轮询
          self.start3DSVerifyPolling();
        }
      };

      try {
        this.connectE = new window.Connect.ConnectE(payConfig, (err) => {
          console.log('Payment errors:', err);
          if (err?.length) {
            self.showErrMsg = true;
            self.errMsgText = err[0].message;
          }
        });
      } catch (initError) {
        console.error('SDK init error:', initError);
        this.loading = false;
        this.showErrMsg = true;
        this.errMsgText = 'Payment system initialization failed';
      }
    },

    /**
     * 启动3DS验证结果轮询
     */
    start3DSVerifyPolling() {
      console.log('Starting 3DS verify polling...');
      this.clearAllTimers();
      // 每5秒查询一次验证状态
      this.verifyPollingTimer = setInterval(() => {
        console.log('Polling 3DS verify result...');
        this.check3DSVerifyResult();
      }, this.retryConfig.verifyPollingInterval);
    },

    /**
     * 检查3DS验证结果
     */
    async check3DSVerifyResult() {
      try {
        const result = await this.$api.get3DSVerifyResult(this.paymentToken);
        if (result.success) {
          console.log('3DS verify result:', result);
          // 3DS验证成功，查询支付状态
          this.clearAllTimers();
          this.getPaymentStatusFn();
        } else if (result.status === 'FAILED') {
          console.log('3DS verify failed:', result);
          // 3DS验证失败
          this.clearAllTimers();
          this.show3DSVerify = false;
          this.showErrMsg = true;
          this.errMsgText = '3D Secure verification failed, please try again';
        }
        // 状态为PENDING则继续轮询
      } catch (err) {
        console.debug('3DS verify poll error:', err);
      }
    },

    /**
     * 执行支付操作
     */
    async paymentExecuteFn() {
      if (!this.connectE) {
        this.$message.error('Payment system not ready');
        return;
      }

      try {
        this.loading = true;
        this.retryConfig.currentRetry = 0;
        // 执行支付（触发3DS验证）
        await this.connectE.executePayment();
      } catch (error) {
        this.loading = false;
        console.error('Payment error:', error);
        if (Array.isArray(error) && error.length) {
          this.showErrMsg = true;
          this.errMsgText = error[0].message;
        } else {
          this.$message.error('Payment failed, please try again');
        }
      }
    },

    /**
     * 查询支付最终状态
     */
    getPaymentStatusFn() {
      const { maxRetries, currentRetry, retryInterval } = this.retryConfig;

      this.$api.getPaymentStatus(this.paymentToken).then(resp => {
        this.loading = false;
        this.retryConfig.currentRetry = 0;
        if ((resp.code === 200 || resp.code === 0) && resp.data?.success) {
          this.$emit('success');
          this.handleClose();
        } else {
          this.showErrMsg = true;
          this.errMsgText = 'Payment failed after 3DS verification';
        }
      }).catch(err => {
        console.error('Payment status query error:', err);
        if (currentRetry < maxRetries) {
          this.retryConfig.currentRetry += 1;
          setTimeout(() => {
            this.getPaymentStatusFn();
          }, retryInterval);
        } else {
          this.loading = false;
          this.showErrMsg = true;
          this.errMsgText = 'Payment status inquiry failed';
        }
      });
    },

    /**
     * 处理3DS iframe加载完成
     */
    handle3DSIframeLoad() {
      this.loading = false;
    },

    /**
     * 处理3DS iframe加载失败
     */
    handle3DSIframeError() {
      this.threeDSVerifyUrl = ''; // 切换到跳转引导
    },

    /**
     * 打开3DS验证页面（新标签页）
     */
    open3DSVerifyPage() {
      window.open(this.threeDSVerifyUrl, '_blank');
    },

    /**
     * 关闭弹窗
     */
    handleClose() {
      this.resetAllStates();
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.payment {
  .content {
    height: 400px;
    overflow-y: auto;
    position: relative;
  }

  .payment-form-container {
    width: 100%;
    height: 350px;
    display: block;
    margin: 0 auto;
  }

  .three-ds-iframe {
    width: 100%;
    height: 350px;
    border: none;
  }

  .redirect-guide {
    text-align: center;
    padding: 20px;
  }

  .tip {
    color: #666;
    font-size: 12px;
  }

  .mt-10 {
    margin-top: 10px;
  }

  .footer {
    .footer-btn {
      background-color: #036fc0;
      color: #ffffff;
      &:disabled {
        background-color: #c0c4cc;
        cursor: not-allowed;
      }
    }
  }

  .err-msg {
    color: #dc3545;
    font-size: 14px;
    text-align: center;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
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