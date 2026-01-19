<template>
  <div class="fill registration-step2">
    <!-- Form content -->
    <el-form :model="registrationForm" :rules="registrationRules" label-position="left" ref="registrationForm"
      class="registration-form" size="small">
      <el-form-item label="Last name" prop="lastname">
        <el-input v-model="registrationForm.lastname" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="First name" prop="firstName">
        <el-input v-model="registrationForm.firstName" placeholder="Please enter" clearable></el-input>
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

      <el-form-item label="Institution Name" prop="institutionName">
        <el-input v-model="registrationForm.institutionName" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="Clinical Specialty" prop="clinicalSpecialty">
        <el-select v-model="registrationForm.clinicalSpecialty" placeholder="Please select">
          <el-option v-for="item in grades" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="registrationForm.grade == 'Other'" label="Other Clinical Specialties" prop="gradeOther">
        <el-input v-model="registrationForm.gradeOther" placeholder="Please enter" clearable></el-input>
      </el-form-item>
      <!-- 占位 -->
      <el-form-item v-show="registrationForm.grade != 'Other'"></el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="registrationForm.email" placeholder="Please enter" clearable></el-input>
      </el-form-item>

      <el-form-item label="Email (alternative)" prop="emailAlternative">
        <el-input v-model="registrationForm.emailAlternative" placeholder="Please enter" clearable></el-input>
      </el-form-item>

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
        <el-select v-model="registrationForm.country" placeholder="Please select" style="width: 100%;">
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

      <el-form-item label="Telephone" prop="telephone">
        <el-input v-model="registrationForm.telephone" placeholder="Please enter" clearable></el-input>
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
        <el-button type="default" style="width: 244px; margin-right: 10px;" @click="preClick">
          Back
        </el-button>
        <el-button type="primary" style="width: 244px;" @click="nextClick">
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
      const validateGradeOther = (rule, value, callback) => {
        if (this.registrationForm.grade === 'Other' && !value) {
          callback(new Error('Please input other clinical specialty'))
        } else {
          callback()
        }
      };
      return {
        showTermsDialog: false,
        registrationForm: {
          lastname: '',
          nickname: '',
          title: '',
          department: '',
          email: '',
          birthday: '',
          city: '',
          address: '',
          telephone: '',
          company: '',
          companyName: '',
          grade: '',
          gradeOther: '',
          emailAlternative: '',
          country: '',
          postCode: '',
          preferredLanguage: ''
        },
        registrationRules: {
          lastname: [
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
            { required: true, message: 'Please input institution name', trigger: 'blur' }
          ],
          clinicalSpecialty: [
            { required: true, message: 'Please select clinical specialty', trigger: 'blur' }
          ],
          gradeOther: [
            { required: true, validator: validateGradeOther, trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'Please input email', trigger: 'blur' },
            { type: 'email', message: 'Please input valid email', trigger: 'blur' }
          ],
          emailAlternative: [
            { type: 'email', message: 'Please input valid email', trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: 'Please select date of birth', trigger: 'blur' }
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
          { value: 'OBs&Gynae', label: 'OBs&Gynae' },
          { value: 'Radiology', label: 'Radiology' },
          { value: 'Midwifery', label: 'Midwifery' },
          { value: 'Sonography', label: 'Sonography' },
          { value: 'Cardiology', label: 'Cardiology' },
          { value: 'Clinical Scientist', label: 'Clinical Scientist' },
          { value: 'Paediatrics', label: 'Paediatrics' },
          { value: 'Paediatric Surgery', label: 'Paediatric Surgery' },
          { value: 'Anesthesiology', label: 'Anesthesiology' },
          { value: 'Physician', label: 'Physician' },
          { value: 'Laboratory', label: 'Laboratory' },
          { value: 'Medical Student', label: 'Medical Student' },
          { value: 'Pharma Industry', label: 'Pharma Industry' },
          { value: 'Medical Device Industry', label: 'Medical Device Industry' },
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
            self.registrationForm.nickname = self.registrationForm.lastname + ' ' + self.registrationForm.firstName
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
.registration-step2 {
  width: 100%;
  background-color: #ffffff;
  .step-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 0 20px;
    border-bottom: 1px solid #e4e7ed;
  }

  .step-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .step-item.active {
    color: #036fc0;
  }

  .step-item:hover {
    color: #036fc0;
  }

  .step-number {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #036fc0;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .step-text {
    font-size: 14px;
    color: #8A9094;
  }

  .registration-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0px 100px;
  }

  .form-column {
    flex: 1;
    min-width: 300px;
  }

  .el-form-item__label {
    font-weight: normal;
    color: #0E3045;
  }

  .el-form-item__content {
    margin-left: 120px;
  }

  .el-input {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }

  .el-date-picker {
    width: 100%;
  }

  .terms-item {
    margin-bottom: 20px;
    .link {
      color: #036fc0;
    }
  }

  .navigation-buttons {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .el-button--primary {
    background-color: #036fc0;
    border-color: #036fc0;
    color: white;
  }

  .el-button--primary:hover {
    background-color: #005a9c;
    border-color: #005a9c;
  }

  .el-button--default {
    background-color: #fff;
    border-color: #dcdfe6;
    color: #606266;
  }
}



/* Responsive design */
@media (max-width: 768px) {
  .registration-step2 {
    padding: 20px;
    .step-indicator {
      flex-direction: column;
      gap: 10px;
    }

    .step-item {
      flex-direction: row;
      align-items: center;
    }

    .step-number {
      margin-right: 5px;
    }

    .registration-form {
      flex-direction: column;
    }

    .form-column {
      min-width: auto;
      width: 100%;
    }

    .el-form-item__content {
      margin-left: 0;
    }

    .navigation-buttons {
      justify-content: center;
    }
  }
}
::v-deep .el-form-item {
  margin-bottom: 0;
  width: 44%;
}
</style>