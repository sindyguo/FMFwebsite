<template>
  <div class="mine-reg">
    <div class="vcontainer main-container">
      <span class="mine-reg-title">Register</span>
      <div class="vcontainer mine-reg-content">
        <span class="sponsored">Sponsored By: {{regForm.companyName}}</span>
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
            <el-form-item label="Last name" prop="lastName">
              <el-input v-model="regForm.lastName" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="First name" prop="firstName">
              <el-input v-model="regForm.firstName" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="regForm.email" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="FMF ID" prop="fmfId">
              <el-input v-model="regForm.fmfId" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Title" prop="title">
              <el-input v-model="regForm.title" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="Clinical Specialty" prop="clinicalSpecialty">
              <el-input v-model="regForm.clinicalSpecialty" placeholder="Please enter" clearable></el-input>
            </el-form-item> -->


            <el-form-item label="Clinical Specialty" prop="clinicalSpecialty">
              <el-select v-model="regForm.clinicalSpecialty" placeholder="Please select" @change="onGradeChange">
                <el-option v-for="item in clinicalSpecialty" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>


            
            <el-form-item label="Institution" prop="institution">
              <el-input v-model="regForm.institution" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Other Clinical Specialties" prop="otherClinicalSpecialty" v-show="regForm.clinicalSpecialty == 'Other'">
              <el-input v-model="regForm.otherClinicalSpecialty" placeholder="Please enter" clearable></el-input>
            </el-form-item>

            <el-form-item label="Institution Name" prop="institutionName">
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
            <el-form-item label="postCode" prop="postCode">
              <el-input v-model="regForm.postCode" placeholder="Please enter" clearable></el-input>
            </el-form-item>
            <el-form-item label="Disclosure Status" prop="disclosureStatus" style="width: 100%;">
              <el-radio-group v-model="regForm.disclosureStatus">
                <el-radio label="true">Agree</el-radio>
                <el-radio label="false">Not Agree</el-radio>
              </el-radio-group>
              <div class="tip">Tick "agree" if you are happy for us to share name and email address with exhibitors.</div>
            </el-form-item>
            <el-form-item label="Visa Document Required?" prop="visaDocument">
              <el-radio-group v-model="regForm.visaDocument">
                <el-radio label="1">Require</el-radio>
                <el-radio label="0">Not Required</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="regForm.visaDocument == 1">
              <el-form-item label="Date Of Birth" prop="dateOfBirth"
                :rules="{ required: true, messge: 'Please Select Date Of Birth', trigger: 'change'}">
                <el-date-picker
                  v-model="regForm.dateOfBirth"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Passport Number" prop="passportNumber"
                :rules="{ required: true, messge: 'Please Select Passport Number', trigger: 'change'}">
                <el-input v-model="regForm.passportNumber" placeholder="Please enter"></el-input>
              </el-form-item>
              <el-form-item label="Date Of Issue" prop="dateOfIssue"
                :rules="{ required: true, messge: 'Please Select Date Of Issue', trigger: 'change'}">
                <el-date-picker
                  v-model="regForm.dateOfIssue"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Country Of Issue" prop="countryOfIssue"
                :rules="{ required: true, messge: 'Please Select Country Of Issue', trigger: 'change'}">
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
        companyList: [],
        clinicalSpecialty: [
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
          postCode: '',
          disclosureStatus: ''
        },
        regRules: {
          title: [
            { required: true, message: 'Please input title', trigger: 'blur' }
          ],
          clinicalSpecialty: [
            { required: true, message: 'Please input clinical specialty', trigger: 'blur' }
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
          postcode: [{ required: false, message: 'Please enter postcode', trigger: 'blur' }],
          visaDocument: [{ required: true, messge: 'Please Select Visa Document Required', trigger: 'change'}]
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
        this.$api.userCongressGroupRegistrationComplementInit().then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.regForm = {
              ...this.regForm,
              ...res.data
            }
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      },
      submitFn() {
        this.$api.userCongressGroupRegistrationComplementSubmit(this.regForm).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.isComplete = true
          }
        }).catch((err) => {
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
    padding: 100px 0 20px;
    background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
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
  }
</style>