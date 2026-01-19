<template>
  <div class="orderdetail">
    <div class="vcontainer main-container">
      <span class="orderdetail-title"><span>Order Details</span>  <i class="el-icon-back" @click="goto('/mine')"></i></span>
      <div class="fill vcontainer orderdetail-content">
        <span class="oc-title">Order Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Order ID</span>
            <span>{{ detailData.orderId }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Payment Status</span>
            <span>{{ detailData.paymentStatus }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Registration Type</span>
            <span>{{ detailData.registrationType }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Congress Title</span>
            <span>{{ detailData.congressTitle }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Starting</span>
            <span>{{ (detailData.startTime || '').substr(0, 10) }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Ending</span>
            <span>{{ (detailData.endTime || '').substr(0, 10) }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Currency</span>
            <span>{{ detailData.currency }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Cost</span>
            <span>{{ detailData.cost }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Handling</span>
            <span>{{ detailData.handling }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Number of Registrants</span>
            <span>{{ detailData.numberOfRegistrants }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Company/Institution Name</span>
            <span>{{ detailData.companyName || detailData.institutionName || '' }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Contact Number</span>
            <span>{{ detailData.contactNumber }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Mode of Payment</span>
            <span>{{ detailData.modeOfPayment }}</span>
          </div>
          <div class="fill"></div>
        </div>
        <span class="oc-title">Payment Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Payment</span>
            <span>{{ detailData.payType }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Amount Payable</span>
            <span>{{ detailData.totalAmount }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Amount Paid</span>
            <span>{{ detailData.paidAmount }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Card Name</span>
            <span>{{ detailData.cardName || '***' }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Card Number</span>
            <span>{{ detailData.cardNumber || '**** **** **** **** ***' }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Document type</span>
            <span>{{ detailData.documentType }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Company Name</span>
            <span>{{ detailData.companyName }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">VAT</span>
            <span>{{ detailData.vat }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Address</span>
            <span>{{ detailData.address }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Town/City</span>
            <span>{{ detailData.town_city }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Postcode</span>
            <span>{{ detailData.postcode }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Country</span>
            <span>{{ detailData.country }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Document</span>
            <a :href="detailData.documentUrl" target="_blank" class="oc-link">{{ detailData.documentUrl }}</a>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Payment Time</span>
            <span>{{ detailData.paymentTime }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Submitter FMF ID</span>
            <span>{{ detailData.submitterId }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Submitted By</span>
            <span>{{ detailData.submittedBy }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Submitter Email</span>
            <span>{{ detailData.submitterEmail }}</span>
          </div>
          <div class="fill"></div>
        </div>
        <span class="oc-title">Registration Information</span>
        <el-table
          :data="detailData.registrationList"
          style="width: 100%"
          :header-cell-style="{backgroundColor: '#DCE4EA', color: '#656B6F'}">
          <el-table-column type="index" label="No." width="60" align="center"></el-table-column>
          <el-table-column prop="fmfId" label="FMF ID" min-width="120" align="center"></el-table-column>
          <el-table-column prop="registrationStatus" label="Registration Status" min-width="180" align="center"></el-table-column>
          <el-table-column prop="lastName" label="Last name" min-width="120" align="center"></el-table-column>
          <el-table-column prop="firstName" label="First name" min-width="120" align="center"></el-table-column>
          <el-table-column prop="email" label="Email" min-width="210" align="center"></el-table-column>
          <el-table-column prop="title" label="Title" min-width="100" align="center"></el-table-column>
          <el-table-column prop="clinicalSpecialty" label="Clinical Specialty" min-width="150" align="center"></el-table-column>
          <el-table-column prop="otherClinicalSpecialty" label="Other Clinical Specialties" min-width="200" align="center"></el-table-column>
          <el-table-column prop="institution" label="Institution" min-width="150" align="center"></el-table-column>
          <el-table-column prop="institutionName" label="Institution Name" min-width="150" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OrderDetail',
    data() {
      return {
        detailData: {}
      }
    },
    methods: {
      goto(path) {
        this.$router.push(path)
      },
      getOrderDetailFn() {
        this.$api.orderDetail({id: this.$route.query.id}).then((res) => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.detailData = res.data
          } else {
            this.detailData = {}
          }
        }).catch((err) => {
          console.log('err:', err)
          this.detailData = {}
        })
      }
    },
    created() {
      this.getOrderDetailFn()
    }
  }
</script>

<style lang="scss" scoped>
  .orderdetail {
    padding: 100px 0 20px;
    background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
    .orderdetail-title {
      font-weight: bold;
      font-size: 24px;
      color: #0E3045;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      i{
        cursor: pointer;
      }
    }
    .orderdetail-content {
      font-weight: bold;
      font-size: 14px;
      color: #0E3045;
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 8px;
      background-color: #FFFFFF;
      box-shadow: 0px 10px 20px 1px rgba(14,48,69,0.1);
      .oc-title {
        font-weight: bold;
        font-size: 18px;
        color: #23272A;
        margin: 10px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #DCE4EA;
      }
      .oc-label {
        width: 200px;
        font-weight: normal;
        color: #8A9094;
        text-align: right;
        margin-right: 30px;
      }
      .oc-link {
        color: #036FC0;
        text-decoration: none;
      }
    }
  }
</style>