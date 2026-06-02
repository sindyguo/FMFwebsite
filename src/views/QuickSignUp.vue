<template>
  <div class="quick-signup" v-loading="loading">
    <div class="vcontainer main-container">
      <span class="quick-signup-title">Attendee Registration</span>
      <div class="vcontainer quick-signup-content">
        <template v-if="!isComplete">
          <span class="sc-title">Registration information</span>
          <el-form
            :model="form"
            :rules="rules"
            ref="formRef"
            class="form-container"
            label-position="top">

            <el-form-item label="First name" prop="firstName">
              <el-input v-model="form.firstName" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Last name" prop="lastName">
              <el-input v-model="form.lastName" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" placeholder="Please enter" :clearable="!isLogin" :disabled="isLogin">
                <template slot="append">
                  <el-button size="small"  @click="handleEmailClick" :disabled="timer > 0">
                    {{ timer > 0 ? `${timer} seconds left` : 'Verify my email' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="Verification code" prop="code">
              <el-input v-model="form.code" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Congress title" prop="congressId">
              <el-input :value="congressTitle" placeholder="Loading..." readonly></el-input>
            </el-form-item>

            <el-form-item label="Title" prop="title">
              <el-select v-model="form.title" placeholder="Please Select" style="width:100%">
                <el-option label="Professor" value="Professor"></el-option>
                <el-option label="Dr" value="Dr"></el-option>
                <el-option label="Ms" value="Ms"></el-option>
                <el-option label="Mr" value="Mr"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Clinical specialty" prop="clinicalSpecialty">
              <el-select v-model="form.clinicalSpecialty" placeholder="Please select" @change="onSpecialtyChange" style="width:100%">
                <el-option v-for="item in clinicalSpecialty" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="form.clinicalSpecialty === 'Other'"
              label="Other Clinical Specialties"
              prop="gradeOther"
              :rules="{ required: true, message: 'Please enter other Clinical specialty', trigger: 'blur' }">
              <el-input v-model="form.gradeOther" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Institution" prop="institution">
              <el-select v-model="form.institution" placeholder="Please Select" style="width:100%">
                <el-option label="Hospital" value="Hospital"></el-option>
                <el-option label="University" value="University"></el-option>
                <el-option label="Private practice" value="Private practice"></el-option>
                <el-option label="Pharmaceutical company" value="Pharmaceutical company"></el-option>
                <el-option label="Medical device company" value="Medical device company"></el-option>
                <el-option label="Other" value="Other"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Institution name" prop="institutionName">
              <el-input v-model="form.institutionName" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Phone" prop="phone">
              <el-input v-model="form.phone" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Address" prop="address">
              <el-input v-model="form.address" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Town/City" prop="townCity">
              <el-input v-model="form.townCity" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Country" prop="country">
              <el-select v-model="form.country" placeholder="Please Select" filterable style="width:100%">
                <el-option v-for="(item, index) in countryList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Postcode" prop="postcode">
              <el-input v-model="form.postcode" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Alternative email" prop="emailAlternative">
              <el-input v-model="form.emailAlternative" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Do you agree to share your name and email address with sponsors?" prop="disclosureStatus" class="full-width-item">
              <el-radio-group v-model="form.disclosureStatus">
                <el-radio label="Agree">Agree</el-radio>
                <el-radio label="Not agree">Not agree</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Visa Document Required?" prop="visaDocument" class="full-width-item">
              <el-radio-group v-model="form.visaDocument">
                <el-radio label="1">Require</el-radio>
                <el-radio label="0">Not Required</el-radio>
              </el-radio-group>
            </el-form-item>

            <template v-if="form.visaDocument === '1'">
              <el-form-item
                label="Date of Birth"
                prop="dateOfBirth"
                :rules="{ required: true, message: 'Please select Date of Birth', trigger: 'change' }">
                <el-date-picker
                  v-model="form.dateOfBirth"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width:100%">
                </el-date-picker>
              </el-form-item>

              <el-form-item
                label="Passport number"
                prop="passportNumber"
                :rules="{ required: true, message: 'Please enter Passport number', trigger: 'blur' }">
                <el-input v-model="form.passportNumber" placeholder="Please enter" clearable></el-input>
              </el-form-item>

              <el-form-item
                label="Passport date of issue"
                prop="dateOfIssue"
                :rules="{ required: true, message: 'Please select Passport date of issue', trigger: 'change' }">
                <el-date-picker
                  v-model="form.dateOfIssue"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width:100%">
                </el-date-picker>
              </el-form-item>

              <el-form-item
                label="Passport country of issue"
                prop="countryOfIssue"
                :rules="{ required: true, message: 'Please select Passport country of issue', trigger: 'change' }">
                <el-select v-model="form.countryOfIssue" placeholder="Please Select" filterable style="width:100%">
                  <el-option v-for="(item, index) in countryList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>

            <div class="hcontainer hcenter action-buttons full-width-item">
              <el-button type="primary" :loading="submitting" :disabled="isSubmitDisabled" @click="handleSubmit">Submit</el-button>
            </div>
          </el-form>
        </template>

        <template v-else>
          <div class="fill vcontainer hcenter vcenter completion">
            <el-image :src="require('@/assets/img/img_succ2.png')" class="completion-img" />
            <span class="completion-tip">Your registration has been submitted successfully.</span>
            <div class="hcontainer hcenter vcenter action-buttons" style="margin-top: 30px;">
              <el-button type="primary" @click="$router.push('/')">Back to Home</el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickSignUpPage',
  inject: ['refreshTokenFn'],
  data() {
    return {
      loading: false,
      submitting: false,
      isComplete: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        code: '',
        congressId: '',
        title: '',
        clinicalSpecialty: '',
        gradeOther: '',
        institution: '',
        institutionName: '',
        phone: '',
        address: '',
        townCity: '',
        country: '',
        postcode: '',
        emailAlternative: '',
        disclosureStatus: 'Agree',
        visaDocument: '0',
        dateOfBirth: '',
        passportNumber: '',
        dateOfIssue: '',
        countryOfIssue: ''
      },
      rules: {
        firstName: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
        lastName: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
        email: [
          { required: true, message: 'Please enter email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
        ],
        code: [{ required: true, message: 'Please enter verification code', trigger: 'blur' }
        ],
        congressId: [{ required: true, message: 'Please select congress', trigger: 'change' }],
        title: [{ required: true, message: 'Please select title', trigger: 'change' }],
        clinicalSpecialty: [{ required: true, message: 'Please select Clinical specialty', trigger: 'change' }],
        institution: [{ required: true, message: 'Please select institution', trigger: 'change' }],
        institutionName: [{ required: true, message: 'Please enter institution name', trigger: 'blur' }],
        phone: [{ required: true, message: 'Please enter phone', trigger: 'blur' }],
        address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
        townCity: [{ required: true, message: 'Please enter town/city', trigger: 'blur' }],
        country: [{ required: true, message: 'Please select country', trigger: 'change' }],
        disclosureStatus: [{ required: true, message: 'Please select', trigger: 'change' }],
        visaDocument: [{ required: true, message: 'Please select', trigger: 'change' }]
      },
      clinicalSpecialty: [
        { value: 'ObGyn', label: 'ObGyn' },
        { value: 'Radiology', label: 'Radiology' },
        { value: 'Midwifery', label: 'Midwifery' },
        { value: 'Sonography', label: 'Sonography' },
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'Clinical scientist', label: 'Clinical scientist' },
        { value: 'Pediatrics', label: 'Pediatrics' },
        { value: 'Pediatric surgery', label: 'Pediatric surgery' },
        { value: 'Anesthesiology', label: 'Anesthesiology' },
        { value: 'Maternal Fetal Medicine', label: 'Maternal Fetal Medicine' },
        { value: 'Physician', label: 'Physician' },
        { value: 'Laboratory', label: 'Laboratory' },
        { value: 'Medical student', label: 'Medical student' },
        { value: 'Pharma industry', label: 'Pharma industry' },
        { value: 'Medical device industry', label: 'Medical device industry' },
        { value: 'Obs&Gynea', label: 'Obs&Gynea' },
        { value: 'Other', label: 'Other' }
      ],
      congressDetail: null,
      congressTitle: '',
      countryList: [],
      timerInterval: null,
      timer: 0
    }
  },
  computed: {
    isLogin() {
      return this.$store.getters['user/isLogin']
    },
    selectedCongress() {
      return this.congressDetail
    },
    isSubmitDisabled() {
      if (!this.congressDetail) return false
      const start = this.parseTime(this.congressDetail.registrationStartTime)
      const end = this.parseTime(this.congressDetail.endTime)
      if (!start || !end) return false
      const now = Date.now()
      return now < start.getTime() || now > end.getTime()
    }
  },
  watch: {
    'form.visaDocument': {
      handler() {
        this.form.dateOfBirth = ''
        this.form.passportNumber = ''
        this.form.dateOfIssue = ''
        this.form.countryOfIssue = ''
      }
    }
  },
  methods: {
    onSpecialtyChange(value) {
      if (value !== 'Other') {
        this.form.gradeOther = ''
      }
    },
    prefillUserInfo() {
      if (!this.isLogin) return
      this.loading = true
      this.$api.userCongressRegistrationInit({}).then(res => {
        if ((res.code === 200 || res.code === 0) && res.data) {
          const d = res.data
          this.form = {
            ...this.form,
            firstName: d.firstName || '',
            lastName: d.lastName || '',
            email: d.email || '',
            title: d.title || '',
            clinicalSpecialty: d.grade || '',
            gradeOther: d.gradeOther || '',
            institution: d.institution || '',
            institutionName: d.institutionName || '',
            phone: d.telephone || '',
            address: d.address || '',
            townCity: d.city || '',
            country: d.country || '',
            postcode: d.postcode || '',
            dateOfBirth: d.birthday || ''
          }
        }
      }).catch(err => {
        console.log('prefillUserInfo err:', err)
      }).finally(() => {
        this.loading = false
      })
    },
    async getCongressInfo() {
      const congressId = this.$route.query.id || this.$route.params.id
      if (!congressId) return
      const res = await this.$api.congressGet({ id: congressId }).catch(err => {
        console.log('getCongressInfo err:', err)
        return null
      })
      if (!res || !(res.code === 200 || res.code === 0) || !res.data) return
      this.congressDetail = res.data
      this.form.congressId = res.data.id || congressId
      this.congressTitle = res.data.title || ''
    },
    getCountryList() {
      this.$api.getCountries().then(res => {
        this.countryList = res.data || []
      }).catch(err => {
        console.log('getCountries err:', err)
      })
    },
    parseTime(value) {
      if (!value) return null
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) return date
      const fallback = new Date(String(value).replace(/-/g, '/'))
      return Number.isNaN(fallback.getTime()) ? null : fallback
    },
    handleSubmit() {
      if (this.isSubmitDisabled) return
      this.$refs.formRef && this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.submitting = true
        try {
          const verifyRes = await this.$api.validateRegisterRmailCode({ email: this.form.email, code: this.form.code })
          if(verifyRes.code !== 200 && verifyRes.code !== 0) {
            return;
          }
          const congress = this.selectedCongress || {}
          const registrationItem = {
            congressId: this.form.congressId,
            congressTitle: congress.title || '',
            registrationType: 'IndividualRegistration',
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            email: this.form.email,
            title: this.form.title,
            clinicalSpecialty: this.form.clinicalSpecialty === 'Other' ? '' : this.form.clinicalSpecialty,
            otherClinicalSpecialty: this.form.clinicalSpecialty === 'Other' ? this.form.gradeOther : '',
            institution: this.form.institution,
            institutionName: this.form.institutionName,
            phone: this.form.phone,
            address: this.form.address,
            townCity: this.form.townCity,
            country: this.form.country,
            postcode: this.form.postcode,
            emailAlternative: this.form.emailAlternative,
            disclosureStatus: this.form.disclosureStatus,
            visaDocument: this.form.visaDocument,
            dateOfBirth: this.form.visaDocument === '1' ? this.form.dateOfBirth : '',
            passportNumber: this.form.visaDocument === '1' ? this.form.passportNumber : '',
            dateOfIssue: this.form.visaDocument === '1' ? this.form.dateOfIssue : '',
            countryOfIssue: this.form.visaDocument === '1' ? this.form.countryOfIssue : ''
          }
          const payload = {
            registrationList: [registrationItem],
            typeOfFeeList: congress.typeOfFeeList || []
          }
          const res = await this.$api.unregisteredSubmit(payload).catch(err => err)
          if (res && (res.code === 200 || res.code === 0)) {
            this.isComplete = true
            const dom = document.querySelector('.quick-signup')
            if (dom) dom.scrollTo({ top: 0, behavior: 'smooth' })
          }
        } finally {
          this.submitting = false
        }
      })
    },
    async handleEmailClick() {
      const fieldsToValidate = ['email'];
      await new Promise((resolve, reject) => {
        let validatedCount = 0 // 记录已校验的字段数量
        this.$refs.formRef.validateField(fieldsToValidate, (valid) => {
          // 如果 valid 是字符串，说明是错误信息（校验失败）；如果是布尔值 true，说明校验通过
          const isFieldValid = typeof valid === 'boolean' ? valid : (valid === '')
          if (!isFieldValid) {
            reject()
          }
          validatedCount++
          // 只有当所有字段都校验完毕后，才进行 resolve 或 reject
          if (validatedCount === fieldsToValidate.length) {
            resolve()
          }
        })
      })
      await this.handleEmailClickFn()
    },
    async handleEmailClickFn() {
      try {
        let data = {
          email: this.form.email
        }
        const res = await this.$api.sendEmailCode2(data);
        if(res.code === 200 || res.code === 0) {
          this.$message({
            message: `Email verification code sent to ${this.form.email}`,
            type: 'success'
          })
          this.timer = 60;
          this.timerInterval = setInterval(() => {
            this.timer--;
            if (this.timer <= 0) {
              clearInterval(this.timerInterval)
              this.timer = 0
            }
          }, 1000)
        }
      } catch (err) {
        console.log("Error sending email verification code:", err);
      }
    }
  },
  async created() {
    await this.refreshTokenFn(false);
    this.getCongressInfo()
    this.getCountryList()
    this.prefillUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.quick-signup {
  width: 100%;
  box-sizing: border-box;
  padding: 40px 20px 60px;
  overflow-x: hidden;
  overflow-y: auto;
  background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);

  .main-container {
    width: 100% !important;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    min-width: 0;
  }

  .quick-signup-title {
    font-weight: bold;
    font-size: 38px;
    color: #0E3045;
    margin-bottom: 30px;
    text-align: center;
  }

  .quick-signup-content {
    font-weight: bold;
    font-size: 18px;
    color: #0E3045;
    padding: 30px;
    margin-bottom: 30px;
    border-radius: 8px;
    background-color: #FFFFFF;
    box-shadow: 0px 10px 20px 1px rgba(14, 48, 69, 0.1);

    .sc-title {
      font-weight: bold;
      font-size: 20px;
      color: #0E3045;
      margin-bottom: 20px;
    }

    .form-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;

      ::v-deep .el-form-item {
        flex: 1 1 100%;
        width: 100%;
        max-width: 544px;
        min-width: 0;
        margin-bottom: 0;

        .el-form-item__label {
          padding-bottom: 0;
          font-weight: bold;
          font-size: 18px;
          color: #0E3045;
          line-height: 1.4;
        }

        .el-input,
        .el-select,
        .el-date-editor {
          width: 100%;
        }
      }

      .full-width-item {
        flex: 1 1 100%;
        max-width: 100%;
        width: 100%;
      }
    }

    .action-buttons {
      width: 100%;
      margin-top: 10px;
      flex-wrap: wrap;
      gap: 12px;

      ::v-deep .el-button--primary {
        background-color: #036fc0;
        border-color: #036fc0;
        padding: 12px 40px;
        font-size: 16px;
        font-weight: bold;
      }
    }

    .completion {
      padding: 40px 0;
      text-align: center;

      .completion-img {
        width: 128px;
        height: 90px;
        object-fit: cover;
        margin-bottom: 24px;
      }

      .completion-tip {
        font-size: 18px;
        font-weight: normal;
        color: #23272A;
      }
    }
  }
}

@media (max-width: 1200px) {
  .quick-signup {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 900px) {
  .quick-signup {
    padding-top: 28px;

    .quick-signup-title {
      font-size: 28px;
    }

    .quick-signup-content {
      padding: 22px 20px;
    }
  }
}

@media (max-width: 768px) {
  .quick-signup {
    padding: 24px 12px 24px;

    .quick-signup-title {
      font-size: 22px;
    }

    .quick-signup-content {
      padding: 16px 14px 20px;

      .form-container {
        ::v-deep .el-form-item {
          max-width: 100% !important;
        }
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;

        ::v-deep .el-button {
          width: 100%;
          margin-left: 0 !important;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .quick-signup {
    padding: 20px 10px 16px;

    .quick-signup-title {
      font-size: 19px;
    }
  }
}
</style>
