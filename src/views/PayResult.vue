<template>
  <div class="vcontainer vcenter hcenter paymentresult">
    <div class="vcontainer vcenter hcenter paymentresult-container">
      <h1>{{ payResult }}</h1>
      <p style="margin: 30px 0;">Thanks!</p>
      <router-link to="/">Back Home</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        payResult: ''
      }
    },
    methods: {
      async getPaymentStatusFn(sessionId) {
        try {
          const resp = await this.$api.getPaySessionStatus(sessionId).catch(err => err)
          // 支付成功逻辑
          if (resp && (resp.code == 200 || resp.code == 0) && resp.data && resp.data.status == 'complete') {
            this.payResult = '🎉 Payment Successful'
          } else {
            this.payResult = '❌ Payment Failed'
          }
        } catch (error) {
          this.payResult = '❌ Payment Failed'
          console.error(`Payment Status Request failed:`, error)
        }
      }
    },
    mounted() {
      // 可通过 URL 参数获取 session_id
      const sessionId = this.$route.query.session_id
      this.getPaymentStatusFn(sessionId)
    }
  }
</script>

<style lang="scss" scoped> 
  .paymentresult {
    width: 100%;
    height: 100%;
    font-size: 18px;
    color: #8A9094;
    .paymentresult-container {
      width: 1000px;
      height: 500px;
      padding: 50px 30px 50px 30px;
      background-color: #ffffff;
    }
  }
</style>