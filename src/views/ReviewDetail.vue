<template>
  <div class="reviewdetail">
    <div class="vcontainer main-container">
      <div class="hcontainer vcenter flex-between page-header">
        <span class="reviewdetail-title">Review Details</span>
        <div class="reviewdetail-back" @click="$router.back()"></div>
      </div>
      <div class="fill vcontainer reviewdetail-content">
        <span class="rc-title">Audit Results</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Audit Results</span>
            <span>{{ detailData.status }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Review Time</span>
            <span>{{ detailData.reviewTime }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <span class="rc-label">Notes</span>
          <span class="fill rc-word-wrap">{{ detailData.notes }}</span>
        </div>

        <span class="rc-title">Submitter Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitter's first name</span>
            <span>{{ detailData.submittingFirstName }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitter's last name</span>
            <span>{{ detailData.submittingLastName }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitter's Email</span>
            <span>{{ detailData.submittingEmail }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitter's FMF ID</span>
            <span>{{ detailData.submittingFmfId }}</span>
          </div>
        </div>

        <span class="rc-title">Speaker information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Who is the speaker</span>
            <div v-if="isPendingReview" class="fill hcontainer speaker-card-group">
              <div
                class="speaker-card"
                :class="{ 'is-selected': formData.whoIsTheSpeaker === 'Myself' }"
                @click="formData.whoIsTheSpeaker = 'Myself'">
                <img
                  src="@/assets/img/icon/icon_myself.png"
                  class="speaker-card-icon"
                  :style="{ filter: formData.whoIsTheSpeaker === 'Myself' ? 'brightness(0) invert(1)' : 'none' }"
                  alt="">
                <span class="speaker-card-label">Myself</span>
              </div>
              <div
                class="speaker-card"
                :class="{ 'is-selected': formData.whoIsTheSpeaker === 'Someone else' }"
                @click="formData.whoIsTheSpeaker = 'Someone else'">
                <img
                  src="@/assets/img/icon/icon_else.png"
                  class="speaker-card-icon"
                  :style="{ filter: formData.whoIsTheSpeaker === 'Someone else' ? 'brightness(0) invert(1)' : 'none' }"
                  alt="">
                <span class="speaker-card-label">Someone else</span>
              </div>
            </div>
            <span v-else>{{ detailData.whoIsTheSpeaker }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Speaker's first name</span>
            <el-input v-if="isPendingReview" v-model="formData.firstName" class="rc-input" :disabled="formData.whoIsTheSpeaker === 'Myself'" />
            <span v-else>{{ (detailData.firstName || ' ')}}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Speaker's last name</span>
            <el-input v-if="isPendingReview" v-model="formData.lastName" class="rc-input" :disabled="formData.whoIsTheSpeaker === 'Myself'" />
            <span v-else>{{ (detailData.lastName || ' ')}}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Speaker's Country</span>
            <el-select v-if="isPendingReview" v-model="formData.speakerCountry" filterable placeholder="Please Select" class="rc-input" :disabled="formData.whoIsTheSpeaker === 'Myself'">
              <el-option v-for="(item, index) in countryList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else>{{ detailData.speakerCountry }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Speaker's Email</span>
            <el-input v-if="isPendingReview" v-model="formData.email" class="rc-input" :disabled="formData.whoIsTheSpeaker === 'Myself'" />
            <span v-else>{{ detailData.email || 'N/A' }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Title</span>
            <el-select v-if="isPendingReview" v-model="formData.title" placeholder="Please Select" class="rc-input">
              <el-option label="Professor" value="Professor" />
              <el-option label="Dr" value="Dr" />
              <el-option label="Ms" value="Ms" />
              <el-option label="Mr" value="Mr" />
            </el-select>
            <span v-else>{{ detailData.title }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Institution</span>
            <el-select v-if="isPendingReview" v-model="formData.institution" placeholder="Please Select" class="rc-input">
              <el-option label="Hospital" value="Hospital" />
              <el-option label="University" value="University" />
              <el-option label="Private practice" value="Private practice" />
              <el-option label="Pharmaceutical company" value="Pharmaceutical company" />
              <el-option label="Medical device company" value="Medical device company" />
              <el-option label="Other" value="Other" />
            </el-select>
            <span v-else>{{ detailData.institution }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Institution name</span>
            <el-input v-if="isPendingReview" v-model="formData.institutionName" class="rc-input" />
            <span v-else>{{ detailData.institutionName }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Institution town</span>
            <el-input v-if="isPendingReview" v-model="formData.institutionTown" class="rc-input" />
            <span v-else>{{ detailData.institutionTown }}</span>
          </div>
          <div class="fill hcontainer vcenter"></div>
        </div>

        <span class="rc-title">Abstracts Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Topic</span>
            <el-cascader
              v-if="isPendingReview"
              v-model="formData.topic"
              :options="topicOptions"
              class="rc-input" />
            <span v-else>{{ detailData.topic || '' }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Title</span>
            <el-input v-if="isPendingReview" v-model="formData.abstractsTitle" class="rc-input" />
            <span v-else>{{ detailData.abstractsTitle }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Authors</span>
            <el-input v-if="isPendingReview" v-model="formData.authors" class="rc-input" />
            <span v-else>{{ detailData.authors }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Objective</span>
            <el-input
              v-if="isPendingReview"
              v-model="formData.objective"
              type="textarea"
              :rows="3"
              class="rc-input" />
            <span v-else class="fill rc-word-wrap">{{ detailData.objective }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Methods</span>
            <el-input
              v-if="isPendingReview"
              v-model="formData.methods"
              type="textarea"
              :rows="3"
              class="rc-input" />
            <span v-else class="fill rc-word-wrap">{{ detailData.methods }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Results</span>
            <el-input
              v-if="isPendingReview"
              v-model="formData.results"
              type="textarea"
              :rows="3"
              class="rc-input" />
            <span v-else class="fill rc-word-wrap">{{ detailData.results }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Conclusion</span>
            <el-input
              v-if="isPendingReview"
              v-model="formData.conclusion"
              type="textarea"
              :rows="3"
              class="rc-input" />
            <span v-else class="fill rc-word-wrap">{{ detailData.conclusion }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Type</span>
            <el-radio-group v-if="isPendingReview" v-model="formData.type">
              <el-radio label="Poster" />
              <el-radio label="Oral" />
            </el-radio-group>
            <span v-else>{{ detailData.type }}</span>
          </div>
        </div>
        <div class="hcontainer flex-between pv-10">
          <div class="fill hcontainer">
            <span class="rc-label" style="padding-top: 6px;">Images and tables</span>
            <div class="fill vcontainer">
              <template v-if="isPendingReview">
                <el-upload
                  action=""
                  accept=".jpg,.jpeg,.png,.doc,.docx"
                  :auto-upload="false"
                  :before-upload="beforeUpload"
                  :on-change="uploadFileChange"
                  :on-remove="uploadFileRemove"
                  :on-preview="handleFilePreview"
                  :file-list="uploadFileList"
                  :limit="4"
                  :on-exceed="handleExceed"
                  :disabled="uploadDisabled">
                  <el-button size="small" type="primary">Upload</el-button>
                </el-upload>
                <div style="margin-top: 6px; font-size: 12px; color: #8A9094;">
                  Allowed file types: .jpg, .jpeg, .png, .doc, .docx (4 files total)
                </div>
              </template>
              <template v-else>
                <a
                  v-for="(item, index) in (detailData.abstractsFileList || [])"
                  :key="index"
                  :href="item.url || ''"
                  target="_blank"
                  class="rc-link mb-5">
                  {{ (item.url || '').split('/').pop() }}
                </a>
              </template>
            </div>
          </div>
        </div>

        <span class="rc-title">Other Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Congress Title</span>
            <span v-html="detailData.congressTitle || ''"></span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitted at</span>
            <span>{{ detailData.submittedAt || 'N/A' }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">E-poster</span>
            <a :href="detailData.presentationFileList && detailData.presentationFileList[0] && detailData.presentationFileList[0].url || ''" target="_blank" class="rc-link">
              {{ (detailData.presentationFileList && detailData.presentationFileList[0] && detailData.presentationFileList[0].url || '').split('/').pop() }}
            </a>
          </div>
        </div>

        <div v-if="isPendingReview" class="save-bar">
          <el-button
            type="primary"
            :loading="saving"
            class="save-btn"
            @click="handleSave">
            Save
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ReviewDetail',
    data() {
      return {
        detailData: {},
        formData: {},
        saving: false,
        uploadFileList: [],
        uploadDisabled: false,
        countryList: [],
        topicOptions: [
          { value: '1st trimester', label: '1st trimester' },
          { value: 'Genetics', label: 'Genetics' },
          {
            value: 'Defects', label: 'Defects',
            children: [
              { value: 'Brain', label: 'Brain' },
              { value: 'Face', label: 'Face' },
              { value: 'Heart', label: 'Heart' },
              { value: 'Lungs', label: 'Lungs' },
              { value: 'Gastrointestinal', label: 'Gastrointestinal' },
              { value: 'Genitourinary', label: 'Genitourinary' },
              { value: 'Spine', label: 'Spine' },
              { value: 'Skeleton', label: 'Skeleton' },
              { value: 'Syndromes', label: 'Syndromes' },
              { value: 'Other', label: 'Other' }
            ]
          },
          { value: 'Fetal therapy', label: 'Fetal therapy' },
          { value: 'Infections', label: 'Infections' },
          { value: 'Maternal medicine', label: 'Maternal medicine' },
          { value: 'Hypertensive disorders', label: 'Hypertensive disorders' },
          { value: 'Gestational diabetes', label: 'Gestational diabetes' },
          { value: 'Pregnancy', label: 'Pregnancy' },
          { value: 'Labor', label: 'Labor' },
          { value: 'Defects tumors', label: 'Defects tumors' },
          { value: 'Preterm birth', label: 'Preterm birth' },
          { value: 'Fetal growth', label: 'Fetal growth' },
          { value: 'Multiple pregnancies', label: 'Multiple pregnancies' },
          { value: 'Placenta', label: 'Placenta' },
          { value: 'Artificial intelligence', label: 'Artificial intelligence' },
          { value: 'Other', label: 'Other' }
        ]
      }
    },
    computed: {
      isPendingReview() {
        return this.detailData.status === 'PendingReview' || this.detailData.status === 'Rejected'
      }
    },
    methods: {
      getReviewDetailFn() {
        this.$api.presentationDetail({id: this.$route.query.id}).then((res) => {
          console.log('res:', res)
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.detailData = res.data
            if (this.isPendingReview) {
              this.initFormData()
            }
          } else {
            this.detailData = {}
          }
          console.log('detailData:', this.detailData)
        }).catch((err) => {
          console.log('err:', err)
          this.detailData = {}
        })
      },
      initFormData() {
        const d = this.detailData
        this.formData = {
          id: d.id,
          whoIsTheSpeaker: d.whoIsTheSpeaker,
          firstName: d.firstName,
          lastName: d.lastName,
          speakerCountry: d.speakerCountry,
          email: d.email,
          title: d.title,
          institution: d.institution,
          institutionName: d.institutionName,
          institutionCountry: d.institutionCountry,
          institutionTown: d.institutionTown,
          topic: d.topic ? d.topic.split('/') : [],
          abstractsTitle: d.abstractsTitle,
          authors: d.authors,
          objective: d.objective,
          methods: d.methods,
          results: d.results,
          conclusion: d.conclusion,
          type: d.type
        }
        this.uploadFileList = (d.abstractsFileList || []).map(item => ({
          id: item.id,
          url: item.url || '',
          name: (item.url || '').split('/').pop() || item.name || ''
        }))
      },
      beforeUpload(file) {
        const allowedTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        const fileExt = file.name.toLowerCase().split('.').pop()
        if (!Object.keys(allowedTypes).includes(fileExt)) {
          this.$message.error(`Invalid file type: ${file.name}. Only .jpg, .jpeg, .png, .doc, .docx are allowed.`)
          return false
        }
        if (file.type && !Object.values(allowedTypes).includes(file.type)) {
          this.$message.error(`File type verification failed: ${file.name}`)
          return false
        }
        this.uploadDisabled = true
        setTimeout(() => { this.uploadDisabled = false }, 1000)
        return true
      },
      async uploadFileChange(file, fileList) {
        if (!this.beforeUpload(file.raw)) {
          this.uploadFileList = fileList.filter(item => item.uid !== file.uid)
          return
        }
        const loading = this.$loading({ lock: true, text: 'Uploading...', spinner: 'el-icon-loading', background: 'rgba(0,0,0,0.7)' })
        try {
          const res = await this.$api.uploadFile(file.raw, 'congress', 'congress').catch(err => err)
          loading.close()
          if (res && res.id) {
            this.uploadFileList.push({ id: res.id, name: file.name, url: res.url })
            this.$message.success(`File ${file.name} uploaded successfully`)
          } else {
            this.$message.error(`Failed to upload ${file.name}`)
            this.uploadFileList = fileList.filter(item => item.uid !== file.uid)
          }
        } catch (err) {
          loading.close()
          this.$message.error(`Failed to upload ${file.name}`)
          this.uploadFileList = fileList.filter(item => item.uid !== file.uid)
        }
      },
      uploadFileRemove(file, fileList) {
        this.uploadFileList = fileList
      },
      handleExceed() {
        this.$message.warning('Only four files can be uploaded')
      },
      handleFilePreview(file) {
        const url = file.url
        if (url) {
          window.open(url, '_blank')
        }
      },
      handleSave() {
        this.saving = true
        const payload = {
          ...this.formData,
          topic: Array.isArray(this.formData.topic) ? this.formData.topic.join('/') : (this.formData.topic || ''),
          abstractsFile: !this.uploadFileList.length ? '' : this.formData.abstractsFile,
          abstractsFileList: this.uploadFileList.map(item => ({ id: item.id, url: item.url, name: item.name }))
        }
        this.$api.congressPresentationUpdate(payload).then((res) => {
          if (res.code === 200 || res.code === 0) {
            this.$message.success('Saved successfully')
            this.getReviewDetailFn()
          } else {
            this.$message.error(res.msg || 'Save failed')
          }
        }).catch((err) => {
          console.log('err:', err)
          this.$message.error('Save failed')
        }).finally(() => {
          this.saving = false
        })
      }
    },
    created() {
      this.getReviewDetailFn()
      this.$api.getCountries().then(res => {
        this.countryList = res.data || []
      })
    }
  }
</script>

<style lang="scss" scoped>
.reviewdetail {
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 100px 20px 24px;
  background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
  overflow-x: hidden;

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

  .reviewdetail-title {
    font-weight: bold;
    font-size: 24px;
    color: #0E3045;
    line-height: 1.3;
    word-break: break-word;
    min-width: 0;
    flex: 1;
  }

  .reviewdetail-back {
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

  .reviewdetail-content {
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

    .rc-title {
      font-weight: bold;
      font-size: 18px;
      color: #23272A;
      margin: 10px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #DCE4EA;
    }

    .rc-label {
      width: 200px;
      font-weight: normal;
      color: #8A9094;
      text-align: right;
      margin-right: 30px;
      flex-shrink: 0;
    }

    .rc-input {
      flex: 1;
      min-width: 0;
      max-width: 100%;
    }

    .rc-link {
      color: #036FC0;
      text-decoration: none;
      word-break: break-word;
    }

    .rc-word-wrap {
      word-wrap: break-word;
      word-break: break-word;
      min-width: 0;
    }

    .fill.hcontainer {
      align-items: flex-start;
      min-width: 0;
    }

    .fill.hcontainer > span:not(.rc-label) {
      word-break: break-word;
      min-width: 0;
    }

    .speaker-card-group {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      min-width: 0;

      .speaker-card {
        flex: 1;
        min-width: 120px;
        display: flex;
        align-items: center;
        padding: 10px 16px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        cursor: pointer;
        background: #ffffff;
        transition: background 0.2s, border-color 0.2s;

        &.is-selected {
          background-color: #036FC0;
          border-color: #036FC0;
          .speaker-card-label { color: #ffffff; }
        }

        .speaker-card-icon {
          width: 20px;
          height: 22px;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .speaker-card-label {
          font-size: 16px;
          font-weight: bold;
          color: #0E3045;
        }
      }
    }

    .save-bar {
      display: flex;
      justify-content: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #DCE4EA;

      .save-btn {
        min-width: 160px;
        height: 42px;
        font-size: 15px;
      }
    }

    ::v-deep .rc-input {
      width: 100%;
      max-width: 100%;
    }

    ::v-deep .el-radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;
      align-items: center;
    }
  }
}

@media (max-width: 900px) {
  .reviewdetail {
    padding: 88px 16px 20px;

    .reviewdetail-title {
      font-size: 21px;
    }

    .reviewdetail-content {
      padding: 18px 18px 20px;

      .rc-label {
        width: 168px;
        margin-right: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .reviewdetail {
    padding: 72px 14px 20px;

    .reviewdetail-title {
      font-size: 19px;
    }

    .reviewdetail-content {
      padding: 16px 14px 20px;
      margin-bottom: 24px;

      .rc-title {
        font-size: 16px;
        margin-top: 14px;
      }

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

      .hcontainer.flex-between.pv-10 > .rc-label + .fill,
      .hcontainer.flex-between.pv-10 > .rc-label {
        width: 100%;
        max-width: 100%;
      }

      .fill.hcontainer:not(.speaker-card-group) {
        flex-direction: column;
        align-items: flex-start;
      }

      .rc-label {
        width: 100%;
        max-width: 100%;
        text-align: left;
        margin-right: 0;
        margin-bottom: 6px;
        font-weight: 600;
      }

      .save-bar .save-btn {
        width: 100%;
        max-width: 320px;
      }
    }
  }
}

@media (max-width: 640px) {
  .reviewdetail {
    padding: 64px 10px 16px;

    .reviewdetail-title {
      font-size: 17px;
    }

    .reviewdetail-content {
      padding: 14px 12px 18px;
      border-radius: 10px;
      font-size: 13px;

      .rc-title {
        font-size: 15px;
      }

      .speaker-card-group {
        flex-direction: column;

        .speaker-card {
          width: 100%;
          min-width: 0;
        }

        .speaker-card-label {
          font-size: 15px;
        }
      }
    }
  }
}

@media (max-width: 420px) {
  .reviewdetail {
    padding: 56px 8px 14px;

    .reviewdetail-title {
      font-size: 16px;
    }

    .reviewdetail-back {
      width: 30px;
      height: 30px;
      background-size: 16px;
    }
  }
}
</style>
