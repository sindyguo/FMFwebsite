<template>
  <div class="myCourses">
    <div class="myCourses-left vcontainer flex-around">
      <div class="hcontainer vcenter mine-item-header">
        <span class="mine-item-title">{{ item.imageTitle }}</span>
        <template v-if="currentType == 'history' && item.status == 'Pass'">
          <div class="myCountry-status" :class="item.validityType === '0' ? 'temporary' : 'permanent'">
            <span>{{ item.acquisitionStatus }}</span>
            <span>{{ item.validityType == '0' ? defineFormat(item.validityStart) + ' - ' + defineFormat(item.validityEnd) : 'Permanent' }}</span>
          </div>
        </template>
      </div>
      <div class="hcontainer vcenter flex-between">
        <template v-if="currentType == 'all'">
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Validity Type</span>
            <span class="mine-item-value">{{item.validityType === '0' ? 'One Year' : 'Permanent'}}</span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Course</span>
            <span class="mine-item-value">{{ item.courseName }}</span>
          </div>
        </template>
        <template v-else>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Status</span>
            <span class="mine-item-value">{{ item.status }}</span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Submission date</span>
            <span class="mine-item-value">{{ item.submissionDate }}</span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Is Appealed</span>
            <span class="mine-item-value">{{ item.appealDescription ? 'Yes' : 'No' }}</span>
          </div>
        </template>
        
      </div>
    </div>
    <div class="vcontainer myCourses-btns flex-around">
      <el-button
        v-if="currentType == 'all'"
        type="text"
        class="mine-btn"
        :disabled="!item.isUpload"
        @click="uploadClick(item)">
        Upload Images
      </el-button>
      <template v-else>
        <el-link type="primary" @click="handleDetail(item)" style="margin-bottom: 8px;">Details</el-link>
        <el-link type="primary" :disabled="!!item.appealDescription || item.status == 'Pass' || item.status == 'Pending'"  @click="handleAppeal(item)" style="margin-bottom: 8px;">Appeal</el-link>
        <el-link type="primary" v-if="item.status == 'Pass'" :disabled="!item.certificate" @click="item.certificate && letterClick('/app-api/fmf/user/congress' + item.certificate)">Certificate</el-link>
      </template>
    </div>
    <el-dialog
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      append-to-body
      modal-append-to-body
      custom-class="uploadImage-dialog"
      :width="dialogObj.width">
      <template v-if="dialogObj.component == 'uploadImage'">
        <div class="uploadImage-dialog-tips">To upload images, you need to complete the online course "<span>{{ dialogObj.obj.coursesTitle }}</span>"</div>
        <div class="uploadImage-dialog-container">
          <div class="uploadImage-dialog-container-title">
            <span>{{ dialogObj.obj.coursesTitle }}</span>
            <span class="pt-4 pb-4 pl-8 pr-8 bg-[#E5FFF6] color-[#23C36E] border-[#23C36E] br-4 fs-12 ml-24" style="font-weight: normal;" v-if="dialogObj.obj.examResults === 1">Pass</span>
            <template v-if="dialogObj.obj.examResults == 0">
              <span class="pt-4 pb-4 pl-8 pr-8 bg-[#ddd] color-[#333] br-4 fs-12 ml-24" style="font-weight: normal;" v-if="dialogObj.obj.coursesLearnCount < dialogObj.obj.coursesTotal">In Progress</span>
              <span class="pt-4 pb-4 pl-8 pr-8 bg-[#F0F9FF] color-[#0895FF] border-[#0895FF] br-4 fs-12 ml-24" style="font-weight: normal;" v-if="dialogObj.obj.coursesLearnCount == dialogObj.obj.coursesTotal">Completed-Exam Pending</span>
            </template>
            <template v-if="dialogObj.obj.examResults == 2">
              <span class="pt-4 pb-4 pl-8 pr-8 bg-[#EEEEEE] color-[#656B6F] border-[#656B6F] br-4 fs-12 ml-24" style="font-weight: normal;">Failed</span>
            </template>
          </div>
          <div class="uploadImage-dialog-container-content">
            <div class="uploadImage-dialog-container-content-item">
              <span class="uploadImage-dialog-container-content-item-label">Update Status</span>
              <span class="uploadImage-dialog-container-content-item-value">{{ dialogObj.obj.updateStatus == 1 ? 'Updated' : 'Updating' }}</span>
            </div>
            <div class="uploadImage-dialog-container-content-item">
              <span class="uploadImage-dialog-container-content-item-label">Learning Progress</span>
              <span class="uploadImage-dialog-container-content-item-value">{{ dialogObj.obj.coursesLearnCount || 0 }}/{{ dialogObj.obj.coursesTotal || 0}}</span>
            </div>
            <div class="uploadImage-dialog-container-content-item">
              <span class="uploadImage-dialog-container-content-item-label">Exam Results</span>
              <span class="uploadImage-dialog-container-content-item-value">{{ defineFormat(dialogObj.obj.examTime, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="uploadImage-dialog-tips">If your images were examined and failed within the last two weeks and you disagree with this assessment,you may fill in your appeal content in the input box below.</div>
        <div class="uploadImage-dialog-container">
          <div class="uploadImage-dialog-container-title">Appeal Description</div>
          <div class="uploadImage-dialog-container-content">
            <el-input
              v-model="dialogObj.obj.appealDescription"
              placeholder="Please enter"
              type="textarea"
              :rows="6"
              autofocus
              :show-word-limit="true"
              resize="none" />
          </div>
        </div>
      </template>
      <div slot="footer" class="hcontainer vcenter hcenter">
        <el-button v-if="dialogObj.component == 'uploadImage'" type="primary" class="w-150" round @click="dialogObj.visible = false">Close</el-button>
        <template v-else>
          <el-button type="info" class="w-150" round @click="dialogObj.visible = false">Dismiss</el-button>
          <el-button type="primary" class="w-150" round @click="handleDialogSubmit">Submit</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'MyCourses',
    inject: ['letterClick'],
    props: {
      item: {
        type: Object,
        default: () => {},
      },
      userInfo: {
        type: Object,
        default: () => {},
      },
      currentType: {
        type: String,
        default: "all",
      }
    },
    data() {
      return {
        dialogObj: {
          title: 'Upload Images',
          visible: false,
          obj: {},
          width: '800px',
          component: 'uploadImage',
        }
      }
    },
    filters: {
      examTimeF(val) {
        if (!val) {
          return '-'
        }
        return val.replace('T', ' ')
      }
    },
    methods: {
      examClick(row) {
        this.$utils.startExam(row.coursesId, row.coursesTitle)
      },
      async uploadClick(item) {
        try {
          const resData = await this.$api.getUserLearingProcessResult(item.courseId)
          if(resData.code === 0) {
            if(resData.data) {
              this.$router.push({ name: 'UpdateMyUploadImage', query: { id: item.id } })
            } else {
              const res = await this.$api.webUserLearingProcessPage({
                userId: this.userInfo.id,
                coursesId: item.courseId,
              })
              if(res.code === 0) {
                this.dialogObj.obj = res.data?.list?.[0] || {}
              }
              this.dialogObj.title = 'Upload Images'
              this.dialogObj.component = 'uploadImage'
              this.dialogObj.visible = true
            }
          }
        } catch (err) {
          console.log(err)
        }
      },
      handleDetail(item) {
        this.$router.push({ name: 'MyUploadImageDetail', query: { id: item.id } })
      },
      handleAppeal(item) {
        this.dialogObj.title = 'Appeal'
        this.dialogObj.visible = true
        this.dialogObj.obj = item
        this.dialogObj.component = 'appeal'
      },
      async handleDialogSubmit() {
        try {
          let data = {...this.dialogObj.obj}
          const res = await this.$api.updateImageReviewLog(data)
          if(res.code === 0) {
            this.$message({
              message: 'Appeal submitted successfully',
              type: 'success',
            })
            this.dialogObj.visible = false;
            this.$emit('refreshList')
          }
        } catch (err) {
          console.log(err)
        }
      },
    }
  }
</script>

<style lang="scss">
.myCountry-status {
  margin-left: 16px;
  span {
    font-size: 12px;
    padding: 4px 8px;
    display: inline-block;
    text-align: center;
    &:nth-of-type(1) {
      width: 120px;
      border-radius: 4px 0 0 4px;
    }
    &:nth-of-type(2) {
      padding: 4px 8px;
      border-radius: 0 4px 4px 0;
      background-color: #fff;
    }
  }
  &.temporary {
    span {
      color: #fff;
      background-color: #f9ad29;
      border: 1px solid #f9ad29;
      &:nth-of-type(2) {
        color: #f9ad29;
        background-color: #fff;
      }
    }
  }
  &.permanent {
    span{
      color: #fff;
      background-color: #25c05c;
      border: 1px solid #25c05c;
      &:nth-of-type(2) {
        background-color: #fff;
        color: #25c05c;
      }
    }
  }
}
.myCourses {
  width: 100%;
  display: flex;
  flex-direction: row;
  &-left {
    flex: 1;
    height: 100%;
  }
  &-btns {
    margin-left: 50px;
  }
}
.uploadImage-dialog {
  &-tips {
    padding: 12px 20px;
    font-size: 14px;
    color: #333;
    background: rgba($color: #f9e3e3, $alpha: 0.5);
    margin-bottom: 40px;
    span {
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
  }
  &-container {
    padding: 20px;
    margin-bottom: 40px;
    background: rgba($color: #eee, $alpha: 0.6);
    border-radius: 10px;
    &-title {
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
    &-content {
      display: flex;
      flex-direction: row;
      margin-top: 20px;
      justify-content: space-between;
      &-item {
        &-label {
          font-size: 14px;
          margin-right: 12px;
          color: #999;
        }
        &-value {
          font-size: 15px;
          color: #000;
        }
      }
    }
  }
}
</style>