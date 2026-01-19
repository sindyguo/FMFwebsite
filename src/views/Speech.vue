<template>
  <div class="speech">
    <div class="vcontainer main-container">
      <span class="speech-title">Abstract Submission</span>
      <span class="speech-subtitle">23rd World Congress in Fetal Medicine •  Vienna, Austria • June 28th - July 2nd, 2026</span>
      <el-steps :active="currentStep" align-center class="speech-steps">
        <el-step title="Submitter Name"></el-step>
        <el-step title="Abstracts Information"></el-step>
        <el-step title="Information Review"></el-step>
      </el-steps>
      <div class="fill vcontainer speech-content">
        <div v-if="currentStep === 1">
          <span class="sc-title">Submitter Information</span>
          <el-form
            :model="submitterForm"
            :rules="submitterRules"
            ref="submitterFormRef"
            class="form-container"
            label-width="150px"
            label-position="top">
            <el-form-item label="Submitter name" prop="submitterName">
              <el-input disabled v-model="userInfo.username" placeholder="LeBron James"></el-input>
            </el-form-item>
            <el-form-item label="Submitter Email" prop="submitterEmail">
              <el-input disabled v-model="userInfo.email" placeholder="xxxxxx@163.com"></el-input>
            </el-form-item>
            <el-form-item label="Submitter FMF ID" prop="submitterFmfId">
              <el-input disabled v-model="userInfo.fmfId" placeholder="334242"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <span class="sc-title w-full">Speaker Information</span>
            <el-form-item label="Who is the speaker?" prop="speakerType" style="width: 100%">
              <el-radio-group v-model="submitterForm.speakerType"
                class="fill hcontainer flex-between speakertype-radio-group">
                <el-radio-button label="Myself">
                  <div class="hcontainer">
                    <img src="@/assets/img/icon/icon_myself.png" style="width: 24px;height: 26px; margin-right: 16px;" alt="">
                    <div class="fill vcontainer">
                      <span class="radio-label">Myself</span>
                      <span class="radio-desc">Speaker Information Not Required</span>
                    </div>
                  </div>
                </el-radio-button>
                <el-radio-button label="Someone Else">
                  <div class="hcontainer">
                    <img src="@/assets/img/icon/icon_else.png" style="width: 24px;height: 26px; margin-right: 16px;" alt="">
                    <div class="fill vcontainer">
                      <span class="radio-label">Someone Else</span>
                      <span class="radio-desc">Speaker Information Required</span>
                    </div>
                  </div>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Speaker's Name" prop="speakersName">
              <el-input 
                v-model="submitterForm.speakersName" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'" 
                :disabled="isSpeakerMyself">
              </el-input>
            </el-form-item>
            <el-form-item label="Speaker's Country" prop="speakerCountry">
              <el-input v-if="isSpeakerMyself" v-model="submitterForm.speakerCountry" :placeholder="isSpeakerMyself ? '' : 'Please Select'" disabled></el-input>
              <el-select
                v-else
                v-model="submitterForm.speakerCountry" 
                :placeholder="isSpeakerMyself ? '' : 'Please Select'" filterable>
                <el-option v-for="(item, index) in companyList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Speaker's Email" prop="email">
              <el-input 
                v-model="submitterForm.email" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'" 
                :disabled="isSpeakerMyself">
              </el-input>
            </el-form-item>
            <el-form-item label="Title" prop="title">
              <el-select 
                v-model="submitterForm.title" 
                :placeholder="isSpeakerMyself ? '' : 'Please Select'">
                <el-option label="Professor" value="Professor"></el-option>
                <el-option label="Dr" value="Dr"></el-option>
                <el-option label="Ms" value="Ms"></el-option>
                <el-option label="Mr" value="Mr"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Institution" prop="institutionType">
              <el-select 
                v-model="submitterForm.institutionType" 
                :placeholder="isSpeakerMyself ? '' : 'Please Select'">
                <el-option label="Hospital" value="Hospital"></el-option>
                <el-option label="University" value="University"></el-option>
                <el-option label="Pharmaceutical company" value="Pharmaceutical company"></el-option>
                <el-option label="Medical device company" value="Medical device company"></el-option>
                <el-option label="Other" value="Other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Institution Name" prop="institutionName">
              <el-input 
                v-model="submitterForm.institutionName" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'">
              </el-input>
            </el-form-item>
            <el-form-item label="Institution Country" prop="institutionCountry">
              <el-select v-model="submitterForm.institutionCountry" :placeholder="isSpeakerMyself ? '' : 'Please Select'" filterable>
                <el-option v-for="item in companyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Institution Town" prop="institutionTown">
              <el-input 
                v-model="submitterForm.institutionTown" 
                :placeholder="isSpeakerMyself ? '' : 'Please Enter'">
              </el-input>
            </el-form-item>
            <div class="hcontainer flex-end action-buttons">
              <el-button type="primary" @click="submitterFormValidate">Continue</el-button>
            </div>
          </el-form>
        </div>
        <div v-else-if="currentStep === 2">
          <span class="sc-title w-full">Abstracts Information</span>
          <el-form
            :model="abstractForm"
            :rules="abstractRules"
            class="form-container"
            ref="abstractFormRef"
            label-width="150px"
            label-position="top">
            <el-form-item label="Title" prop="abstractsTitle" style="width: 100%;">
              <el-input v-model="abstractForm.abstractsTitle" placeholder="Please Enter"></el-input>
            </el-form-item>
            <el-form-item label="Authors" prop="authors" style="width: 100%;">
              <el-input v-model="abstractForm.authors" placeholder="Please Enter"></el-input>
            </el-form-item>
            <el-form-item label="Objective" prop="objective" style="width: 100%;">
              <el-input v-model="abstractForm.objective" placeholder="Please Enter" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="Methods" prop="methods" style="width: 100%;">
              <el-input v-model="abstractForm.methods" placeholder="Please Enter" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="Results" prop="results" style="width: 100%;">
              <el-input v-model="abstractForm.results" placeholder="Please Enter" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="Conclusion" prop="conclusion" style="width: 100%;">
              <el-input v-model="abstractForm.conclusion" placeholder="Please Enter" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="Type" prop="type" style="width: 100%;">
              <el-radio-group v-model="abstractForm.type">
                <el-radio label="Poster"></el-radio>
                <el-radio label="Oral"></el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="hcontainer vcenter flex-between action-buttons">
              <el-button @click="prevStep">Back</el-button>
              <el-button type="primary" @click="abstractFormValidate">Continue</el-button>
            </div>
          </el-form>
        </div>
        <div v-else-if="currentStep === 3" class="fill vcontainer vcenter hcenter completion">
          <div class="fill vcontainer hcenter vcenter">
            <el-image :src="require('@/assets/img/img_succ2.png')" class="comletion-img" />
            <span style="width: 640px;">Thank you for Submitter your abstract. Please check your email for submission confirmation, if you did not receive it, please email education@fetalmedicine.org.</span>
          </div>
          <div class="hcontainer hcenter vcenter action-buttons">
            <el-button type="primary" @click="goToOwnPage">Own Page</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
export default {
  name: 'SpeechPage',
  data() {
    return {
      currentStep: 1,
      submitterForm: {
        submitterName: '',
        submitterEmail: '',
        submitterFmfId: '',
        speakerType: 'Myself',
        firstName: '',
        speakersName: '',
        email: '',
        speakerCountry: '',
        title: '',
        institutionType: '',
        institutionName: '',
        institutionCountry: '',
        institutionTown: ''
      },
      abstractForm: {
        abstractsTitle: '',
        authors: '',
        objective: '',
        methods: '',
        results: '',
        conclusion: '',
        type: 'Agree'
      },
      submitterRules: {
        submitterName: [{ required: false, message: 'Please enter Submitter name', trigger: 'blur' }],
        submitterEmail: [{ required: false, message: 'Please enter Submitter email', trigger: 'blur' }],
        submitterFmfId: [{ required: false, message: 'Please enter submitter FMF ID', trigger: 'blur' }],
        speakerType: [{ required: true, message: 'Please select who is the speaker', trigger: 'change' }],
        firstName: [
          { 
            required: true, 
            message: 'Please enter speaker name', 
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.submitterForm.speakerType === 'Someone Else' && !value) {
                callback(new Error('Please enter speaker name'));
              } else {
                callback();
              }
            }
          }
        ],
        email: [
          { 
            required: true, 
            message: 'Please enter speaker email', 
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.submitterForm.speakerType === 'Someone Else' && !value) {
                callback(new Error('Please enter speaker email'));
              } else {
                callback();
              }
            }
          }
        ],
        speakerCountry: [
          { 
            required: true, 
            message: 'Please select speaker country', 
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.submitterForm.speakerType === 'Someone Else' && !value) {
                callback(new Error('Please select speaker country'));
              } else {
                callback();
              }
            }
          }
        ],
        title: [{ required: true, message: 'Please select title', trigger: 'change' }],
        institutionType: [{ required: true, message: 'Please select institution', trigger: 'change' }],
        institutionName: [{ required: true, message: 'Please enter institution name', trigger: 'blur' }],
        institutionCountry: [{ required: true, message: 'Please select institution country', trigger: 'change' }],
        institutionTown: [{ required: true, message: 'Please enter institution town', trigger: 'blur' }]
      },
      abstractRules: {
        abstractsTitle: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
        authors: [{ required: true, message: 'Please enter authors', trigger: 'blur' }],
        objective: [{ required: true, message: 'Please enter objective', trigger: 'blur' }],
        methods: [{ required: true, message: 'Please enter methods', trigger: 'blur' }],
        results: [{ required: true, message: 'Please enter results', trigger: 'blur' }],
        conclusion: [{ required: true, message: 'Please enter conclusion', trigger: 'blur' }],
        type: [{ required: true, message: 'Please select type', trigger: 'change' }]
      },
      companyList: []
    }
  },
  computed: {
    isSpeakerMyself() {
      return this.submitterForm.speakerType === 'Myself'
    },
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  watch: {
    // Watch for changes in speakerType to populate/clear fields accordingly
    'submitterForm.speakerType': {
      handler(newVal) {
        if (newVal === 'Myself') {
          // Populate speaker fields with user info when "Myself" is selected
          this.submitterForm.firstName = this.userInfo.username || '';
          this.submitterForm.email = this.userInfo.email || '';
          this.submitterForm.speakerCountry = this.userInfo.country || ''; // assuming userInfo has a country field
          this.submitterForm.speakersName = this.userInfo.username || '';
        } else {
          // Clear fields when "Someone Else" is selected
          this.submitterForm.firstName = '';
          this.submitterForm.email = '';
          this.submitterForm.speakerCountry = '';
          this.submitterForm.speakersName = '';
        }
      },
      immediate: true
    }
  },
  created() {
    
    this.getCompanyList();
  },
  methods: {
    ...mapActions('user', ['changeActiveId']),
    getCompanyList() {
      this.$api.getCountries().then((res) => {
        console.log(res);
        this.companyList = res.data || [];
      });
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    async submitterFormValidate() {
      try {
        await this.$refs.submitterFormRef.validate()
        this.nextStep()
      } catch (error) {
        console.error('Validation failed:', error)
      }
    },
     async isEmailRegistered(emails) {
        const params = {
          emails: emails.join(','),
          type: 'presentation'
        }
        const res = await this.$api.userCongressVerifyEmail(params).catch(err => err)
        if ((res.code === 200 || res.code === 0) && !res.data) {
          return null
        }
        return res?.data || null
      },
    async abstractFormValidate() {
      try {
        await this.$refs.abstractFormRef.validate()
        const existEmails = await this.isEmailRegistered([this.submitterForm.email])
        if (Array.isArray(existEmails) && existEmails.length > 0) {
          this.$message.error(`Duplicate Registration. The Speaker's Email ${existEmails.join(',')} is already registered.`)
          return
        }
        // this.nextStep()
        console.log(this.submitterForm)
        console.log(this.abstractForm)
        this.$api.userCongressPresentationCreate({
          ...this.submitterForm,
          ...this.abstractForm,
          congressId: this.$route.query.id
        }).then(res => {
          console.log(res)
          this.$message.success('Submitted successfully')
          // this.goToOwnPage()
          this.nextStep()
        }).catch(err => {
          console.log(err)
        })
      } catch (error) {
        console.error('Validation failed:', error)
      }
    },
    goToOwnPage() {
      this.changeActiveId('/mine')
      this.$router.push('/mine')
    }
  }
}
</script>

<style lang="scss" scoped>
.speech {
  padding: 100px 0 20px;
  background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
  .speech-title {
    font-weight: bold;
    font-size: 38px;
    color: #0E3045;
    margin-bottom: 10px;
    text-align: center;
  }
  .speech-subtitle {
    font-size: 16px;
    color: #656B6F;
    text-align: center;
  }
  .speech-steps {
    margin: 40px 0 24px;
  }
  .speech-content {
    font-weight: bold;
    font-size: 14px;
    color: #0E3045;
    padding: 30px;
    margin-bottom: 30px;
    border-radius: 8px;
    background-color: #FFFFFF;
    box-shadow: 0px 10px 20px 1px rgba(14,48,69,0.1);
    .sc-title {
      font-weight: bold;
      font-size: 20px;
      color: #0E3045;
      margin: 10px 0;
    }
    .sc-subtitle {
      font-weight: bold;
      font-size: 18px;
      color: #0E3045;
      margin: 10px 0;
    }
    .form-container {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      ::v-deep .el-form-item {
        width: 544px;
        margin-bottom: 0;
        .el-form-item__label {
          padding-bottom: 0;
          font-weight: bold;
          font-size: 14px;
          color: #0E3045;
        }
        .el-input, .el-select {
          width: 100%;
          height: 100%;
        }
      }
      .tip {
        font-size: 14px;
        color: #8A9094;
      }
      .submit-btn {
        font-weight: bold;
        font-size: 18px;
        color: #FFFFFF;
        background-color: #036FC0;
        border-radius: 8px;
      }
    }
    .action-buttons {
      width: 100%;
      font-weight: bold;
      font-size: 16px;
      margin-top: 30px;
      .el-button--primary {
        background-color: #036fc0;
        border-color: #036fc0;
      }
    }
  }
  .w-full {
    width: 100%;
  }
  .completion {
    min-height: 700px;
    padding: 60px 0;
    font-size: 16px;
    color: #23272A;
    .comletion-img {
      width: 128px;
      height: 90px;
      object-fit: cover;
      margin-bottom: 30px;
    }
  }
}
</style>

<style lang="scss">
.speech-steps {
  .el-step__title.is-process,
  .el-step__head.is-wait {
    color: #8A9094;
    font-weight: normal;
  }
  .el-step__title.is-finish {
    color: #036fc0;
  }
  .el-step__head {
    &.is-finish {
      .el-step__icon {
        color: #ffffff;
        background: linear-gradient(180deg, #79C5FF 0%, #036FC0 100%);
        box-shadow: 0px 8px 15px 1px rgba(3,56,89,0.21);
      }
      .el-step__line {
        background: linear-gradient(180deg, #79C5FF 0%, #036FC0 100%);
      }
    }
  }
  .el-step__line {
    top: 30px !important;
    height: 4px !important;
    margin: 0 50px !important;
    background-color: #DCE4EA;
  }
  .el-step__icon {
    font-weight: bold;
    font-size: 18px;
    color: #656B6F;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background-color: #E8E8E8;
  }
}
.speakertype-radio-group {
  width: 100%;
  display: flex;
  gap: 30px;
  color: #656B6F;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  .el-radio-button {
    width: 100%;
    .el-radio-button__inner {
      width: 100%;
      text-align: left;
      border-radius: 4px;
      border-left: 1px solid #DCDFE6;
      box-shadow: none;
      .radio-label {
        font-size: 24px;
        font-weight: bold;
        color: #0E3045;
        margin-bottom: 12px;
      }
      .radio-desc {
        font-size: 14px;
        color: #8A9094;
      }
      .radio-icon {
        color: #656B6F;
        margin: 5px 5px 0 0;
      }
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border-color: #a6d9ff;
      background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
    }
  }
}
</style>