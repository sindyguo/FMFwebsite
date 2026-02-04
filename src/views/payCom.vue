<template>
  <div class="paymentsense-demo">
    <div class="container">
      <h2 class="text-center mb-4">Paymentsense SDK Demo</h2>
      <p class="text-center text-muted mb-4">演示如何使用 Paymentsense Connect-E SDK 进行支付、查询和退款</p>

      <!-- Step 1: 创建支付 Token -->
      <div class="section">
        <h4><span class="step-number">1</span>创建支付 Token</h4>
        <form @submit.prevent="createToken">
          <div class="form-row">
            <div class="form-group col-md-4">
              <label for="amount">支付金额（最小单位）</label>
              <input type="text" class="form-control" v-model="tokenForm.amount" required>
              <small class="form-text text-muted">100 = 1.00 GBP</small>
            </div>
            <div class="form-group col-md-4">
              <label for="currency">货币</label>
              <select class="form-control" v-model="tokenForm.currency" required>
                <option value="GBP" selected>GBP - 英镑</option>
                <option value="EUR">EUR - 欧元</option>
                <option value="USD">USD - 美元</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label for="txntype">交易类型</label>
              <select class="form-control" v-model="tokenForm.transactionType" required>
                <option value="SALE" selected>SALE - 即时支付</option>
                <option value="PREAUTH">PREAUTH - 预授权</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">创建支付 Token</button>
        </form>

        <div id="token-result" class="result-box" v-if="tokenResult.tokenId">
          <div class="info-row">
            <span class="info-label">Token ID:</span>
            <span>{{ tokenResult.tokenId }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">订单ID:</span>
            <span>{{ tokenResult.orderId }}</span>
          </div>
        </div>
      </div>

      <!-- Step 2: 执行支付 -->
      <div class="section" v-if="showPaymentSection">
        <h4><span class="step-number">2</span>执行支付</h4>
        <p class="text-muted">请在下方表单中输入测试卡信息</p>
        <!-- 确保支付表单元素总是存在，使用 v-show 而不是 v-if -->
        <div id="payment-form" v-show="showPayBtn"></div>
        <button 
          id="pay-btn" 
          class="btn btn-success btn-block btn-custom" 
          :disabled="payBtnDisabled"
          @click="executePayment"
          v-if="showPayBtn">
          {{ payBtnText }}
        </button>
        <div id="errors" class="mt-2 text-danger" v-if="errorMessage">{{ errorMessage }}</div>
      </div>

      <!-- Step 3: 支付结果 -->
      <div class="section" v-if="showResultSection">
        <h4><span class="step-number">3</span>支付结果</h4>
        <div id="payment-result" class="result-box">
          <div :class="paymentResult.success ? 'success' : 'error'" style="font-size: 18px; margin-bottom: 15px;">
            {{ paymentResult.success ? '支付成功' : '支付失败' }}
          </div>
          <div class="info-row">
            <span class="info-label">状态码:</span> {{ paymentResult.statusCode || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">授权码:</span> {{ paymentResult.authCode || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">交易参考号:</span> {{ paymentResult.crossReference || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">交易时间:</span> {{ paymentResult.transactionDateTime || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">卡类型:</span> {{ paymentResult.cardType || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">卡号:</span> {{ paymentResult.cardNumber || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">持卡人:</span> {{ paymentResult.cardName || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">有效期:</span> {{ paymentResult.expiryDate || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">消息:</span> {{ paymentResult.message || '' }}
          </div>
        </div>
      </div>

      <!-- Step 4: 退款操作 -->
      <div class="section" v-if="showRefundSection">
        <h4><span class="step-number">4</span>退款操作</h4>
        <form @submit.prevent="processRefund">
          <div class="form-row">
            <div class="form-group col-md-8">
              <label for="refund-amount">退款金额（可选，留空为全额退款）</label>
              <input type="text" class="form-control" v-model="refundForm.amount" placeholder="留空为全额退款">
            </div>
            <div class="form-group col-md-4 d-flex align-items-end">
              <button type="submit" class="btn btn-warning btn-block" :disabled="refundBtnDisabled">
                {{ refundBtnText }}
              </button>
            </div>
          </div>
        </form>

        <div id="refund-result" class="result-box" v-if="refundResult.tokenId">
          <div :class="refundResult.success ? 'success' : 'error'" style="font-size: 18px; margin-bottom: 15px;">
            {{ refundResult.success ? '退款成功' : '退款失败' }}
          </div>
          <div class="info-row">
            <span class="info-label">退款Token ID:</span> {{ refundResult.tokenId }}
          </div>
          <div class="info-row">
            <span class="info-label">状态码:</span> {{ refundResult.statusCode || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">授权码:</span> {{ refundResult.authCode || 'N/A' }}
          </div>
          <div class="info-row">
            <span class="info-label">消息:</span> {{ refundResult.message || '' }}
          </div>
        </div>
      </div>

      <!-- 测试卡信息提示 -->
      <div class="section">
        <h4>测试卡信息</h4>
        <div class="result-box">
          <ul>
            <li>卡名字: Sherlock Holmes</li>
            <li>卡号: 4111111111111111</li>
            <li>过期日期: 12/25 </li>
            <li>CVV: 111</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentsenseSdkDemo',
  data() {
    return {
      // Token表单数据
      tokenForm: {
        amount: '100',
        currency: 'GBP',
        transactionType: 'SALE'
      },
      // Token创建结果
      tokenResult: {
        tokenId: '',
        orderId: ''
      },
      // 支付相关状态
      connectEInstance: null,
      currentTokenId: null,
      currentCurrency: null,
      showPaymentSection: false,
      showPayBtn: false,
      payBtnDisabled: false,
      payBtnText: '确认支付',
      errorMessage: '',
      // 支付结果
      showResultSection: false,
      paymentResult: {},
      // 退款相关
      showRefundSection: false,
      refundForm: {
        amount: ''
      },
      refundBtnDisabled: false,
      refundBtnText: '执行退款',
      refundResult: {},
      currentPaymentInfo: null
    }
  },
  mounted() {
    // 确保Paymentsense SDK加载完成
    this.checkSdkLoaded();
  },
  beforeDestroy() {
    // 销毁SDK实例，防止内存泄漏
    if (this.connectEInstance) {
      try {
        this.connectEInstance = null;
      } catch (e) {
        console.warn('销毁ConnectE实例时出错:', e);
      }
    }
  },
  methods: {
    // 检查SDK是否加载完成
    checkSdkLoaded() {
      if (window.Connect && window.Connect.ConnectE) {
        console.log('Paymentsense SDK已加载');
        return true;
      } else {
        console.warn('Paymentsense SDK未加载，5秒后重试...');
        setTimeout(() => {
          this.checkSdkLoaded();
        }, 5000);
        return false;
      }
    },

    // 显示错误信息
    displayErrors(errors) {
      if (!errors) {
        this.errorMessage = '';
        return;
      }
      
      let errorText = '';
      if (Array.isArray(errors)) {
        errorText = errors.map(error => {
          let msg = error.message || error;
          return typeof msg === 'object' ? JSON.stringify(msg) : msg;
        }).join('<br>');
      } else {
        errorText = typeof errors === 'object' ? JSON.stringify(errors) : errors;
      }
      
      this.errorMessage = errorText;
    },

    // Step 1: 创建支付Token
    async createToken() {
      try {
        this.displayErrors('');
        const response = await this.$api.createPayToken({
          amount: this.tokenForm.amount,
          currency: this.tokenForm.currency,
          transactionType: this.tokenForm.transactionType
        }).catch(err => err)

        const data = response.data;

        if (data.success) {
          this.tokenResult = {
            tokenId: data.tokenId,
            orderId: data.orderId
          };
          this.currentTokenId = data.tokenId;
          this.currentCurrency = this.tokenForm.currency;

          // 显示支付区域
          this.showPaymentSection = true;

          // 使用 $nextTick 确保DOM已更新后再初始化支付表单
          this.$nextTick(() => {
            // 初始化支付表单
            this.initPaymentForm(data);
          });
        } else {
          this.$message.error('创建 Token 失败: ' + (data.error || '未知错误'));
        }
      } catch (error) {
        console.error('创建Token失败:', error);
        this.$message.error('请求失败: ' + (error.message || '网络错误'));
      }
    },

    // 初始化支付表单
    initPaymentForm(tokenData) {
      // 确保支付表单元素存在
      const paymentFormElement = document.getElementById('payment-form');
      if (!paymentFormElement) {
        console.error('Payment form element not found');
        this.$message.error('支付表单初始化失败，请刷新页面重试');
        return;
      }

      console.log('Payment form element found:', paymentFormElement);

      // Connect-E 表单样式
      const styles = {
        base: {
          default: {
            color: 'black',
            fontFamily: "'Do Hyeon', sans-serif",
            padding: '.375rem .75rem',
            fontSize: '1rem',
            borderRadius: '.25rem',
            backgroundColor: '#fff',
          },
          focus: {
            borderColor: '#80bdff',
          },
          error: {
            color: '#dc3545',
            borderColor: '#dc3545',
          },
          valid: {
            color: '#28a745',
            borderColor: '#28a745',
          },
        },
      };

      const currencyCodeMap = {
        GBP: '826',
        EUR: '978',
        USD: '840'
      };

      const paymentDetails = {
        amount: tokenData.amount,
        currencyCode: currencyCodeMap[this.tokenForm.currency] || '826',
        paymentToken: tokenData.tokenId
      };

      const config = {
        paymentDetails: paymentDetails,
        containerId: 'payment-form', // 确保容器ID与DOM元素匹配
        fontCss: ['https://fonts.googleapis.com/css?family=Do+Hyeon'],
        styles: styles,
      };

      // 延迟初始化，确保DOM元素完全渲染
      setTimeout(() => {
        try {
          // 创建ConnectE实例
          this.connectEInstance = new window.Connect.ConnectE(config, (errors) => {
            console.error('ConnectE实例错误:', errors);
            this.displayErrors(errors);
          });
          
          // 显示支付按钮
          this.showPayBtn = true;
        } catch (error) {
          console.error('初始化ConnectE实例失败:', error);
          this.$message.error('支付表单初始化失败: ' + error.message);
        }
      }, 100); // 延迟100ms确保DOM渲染完成
    },

    // Step 2: 执行支付
    async executePayment() {
      this.payBtnDisabled = true;
      this.payBtnText = '处理中...';
      this.displayErrors('');

      try {
        if (!this.connectEInstance) {
          throw new Error('支付表单未初始化，请重新创建Token');
        }

        const paymentResult = await this.connectEInstance.executePayment();
        console.log('Payment executed:', paymentResult);

        // 查询支付状态
        await this.checkPaymentStatus(this.currentTokenId);

      } catch (error) {
        console.error('Payment failed:', error);
        this.displayErrors([error]);
        this.payBtnDisabled = false;
        this.payBtnText = '确认支付';
      }
    },

    // 查询支付状态
    async checkPaymentStatus(tokenId) {
      try {
        const response = await this.$axios.get(`/app-api/fmf/webuser/payment-status/${tokenId}`);
        const data = response.data;

        // 保存支付信息用于退款
        this.currentPaymentInfo = data;

        // 隐藏支付表单
        this.showPaymentSection = false;

        // 显示支付结果
        this.paymentResult = data;
        this.showResultSection = true;

        // 如果支付成功，显示退款选项
        if (data.success) {
          this.showRefundSection = true;
        }

      } catch (error) {
        console.error('查询支付状态失败:', error);
        this.$message.error('查询支付状态失败: ' + (error.message || '网络错误'));
        this.payBtnDisabled = false;
        this.payBtnText = '确认支付';
      }
    },

    // Step 4: 执行退款
    async processRefund() {
      this.refundBtnDisabled = true;
      this.refundBtnText = '处理中...';

      try {
        // Step 4.1: 获取原支付信息（如果还没有）
        if (!this.currentPaymentInfo) {
          const statusResponse = await this.$axios.get(`/api/payment-status/${this.currentTokenId}`);
          this.currentPaymentInfo = statusResponse.data;
        }

        if (!this.currentPaymentInfo.crossReference) {
          throw new Error('无法获取原支付的交易参考号');
        }

        // Step 4.2: 创建退款 Token
        const refundTokenResponse = await this.$axios.post('/api/create-refund-token', {
          token: this.currentTokenId,
          amount: this.refundForm.amount || this.tokenForm.amount,
          currency: this.currentCurrency || this.tokenForm.currency
        });

        const refundTokenData = refundTokenResponse.data;

        if (!refundTokenData.success) {
          throw new Error(refundTokenData.error || '创建退款Token失败');
        }

        console.log('Refund token created:', refundTokenData.tokenId);

        // Step 4.3: 执行 Cross Reference Payment
        const crossRefResponse = await this.$axios.post(`/api/cross-reference-payments/${refundTokenData.tokenId}`, {
          crossReference: this.currentPaymentInfo.crossReference
        });

        const refundResult = crossRefResponse.data;
        
        // 显示退款结果
        this.refundResult = {
          ...refundResult,
          tokenId: refundTokenData.tokenId
        };

        // 禁用退款按钮（防止重复退款）
        this.refundBtnText = '已退款';

        this.$message.success(refundResult.success ? '退款成功' : '退款失败');

      } catch (error) {
        console.error('退款请求失败:', error);
        this.$message.error('退款请求失败: ' + (error.message || '网络错误'));
        this.refundBtnDisabled = false;
        this.refundBtnText = '执行退款';
      }
    }
  }
}
</script>

<style scoped>
.paymentsense-demo {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.section h4 {
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
}

#payment-form {
  min-height: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

#payment-form iframe {
  width: 100%;
  min-height: 200px;
}

.result-box {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
}

.success {
  color: #28a745;
  font-weight: bold;
}

.error {
  color: #dc3545;
  font-weight: bold;
}

.info-row {
  margin-bottom: 8px;
  word-wrap: break-word;
  word-break: break-all;
}

.info-label {
  font-weight: 600;
  color: #666;
  min-width: 150px;
  display: inline-block;
}

.info-row span:not(.info-label) {
  word-wrap: break-word;
  word-break: break-all;
  display: inline-block;
  max-width: calc(100% - 160px);
  vertical-align: top;
}

.btn-custom {
  margin-top: 10px;
}

.step-number {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
  font-weight: bold;
}

.text-danger {
  color: #dc3545 !important;
}

.text-muted {
  color: #6c757d !important;
}

.text-center {
  text-align: center !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -5px;
  margin-left: -5px;
}

.form-group {
  margin-bottom: 1rem;
}

.col-md-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  padding-right: 5px;
  padding-left: 5px;
}

.col-md-8 {
  flex: 0 0 66.666667%;
  max-width: 66.666667%;
  padding-right: 5px;
  padding-left: 5px;
}

.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
}

.btn-block {
  display: block;
  width: 100%;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

.btn-warning {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}

.d-flex {
  display: flex !important;
}

.align-items-end {
  align-items: flex-end !important;
}
</style>

<!-- 全局样式引入（建议在main.js中全局引入，这里为了完整保留） -->
<style>

</style>

<!-- SDK引入（建议在public/index.html中引入，这里为了完整保留） -->