<template>
  <div class="abstractApprovals">
    <div class="fill vcontainer flex-around" style="height: 100%">
      <div class="hcontainer vcenter mine-item-header">
        <span class="mine-item-title">{{ item.abstractsTitle }}</span>
        <span :class="['mine-item-status', item.status]">{{ item.status | approvalStatusF }}</span>
      </div>
      <div class="hcontainer vcenter flex-between two-col-row"> 
        <div class="vcontainer flex-between data-col">
          <div class="hcontainer vcenter mb-10">
            <span class="mine-item-label">Congress Title</span>
            <span class="mine-item-value" v-html="item.congressTitle || ''"></span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">Speaker</span>
            <span class="mine-item-value">{{ (item.firstName || '')  + ' ' + (item.lastName || '')}}</span>
          </div>
        </div>
        <div class="vcontainer flex-between data-col">
          <div class="hcontainer vcenter mb-10">
            <span class="mine-item-label">Submitted at</span>
            <span class="mine-item-value">{{ item.submittedAt }}</span>
          </div>
          <div class="hcontainer vcenter">
            <span class="mine-item-label">E-poster</span>
            <span class="mine-item-value" v-if="item.presentationFileList && item.presentationFileList[0] && item.presentationFileList[0].url">
              <span class="link-span" @click="handlePreview(item.presentationFileList[0].url)">{{item.presentationFileList[0].name}}</span>
            </span>
              <!-- {{ (item.presentationFileList && item.presentationFileList[0] && item.presentationFileList[0].url || '').split('/').pop() }}</span> -->
          </div>
        </div>
      </div>
      <div class="hcontainer vcenter mt-10">
        <span class="mine-item-label" style="font-weight: bold; color: #0E3045;">E-poster Submission Deadline Date</span>
        <span class="mine-item-value" style="font-weight: bold;">{{ item.deadlineTime || '-' }}</span>
      </div>
    </div>
    <div class="vcontainer abstractApprovals-btn ml-50">
      <el-button type="text" class="mine-btn" @click="reviewClick(item)">Review Details</el-button>
      <!-- :disabled="item.status != 'Approved'  ||  !getClickStatus(item.abstractSubmissionStartTime,item.abstractSubmissionEndTime)" -->
      <el-button type="text" class="mine-btn" :disabled="isUploadDisabled(item)"  @click="uploadClick(item)">Upload e-poster</el-button>
    </div>
    <el-dialog
      :visible="showUploadDialog"
      title="Upload"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :destroy-on-close="true"
      :width="uploadDialogWidth"
      :fullscreen="uploadDialogFullscreen"
      :top="uploadDialogTop"
      custom-class="upload-dialog"
      @close="showUploadDialog = false">
      <el-upload
        action="#"
        :accept="uploadObj.accept"
        :limit="uploadObj.limit"
        :show-file-list="false"
        :before-upload="beforeUploadFn">
        <div class="upload-dialog-inner">
          <el-button size="small" type="primary" :disabled="uploadFileList.length >= uploadObj.limit">Upload</el-button>
          <p class="upload-dialog-note">
            Note: Maximum file size is {{ uploadObj.size / (1024 * 1024) }}MB, and only one file can be uploaded.
          </p>
        </div>
        <div v-if="uploadFileList.length" class="upload-dialog-tags">
          <el-tag
            v-for="tag in uploadFileList"
            :key="tag.id"
            closable
            @close="uploadFileRemove(tag)"
            @click="handlePreview(tag.url)"
            type="">
            {{ tag.name }}
          </el-tag>
        </div>
      </el-upload>
      <div slot="footer" class="hcontainer vcenter hcenter footer upload-dialog-footer">
        <el-button class="w-150" @click="showUploadDialog = false">Cancel</el-button>
        <el-button class="w-150" type="primary" @click="submitFn">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
  export default {
    name: 'AbstractApprovals',
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    inject: ['getListDataFn'],
    filters: {
      approvalStatusF(status) { 
        if (status == 'PendingReview') {
          return 'Pending Review'
        } else {
          return status
        }
      },
    },
    data() {
      return {
        showUploadDialog: false,
        curApproval: null,
        uploadFileList: [],
        uploadObj:{
          accept: '.pdf',
          size: 200*1024*1024,
          limit: 1
        },
        uploadDialogWidth: '500px',
        uploadDialogFullscreen: false,
        uploadDialogTop: '8vh',
      }
    },
    watch: {
      showUploadDialog(val) {
        if (val) {
          this.updateUploadDialogLayout()
        }
      }
    },
    mounted() {
      this.updateUploadDialogLayout()
      window.addEventListener('resize', this.updateUploadDialogLayout)
    },
    methods: {
      ...mapActions('user', ['changeActiveId']),
      isUploadDisabled(item) {
        return item.status != 'Approved'
      },
      async uploadClick(item) {
        // ① 校验 deadlineTime
        if (item.deadlineTime) {
          const today = this.$moment().startOf('day')
          const deadline = this.$moment(item.deadlineTime).startOf('day')
          if (today.isAfter(deadline)) {
            this.$alert(
              'The deadline has passed. Please email us for any further assistance at: <span style="color:#036FC0;">education@fetalmedicine.org</span>',
              'Tip',
              { confirmButtonText: 'OK', dangerouslyUseHTMLString: true }
            ).catch(() => {})
            return
          }
        }
        // ② 校验 toPublish
        if (!item.toPublish) {
          this.$alert(
            'You are not currently registered to the congress. Registration is required before submitting the e-poster. If another author is attending, please inform us by email at: <span style="color:#036FC0;">education@fetalmedicine.org</span>',
            'Tip',
            { confirmButtonText: 'Cancel', dangerouslyUseHTMLString: true }
          ).catch(() => {})
          return
        }
        // toPublish = Yes，展示上传弹窗
        this.curApproval = item
        this.uploadFileList = []
        if (Array.isArray(item.presentationFileList) && item.presentationFileList.length > 0) {
          this.uploadFileList = [...item.presentationFileList]
        }
        this.showUploadDialog = true
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
      handlePreview(url) {
        window.open(url)
      },
      uploadFileRemove (tag) {
        this.uploadFileList = this.uploadFileList.filter(item => item.id !== tag.id)
      },
      beforeUploadFn(file) {
        this.beforeUploadFn(file, this.uploadObj, async (file) => {
          const loading = this.$loading({
            lock: true,
            text: 'Uploading...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          try {
            const res = await this.$api.uploadFile(file, 'congress', 'congress').catch(err => err)
            loading.close();
            this.uploadFileList.push({
              id: res.id,
              name: file.name,
              url: res.url
            })
          } catch {
            loading.close();
            this.$message.error('Failed to upload')
          }
        })
        return false;
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
      reviewClick(item) {
        this.$router.push('/reviewDetail?id=' + item.id)
      },
      updateUploadDialogLayout() {
        if (typeof window === 'undefined') return
        const w = window.innerWidth
        if (w <= 576) {
          this.uploadDialogFullscreen = true
          this.uploadDialogWidth = '100%'
          this.uploadDialogTop = '0'
        } else {
          this.uploadDialogFullscreen = false
          this.uploadDialogTop = w <= 768 ? '2vh' : '8vh'
          if (w <= 768) this.uploadDialogWidth = '94%'
          else if (w <= 1100) this.uploadDialogWidth = '92%'
          else this.uploadDialogWidth = '500px'
        }
      },
      getClickStatus(abstractSubmissionEndTime,abstractSubmissionStartTime) { 
        if(this.currentTime.getTime() >= new Date(abstractSubmissionStartTime).getTime() && this.currentTime.getTime() <= new Date(abstractSubmissionEndTime).getTime()){
          return true
        }else{ 
          return false
        }
      },
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateUploadDialogLayout)
    }
  }
</script>

<style lang="scss" scoped>
.abstractApprovals {
  display: flex;
  flex-direction: row;
  width: 100%;

  &-btn {
    justify-content: center;
  }

  .two-col-row {
    width: 100%;
  }

  .data-col {
    min-width: 0;
  }
}

/* Tablet: ≤ 900px — two data columns start wrapping */
@media (max-width: 900px) {
  .abstractApprovals {
    .two-col-row {
      flex-wrap: wrap;
      gap: 6px 0;
    }

    .data-col {
      width: 100%;
    }
  }
}

/* Mobile: ≤ 768px — stack buttons below content */
@media (max-width: 768px) {
  .abstractApprovals {
    flex-direction: column;

    &-btn {
      flex-direction: row !important;
      justify-content: flex-end;
      margin-left: 0 !important;
      margin-top: 10px;
      gap: 4px;
    }
  }
}

/* Small mobile: ≤ 480px — label/value pairs allow wrapping */
@media (max-width: 480px) {
  .abstractApprovals {
    .hcontainer.vcenter {
      flex-wrap: wrap;
      gap: 2px 6px;
    }
  }
}
</style>