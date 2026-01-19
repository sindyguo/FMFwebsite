<template>
  <div class="mine">
    <div class="vcontainer main-container">
      <span class="mine-title">Own Page</span>
      <div class="fill hcontainer">
        <div class="vcontainer mine-left">
          <div class="vcontainer vcenter">
            <el-avatar :size="64" style="font-size: 40px;background-color: #DCE4EA;" icon="el-icon-user-solid"></el-avatar>
            <span class="mine-name">{{ userInfo.username }}</span>
            <span class="mine-title">{{ userInfo.title }}</span>
            <span class="mine-title mine-title1">FMFID:{{ userInfo.fmfId }}</span>
          </div>
          <div class="fill vcontainer mine-userinfo-container">
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_ins.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Institution</span>
                <span>{{ userInfo.institution }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_ins_name.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Institution Name</span>
                <span>{{ userInfo.institutionName }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_clin.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Clinical Specialty</span>
                <span>{{ userInfo.clinicalSpecialty }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_email.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Email</span>
                <span>{{ userInfo.email }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_birDate.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Date of birth</span>
                <span>{{ userInfo.birthday }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_country.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Country</span>
                <span>{{ userInfo.country }}</span>
              </div>
            </div>
          </div>
          <!-- <el-button type="text" class="mine-btn" @click="editClick">Edit</el-button> -->
        </div>
        <div class="fill vcontainer mine-right">
          <div class="hcontainer vcenter tabs">
            <span
              v-for="(tabItem, tabIndex) in tabList"
              :key="tabIndex"
              :class="['tab-item', {'active': tabIndex === curTabIndex}]"
              @click="tabClick(tabIndex)">
              {{ tabItem.name }}
            </span>
          </div>
          <div class="hcontainer vcenter flex-between mine-right-top">
            <div class="header-title">{{ tabList[curTabIndex].name }} ({{ listData.length }})</div>
            <el-pagination
              layout="total, prev, pager, next"
              class="pagination-container"
              :current-page.sync="pageConfig.pageNo"
              :page-size="pageConfig.pageSize"
              :total="pageConfig.total"
              :pager-count="7"
              @current-change="getListDataFn">
            </el-pagination>
          </div>
          <div class="fill vcontainer mine-content">
            <div v-for="(item, index) in listData" :key="index"
              :class="[(curTabIndex === 1 ? 'vcontainer': 'hcontainer vcenter'),
              'flex-between mine-item']">
              <!-- orders -->
              <template v-if="curTabIndex === 1">
                <div class="hcontainer vcenter flex-between">
                  <div class="hcontainer vcenter">
                    <div class="hcontainer vcenter mr-10">
                      <span class="order-sn" @click="orderClick(item)">{{ item.orderId }}</span>
                      <span class="order-name">{{ item.congressTitle }}</span>
                    </div>
                    <span :class="['mine-item-status', (item.paymentStatus || '').toLowerCase()]">{{ item.paymentStatus }}</span>
                  </div>
                  <el-button
                    v-if="item.paymentStatus === 'Unpaid'"
                    type="text"
                    class="mine-btn"
                    @click="payClick(item)">
                    Proceed to Pay
                  </el-button>
                </div>
                <div class="hcontainer vcenter flex-between mv-10">
                  <div class="hcontainer vcenter">
                    <span class="mine-item-label">Registration Type</span>
                    <span class="mine-item-value">{{ item.registrationType }}</span>
                  </div>
                  <div class="hcontainer vcenter">
                    <span class="mine-item-label">Payment Time</span>
                    <span class="mine-item-value">{{ item.paymentTime }}</span>
                  </div>
                  <div class="hcontainer vcenter">
                    <span class="mine-item-label">Currency</span>
                    <span class="mine-item-value">{{ item.currency }}</span>
                  </div>
                </div>
                <div class="hcontainer vcenter flex-between">
                  <div class="hcontainer vcenter">
                    <span class="mine-item-label">Cost</span>
                    <span class="mine-item-value">{{ item.cost }}</span>
                  </div>
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
              </template>
              <!-- congress -->
              <template v-else-if="curTabIndex === 2"> 
                <div class="fill vcontainer flex-around" style="height: 100%">
                  <div class="hcontainer vcenter mine-item-header">
                    <span class="mine-item-title">{{ item.congressTitle }}</span>
                    <span :class="['mine-item-status', (item.registrationStatus || '').toLowerCase().replace(' ', '-')]">{{ item.registrationStatus }}</span>
                  </div>
                  <div class="hcontainer vcenter flex-between">
                    <div class="hcontainer vcenter">
                      <span class="mine-item-label">Order ID</span>
                      <span class="mine-item-link" @click="orderClick(item)">{{ item.orderId }}</span>
                    </div>
                    <div class="hcontainer vcenter">
                      <span class="mine-item-label">Registration Type</span>
                      <span class="mine-item-value">{{ item.registrationType }}</span>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div class="vcontainer flex-around ml-50">
                  <el-button type="text" class="mine-btn" :disabled="item.registrationType !== 'group' || item.registrationStatus != 'Pending Payment'" @click="registerClick(item)">Register</el-button>
                  <el-button type="text" class="mine-btn" disabled @click="letterClick(item)">Visa Letter</el-button>
                  <el-button type="text" class="mine-btn" disabled @click="certClick(item)">Certificate</el-button>
                </div>
              </template>
              <!-- abstract approvals -->
              <template v-else-if="curTabIndex === 3"> 
                <div class="fill vcontainer flex-around" style="height: 100%">
                  <div class="hcontainer vcenter mine-item-header">
                    <span class="mine-item-title">{{ item.abstractsTitle }}</span>
                    <span :class="['mine-item-status', item.status]">{{ item.status | approvalStatusF }}</span>
                  </div>
                  <div class="hcontainer vcenter flex-between"> 
                    <div class="vcontainer flex-between">
                      <div class="hcontainer vcenter mb-10">
                        <span class="mine-item-label">Congress Title</span>
                        <span class="mine-item-value">{{ item.congressTitle }}</span>
                      </div>
                      <div class="hcontainer vcenter">
                        <span class="mine-item-label">Review Time</span>
                        <span class="mine-item-value">{{ item.reviewTime || '' }}</span>
                      </div>
                    </div>
                    <div class="vcontainer flex-between">
                      <div class="hcontainer vcenter mb-10">
                        <span class="mine-item-label">Submitted at</span>
                        <span class="mine-item-value">{{ item.submittedAt }}</span>
                      </div>
                      <div class="hcontainer vcenter">
                        <span class="mine-item-label">Presentation File</span>
                        <span class="mine-item-value" v-if="item.presentationFileList && item.presentationFileList[0] && item.presentationFileList[0].url">
                          <a :href="item.presentationFileList[0].url" target="_blank">{{item.presentationFileList[0].name}}</a>
                        </span>
                          <!-- {{ (item.presentationFileList && item.presentationFileList[0] && item.presentationFileList[0].url || '').split('/').pop() }}</span> -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vcontainer flex-around ml-50">
                  <el-button type="text" class="mine-btn" @click="reviewClick(item)">Review Details</el-button>
                  <!-- :disabled="item.status != 'approved'" -->
                  <!-- :disabled="item.status != 'approved'  ||  !getClickStatus(item.abstractSubmissionStartTime,item.abstractSubmissionEndTime)" -->
                  <el-button type="text" class="mine-btn" :disabled="item.status != 'approved'"  @click="uploadClick(item)">Upload File</el-button>
                </div>
              </template>
              <!-- courses -->
              <template v-else> 
                <div class="fill vcontainer flex-around" style="height: 100%">
                  <div class="hcontainer vcenter mine-item-header">
                    <span class="mine-item-title">{{ item.coursesTitle }}</span>
                    <!-- <span :class="['mine-item-status', (item.examResults === 1 ? 'pass' : (item.total ? 'failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'not-attempted': '')))]">
                      {{ item.examResults === 1 ? 'Pass' : (item.total ? 'Failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'Not Attempted' : '-'))}}
                    </span> -->


                    <!-- <span :class="['mine-item-status', (item.examResults === 1 ? 'pass' : (item.total ? 'failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'not-attempted': '')))]">
                      {{ item.examResults === 1 ? 'Pass' : (item.total ? 'Failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'Not Attempted' : '-'))}}
                    </span> -->


                    <span class="mine-item-status pass" v-if="item.examResults === 1">Pass</span>
                    <template v-else>
                      <span class="mine-item-status not-attempted" v-if="item.coursesLearnCount < item.coursesTotal">In Progress</span>
                      <span class="mine-item-status examPending" v-if="item.coursesLearnCount == item.coursesTotal">Completed-Exam Pending</span>
                    </template>


                  </div>
                  <div class="hcontainer vcenter flex-between">
                    <div class="hcontainer vcenter">
                      <span class="mine-item-label">Update Status</span>
                      <span class="mine-item-value">{{ item.updateStatus == 1 ? 'Finished' : 'Updateing' }}</span>
                    </div>
                    <div class="hcontainer vcenter">
                      <span class="mine-item-label">Learning Progress</span>
                      <span class="mine-item-value">{{ item.coursesLearnCount || 0 }}/{{ item.coursesTotal || 0}}</span>
                    </div>
                    <div class="hcontainer vcenter">
                      <span class="mine-item-label">Exam time</span>
                      <span class="mine-item-value">{{ item.examTime | examTimeF}}</span>
                    </div>
                  </div>
                </div>
                <div class="vcontainer flex-around ml-50">
                  <el-button
                    type="text"
                    class="mine-btn"
                    :disabled="item.examResults == 1 || item.updateStatus != 1 || item.coursesLearnCount != item.coursesTotal"
                    @click="examClick(item)">
                    Take an exam
                  </el-button>
                  <el-button
                    type="text"
                    class="mine-btn"
                    :disabled="item.examResults != 1"
                    @click="certClick(item)">
                    Certification
                  </el-button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <PaymentDialog
      :visible="showPaymentDialog"
      :paymentToken="paymentToken"
      @close="showPaymentDialog = false"
      @success="paymentSuccess" /> -->
    <el-dialog
      :visible="showUploadDialog"
      title="Upload"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :destroy-on-close="true"
      width="500px"
      custom-class="upload-dialog"
      @close="showUploadDialog = false">
      <el-upload
        action=""
        accept=".pdf"
        :auto-upload="false"
        :on-change="uploadFileChange"
        :on-remove="uploadFileRemove"
        :file-list="uploadFileList"
        :limit="1"
        :on-exceed="handleExceed">
        <el-button size="small" type="primary">Upload</el-button>
      </el-upload>
      <div slot="footer" class="hcontainer vcenter hcenter footer">
        <el-button class="w-150" @click="showUploadDialog = false">Cancel</el-button>
        <el-button class="w-150" type="primary" @click="submitFn">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import PaymentDialog from '@/components/PaymentDialog.vue'
  export default {
    name: 'MinePage',
    components: {
      // PaymentDialog
    },
    data() {
      return {
        userInfo: {},
        tabList: [
          { name: 'My Courses' },
          { name: 'My Orders' },
          { name: 'My Congress' },
          { name: 'Abstract Approvals' }
        ],
        curTabIndex: 0,
        pageConfig: {
          pageNo: 1,
          pageSize: 5,
          total: 0
        },
        listData: [],
        // paymentToken: '',
        // showPaymentDialog: false,
        showUploadDialog: false,
        curApproval: null,
        uploadFileList: [],
        currentTime: new Date()
      }
    },
    filters: {
      approvalStatusF(status) { 
        if (status == 'PendingReview') {
          return 'Pending Review'
        } else {
          return status
        }
      },
      examTimeF(val) {
        if (!val) {
          return '-'
        }
        return val.replace('T', ' ')
      }
    },
    methods: {
      getClickStatus(abstractSubmissionEndTime,abstractSubmissionStartTime) { 
        console.log(this.currentTime.getTime())
        console.log(abstractSubmissionEndTime,abstractSubmissionStartTime)
        if(this.currentTime.getTime() >= new Date(abstractSubmissionStartTime).getTime() && this.currentTime.getTime() <= new Date(abstractSubmissionEndTime).getTime()){
          return true
        }else{ 
          return false
        }
        
      },
      getOwnUserInfoFn() { 
        this.$api.getOwnUserInfo({}).then(res => { 
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.userInfo = res.data
          } else {
            this.userInfo = {}
          }
        }).catch(err => {
          console.log('err:', err)
          this.userInfo = {}
        })
      },
      tabClick(index) {
        this.curTabIndex = index
        // Reset pagination when changing tabs
        this.pageConfig.pageNo = 1
        this.getListDataFn()
      },
      editClick() {
        console.log('editClick')
      },
      examClick(row) {
        this.$utils.startExam(row.coursesId, row.coursesTitle)
      },
      payClick() {
        // PaymentDialog disabled.
        // this.$api.createPayToken({
        //   amount: row.totalAmount,
        //   currency: row.currency,
        //   orderId: row.orderId,
        //   transactionType: 'SALE'
        // }).then(res => {
        //   if ((res.code === 200 || res.code === 0) && res.data) {
        //     this.paymentToken = res.data.tokenId
        //     this.showPaymentDialog = true
        //   }
        // }).catch((err) => {
        //   console.log('err:', err)
        // })
      },
      paymentSuccess() {
        // PaymentDialog disabled.
        // this.showPaymentDialog = false
        // this.getListDataFn()
      },
      async certClick(row) {
        try {
          const resData = await this.$api.websiteCourseCompletionCertificate(row.coursesId, row.userId).catch(err => err)
          const blob = new Blob([resData], { type: 'application/pdf' })
          const previewUrl = URL.createObjectURL(blob)
          const newWindow = window.open(previewUrl, '_blank')
          if (newWindow) {
            newWindow.onbeforeunload = () => {
              URL.revokeObjectURL(previewUrl)
            }
          }
        } catch (error) {
          this.$message.error('Failed to preview document')
          console.error('Error previewing document:', error)
        }
      },
      orderClick(row) {
        this.$router.push('/orderDetail?id=' + row.orderId)
      },
      letterClick(row) {
        console.log('letterClick:', row)
      },
      registerClick(row) {
        this.$router.push('/mineReg?id=' + row.id)
      },
      reviewClick(item) {
        this.$router.push('/reviewDetail?id=' + item.id)
      },
      uploadClick(item) {
        this.curApproval = item
        this.uploadFileList = []
        if (Array.isArray(item.presentationFileList) && item.presentationFileList.length > 0) {
          this.uploadFileList = [...item.presentationFileList]
        }
        this.showUploadDialog = true
      },
      async uploadFileChange(file) {
        try {
          const loading = this.$loading({
            lock: true,
            text: 'Uploading...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          const res = await this.$api.uploadFile(file.raw, 'congress', 'congress').catch(err => err)

          loading.close();
          this.uploadFileList.push({
            id: res.id,
            name: file.name,
            url: res.url
          })
        } catch {
          this.$message.error('Failed to upload')
        }
      },
      uploadFileRemove () {
        this.uploadFileList = []
      },
      handleExceed() {
        this.$message.warning('Only one file can be uploaded')
      },
      async submitFn() {
        const reqData = {
          ...this.curApproval,
          presentationFile: this.uploadFileList.map(item => item.id).join(','),
          presentationFileList: this.uploadFileList
        }
        this.$api.presentationUpdate(reqData).then((res) => {
          if (res.code === 200 || res.code === 0) {
            this.showUploadDialog = false
            this.getListDataFn()
          }
        })
      },
      async getListDataFn() {
        // Only clear data if we're on the first page to avoid flickering during pagination
        if (this.pageConfig.pageNo === 1) {
          this.listData = []
        }
        
        let res = null
        if (this.curTabIndex === 3) {
          // For abstract approvals, ensure pagination is passed
          res = await this.$api.presentationGet({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        } else if (this.curTabIndex === 2) {
          res = await this.$api.registrationGet({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        } else if (this.curTabIndex === 1) {
          res = await this.$api.orderGet({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        } else {
          // For courses, ensure we pass pagination if the API supports it
          res = await this.$api.webUserLearingProcessPage({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        }

        if (res && (res.code === 200 || res.code === 0) &&
          res.data && Array.isArray(res.data.list)) {
          this.listData = res.data.list
          this.pageConfig.total = res.data.total || 0
        } else {
          this.listData = []
          this.pageConfig.total = 0
        }
      }
    },
    mounted() {
      this.getOwnUserInfoFn()
      this.getListDataFn()
    }
  }
</script>

<style lang="scss" scoped>
  .mine {
    padding: 100px 0 20px;
    background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
    .mine-title {
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .mine-left {
      height: 100%;
      width: 300px;
      border-radius: 8px;
      padding: 20px;
      margin-right: 20px;
      background-color: #ffffff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      .mine-name {
        font-size: 18px;
        font-weight: bold;
        color: #0E3045;
        margin-bottom: 10px;
      }
      .mine-title {
        font-size: 14px;
        color: #656B6F;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      }
      .mine-title1 {
        margin-bottom: 40px;
      }
      .mine-userinfo-container {
        font-size: 14px;
        margin-bottom: 20px;
        border-bottom: 1px solid #C8D1D7;
        .mine-userinfo {
          font-size: 14px;
          color: #0E3045;
          margin-bottom: 36px;
          .mine-userinfo-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
          .mine-userinfo-label {
            font-size: 12px;
            color: #8A9094;
            margin-bottom: 8px;
          }
        }
      }
    }
    .mine-right {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      .tabs {
        padding: 20px;
        height: 64px;
        background-color: #E3F3FF;
        border-radius: 8px 8px 0 0;
        .tab-item {
          position: relative;
          font-size: 14px;
          color: #656B6F;
          margin-right: 50px;
          cursor: pointer;
          // width: 132px;
          display: block;
          text-align: center;
          font-weight: bold;
          &.active, &:hover {
            font-weight: bold;
            color: #036FC0;
            &:after { 
              content: '';
              position: absolute;
              left: 50%;    
              bottom: -10px;
              transform: translateX(-50%);               
              width: 16px;                 
              height: 3px;
              background: #036FC0
            }
          }
        }
      }
      .mine-right-top {
        padding: 20px 20px 0;
        color: #656B6F;
        font-size: 14px;
        font-weight: bold;
        .pagination-container {
          color: #8A9094;
          font-size: 14px;
        }
      }
      .mine-content {
        padding: 0 20px 20px;
        overflow-y: auto;
        .mine-item {
          padding: 16px;
          margin-top: 16px;
          border-radius: 8px;
          background-color: #F7FCFF;
          .mine-item-status {
            margin-left: 20px;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 14px;
            &.pass {
              background-color: #E5FFF6;
              color: #23C36E;
              border: 1px solid #23C36E;
            }
            &.failed {
              background-color: #FFE3E3;
              color: #FF7A7A;
              border: 1px solid #FF7A7A;
            }
            &.examPending {
              background-color: #F0F9FF;
              color: #0895FF;
              border: 1px solid #0895FF;
            }
            &.not-attempted {
              background-color: #EEEEEE;
              color: #656B6F;
              border: 1px solid #656B6F;
            }
            &.unpaid {
              background-color: #F0F9FF;
              color: #0895FF;
              border: 1px solid #0895FF;
            }
            &.paid {
              background-color: #E5FFF6;
              color: #23C36E;
              border: 1px solid #23C36E;
            }
            &.refunded {
              background-color: #FFF0DD;
              color: #F8AC48;
              border: 1px solid #F8AC48;
            }
            &.free {
              background-color: #D9F1FF;
              color: #036fc0;
              border: 1px solid #036fc0;
            }
            &.pending-payment {
              background-color: #E2F3FF;
              color: #0895FF;
              border: 1px solid #0895FF;
            }
            &.registered {
              background-color: #E2F3FF;
              color: #23C36E;
              border: 1px solid #23C36E;
            }
            &.incomplete-registration {
              background-color: #FFF0DD;
              color: #F8AC48;
              border: 1px solid #F8AC48;
            }
            &.PendingReview {
              background-color: #E2F3FF;
              color: #0895FF;
              border: 1px solid #0895FF;
            }
            &.Approved {
              background-color: #E5FFF6;
              color: #23C36E;
              border: 1px solid #23C36E;
            }
            &.Rejected {
              background-color: #FFF0DD;
              color: #F8AC48;
              border: 1px solid #F8AC48;
            }
          }
          .mine-item-label {
            font-size: 12px;
            color: #8A9094;
          }
          .mine-item-value {
            font-size: 12px;
            margin-left: 14px;  
            color: #0E3045;
          }
          .mine-item-link {
            font-size: 12px;
            margin-left: 14px;
            color: #036FC0;
            text-decoration-line: underline;
            cursor: pointer;
          }
          .mine-item-header {
            margin-bottom: 12px;
            .mine-item-title {
              font-size: 16px;
              font-weight: bold;
              color: #0E3045;
              max-width: 487px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
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
        }
      }
    }
    .mine-btn {
      padding: 5px 10px;
      font-weight: bold;
      font-size: 14px;
      color: #036FC0;
      &.is-disabled {
        color: #C8D1D7;
      }
    }
  }
</style>

<style lang="scss">
  .upload-dialog {
    .el-dialog__body {
      height: 300px;
    }
  }
</style>
