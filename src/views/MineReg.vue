<template>
  <div class="mine-reg" v-loading="loading">
    <div class="vcontainer main-container">
      <span class="mine-reg-title">Register</span>
      <div class="vcontainer mine-reg-content">
        <span class="sponsored">Sponsored By: {{regForm.companyName2}}</span>
        <template v-if="isComplete">
          <div class="vcontainer vcenter flex-between">
            <div class="vcontainer vcenter mv-90">
              <el-image :src="require('@/assets/img/img_succ2.png')" class="mine-reg-img" />
              <span class="mine-reg-tip">Your registration is complete</span>
            </div>
            <el-button class="mine-reg-btn" @click="ownPageClick">Own Page</el-button>
          </div>
        </template>
        <template v-else>
          <el-form
            :model="regForm"
            :rules="regRules"
            label-position="top"
            ref="regForm"
            class="min-reg-form">
            <el-form-item label="First name" prop="firstName">
              <el-input v-model="regForm.firstName" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Last name" prop="lastName">
              <el-input v-model="regForm.lastName" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="regForm.email" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="FMF ID" prop="fmfId">
              <el-input v-model="regForm.fmfId" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Title" prop="title">
              <el-select v-model="regForm.title" placeholder="Please Select">
                <el-option label="Professor" value="Professor"></el-option>
                <el-option label="Dr" value="Dr"></el-option>
                <el-option label="Ms" value="Ms"></el-option>
                <el-option label="Mr" value="Mr"></el-option>
              </el-select>
              <!-- <el-input v-model="regForm.title" placeholder="Please enter" clearable></el-input> -->
            </el-form-item>
            <!-- <el-form-item label="Clinical specialty" prop="clinicalSpecialty">
              <el-input v-model="regForm.clinicalSpecialty" placeholder="Please enter" clearable></el-input>
            </el-form-item> -->


            <el-form-item label="Clinical specialty" prop="clinicalSpecialty">
              <el-select v-model="regForm.clinicalSpecialty" placeholder="Please select" @change="onGradeChange">
                <el-option v-for="item in clinicalSpecialty" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>


            
            <el-form-item label="Institution" prop="institution">
              <el-input v-model="regForm.institution" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item v-if="regForm.clinicalSpecialty == 'Other'" label="Other Clinical Specialties" prop="otherClinicalSpecialty"
              :rules="{ required: true, message: 'Please enter other Clinical specialty', trigger: 'blur' }">
              <el-input v-model="regForm.otherClinicalSpecialty" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Institution name" prop="institutionName">
              <el-input v-model="regForm.institutionName" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="regForm.phone" placeholder="Please enter" maxlength="11" clearable></el-input>
            </el-form-item>
            <el-form-item label="Address" prop="address">
              <el-input v-model="regForm.address" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Town/City" prop="townCity">
              <el-input v-model="regForm.townCity" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Country" prop="country">
              <el-select v-model="regForm.country" placeholder="Please select" filterable>
                <el-option v-for="(item) in countries" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Postcode" prop="postcode">
              <el-input v-model="regForm.postcode" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Do you agree to share your name and email address with Sponsors. " prop="disclosureStatus" style="width: 100%;">
              <el-radio-group v-model="regForm.disclosureStatus">
                <el-radio label="Agree">Agree</el-radio>
                <el-radio label="Not agree">Not agree</el-radio>
              </el-radio-group>
              <!-- <div class="tip">Tick "agree" if you are happy for us to share name and email address with exhibitors.</div> -->
            </el-form-item>
            <el-form-item label="Visa document required?" prop="visaDocument">
              <el-radio-group v-model="regForm.visaDocument">
                <el-radio label="1">Required</el-radio>
                <el-radio label="0">Not Required</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="regForm.visaDocument == 1">
              <el-form-item label="Date of birth" prop="dateOfBirth"
                :rules="{ required: true, messge: 'Please Select Date of birth', trigger: 'change'}">
                <el-date-picker
                  v-model="regForm.dateOfBirth"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Passport number" prop="passportNumber"
                :rules="{ required: true, messge: 'Please Select Passport number', trigger: 'change'}">
                <el-input v-model="regForm.passportNumber" placeholder="Please enter"></el-input>
              </el-form-item>
              <el-form-item label="Passport date of issue" prop="dateOfIssue"
                :rules="{ required: true, messge: 'Please Select Passport date of issue', trigger: 'change'}">
                <el-date-picker
                  v-model="regForm.dateOfIssue"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Passport country of issue" prop="countryOfIssue"
                :rules="{ required: true, messge: 'Please Select Passport country of issue', trigger: 'change'}">
                <el-select v-model="regForm.countryOfIssue" placeholder="Please Select" filterable>
                  <el-option v-for="(item, index) in companyList" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <div class="hcontainer flex-end" style="width: 100%;">
              <el-button type="primary" class="submit-btn" @click="submitClick">Submit</el-button>
            </div>
          </el-form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'MineReg',
    data() {
      return {
        isComplete: false,
        loading: false,
        companyList: [],
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
          { value: 'Other', label: 'Other' }
        ],
        regForm: {
          lastName: '',
          firstName: '',
          email: '',
          fmfId: '',
          title: '',
          clinicalSpecialty: '',
          otherClinicalSpecialty: '',
          institution: '',
          institutionName: '',
          phone: '',
          address: '',
          townCity: '',
          country: '',
          postcode: '',
          disclosureStatus: 'Agree',
          visaDocument: '1',
          dateOfBirth: '',
          passportNumber: '',
          dateOfIssue: '',
          countryOfIssue: '',
        },
        regRules: {
          title: [
            { required: true, message: 'Please input title', trigger: 'blur' }
          ],
          clinicalSpecialty: [
            { required: true, message: 'Please input Clinical specialty', trigger: 'blur' }
          ],
          institution: [
            { required: true, message: 'Please select institution', trigger: 'change' }
          ],
          institutionName: [
            { required: true, message: 'Please input insitution name', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: 'Please input phone', trigger: 'blur' }
          ],
          address: [
            { required: true, message: 'Please input address', trigger: 'blur' }
          ],
          townCity: [
            { required: true, message: 'Please input town/city', trigger: 'blur' }
          ],
          country: [
            { required: true, message: 'Please select country', trigger: 'change' }
          ],
          disclosureStatus: [
            { required: true, message: 'Please select disclosure status', trigger: 'change' }
          ],
          postcode2: [{ required: false, message: 'Please enter postcode', trigger: 'blur' }],
          visaDocument: [{ required: true, messge: 'Please Select Visa document required', trigger: 'change'}]
        },
        countries: [
          { value: 'US', label: 'United States' },
          { value: 'UK', label: 'United Kingdom' },
          { value: 'CA', label: 'Canada' },
          { value: 'AU', label: 'Australia' },
          { value: 'DE', label: 'Germany' },
          { value: 'FR', label: 'France' },
          { value: 'JP', label: 'Japan' },
          { value: 'CN', label: 'China' }
        ]
      }
    },
    methods: {
      onGradeChange(value) {
        // Clear the other field when grade is changed to something other than 'Other'
        if (value !== 'Other') {
          // this.individualForm.gradeOther = '';
        }
      },
      ...mapActions('user', ['changeActiveId']),
      getCompanyList() {
        this.$api.getCountries().then((res) => {
          this.companyList = res.data || [];
        });
      },
      ownPageClick() {
        this.changeActiveId('/mine')
        this.$router.push('/mine')
      },
      submitClick() {
        this.$refs.regForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.submitFn()
          } else {
            console.log('Validation failed or terms not accepted')
          }
        })
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
      userCongressGroupRegistrationComplementInitFn() {
        this.loading = true
        this.$api.userCongressGroupRegistrationComplementInit({congressId: this.$route.query.congressId}).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.regForm = {
              ...this.regForm,
              ...res.data
            }
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          console.log('err:', err)
        })
      },
      submitFn() {
        this.$api.userCongressGroupRegistrationComplementSubmit(this.regForm).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.isComplete = true
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          console.log('err:', err)
        })
      }
    },
    created() {
      this.userCongressGroupRegistrationComplementInitFn()
      this.getCountriesFn()
      this.getCompanyList()
    }
  }
</script>

<style lang="scss" scoped>
  .mine-reg {
    padding: 100px 20px 20px;
    box-sizing: border-box;
    background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);

    .main-container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .mine-reg-title {
      color: #0E3045;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .mine-reg-content {
      padding: 30px 40px;
      background-color: #FFFFFF;
      box-shadow: 0px 10px 20px 1px rgba(14,48,69,0.1);
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;

      .sponsored {
        font-weight: bold;
        font-size: 20px;
        color: #036FC0;
      }
      .mine-reg-img {
        width: 128px;
        height: 90px;
        object-fit: cover;
      }
      .mine-reg-tip {
        font-weight: bold;
        font-size: 18px;
        color: #0E3045;
        margin-top: 30px;
      }
      .mine-reg-btn {
        font-weight: bold;
        font-size: 18px;
        color: #656B6F;
      }
    }

    .min-reg-form {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      width: 100%;
      box-sizing: border-box;

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
        }
      }
      .tip {
        font-size: 12px;
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
  }

  /* ── 平板及以下（≤ 900px）：单列，宽度自适应 ── */
  @media (max-width: 900px) {
    .mine-reg {
      padding: 80px 16px 20px;
    }

    .mine-reg-content {
      padding: 24px 20px !important;
    }

    .min-reg-form {
      gap: 14px !important;

      ::v-deep .el-form-item {
        width: 100% !important;
        min-width: 0;
      }
    }
  }

  /* ── 手机（≤ 480px）── */
  @media (max-width: 480px) {
    .mine-reg {
      padding: 70px 12px 16px;
    }

    .mine-reg-title {
      font-size: 20px !important;
    }

    .mine-reg-content {
      padding: 16px 14px !important;
      border-radius: 6px !important;
    }

    .sponsored {
      font-size: 16px !important;
    }

    .min-reg-form {
      gap: 12px !important;

      ::v-deep .el-form-item {
        width: 100% !important;
        min-width: 0;
      }

      .submit-btn {
        font-size: 16px !important;
        width: 100%;
      }
    }
  }
</style>