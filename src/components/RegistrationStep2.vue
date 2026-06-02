<template>
  <div class="fill registration-step2">
    <!-- Form content -->
    <el-form :model="registrationForm" :rules="registrationRules" label-position="left" ref="registrationForm"
      class="registration-form" size="small">
      <el-form-item label="First name" prop="firstName">
        <el-input v-model="registrationForm.firstName" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="Last name" prop="lastName">
        <el-input v-model="registrationForm.lastName" placeholder="Please enter" clearable></el-input>
      </el-form-item>
      <el-form-item label="Alternative email" prop="emailAlternative">
        <el-input v-model="registrationForm.emailAlternative" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="Title" prop="title">
        <el-select v-model="registrationForm.title" placeholder="Please select">
          <el-option v-for="item in titles" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Department" prop="department">
        <el-input v-model="registrationForm.department" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="Institution" prop="institution">
        <el-select v-model="registrationForm.institution" placeholder="Please select">
          <el-option v-for="item in companys" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Institution name" prop="institutionName">
        <el-input v-model="registrationForm.institutionName" placeholder="Please enter" clearable></el-input>
      </el-form-item>
      
      <el-form-item label="Clinical specialty" prop="clinicalSpecialty">
        <el-select v-model="registrationForm.clinicalSpecialty" placeholder="Please select">
          <el-option v-for="item in grades" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      

      <el-form-item v-if="registrationForm.clinicalSpecialty == 'Other'"
        label="Other Clinical Specialties" prop="gradeOther"
        :rules="[{ required: true, message: 'Please enter other Clinical specialty', trigger: 'blur' }]">
        <el-input v-model="registrationForm.gradeOther" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="Telephone" prop="telephone">
        <el-input v-model="registrationForm.telephone" placeholder="Please enter" clearable></el-input>
      </el-form-item>
      <!-- 占位 -->
      <el-form-item v-show="registrationForm.clinicalSpecialty != 'Other'"></el-form-item>
      <!-- <el-form-item label="Email" prop="email">
        <el-input v-model="registrationForm.email" placeholder="Please enter" clearable></el-input>
      </el-form-item> -->

      <!-- <el-form-item label="Email (alternative)" prop="emailAlternative">
        <el-input v-model="registrationForm.emailAlternative" placeholder="Please enter" clearable></el-input>
      </el-form-item> -->

      <el-form-item label="Date of birth" prop="birthday">
        <el-date-picker
          v-model="registrationForm.birthday"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="Select date"
          style="width: 100%;">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="Country" prop="country">
        <el-select v-model="registrationForm.country" filterable  placeholder="Please select" style="width: 100%;">
          <el-option v-for="item in countries" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="City" prop="city">
        <el-input v-model="registrationForm.city" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="PostCode" prop="postCode">
        <el-input v-model="registrationForm.postCode" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="Street and number" prop="address" style="width: 100%;">
        <el-input v-model="registrationForm.address" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      

      <el-form-item label="Preferred language" prop="preferredLanguage">
        <el-select v-model="registrationForm.preferredLanguage" placeholder="Please select" style="width: 100%;">
          <el-option v-for="item in languages" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <!-- Terms and conditions -->
      <el-form-item class="terms-item">
        <el-checkbox v-model="agreedToTerms" @change="handleTermsChange">
          <span class="link" @click.prevent="showTermsDialog = true">I accept the terms & conditions</span>
        </el-checkbox>
      </el-form-item>

      <!-- Navigation buttons -->
      <div class="navigation-buttons">
        <el-button type="default" class="nav-btn nav-btn--back" @click="preClick">
          Back
        </el-button>
        <el-button type="primary" class="nav-btn nav-btn--next" @click="nextClick">
          Next
        </el-button>
      </div>
    </el-form>
    <TermsDialog
      :visible="showTermsDialog"
      @close="showTermsDialog = false" />
  </div>
</template>

<script>
  import TermsDialog from '@/components/TermsDialog.vue'
  export default {
    name: 'RegistrationStep2',
    components: { TermsDialog },
    data() {
      return {
        showTermsDialog: false,
        registrationForm: {
          lastName: '',
          nickname: '',
          emailAlternative: '',
          title: '',
          department: '',
          birthday: '',
          city: '',
          address: '',
          telephone: '',
          company: '',
          companyName: '',
          grade: '',
          gradeOther: '',
          country: '',
          postCode: '',
          preferredLanguage: ''
        },
        registrationRules: {
          lastName: [
            { required: true, message: 'Please input last name', trigger: 'blur' }
          ],
          firstName: [
            { required: true, message: 'Please input first name', trigger: 'blur' }
          ],
          title: [
            { required: true, message: 'Please select title', trigger: 'blur' }
          ],
          department: [
            { required: true, message: 'Please input department', trigger: 'blur' }
          ],
          institution: [
            { required: true, message: 'Please select institution', trigger: 'blur' }
          ],
          institutionName: [
            { required: true, message: 'Please input Institution name', trigger: 'blur' }
          ],
          clinicalSpecialty: [
            { required: true, message: 'Please select Clinical specialty', trigger: 'blur' }
          ],
          // email: [
          //   { required: true, message: 'Please input email', trigger: 'blur' },
          //   { type: 'email', message: 'Please input valid email', trigger: 'blur' }
          // ],
          emailAlternative: [
            { type: 'email', message: 'Please input valid email', trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: 'Please select Date of birth', trigger: 'blur' }
          ],
          country: [
            { required: true, message: 'Please select country', trigger: 'blur' }
          ],
          city: [
            { required: true, message: 'Please input city', trigger: 'blur' }
          ],
          postCode: [
            { required: true, message: 'Please input post code', trigger: 'blur' }
          ],
          address: [
            { required: true, message: 'Please input street and number', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: 'Please input telephone', trigger: 'blur' }
          ],
          preferredLanguage: [
            { required: true, message: 'Please select preferred language', trigger: 'blur' }
          ]
        },
        agreedToTerms: true,
        titles: [
          { value: 'Professor', label: 'Professor' },
          { value: 'Dr', label: 'Dr' },
          { value: 'Ms', label: 'Ms' },
          { value: 'Mr', label: 'Mr' }
        ],
        companys: [
          { value: 'Hospital', label: 'Hospital' },
          { value: 'University', label: 'University' },
          { value: 'Private practice', label: 'Private practice' },
          { value: 'Pharmaceutical company', label: 'Pharmaceutical company' },
          { value: 'Medical device company', label: 'Medical device company' },
          { value: 'Other', label: 'Other' }
        ],
        countries: [
          { value: 'US', label: 'United States' },
          { value: 'UK', label: 'United Kingdom' },
          { value: 'CA', label: 'Canada' },
          { value: 'AU', label: 'Australia' },
          { value: 'DE', label: 'Germany' },
          { value: 'FR', label: 'France' },
          { value: 'JP', label: 'Japan' },
          { value: 'CN', label: 'China' }
        ],
        languages: [
          { value: 'en', label: 'English' },
          { value: 'zh', label: 'Chinese' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'es', label: 'Spanish' },
          { value: 'ja', label: 'Japanese' }
        ],
        grades: [
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
          { value: 'Pharma sndustry', label: 'Pharma sndustry' },
          { value: 'Medical device industry', label: 'Medical device industry' },
          { value: 'Other', label: 'Other' }
        ]
      }
    },
    methods: {
      preClick() {
        this.$emit('preSuccess');
      },
      nextClick() {
        if (!this.agreedToTerms) {
          this.$message.warning('Please agree to the terms and conditions.');
          return;
        }
        const self = this
        this.$refs.registrationForm.validate(valid => {
          if (valid) {
            self.registrationForm.nickname = self.registrationForm.lastName + ' ' + self.registrationForm.firstName
            this.$emit('nextSuccess', self.registrationForm)
          } else {
            console.log('Validation failed or terms not accepted');
          }
        });
      },
      handleTermsChange(checked) {
        this.agreedToTerms = checked;
      },
      getCountriesFn() {
        this.$api.getCountries().then(res => {
          if ((res.code === 200 || res.code === 0) && Array.isArray(res.data)) {
            this.countries = res.data
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      },
      getLanguagesFn() {
        this.$api.getLanguages().then(res => {
          if ((res.code === 200 || res.code === 0) && Array.isArray(res.data)) {
            this.languages = res.data
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      }
    },
    created() {
      this.getCountriesFn()
      this.getLanguagesFn()
    },
    mounted() {
      // Initialize form validation
    }
  }
</script>

<style lang="scss" scoped>
/* ── Step 2 wrapper ──────────────────────────────────────── */
.registration-step2 {
  width: 100%;
  background-color: #ffffff;
  padding-top: 20px;
  padding-bottom: 12px;

  .registration-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0 80px;
  }

  .terms-item {
    margin-bottom: 16px;
    .link {
      color: #036fc0;
      cursor: pointer;
      &:hover { text-decoration: underline; }
    }
  }

  .navigation-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    width: 100%;
    margin-top: 8px;
    padding-bottom: 12px;
    box-sizing: border-box;

    .nav-btn {
      height: 46px !important;
      border-radius: 10px !important;
      font-size: 15px !important;
      min-width: 160px;
      width: 244px;
      max-width: 100%;
      box-sizing: border-box;
      margin-left: 0 !important; /* override ElementUI default sibling margin */
    }

    /* ElementUI adds `.el-button + .el-button { margin-left: 10px; }` globally */
    ::v-deep .el-button + .el-button {
      margin-left: 0 !important;
    }

    .nav-btn--back {
      border-color: #d6e2ee !important;
      color: #4a5b6a !important;
      &:hover {
        border-color: #036fc0 !important;
        color: #036fc0 !important;
      }
    }

    .nav-btn--next {
      background-color: #036fc0 !important;
      border-color: #036fc0 !important;
      &:hover {
        background-color: #005a9c !important;
        border-color: #005a9c !important;
      }
    }
  }
}

/* ── Form field overrides (desktop) ─────────────────────── */
::v-deep .el-form-item {
  margin-bottom: 6px !important;
  width: 44%;
}

::v-deep .el-form-item__label {
  font-size: 15px !important;
  color: #4a5b6a !important;
  font-weight: 500 !important;
}

::v-deep .el-input__inner,
::v-deep .el-input--small .el-input__inner {
  border-radius: 8px !important;
  border-color: #d6e2ee !important;
  height: 38px !important;
  line-height: 38px !important;
  font-size: 14px !important;
  color: #0e3045 !important;

  &:focus {
    border-color: #036fc0 !important;
    box-shadow: 0 0 0 3px rgba(3, 111, 192, 0.1) !important;
  }
}

::v-deep .el-select {
  width: 100%;
}

::v-deep .el-date-editor {
  width: 100% !important;
}

/* ── Responsive ──────────────────────────────────────────── */

/* Tablet: ≤ 900px */
@media (max-width: 900px) {
  .registration-step2 .registration-form {
    gap: 0 32px;
  }
}

/* Mobile: ≤ 767px — single column + top labels */
@media (max-width: 767px) {
  .registration-step2 {
    padding-top: 12px;
    padding-bottom: 16px;

    .registration-form {
      flex-direction: column;
      gap: 0;
    }

    .navigation-buttons {
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 10px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));

      .nav-btn {
        width: 100% !important;
        min-width: unset;
      }
    }
  }

  /* Switch to top-label layout */
  ::v-deep .el-form-item {
    display: block !important;
    width: 100% !important;
    margin-bottom: 10px !important;
  }

  ::v-deep .el-form-item__label {
    display: block !important;
    width: 100% !important;
    text-align: left !important;
    padding-bottom: 4px !important;
    padding-right: 0 !important;
    font-size: 13px !important;
  }

  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }
}

/* Small mobile: ≤ 479px */
@media (max-width: 479px) {
  ::v-deep .el-form-item__label {
    font-size: 12px !important;
  }

  ::v-deep .el-input__inner {
    font-size: 13px !important;
    height: 36px !important;
    line-height: 36px !important;
  }
}
</style>