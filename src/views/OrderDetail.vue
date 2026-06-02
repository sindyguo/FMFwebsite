<template>
  <div class="orderdetail">
    <div class="vcontainer main-container">
      <div class="hcontainer vcenter flex-between page-header">
        <span class="orderdetail-title">Order Details</span>
        <div class="order-back" @click="$router.back()"></div>
      </div>
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
            <span class="oc-label">Registration type</span>
            <span>{{ detailData.registrationType | registrationTypeF }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Congress Title</span>
            <span v-html="detailData.congressTitle || ''"></span>
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
            <span class="oc-label">Type</span>
            <span>{{ detailData.congressType }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Type of Fee</span>
            <span>{{ detailData.typeOfFee }}</span>
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
        
        <!-- <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Company/Institution name</span>
            <span>{{ detailData.companyName || detailData.institutionName || '' }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Contact number</span>
            <span>{{ detailData.contactNumber }}</span>
          </div>
        </div> -->
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Mode of payment</span>
            <span>{{ detailData.modeOfPayment | modeOfPaymentF }}</span>
          </div>
          <div class="fill"></div>
        </div>
        <span class="oc-title">Payment information</span>
        <div class="hcontainer vcenter flex-between pv-10" v-for="item in detailData.typeOfFeeList" :key="item.id">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">{{item.feeType}}</span>
            <span>{{ item.feeName }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Fee Amount</span>
            <span>{{ item.feeAmount }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10" v-if="detailData.supportingDocumentsImgList && detailData.supportingDocumentsImgList.length">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Supporting Documents</span>
            <span v-for="(item, index) in detailData.supportingDocumentsImgList" :key="index">
              <el-link type="primary" @click="handleDownLoad(item.url)">{{ item.name }}</el-link>
              <span v-if="index<detailData.supportingDocumentsImgList.length - 1">，</span>
            </span>
          </div>
        </div>
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
            <span class="oc-label">Document type</span>
            <span>{{ detailData.documentType }}</span>
          </div>
          
        </div>
        
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Company name</span>
            <span>{{ detailData.companyName2 }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">VAT</span>
            <span>{{ detailData.vat }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Address</span>
            <span>{{ detailData.address2 }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Town/City</span>
            <span>{{ detailData.townCity2 }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Postcode</span>
            <span>{{ detailData.postcode2 }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Country</span>
            <span>{{ detailData.country2 }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Document</span>
            <a v-if="detailData[`${detailData.documentType}Url`]" :href="baseUrl+'/app-api/fmf/user/congress' + detailData[`${detailData.documentType}Url`]" target="_blank" class="oc-link">{{detailData.documentType}}.pdf</a>
            <!-- <el-button type="text" @click="downloadDocument(detailData)">{{detailData.documentType}}.pdf</el-button> -->
          </div>
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Payment Time</span>
            <span>{{ detailData.paymentTime }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="oc-label">Submitter FMF ID</span>
            <span>{{ detailData.fmfId }}</span>
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
        <span class="oc-title">Registration information</span>
        <div class="registration-table-wrap">
        <el-table
          :data="detailData.registrationList"
          style="width: 100%"
          :header-cell-style="{backgroundColor: '#DCE4EA', color: '#656B6F'}">
          <el-table-column type="index" label="No." width="60" align="center"></el-table-column>
          <el-table-column prop="fmfId" label="FMF ID" min-width="120" align="center"></el-table-column>
          <el-table-column prop="registrationStatus" label="Registration Status" min-width="180" align="center"></el-table-column>
          <el-table-column prop="firstName" label="First name" min-width="120" align="center"></el-table-column>
          <el-table-column prop="lastName" label="Last name" min-width="120" align="center"></el-table-column>
          <el-table-column prop="email" label="Email" min-width="210" align="center"></el-table-column>
          <el-table-column prop="title" label="Title" min-width="100" align="center"></el-table-column>
          <el-table-column prop="clinicalSpecialty" label="Clinical specialty" min-width="150" align="center"></el-table-column>
          <el-table-column prop="otherClinicalSpecialty" label="Other Clinical Specialties" min-width="200" align="center"></el-table-column>
          <el-table-column prop="institution" label="Institution" min-width="150" align="center"></el-table-column>
          <el-table-column prop="institutionName" label="Institution name" min-width="150" align="center"></el-table-column>
          <el-table-column prop="phone" label="Phone" min-width="150" align="center"></el-table-column>
          <el-table-column prop="address" label="Address" min-width="150" align="center"></el-table-column>
          <el-table-column prop="townCity" label="Town/City" min-width="100" align="center"></el-table-column>
          <el-table-column prop="country" label="Country" min-width="150" align="center"></el-table-column>
          <el-table-column prop="postcode" label="Postcode" min-width="100" align="center"></el-table-column>
          <el-table-column prop="disclosureStatus" label="Disclosure Status" min-width="150" align="center"></el-table-column>
          <el-table-column prop="visaDocument" label="Visa document required?" min-width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.visaDocument == 1 ? 'Required' : 'Not required' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dateOfBirth" label="Date of birth" min-width="150" align="center"></el-table-column>
          <el-table-column prop="passportNumber" label="Passport number" min-width="150" align="center"></el-table-column>
          <el-table-column prop="dateOfIssue" label="Date of issue" min-width="110" align="center"></el-table-column>
          <el-table-column prop="countryOfIssue" label="Country of issue" min-width="150" align="center"></el-table-column>
        </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'OrderDetail',
    data() {
      return {
        detailData: {}
      }
    },
    filters: {
      modeOfPaymentF(val) {
        if (val) {
          if (val == 'credit') {
            return 'Credit card'
          } else if (val == 'debit') {
            return 'Debit card'
          } else if (val.toLowerCase().includes('transfer')) {
            return 'Bank transfer'
          } else {
            return val
          }
        } else {
          return ''
        }
      }
    },
    computed: {
      baseUrl() {
        return window.location.origin + process.env.VUE_APP_BASE_API;
      }
    },
    methods: {
      ...mapActions('user', ['changeActiveId']),
      goto(path) {
        this.changeActiveId('/mine')
        this.$router.push(path)
      },
      downloadDocument(item) {
       this.$api.exportCongressFile(item.documentType,item.congressId,item.documentType,item.documentType)
      },
      getOrderDetailFn() {
        this.$api.orderDetail({id: this.$route.query.id}).then((res) => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.detailData = {
              ...res.data,
              typeOfFee: res.data.typeOfFeeList?.map(item=>item.feeType).join('，'),
            }
          } else {
            this.detailData = {}
          }
        }).catch((err) => {
          console.log('err:', err)
          this.detailData = {}
        })
      },
      handleDownLoad(url) {
        window.open(url, '_black')
      }
    },
    created() {
      this.getOrderDetailFn()
    }
  }
</script>

<style lang="scss" scoped>
.orderdetail {
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 100px 20px 24px;
  background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
  overflow-x: hidden;

  /* Override global .main-container fixed 1200px */
  .main-container {
    width: 100% !important;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    min-width: 0;
  }

  .page-header {
    align-items: flex-start;
    gap: 12px;
  }

  .orderdetail-title {
    font-weight: bold;
    font-size: 24px;
    color: #0E3045;
    line-height: 1.3;
    word-break: break-word;
    min-width: 0;
    flex: 1;
  }

  .order-back {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    margin-right: 0;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9) url('#{$svgUrl}/icon_back.svg') center no-repeat;
    background-size: 18px;
    border: 1px solid #d4e5f5;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;

    &:hover {
      background-color: #fff;
      box-shadow: 0 2px 8px rgba(14, 48, 69, 0.1);
    }
  }

  .orderdetail-content {
    font-weight: bold;
    font-size: 14px;
    color: #0E3045;
    padding: 20px 24px 24px;
    margin-top: 10px;
    margin-bottom: 30px;
    border-radius: 8px;
    background-color: #FFFFFF;
    box-shadow: 0px 10px 20px 1px rgba(14, 48, 69, 0.1);
    box-sizing: border-box;
    max-width: 100%;
    min-width: 0;

    .oc-title {
      font-weight: bold;
      font-size: 18px;
      color: #23272A;
      margin: 10px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #DCE4EA;
    }

    .oc-label {
      flex-shrink: 0;
      width: 200px;
      font-weight: normal;
      color: #8A9094;
      text-align: right;
      margin-right: 30px;
    }

    .oc-link {
      color: #036FC0;
      text-decoration: none;
      word-break: break-word;
    }

    /* label + value row inside each cell */
    .fill.hcontainer {
      align-items: flex-start;
      min-width: 0;
    }

    .fill.hcontainer > span:not(.oc-label) {
      word-break: break-word;
      font-weight: bold;
      min-width: 0;
    }
  }

  .registration-table-wrap {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    margin-top: 8px;
    -webkit-overflow-scrolling: touch;
    min-height: 0;
  }

  .registration-table-wrap ::v-deep .el-table {
    min-width: 1100px;
  }

  .registration-table-wrap ::v-deep .el-table__body-wrapper {
    overflow-x: visible;
  }
}

@media (max-width: 900px) {
  .orderdetail {
    padding: 88px 16px 20px;

    .orderdetail-title {
      font-size: 21px;
    }

    .orderdetail-content {
      padding: 18px 18px 20px;

      .oc-label {
        width: 168px;
        margin-right: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .orderdetail {
    padding: 72px 14px 20px;

    .orderdetail-title {
      font-size: 19px;
    }

    .orderdetail-content {
      padding: 16px 14px 20px;
      margin-bottom: 24px;

      .oc-title {
        font-size: 16px;
        margin-top: 14px;
      }

      /* Two-column rows → stack */
      .hcontainer.flex-between.pv-10 {
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
      }

      .hcontainer.flex-between.pv-10 > .fill {
        flex: none;
        width: 100%;
        max-width: 100%;
      }

      .fill.hcontainer {
        flex-direction: column;
        align-items: flex-start;
      }

      .oc-label {
        width: 100%;
        max-width: 100%;
        text-align: left;
        margin-right: 0;
        margin-bottom: 6px;
        font-weight: 600;
      }
    }
  }
}

@media (max-width: 640px) {
  .orderdetail {
    padding: 64px 10px 16px;

    .orderdetail-title {
      font-size: 17px;
    }

    .orderdetail-content {
      padding: 14px 12px 18px;
      border-radius: 10px;
      font-size: 13px;

      .oc-title {
        font-size: 15px;
      }
    }
  }

  .registration-table-wrap ::v-deep .el-table {
    font-size: 12px;
  }

  .registration-table-wrap ::v-deep .el-table th,
  .registration-table-wrap ::v-deep .el-table td {
    padding: 8px 4px;
  }
}

@media (max-width: 420px) {
  .orderdetail {
    padding: 56px 8px 14px;

    .orderdetail-title {
      font-size: 16px;
    }

    .order-back {
      width: 30px;
      height: 30px;
      background-size: 16px;
    }
  }
}
</style>