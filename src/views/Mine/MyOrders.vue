<template>
  <div class="myOrders">
    <div class="fill vcontainer flex-around mine-order-main">
        <div class="hcontainer vcenter flex-between">
          <div class="hcontainer vcenter">
            <div class="hcontainer vcenter mr-10">
              <span class="order-sn" @click="orderClick(item)">{{ item.orderId }}</span>
              <span class="order-name" v-html="item.congressTitle || ''"></span>
            </div>
            <span :class="['mine-item-status', (item.paymentStatus || '').toLowerCase()]">{{ item.paymentStatus }}</span>
          </div>
        </div>
        <div class="w100 hcontainer vcenter flex-between mv-10">
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Registration type</span>
            <span class="mine-item-value">{{ item.registrationType | registrationTypeF }}</span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Payment Time</span>
            <span class="mine-item-value">{{ item.paymentTime }}</span>
          </div>
          <div class="hcontainer vcenter" v-if="item[`${item.documentType}Url`]">
            <span class="mine-item-label">Document</span>
            <el-link type="primary" style="margin-left: 12px;" @click="letterClick('/app-api/fmf/user/congress' +item[`${item.documentType}Url`])">{{ item.documentType + '.pdf' }}</el-link>
          </div>
        </div>
        <div class="w100 hcontainer vcenter flex-between">
          <!-- <div class="hcontainer vcenter">
            <span class="mine-item-label">Cost</span>
            <span class="mine-item-value">{{ item.cost }}</span>
          </div> -->
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Number of Registrants</span>
            <span class="mine-item-value">{{ item.numberOfRegistrants }}</span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Amount Payable</span>
            <span class="mine-item-value">{{ item.totalAmount }}</span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Amount Paid</span>
            <span class="mine-item-value">{{ item.paidAmount }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="item.paymentStatus === 'Unpaid'"
        class="vcontainer flex-around ml-50 mine-order-actions">
        <el-button type="text" class="mine-btn" @click="payClick(item)">
          Proceed to Pay
        </el-button>
      </div>
      <PaymentDialog
      :visible="showPaymentDialog"
      :paymentToken="paymentToken"
      :stripeOrderId="stripeOrderId"
      :stripeQuantity="stripeQuantity"
      :stripePayType="stripePayType"
      @close="paymentClose"
      @success="paymentSuccess" />
  </div>
</template>

<script>
  import PaymentDialog from '@/components/PaymentDialog.vue'
  export default {
    name: 'MyOrders',
    components: {
      PaymentDialog
    },
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    inject: ['letterClick'],
    data() {
      return {
        paymentToken: '',
        stripeOrderId: '',
        stripeQuantity: 1,
        stripePayType: '',
        showPaymentDialog: false,
        baseUrl: import.meta.env.VITE_BASE_URL
      }
    },
    methods: {
      orderClick(row) {
        this.$router.push('/orderDetail?id=' + row.orderId)
      },
      payClick(row) {
        // 记录当前订单信息，供 Stripe 支付使用
        this.stripeOrderId = row.orderId
        this.stripeQuantity = row.quantity || 1
        this.stripePayType = row.payType || ''
        this.createPayTokenFn(row.totalAmount, row.currency, row.orderId)
      },
      createPayTokenFn(amount, currency, orderId, transactionType = 'SALE') {
        this.$api.createPayToken({
          amount: amount,
          currency: currency,
          orderId: orderId,
          transactionType: transactionType
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.paymentToken = res.data.tokenId
            this.showPaymentDialog = true
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      },
      paymentSuccess() {
        this.showPaymentDialog = false
        this.$emit('refreshList')
      },
      paymentClose() {
        this.showPaymentDialog = false
      },
    }
  }
</script>

<style lang="scss">
.myOrders {
  width: 100%;
  .mr-10 { flex-wrap: wrap; gap: 2px 0; }
  .order-sn {
    font-weight: bold;
    font-size: 16px;
    color: #036FC0;
    cursor: pointer;
  }
  .order-name {
    font-size: 14px;
    color: #0E3045;
    margin-left: 20px;
  }

  .mine-order-main {
    min-width: 0;
  }

  /* Same column as My Registrations actions: pin to bottom-right of the card row */
  .mine-order-actions {
    flex-shrink: 0;
    align-self: flex-end;
    justify-content: flex-end;
  }
}
</style>