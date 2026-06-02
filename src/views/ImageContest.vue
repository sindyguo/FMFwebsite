<template>
  <div class="image-contest vcontainer" v-loading="loading">
    <div class="main-container">
      <div class="page-header">
        <div class="header-info">
          <h1 class="page-title">FMF Clinical Image Contest</h1>
          <div class="page-subtitle">{{ congressInfo.title }}</div>
        </div>
        <el-button class="back-btn" icon="el-icon-back" circle @click="$router.back()"></el-button>
      </div>

      <div class="welcome-block">
        <span class="welcome-text">
          Welcome <strong>{{ userInfo.title }} {{ userInfo.firstName }} {{ userInfo.lastName }}</strong>
        </span>
        <p class="welcome-desc">Please submit your most interesting ultrasound image to participate in the contest.</p>
      </div>

      <!-- Readonly notice -->
      <div v-if="isReadonly" class="readonly-notice">
        <i class="el-icon-info-circle" style="margin-right:6px;"></i>
        Your image has already been submitted. This page is view-only.
      </div>

      <!-- Step 1 -->
      <div class="step-block">
        <div class="step-title" :class="{ required: !isReadonly }">Step 1: Choose your image</div>
        <ul class="step-hints" v-if="!isReadonly">
          <li>Formats Accepted: JPG, PNG, BMP, TIFF</li>
          <li>Only one file can be uploaded, file size must not exceed 500MB.</li>
        </ul>
        <!-- 上传中 -->
        <div v-if="uploading" class="upload-area upload-area--result">
          <i class="el-icon-loading upload-result-icon"></i>
          <span class="upload-result-name">Uploading {{ uploadedFile && uploadedFile.name }}...</span>
        </div>

        <!-- 上传成功 -->
        <div v-else-if="uploadedFileUrl" class="upload-area upload-area--result upload-area--success">
          <i class="el-icon-circle-check upload-result-icon" style="color:#67c23a;"></i>
          <span class="upload-result-name">{{ uploadedFileInfo && (uploadedFileInfo.name || uploadedFileInfo.url) }}</span>
          <el-button
            v-if="!isReadonly"
            type="text"
            class="upload-clear-btn"
            icon="el-icon-delete"
            @click="clearUpload">Re-upload</el-button>
        </div>

        <!-- 上传失败（仅非只读模式） -->
        <div v-else-if="!isReadonly && uploadedFile && !uploading" class="upload-area upload-area--result upload-area--error">
          <i class="el-icon-warning upload-result-icon" style="color:#f56c6c;"></i>
          <span class="upload-result-name" style="color:#f56c6c;">Upload failed</span>
          <el-button
            type="text"
            class="upload-clear-btn"
            icon="el-icon-refresh"
            @click="clearUpload">Retry</el-button>
        </div>

        <!-- 默认拖拽区（仅非只读模式） -->
        <div
          v-else-if="!isReadonly"
          class="upload-area"
          :class="{ 'upload-area--dragover': isDragOver }"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="onDrop">
          <div class="upload-inner">
            <span class="upload-hint">Drag &amp; drop an image here or</span>
            <el-button type="primary" size="small" @click="triggerFileInput">Select Image</el-button>
          </div>
        </div>

        <input
          v-if="!isReadonly"
          ref="fileInput"
          type="file"
          accept=".jpg,.jpeg,.png,.bmp,.tiff,.tif"
          style="display:none"
          @change="onFileChange" />
      </div>

      <!-- Step 2 -->
      <div class="step-block">
        <div class="step-title" :class="{ required: !isReadonly }">Step 2: Choose one Contest Category</div>
        <div class="category-row">
          <label class="category-item" :class="{ 'is-disabled': isReadonly }">
            <input type="checkbox" :checked="form.category === 'Diagnostic'" :disabled="isReadonly" @change="!isReadonly && onCategoryChange('Diagnostic')" />
            Diagnostic
          </label>
          <label class="category-item" :class="{ 'is-disabled': isReadonly }">
            <input type="checkbox" :checked="form.category === 'Artistic'" :disabled="isReadonly" @change="!isReadonly && onCategoryChange('Artistic')" />
            Artistic
          </label>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="step-block">
        <div class="step-title" :class="{ required: !isReadonly }">Step 3: I agree to the terms and conditions</div>
        <div class="consent-row">
          <label class="category-item" :class="{ 'is-disabled': isReadonly }">
            <input type="checkbox" v-model="form.consent" :disabled="isReadonly" />
            Consent and Data Sharing Agreement
          </label>
          <a class="read-more" href="javascript:void(0)" @click="showConsent = true">Read more</a>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="step-block">
        <div class="step-title">Step 4: Add a description</div>
        <el-input
          type="textarea"
          v-model="form.description"
          maxlength="200"
          show-word-limit
          :rows="4"
          :disabled="isReadonly"
          placeholder="Image description, up 200 characters">
        </el-input>
      </div>

      <!-- Sponsors -->
      <div class="sponsors-block" v-if="sponsorList.length">
        <img v-for="(s, i) in sponsorList" :key="i" :src="s.companyLogo" class="sponsor-logo" alt="sponsor" />
      </div>

      <div class="submit-row" v-if="!isReadonly">
        <el-button type="primary" class="submit-btn" :loading="submitting" @click="handleSubmit">Submit Image</el-button>
      </div>
    </div>

    <!-- Success state -->
    <div v-if="submitted" class="success-overlay">
      <div class="success-box">
        <div class="success-icon-wrap">
          <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-svg">
            <rect x="22" y="10" width="52" height="68" rx="5" fill="#E8F0FE" stroke="#A8C4F5" stroke-width="2"/>
            <rect x="32" y="26" width="32" height="4" rx="2" fill="#A8C4F5"/>
            <rect x="32" y="36" width="24" height="4" rx="2" fill="#C5D8FB"/>
            <rect x="32" y="46" width="20" height="4" rx="2" fill="#C5D8FB"/>
            <circle cx="68" cy="68" r="18" fill="#4A90D9" opacity="0.15"/>
            <circle cx="68" cy="68" r="13" fill="#4A90D9" opacity="0.25"/>
            <polyline points="61,68 66,73 76,62" stroke="#4A90D9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>
        <p class="success-msg">Your image has been submitted successfully.</p>
        <el-button class="success-own-btn" @click="goOwnPage">Own Page</el-button>
      </div>
    </div>

    <!-- Consent dialog -->
    <el-dialog title="Read more" :visible.sync="showConsent" width="min(600px, calc(100vw - 32px))" append-to-body>
      <div style="line-height:1.7;color:#333;font-size:14px;text-align:justify;">
        <p style="margin-bottom:16px;">I agree to share my contact information with FMF and the event industry partner GE HealthCare for the purpose of contacting me regarding the FMF Clinical Image Contest. I also agree to provide the clinical image to FMF and GE HealthCare.</p>
        <p style="margin-bottom:16px;">I warrant that any data provided to FMF will not contain any "Personal Data" as defined under applicable privacy laws and will be anonymized in accordance with these laws. I agree to only provide data for which I have obtained all necessary rights to share with FMF and subsequently license to GE HealthCare.</p>
        <p style="margin-bottom:16px;">I confirm that any Clinical Image provided to FMF has been anonymized in compliance with applicable privacy, data, and patient protection laws, including the General Data Protection Regulation (EU) 2016/679 ("GDPR"), ensuring that the Clinical Image does not identify the patient and does not constitute "personal data" as defined under GDPR ("Anonymized Data"). While some GE HealthCare products include automated anonymization tools, GE HealthCare makes no representation or warranty that such tools will render data anonymized. FMF and GE HealthCare reserve the right, at their sole discretion, to reject and securely destroy any data that is not anonymized.</p>
        <p>FMF grants GE HealthCare and its affiliates, or third parties acting on behalf of GE HealthCare, a non-exclusive, worldwide, unlimited, royalty-free right to use, copy, reproduce, alter, incorporate, modify, and display the Clinical Image, in whole or in part, and to create derivative works based on it, for marketing purposes in channels such as events, websites, apps, social media, and press releases. All intellectual property rights shall be exclusively owned by GE HealthCare.</p>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="showConsent = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '@/utils/upload'

export default {
  name: 'ImageContestPage',
  data() {
    return {
      loading: false,
      submitting: false,
      submitted: false,
      congressInfo: {},
      userInfo: {},
      sponsorList: [],
      isDragOver: false,
      uploading: false,
      uploadedFile: null,
      uploadedFileUrl: '',
      uploadedFileInfo: null,
      showConsent: false,
      form: {
        category: '',
        consent: false,
        description: '',
      },
    }
  },
  computed: {
    congressId() {
      return this.$route.query.id
    },
    isReadonly() {
      return !!this.$route.query.readonly
    },
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onFileChange(e) {
      const file = e.target.files[0]
      if (file) this.handleFile(file)
    },
    onDrop(e) {
      this.isDragOver = false
      const file = e.dataTransfer.files[0]
      if (file) this.handleFile(file)
    },
    async handleFile(file) {
      const maxSize = 500 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('File size must not exceed 500MB.')
        return
      }
      this.uploadedFile = file
      this.uploadedFileUrl = ''
      this.uploadedFileInfo = null
      this.uploading = true
      try {
        const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
        const _u = this.$store.state.user.userInfo || {}
        const _year = this.congressInfo.startTime ? new Date(this.congressInfo.startTime.replace(' ', 'T')).getFullYear() : ''
        const filename = [_u.fmfId, this.userInfo.firstName, this.userInfo.lastName, _year].filter(Boolean).join('_') + ext
        const res = await uploadFile(file, 'congress/image-contest', 'image-contest', filename)
        this.uploadedFileUrl = res.url
        this.uploadedFileInfo = res
      } catch (err) {
        this.uploadedFile = null
        this.uploadedFileUrl = ''
        this.uploadedFileInfo = null
        this.$message.error(err?.msg || err?.message || 'Image upload failed, please try again.')
      } finally {
        this.uploading = false
      }
    },
    clearUpload() {
      this.uploadedFile = null
      this.uploadedFileUrl = ''
      this.uploadedFileInfo = null
      this.$refs.fileInput.value = ''
    },
    onCategoryChange(val) {
      this.form.category = this.form.category === val ? '' : val
    },
    validate() {
      if (!this.uploadedFile) {
        this.$message.warning('Please choose an image to upload.')
        return false
      }
      if (this.uploading) {
        this.$message.warning('Image is still uploading, please wait.')
        return false
      }
      if (!this.uploadedFileUrl) {
        this.$message.warning('Image upload failed, please re-select the image.')
        return false
      }
      if (!this.form.category) {
        this.$message.warning('Please choose a contest category.')
        return false
      }
      if (!this.form.consent) {
        this.$message.warning('Please agree to the terms and conditions.')
        return false
      }
      return true
    },
    async handleSubmit() {
      if (!this.validate()) return
      this.submitting = true
      try {
        const payload = {
          congressId: this.congressId,
          imageList: [this.uploadedFileInfo],
          contestCategory: this.form.category,
          description: this.form.description,
        }
        const res = await this.$api.submitImageContest(payload)
        if (res && (res.code === 200 || res.code === 0)) {
          this.submitted = true
        }
      } catch (err) {
        this.$message.error(err?.msg || err?.message || 'Submission failed, please try again.')
      } finally {
        this.submitting = false
      }
    },
    goOwnPage() {
      this.$router.push('/mine')
    },
    async getCongressInfo() {
      if (!this.congressId) return
      const res = await this.$api.websiteCongressGet({ id: this.congressId }).catch(() => null)
      if (res && (res.code === 200 || res.code === 0) && res.data) {
        this.congressInfo = res.data
        // this.sponsorList = [
        //   ...(res.data.diamonSponsorsList || []),
        //   ...(res.data.goldSponsorsList || []),
        // ].filter(s => s.companyLogo)
        this.sponsorList = res.data.contestSponsorsList
      }
    },
    initUserInfo() {
      try {
        const info = JSON.parse(localStorage.getItem('userInfo') || '{}')
        this.userInfo = {
          title: info.title || '',
          firstName: info.firstName || '',
          lastName: info.lastName || '',
        }
      } catch {
        this.userInfo = { title: '', firstName: '', lastName: '' }
      }
    },
    async loadSubmission() {
      this.loading = true
      try {
        const res = await this.$api.getImageContestPage({
          congressId: this.congressId,
          pageSize: 1,
        })
        if (res && (res.code === 200 || res.code === 0) && res.data && res.data.list && res.data.list[0]) {
          const submission = res.data.list[0]
          this.form.category = submission.contestCategory || ''
          this.form.description = submission.description || ''
          this.form.consent = true
          const fileInfo = Array.isArray(submission.imageList) && submission.imageList[0]
            ? submission.imageList[0]
            : null
          if (fileInfo) {
            this.uploadedFileUrl = fileInfo.url || ''
            this.uploadedFileInfo = fileInfo
            this.uploadedFile = { name: fileInfo.name || (fileInfo.url || '').split('/').pop() }
          }
        }
      } catch {
        // silent — page still renders
      } finally {
        this.loading = false
      }
    },
  },
  created() {
    this.initUserInfo()
    this.getCongressInfo()
    if (this.isReadonly) {
      this.loadSubmission()
    }
  },
}
</script>

<style lang="scss" scoped>
.image-contest {
  min-height: 100vh;
  background: linear-gradient(135deg, #fcffff 0%, #f6fbff 100%);
  padding: 100px 20px 60px;
  box-sizing: border-box;

  .main-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .header-info {
      .page-title {
        font-size: 32px;
        font-weight: bold;
        color: #036fc0;
        margin: 0 0 6px;
        line-height: 1.2;
      }
      .page-subtitle {
        font-size: 16px;
        color: #656b6f;
      }
    }

    .back-btn {
      flex-shrink: 0;
      margin-left: 16px;
    }
  }

  .welcome-block {
    margin-bottom: 32px;
    .welcome-text {
      font-size: 16px;
      color: #0e3045;
      display: block;
      margin-bottom: 6px;
    }
    .welcome-desc {
      font-size: 15px;
      color: #656b6f;
      margin: 0;
    }
  }

  .step-block {
    margin-bottom: 32px;

    .step-title {
      font-size: 18px;
      font-weight: bold;
      color: #036fc0;
      margin-bottom: 12px;
      &.required::before {
        content: '* ';
        color: #f56c6c;
      }
    }

    .step-hints {
      margin: 0 0 14px 18px;
      padding: 0;
      color: #656b6f;
      font-size: 14px;
      li {
        margin-bottom: 4px;
      }
    }

    .upload-row {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .upload-area {
      min-width: 260px;
      border: 2px dashed #c0d8ea;
      border-radius: 8px;
      padding: 32px 20px;
      background: #fafcff;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      &--dragover {
        border-color: #036fc0;
        background: #eef6ff;
      }
      &--result {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px 24px;
        cursor: default;
      }
      &--success {
        border-color: #67c23a;
        background: #f0faf0;
      }
      &--error {
        border-color: #f56c6c;
        background: #fff5f5;
      }
      .upload-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        .upload-hint {
          font-size: 14px;
          color: #8a9094;
        }
      }
      .upload-result-icon {
        font-size: 22px;
        flex-shrink: 0;
      }
      .upload-result-name {
        flex: 1;
        font-size: 14px;
        color: #0e3045;
        word-break: break-all;
      }
      .upload-clear-btn {
        flex-shrink: 0;
        font-size: 13px;
        padding: 0;
        color: #036fc0;
      }
    }

    .category-row {
      display: flex;
      gap: 40px;
      align-items: center;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      color: #0e3045;
      cursor: pointer;
      input[type='checkbox'] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        flex-shrink: 0;
      }
    }

    .consent-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      .read-more {
        font-size: 14px;
        color: #036fc0;
        text-decoration: underline;
      }
    }
  }

  .readonly-notice {
    display: flex;
    align-items: center;
    background: #e8f4fd;
    border: 1px solid #b3d9f7;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    color: #036fc0;
    margin-bottom: 28px;
  }

  .category-item.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }

  .sponsors-block {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    .sponsor-logo {
      height: 40px;
      max-width: 140px;
      object-fit: contain;
    }
  }

  .submit-row {
    display: flex;
    justify-content: center;
    .submit-btn {
      min-width: 160px;
      height: 48px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  @media (max-width: 768px) {
    padding: 80px 14px 40px;

    .page-header .header-info .page-title {
      font-size: 24px;
    }

    .step-block {
      .upload-row {
        flex-direction: column;
        align-items: stretch;
      }
      .upload-preview {
        max-width: 100%;
      }
      .category-row {
        gap: 20px;
      }
    }
  }
}

.success-overlay {
  position: fixed;
  inset: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .success-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .success-icon-wrap {
    .success-svg {
      width: 96px;
      height: 96px;
    }
  }

  .success-msg {
    font-size: 14px;
    color: #555;
    margin: 0;
    text-align: center;
  }

  .success-own-btn {
    min-width: 100px;
    font-size: 13px;
    border-radius: 4px;
    border-color: #c0c4cc;
    color: #333;
    background: #fff;
    &:hover {
      border-color: #036fc0;
      color: #036fc0;
    }
  }
}
</style>
