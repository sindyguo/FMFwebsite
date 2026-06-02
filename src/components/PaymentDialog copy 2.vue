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
      <!-- 优化错误提示：区分不同场景 -->
      <span v-if="showErrMsg" class="fill hcontainer vcenter hcenter err-msg">
        {{ errMsgText }}
      </span>
      <!-- 3D验证提示 -->
      <span v-if="show3DSPrompt" class="fill hcontainer vcenter hcenter prompt-msg">
        Redirecting to bank verification page... Please complete the identity verification to continue payment.
      </span>
    </div>
    <div slot="footer" class="hcontainer vcenter hcenter footer">
      <el-button class="w-150" @click="handleClose">Cancel</el-button>
      <el-button class="footer-btn w-150" :disabled="loading || showErrMsg || show3DSPrompt" @click="paymentExecuteFn">Confirm Pay</el-button>
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
    },
    // 新增：3D验证回调后传递的参数（由父组件传入）
    threeDSResult: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogTitle: 'Card Information',
      connectE: null,
      loading: false,
      showErrMsg: false,
      show3DSPrompt: false, // 3D验证跳转提示
      errMsgText: 'Payment system load fail, please close and try again',
      // 重试配置
      retryConfig: {
        maxRetries: 5,
        currentRetry: 0,
        retryInterval: 3000
      },
      // 3D验证相关参数
      threeDSParams: null
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.paymentToken) {
        this.resetState();
        this.$nextTick(() => {
          this.initPaymentsense();
        });
      }
    },
    // 监听3D验证结果（父组件传递）
    threeDSResult(newVal) {
      if (newVal && newVal.MD && newVal.PaRes) {
        this.handle3DSCallback(newVal);
      }
    }
  },
  methods: {
    // 重置组件状态
    resetState() {
      this.loading = false;
      this.showErrMsg = false;
      this.show3DSPrompt = false;
      this.errMsgText = 'Payment system load fail, please close and try again';
      this.retryConfig.currentRetry = 0;
      this.threeDSParams = null;
    },
    // 初始化支付SDK
    initPaymentsense() {
      this.loading = true;
      const self = this;
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
          self.loading = false;
        },
        onIframeLoadFailed: (err) => {
          console.log('iframe load failed:', err);
          self.loading = false;
          self.showErrMsg = true;
        }
      };

      this.connectE = new window.Connect.ConnectE(payConfig, (err) => {
        console.log('connect displayErrorsCallback: ', err);
      }, (data) => {
        console.log('connectE onSubmitTriggered:', data);
      });
    },
    // 执行支付
    async paymentExecuteFn() {
      if (!this.connectE) {
        this.$message.error('Payment system is not ready. Please try again.');
        return;
      }

      try {
        this.loading = true;
        this.resetState();
        // 执行支付请求
        const paymentResult = await this.connectE.executePayment();
        console.log('Payment Execute Result:', paymentResult);

        // 判断是否需要3D验证
        if (paymentResult.statusCode === 3 && paymentResult.acsUrl && paymentResult.paReq) {
          this.handle3DSVerification(paymentResult);
        } else if (paymentResult.success) {
          // 无需3D验证，直接查询支付状态
          this.getPaymentStatusFn();
        } else {
          this.loading = false;
          this.$message.error(paymentResult.message || 'Payment failed');
        }
      } catch (error) {
        this.loading = false;
        console.log('Payment execute error:', error);
        if (Array.isArray(error) && error.length > 0) {
          this.$message.warning(error[0].message);
        } else {
          this.$message.error('Payment process failed. Please try again.');
        }
      }
    },
    /**
     * 处理3D Secure验证 - 核心方法
     * @param {Object} params 3D验证参数（acsUrl/paReq/md等）
     */
    handle3DSVerification(params) {
      this.loading = false;
      this.show3DSPrompt = true;
      this.threeDSParams = params;

      // 1. 构建3D验证回调地址（替换为你的实际后端回调地址）
      const termUrl = `${window.location.origin}/api/payment/3ds-callback`;
      
      // 2. 创建隐藏表单并自动提交
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = params.acsUrl; // 银行验证页面地址
      form.target = '_self'; // 同窗口跳转（也可设为_blank新窗口）
      form.style.display = 'none';

      // 3. 添加3D验证必要参数
      const formParams = [
        { name: 'PaReq', value: params.paReq },
        { name: 'MD', value: params.md || params.transactionId }, // 交易会话ID
        { name: 'TermUrl', value: termUrl } // 验证完成后的回调地址
      ];

      // 4. 插入参数到表单
      formParams.forEach(item => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = item.name;
        input.value = item.value;
        form.appendChild(input);
      });

      // 5. 提交表单跳转到银行验证页面
      document.body.appendChild(form);
      setTimeout(() => {
        form.submit();
      }, 1000); // 延迟1秒提交，让用户看到提示文字
    },
    /**
     * 处理3D验证回调结果（由父组件传递参数触发）
     * @param {Object} result 回调参数（MD/PaRes等）
     */
    handle3DSCallback(result) {
      this.loading = true;
      this.show3DSPrompt = false;

      // 调用后端接口确认3D验证结果
      this.$api.confirm3DSVerification({
        MD: result.MD,
        PaRes: result.PaRes,
        paymentToken: this.paymentToken
      }).then(resp => {
        if (resp.code === 200 && resp.data.success) {
          // 验证成功，查询最终支付状态
          this.getPaymentStatusFn();
        } else {
          this.loading = false;
          this.$message.error(resp.data.message || '3D verification failed');
        }
      }).catch(err => {
        this.loading = false;
        console.log('3DS confirm error:', err);
        this.$message.error('Failed to confirm verification result. Please check payment status manually.');
      });
    },
    /**
     * 带重试逻辑的支付状态查询
     */
    getPaymentStatusFn() {
      const { maxRetries, currentRetry, retryInterval } = this.retryConfig;
      console.log(`[Payment Status] Query attempt ${currentRetry + 1}/${maxRetries}`);

      this.$api.getPaymentStatus(this.paymentToken).then(resp => {
        this.loading = false;
        this.retryConfig.currentRetry = 0;
        
        if ((resp.code === 200 || resp.code === 0) && resp.data && resp.data.success) {
          this.$emit('success');
          this.$message.success('Payment completed successfully!');
        } else {
          this.$message.error(resp.data?.message || 'Payment Failed');
        }
      }).catch(err => {
        console.log('Payment status query error:', err);
        
        // 判断是否是500错误
        const is500Error = err.response?.status === 500 || 
                          err.code === 500 || 
                          err.message?.includes('INTERNAL_SERVER_ERROR');

        // 重试逻辑
        if (is500Error && currentRetry < maxRetries) {
          this.retryConfig.currentRetry += 1;
          console.log(`[Payment Status] 500 error, retrying in ${retryInterval/1000}s (${this.retryConfig.currentRetry}/${maxRetries})`);
          
          setTimeout(() => {
            this.getPaymentStatusFn();
          }, retryInterval);
        } else {
          this.loading = false;
          this.retryConfig.currentRetry = 0;
          
          if (is500Error) {
            this.$message.error('Payment status inquiry failed after multiple attempts. Please check your payment status later or contact customer service.');
          } else {
            this.$message.error('Failed to query payment status. Please try again.');
          }
        }
      });
    },
    // 关闭弹窗
    handleClose() {
      this.resetState();
      this.$emit('close');
    }
  }
};
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
  .err-msg {
    color: #B00;
    font-size: 16px;
    text-align: center;
  }
  .prompt-msg {
    color: #036fc0;
    font-size: 16px;
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