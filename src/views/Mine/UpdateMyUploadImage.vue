<template>
  <div class="MyUploadImages">
    <div class="vcontainer main-container">
      <div class="hcontainer vcenter flex-between">
        <span class="MyUploadImages-title">Upload Images</span>
        <div class="order-back" @click="handleBack"></div>
      </div>

      <div class="fill vcontainer MyUploadImages-content" v-if="step === 1">
        <div class="MyUploadImages-content-tips">Please read before uploading images and data</div>
        <div v-html="form.imageIntroduction" style="min-height: 200px;"></div>
        <div class="MyUploadImages-content-form">
          <div class="MyUploadImages-content-form-title">Select {{ $utils.numberToEnglish(fileList.length) }} images of nuchal translucency showing the time and date and the calliper placement.</div>
          <div class="MyUploadImages-content-form-desc">An image must be uploaded to each location. Only {{ uploadObj.accept }} file formats are allowed, and the file size must not exceed {{ uploadObj.size / 1024 }}MB.</div>
          <div class="MyUploadImages-content-form-upload">
            <div class="MyUploadImages-content-form-upload-item" v-for="(item, index) in fileList" :key="index">
              <div class="MyUploadImages-content-form-upload-item-title">Upload Image {{ index + 1 }}</div>
              <div class="MyUploadImages-content-form-upload-item-img">
                <el-upload class="avatar-uploader"
                  action
                  v-if="!item.url"
                  :limit="uploadObj.limit"
                  :show-file-list="false"
                  :before-upload="file=>beforeUpload(file, index)"
                  :accept="uploadObj.accept">
                  <div class="avatar-uploader-btn"><i class="el-icon-plus"></i></div>
                </el-upload>
                
                <div class="avatar-container" v-else>
                  <span class="avatar-container-filename">{{ item.name }}</span>
                  <el-link type="danger" :underline="false" icon="el-icon-delete" @click="removeFile(item, index)"></el-link>
                </div>
              </div>
              <div class="MyUploadImages-content-form-upload-item-assessment">
                <span class="label">Your assessment</span>
                <el-select
                  v-model="item.mark1"
                  placeholder="Please select"
                  size="small"
                >
                  <el-option v-for="(item, index) in form.usersAssessmentList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" size="small" @click="handleUpload">Upload Files</el-button>
        </div>
      </div>
      <div class="fill vcontainer MyUploadImages-content" v-else>
        <div class="MyUploadImages-content-result">
          <img src="@/assets/img/img_succ2.png" />
          <div class="MyUploadImages-content-result-tips">Your image files have been submitted successfully. The administrator will review them as soon as possible.</div>
        </div>
        <div class="action-buttons">
          <el-button type="primary" size="small" @click="handleBack(false)">Own Page</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'MyUploadImages',
  data() {
    return {
      form: {},
      uploadObj:{
        limit: 1,
        size: 100 * 1024 * 1024,
        accept: '.JPG,.PNG,.JPEG'
      },
      fileList: [],
      step: 1
    }
  },
  async mounted() {
    await this.getImageDetailFn()
  },
  methods: {
    ...mapActions('user', ['changeActiveId']),
    handleUpload() {
      let flag = this.fileList.every(item => item.mark1 || item.url)
      if(!flag) {
        this.$message.warning('Please upload images and select assessments.')
        return
      } else {
        this.createImageReviewLogFn()
      }
    },
    async createImageReviewLogFn() {
      let data = {
        ...this.form,
        imageTitleId: this.$route.query.id,
        fileList: this.fileList,
        uploadImageJson: JSON.stringify(this.fileList)
      }
      delete data.id
      try {
        const res = await this.$api.createImageReviewLog(data)
        if(res.code === 0) {
          this.$message.success('Image review log created successfully!')
          this.step = 2
        }
      } catch (error) {
        console.error('Failed to save user info:', error)
      }
    },
    removeFile(item, index) {
      this.fileList[index].name = null
      this.fileList[index].url = null
    },
    beforeUpload(file, index) {
      this.beforeUploadFn(file, this.uploadObj, async (file)=>{
        const loading = this.$loading({
          lock: true,
          text: 'Uploading...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        try {
          const res = await this.$api.uploadFile(file, 'congress', 'congress')
          let data = {  
            id: res.id,
            name: file.name,
            url: res.url,
            mark1: this.fileList[index].mark1
          }
          this.$set(this.fileList, index, data)
        } catch {
          this.$message.error('Failed to upload')
        } finally {
          loading.close();
        }
      });
      return false;
    },
    handleBack(flag = true) {
      if(!flag) {
        this.$router.back();
        return
      }
      this.$confirm('Are you sure to leave?',  'Warning', {
        confirmButtonText: 'Discard',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$router.back();
      }).catch(() => {})
    },
    async getImageDetailFn() {
      try {
        const res = await this.$api.getImageReviewPublishDetail({
          id: this.$route.query.id,
        })
        if(res.code === 0) {
          this.form = {
            ...res.data,
            usersAssessmentList: res.data.usersAssessment?.split(',') || []
          };
          this.fileList = Array.from({ length: this.form.imageUploadLimit }).map(() => ({ name: "", url: "", id: "", mark1: "" }))
        }
      } catch (error) {
        console.error('Failed to get image detail:', error)
      }
    }
  },
  created() {
    
  }
}
</script>

<style lang="scss" scoped>
.MyUploadImages {
  padding: 40px 0 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f2f4f7 0%, #eaf3fb 100%);
  &-title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 20px;
    color: #0E3045;
  }
  &-content {
    min-height: 500px;
    padding: 20px;
    background-color: #fff;
    &-tips {
      font-size: 14px;
      font-weight: bold;
      color: #f31111;
      margin-bottom: 20px;
    }
    &-form {
      margin-top: 40px;
      &-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
        color: #0E3045;
      }
      &-desc {
        font-size: 14px;
        color: #8e8e8e;
        margin-bottom: 20px;
      }
      &-upload {
        padding: 0 40px;
        &-item {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          .avatar-container {
            display: flex;
            align-items: center;
            .avatar-container-filename {
              font-size: 14px;
              max-width: 500px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: 12px;
            }
          }
          .avatar-uploader-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed #46a8e4;
            border-radius: 8px;
            cursor: pointer;
          }
          &-title {
            width: 120px;
            flex-shrink: 0;
            font-size: 14px;
            color: #0E3045;
            margin-right: 10px;
          }
          &-img {
            width: 100%;
          }
          &-assessment {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0E3045;
            font-size: 14px;
            .label {
              flex-shrink: 0;
              width: 120px;
            }
            .el-select {
              margin-left: 12px;
            }
          }
        }
      }
    }
    &-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 40px;
      margin-bottom: 80px;
      img {
        width: 200px;
        margin-bottom: 60px;
      }
      &-tips {
        width: 500px;
        text-align: center;
        font-size: 16px;
        line-height: 1.8;
        color: #333;
      }
    }
  }
}



.order-back {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  background: url('#{$svgUrl}/icon_back.svg') center no-repeat;
  background-size: contain;
  cursor: pointer;
}

.personal-info-content {
  font-size: 14px;
  color: #0E3045;
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
  border-radius: 8px;
  background-color: #FFFFFF;
  box-shadow: 0px 10px 20px 1px rgba(14,48,69,0.1);
}

.form-grid {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
}

.el-button {
  padding: 8px 16px;
  font-size: 14px;
}

.alt-email-tip {
  margin-top: 6px;
  font-size: 13px;
  color: #e00;
  font-weight: bold;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.delete-dialog-desc {
  margin: 0 0 16px;
  font-size: 14px;
  color: #0E3045;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
}
.delete-dialog-tip {
  margin: 0 0 10px;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
  strong {
    font-weight: 600;
    color: #0e3045;
  }
  &.is-error {
    color: #f56c6c;
    strong {
      color: inherit;
    }
  }
}
.delete-confirm-input {
  margin-bottom: 0;
  font-size: 14px;
  &.is-error ::v-deep .el-input__inner {
    border-color: #f56c6c;
  }
  ::v-deep .el-input__inner {
    font-size: 14px;
  }
}

/* ─── Responsive ─────────────────────────────────────────── */

/* Override global .main-container fixed 1200px */
.personal-info .main-container {
  width: 100% !important;
  max-width: 1200px;
  box-sizing: border-box;
  padding: 0 24px;
}

/* Tablet ≤ 960px */
@media (max-width: 960px) {
  .personal-info .main-container {
    padding: 0 16px;
  }
}

/* Mobile ≤ 767px */
@media (max-width: 767px) {
  .personal-info {
    padding: 70px 0 20px;
    overflow-x: hidden;
  }

  .personal-info .main-container {
    padding: 0 12px !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .orderdetail-title {
    font-size: 18px;
  }

  /* Make gutter smaller so columns don't overflow */
  ::v-deep .el-row {
    margin-left: -8px !important;
    margin-right: -8px !important;
  }
  ::v-deep .el-col {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  /* Labels sit above inputs (label-position top) */
  ::v-deep .el-form-item {
    margin-bottom: 14px;
  }
  ::v-deep .el-form-item__label {
    float: none !important;
    display: block !important;
    width: 100% !important;
    text-align: left !important;
    padding: 0 0 4px !important;
    line-height: 1.4 !important;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }

  /* Action buttons: wrap and fill width on very small screens */
  .action-buttons {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: stretch;
  }
  .action-buttons .el-button {
    flex: 1 1 auto;
    min-width: 120px;
  }
}

/* Small mobile ≤ 479px */
@media (max-width: 479px) {
  .personal-info {
    padding-top: 60px;
  }

  .personal-info .main-container {
    padding: 0 8px !important;
  }

  .personal-info-content {
    padding: 12px 10px;
  }

  ::v-deep .el-form-item__label {
    font-size: 13px !important;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>

<style lang="scss">
/* Delete account dialog: compact width + viewport center (append-to-body) */
.el-dialog__wrapper:has(> .delete-account-dialog:not(.is-fullscreen)) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  box-sizing: border-box;
}

.el-dialog.delete-account-dialog:not(.is-fullscreen) {
  margin: 0 auto !important;
  margin-top: 0 !important;
  max-width: 420px !important;
  width: min(420px, calc(100vw - 32px)) !important;
  box-sizing: border-box;
}

.el-dialog.delete-account-dialog .el-dialog__body {
  padding: 16px 20px 8px;
  box-sizing: border-box;
}

.el-dialog.delete-account-dialog .el-dialog__footer {
  padding: 8px 20px 16px;
}

@supports not (selector(:has(*))) {
  .el-dialog.delete-account-dialog:not(.is-fullscreen) {
    margin-top: 12vh !important;
  }
}
</style>