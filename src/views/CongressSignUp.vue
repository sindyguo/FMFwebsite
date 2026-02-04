<template>
  <div class="congress-signup">
    <div class="vcontainer main-container">
      <span class="congress-signup-title">Attendee Registration</span>
      <span class="congress-signup-subtitle">{{congressInfo.title}} •  {{congressInfo.city}}, {{congressInfo.country}} • {{congressInfo.startTime?.slice(0,10)}} - {{congressInfo.endTime?.slice(0,10)}}</span>
      <el-steps :active="currentStep" align-center class="congress-signup-steps">
        <el-step title="Registration Type"></el-step>
        <el-step title="Registration Information"></el-step>
        <el-step title="Payment Information"></el-step>
      </el-steps>
      <div class="fill vcontainer congress-signup-content">
        <template v-if="currentStep === 1">
          <span class="sc-title">Select Registration Type</span>
          <el-radio-group v-model="individualForm.registrationType"
            class="fill hcontainer flex-between registrationtype-radio-group">
            <el-radio-button label="individual">
              <div class="vcontainer vcenter">
                <el-image :src="require('@/assets/img/icon/icon_individual.png')" class="registrationtype-img" />
                <span class="registrationtype-radio-title">Individual Registration</span>
                <span class="registrationtype-radio-tip">Register as a single attendee</span>
                <span class="registrationtype-radio-price">{{congressInfo.currency == "GBP" ? "£" : "€" || ""}}{{congressInfo.cost}}</span>
                <span class="registrationtype-radio-desc">Registration fee per person</span>
              </div>
            </el-radio-button>
            <el-radio-button label="group">
              <div class="vcontainer vcenter">
                <el-image :src="require('@/assets/img/icon/icon_group.png')" class="registrationtype-img" />
                <span class="registrationtype-radio-title">Group Registration</span>
                <span class="registrationtype-radio-tip">Register multiple registrationList</span>
                <span class="registrationtype-radio-price">{{congressInfo.currency == "GBP" ? "£" : "€" || ""}}{{congressInfo.cost}}</span>
                <span class="registrationtype-radio-desc">Registration fee per person</span>
              </div>
            </el-radio-button>
          </el-radio-group>
          <div class="hcontainer flex-end action-buttons">
            <el-button type="primary" @click="currentStep = 2">Continue</el-button>
          </div>
        </template>
        <div v-if="currentStep === 2">
          <span class="sc-title">Registration Information</span>
          <el-form
            v-if="isIndividual"
            :model="individualForm"
            :rules="individualRules"
            ref="individualFormRef"
            class="form-container"
            label-width="150px"
            label-position="top">
            <el-form-item label="Last name" prop="lastName">
              <el-input v-model="individualForm.lastName" disabled placeholder="James"></el-input>
            </el-form-item>
            <el-form-item label="First name" prop="firstName">
              <el-input v-model="individualForm.firstName" disabled placeholder="LeBron"></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="individualForm.email" disabled placeholder="xxxxxx@163.com"></el-input>
            </el-form-item>
            <el-form-item label="FMF ID" prop="fmfId">
              <el-input v-model="individualForm.fmfId" disabled placeholder="334242"></el-input>
            </el-form-item>
            <el-form-item label="Title" prop="title">
              <el-select v-model="individualForm.title" placeholder="Please Select">
                <el-option label="Professor" value="Professor"></el-option>
                <el-option label="Dr" value="Dr"></el-option>
                <el-option label="Ms" value="Ms"></el-option>
                <el-option label="Mr" value="Mr"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Clinical Specialty" prop="clinicalSpecialty">
              <el-select v-model="individualForm.clinicalSpecialty" placeholder="Please select" @change="onGradeChange">
                <el-option v-for="item in clinicalSpecialty" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="Institution" prop="institution">
              <el-select v-model="individualForm.institution" placeholder="Please Select">
                <el-option label="Hospital" value="Hospital"></el-option>
                <el-option label="University" value="University"></el-option>
                <el-option label="Pharmaceutical company" value="Pharmaceutical company"></el-option>
                <el-option label="Medical device company" value="Medical device company"></el-option>
                <el-option label="Other" value="Other"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Other Clinical Specialties" prop="gradeOther" v-show="individualForm.clinicalSpecialty =='Other'">
              <el-input v-model="individualForm.gradeOther"  placeholder="Please enter" clearable></el-input>
            </el-form-item>
            
            <el-form-item label="Institution Name" prop="institutionName">
              <el-input v-model="individualForm.institutionName" placeholder="Please Enter"></el-input>
            </el-form-item>
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="individualForm.phone" placeholder="Please Enter" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="Address" prop="address">
              <el-input v-model="individualForm.address" placeholder="Please Enter"></el-input>
            </el-form-item>
            <el-form-item label="Town/City" prop="townCity">
              <el-input v-model="individualForm.townCity" placeholder="Please enter"></el-input>
            </el-form-item>
            <el-form-item label="Country" prop="country">
              <el-select v-model="individualForm.country" placeholder="Please Select" filterable>
                <el-option v-for="(item, index) in companyList" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Postcode" prop="postCode">
              <el-input v-model="individualForm.postCode" placeholder="Please enter"></el-input>
            </el-form-item>
            <el-form-item label="Disclosure Status" prop="disclosureStatus">
              <div class="vcontainer">
                <el-radio-group v-model="individualForm.disclosureStatus">
                  <el-radio label="true">Agree</el-radio>
                  <el-radio label="false">Not Agree</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="Visa Document Required?" prop="visaDocument">
              <div class="vcontainer">
                <el-radio-group v-model="individualForm.visaDocument">
                  <el-radio label="1">Require</el-radio>
                  <el-radio label="0">Not Required</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <div class="tip">Tick "agree" if you are happy for us to share your name and email address with exhibitors.</div>
            <template v-if="individualForm.visaDocument == 1">
              <el-form-item label="Date Of Birth" prop="dateOfBirth"
                :rules="{ required: true, messge: 'Please Select Date Of Birth', trigger: 'change'}">
                <el-date-picker
                  v-model="individualForm.dateOfBirth"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Passport Number" prop="passportNumber"
                :rules="{ required: true, messge: 'Please Select Passport Number', trigger: 'change'}">
                <el-input v-model="individualForm.passportNumber" placeholder="Please enter"></el-input>
              </el-form-item>
              <el-form-item label="Date Of Issue" prop="dateOfIssue"
                :rules="{ required: true, messge: 'Please Select Date Of Issue', trigger: 'change'}">
                <el-date-picker
                  v-model="individualForm.dateOfIssue"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Country Of Issue" prop="countryOfIssue"
                :rules="{ required: true, messge: 'Please Select Country Of Issue', trigger: 'change'}">
                <el-select v-model="individualForm.countryOfIssue" placeholder="Please Select" filterable>
                  <el-option v-for="(item, index) in companyList" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <div class="hcontainer flex-between action-buttons">
              <el-button @click="currentStep = 1">Back</el-button>
              <el-button type="primary" @click="individualFormValidate">Continue</el-button>
            </div>
          </el-form>
          <el-form
            v-else
            :model="groupForm"
            :rules="groupRules"
            class="form-container"
            ref="groupFormRef"
            label-width="150px"
            label-position="top">
            <div class="vcontainer group-container">
              <span class="group-title">Company Information</span>
              <div class="hcontainer" style="gap: 30px;">
                <el-form-item label="Company/Institution Name" prop="companyName">
                  <el-input v-model="groupForm.companyName" placeholder="Please Enter"></el-input>
                </el-form-item>
                <el-form-item label="Contact Number" prop="contactNumber">
                  <el-input v-model="groupForm.contactNumber" placeholder="Please Enter"></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="Mode of Payment" prop="modeOfPayment" style="width: 100%">
              <el-radio-group v-model="groupForm.modeOfPayment"
                class="fill hcontainer flex-between modeOfPayment-radio-group">
                <el-radio-button label="online">
                  <div class="hcontainer">
                    <el-image :src="require('@/assets/img/icon/icon_online.png')" class="radio-icon-online" />
                    <div class="fill vcontainer">
                      <span class="radio-label">Online Payment</span>
                      <span class="radio-desc">Complete The Payment Online After Adding registrationList</span>
                    </div>
                  </div>
                </el-radio-button>
                <el-radio-button label="bankTransfer">
                  <div class="hcontainer">
                    <el-image :src="require('@/assets/img/icon/icon_bank_transfer.png')" class="radio-icon-bank" />
                    <div class="fill vcontainer">
                      <span class="radio-label">Bank Transfer</span>
                      <span class="radio-desc">Complete Registration After Adding registrationList</span>
                    </div>
                  </div>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="vcontainer w-full">
              <div class="hcontainer vcenter flex-between mb-5">
                <span>registrationList Information</span>
                <el-button type="text" icon="el-icon-plus" @click="addAttendee">Add Attendee</el-button>
              </div>
              <div class="vcontainer group-container registrationList-container">
                <div v-for="(attendee, index) in groupForm.registrationList"
                  :key="index"
                  class="vcontainer attendee-item">
                  <div class="hcontainer flex-between vcenter">
                    <span class="attendee-index">Attendee {{ index + 1 }}</span>
                    <el-button v-if="index > 0" size="small" type="danger" icon="el-icon-delete" @click="removeAttendee(index)"></el-button>
                  </div>
                  <div class="hcontainer" style="gap: 30px;">
                    <el-form-item label="Last name" :prop="'registrationList.' + index + '.lastName'" :rules="attendeeRules.lastName">
                      <el-input v-model="attendee.lastName" placeholder="Please Enter"></el-input>
                    </el-form-item>
                    <el-form-item label="First name" :prop="'registrationList.' + index + '.firstName'" :rules="attendeeRules.firstName">
                      <el-input v-model="attendee.firstName" placeholder="Please Enter"></el-input>
                    </el-form-item>
                  </div>
                  <el-form-item label="Email" :prop="'registrationList.' + index + '.email'" :rules="attendeeRules.email">
                    <el-input v-model="attendee.email" placeholder="Please Enter"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="hcontainer vcenter flex-between action-buttons">
              <el-button @click="currentStep = 1">Back</el-button>
              <el-button type="primary" @click="groupFormValidate">Continue</el-button>
            </div>
          </el-form>
        </div>
        <div v-else-if="currentStep === 3" class="fill vcontainer completion">
          <template v-if="isComplete">
            <div class="fill vcontainer hcenter vcenter">
              <el-image :src="require('@/assets/img/img_succ2.png')" class="comletion-img" />
              <span v-if="!isIndividual" class="completion-tip">
                {{ groupForm.modeOfPayment == 'online' ? 'Your registration is complete' : 'Your registration is submitted. Completion is pending payment; for offline payment, please get in touch with the administrator.'}}
              </span>
              <span v-else class="completion-tip">Your registration is complete</span>
            </div>
            <div class="hcontainer hcenter vcenter action-buttons">
              <el-button type="primary" @click="goToOwnPage">Own Page</el-button>
            </div>
          </template>
          <template v-else>
            <span class="sc-title">Payment Information</span>
            <div class="hcontainer vcenter flex-between pay-container">
              <div class="numlist">
                <div class="hcontainer vcenter">
                  <span style="color: #656B6F;margin-right: 56px;width:60px;">Cost</span>
                  <span>{{congressInfo.currency == "GBP" ? "£" : "€" || ""}}{{congressInfo.cost}} x {{pepleCount}}</span>
                </div>
                <span style="font-size: 16px;">{{congressInfo.currency == "GBP" ? "£" : "€" || ""}}{{Number(congressInfo.cost)*Number(pepleCount)}}</span>
              </div>

              <div class="numlist" v-if="payForm.payType=='credit'">
                <div class="hcontainer vcenter">
                  <span style="color: #656B6F;margin-right: 56px;width:60px;">Handling</span>
                  <span>{{congressInfo.currency == "GBP" ? "£" : "€" || ""}}{{congressInfo.handling}}</span>
                </div>
                <span style="font-size: 16px;">{{congressInfo.currency == "GBP" ? "£" : "€" || ""}}{{congressInfo.handling}}</span>
              </div>
            </div>
            
            <div class="hcontainer vcenter flex-end">
              <span style="font-weight:normal;font-size: 16px;color: #656B6F;">Total Registration Fee  {{congressInfo.currency == "GBP" ? "£" : "€" || ""}}</span>
              <span class="total-fee">{{totalAmount}}</span>
            </div>
            <el-form
              :model="payForm"
              :rules="payRules"
              ref="payFormRef"
              class="form-container"
              label-width="150px"
              label-position="top">
              <el-form-item label="Payment" prop="payType" style="width: 100%">
                <el-radio-group v-model="payForm.payType" class="modeOfPayment-radio-group">
                  <el-radio-button label="credit">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_credit.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Credit Card</span>
                        <span class="radio-desc">An Additional Fee Is Required For Credit Card Payments</span>
                      </div>
                    </div>
                  </el-radio-button>
                  <el-radio-button label="debit">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_debit.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Debit Card</span>
                        <span class="radio-desc">No Fee Is Required For Debit Card Payments</span>
                      </div>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Documentation" prop="requestType" style="width: 100%">
                <el-radio-group v-model="payForm.requestType" class="modeOfPayment-radio-group">
                  <el-radio-button label="receipt">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_receipt.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Request Receipt</span>
                        <span class="radio-desc">No Additional Information Needs To Be Provided</span>
                      </div>
                    </div>
                  </el-radio-button>
                  <el-radio-button label="invoice">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_invoice.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Request Invoice</span>
                        <span class="radio-desc">Invoicing Information Must Be Supplied</span>
                      </div>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <!-- Conditionally render invoice fields only when requestType is 'invoice' -->
              <template v-if="payForm.requestType === 'invoice'"> 
                <el-form-item label="Company Name" prop="companyName"
                  :rules="{ required: true, message: 'Please enter company name', trigger: 'blur' }">
                  <el-input v-model="payForm.companyName" placeholder="Please Enter"></el-input>
                </el-form-item>
                <el-form-item label="VAT" prop="vat"
                  :rules="{ required: false, message: 'Please enter vat', trigger: 'blur' }">
                  <el-input v-model="payForm.vat" placeholder="Please Enter"></el-input>
                </el-form-item>
                <el-form-item label="Address" prop="address"
                  :rules="{ required: true, message: 'Please enter address', trigger: 'blur' }">
                  <el-input v-model="payForm.address" placeholder="Please Enter"></el-input>
                </el-form-item>
                <el-form-item label="Town/City" prop="townCity"
                  :rules="{ required: true, message: 'Please enter town/city', trigger: 'blur' }">
                  <el-input v-model="payForm.townCity" placeholder="Please Enter"></el-input>
                </el-form-item>
                <el-form-item label="Postcode" prop="postcode2"
                  :rules="{ required: false, message: 'Please enter postcode', trigger: 'blur' }">
                  <el-input v-model="payForm.postcode2" placeholder="Please Enter"></el-input>
                </el-form-item>
                <el-form-item label="Country" prop="country"
                  :rules="{ required: true, message: 'Please enter country', trigger: 'blur' }">
                  <el-select v-model="payForm.country" placeholder="Please Select" filterable>
                    <el-option v-for="(item, index) in companyList" :label="item.label" :value="item.value" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <div class="hcontainer vcenter flex-between action-buttons">
                <el-button @click="currentStep = 2">Back</el-button>
                <el-button type="primary" @click="payClick">Pay</el-button>
              </div>
            </el-form>
          </template>
        </div>
      </div>
    </div>
    <!-- <PaymentDialog
      :visible="showPaymentDialog"
      :paymentToken="paymentToken"
      @close="showPaymentDialog = false"
      @success="paymentSuccess" /> -->
  </div>
</template>

<script>
  // import PaymentDialog from '@/components/PaymentDialog.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'CongressSignupPage',
    components: {
      // PaymentDialog
    },
    computed: {
      isIndividual() {
        return this.individualForm.registrationType === 'individual'
      },
      totalAmount() { 
        if(this.payForm.payType == 'debit'){
          return Number(this.congressInfo.cost )* this.pepleCount
        }else{
          return Number(Number(this.congressInfo.cost)* this.pepleCount + Number(this.congressInfo.handling))
        }
      },
      pepleCount() { 
        if (this.individualForm.registrationType === 'group') {
          return this.groupForm.registrationList.length
        } else {
          return 1
        }
      },
    },
    data() {
      return {
        currentStep: 1,
        individualForm: {
          registrationType: 'individual',
          lastName: '',
          firstName: '',
          email: '',
          fmfId: '',
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
          disclosureStatus: true,
          visaDocument: '1',
          dateOfBirth: '',
          passportNumber: '',
          dateOfIssue: '',
          countryOfIssue: ''
        },
        individualRules: {
          lastName: [{ required: false, message: 'Please enter last name', trigger: 'blur' }],
          firstName: [{ required: false, message: 'Please enter first name', trigger: 'blur' }],
          email: [{ required: true, message: 'Please enter email', trigger: 'blur' }],
          fmfId: [{ required: false, message: 'Please enter FMF ID', trigger: 'blur' }],
          title: [{ required: true, message: 'Please select title', trigger: 'change' }],
          clinicalSpecialty: [{ required: true, message: 'Please select clinical specialty', trigger: 'change' }],
          gradeOther: [{ required: false, message: 'Please enter other clinical specialty', trigger: 'change' }],
          institution: [{ required: true, message: 'Please select institution', trigger: 'change' }],
          institutionName: [{ required: true, message: 'Please enter institution name', trigger: 'blur' }],
          phone: [{ required: true, message: 'Please enter phone', trigger: 'blur' }],
          address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
          townCity: [{ required: true, message: 'Please enter town/city', trigger: 'blur' }],
          country: [{ required: true, message: 'Please select country', trigger: 'change' }],
          postcode: [{ required: false, message: 'Please enter postcode', trigger: 'blur' }],
          disclosureStatus: [{ required: true, message: 'Please select disclosure status', trigger: 'change' }],
          visaDocument: [{ required: true, messge: 'Please Select Visa Document Required', trigger: 'change'}]
        },
        groupForm: {
          companyName: '',
          contactNumber: '',
          modeOfPayment: 'online',
          registrationList: [
            { lastName: '', firstName: '', email: '' }
          ],
        },
        groupRules: {
          companyName: [{ required: true, message: 'Please enter company/institution name', trigger: 'blur' }],
          contactNumber: [{ required: true, message: 'Please enter contact number', trigger: 'blur' }],
          modeOfPayment: [{ required: true, message: 'Please select mode of payment', trigger: 'change' }]
        },
        attendeeRules: {
          lastName: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
          firstName: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
          email: [
            { required: true, message: 'Please enter email', trigger: 'blur' },
            { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
          ]
        },
        payForm: {
          payType: 'debit',
          requestType: 'invoice',
          companyName: '',
          vat: '',
          address: '',
          postcode2: '',
          townCity: '',
          country: '',
          handling: 1, 
          totalAmount: 0,
          paymentToken: '',
        },
        payRules: { 
          payType: [
            { required: true, message: 'Please select a payment method', trigger: 'change' }
          ]
        },
        isComplete: false,
        congressInfo: {},
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
        // paymentToken: '',
        // showPaymentDialog: false,
        companyList: []
      }
    },
    watch: {
      'individualForm.visaDocument': {
        handler() {
          this.individualForm.dateOfBirth = "";
          this.individualForm.passportNumber = "";
          this.individualForm.dateOfIssue = "";
          this.individualForm.countryOfIssue = "";
        }
      }
    },
    methods: {
      ...mapActions('user', ['changeActiveId']),
      getCompanyList() {
        this.$api.getCountries().then((res) => {
          this.companyList = res.data || [];
        });
      },
      paymentSuccess() {
        // PaymentDialog disabled.
        // this.showPaymentDialog = false
        // this.isComplete = true
      },
      onGradeChange(value) {
        // Clear the other field when grade is changed to something other than 'Other'
        if (value !== 'Other') {
          this.individualForm.gradeOther = '';
        }
      },
      individualFormValidate() {
        this.$refs.individualFormRef && this.$refs.individualFormRef.validate(async (valid) => {
          if (valid) {
            const existEmails = await this.isEmailRegistered([this.individualForm.email])
            if (Array.isArray(existEmails) && existEmails.length > 0) {
              this.$message.error(`Duplicate Registration. The Email ${existEmails.join(',')} is already registered.`)
              return
            }
            this.isComplete = false
            this.currentStep = 3
          } else {
            console.log('Validation failed')
          }
        })
      },
      async isEmailRegistered(emails) {
        const params = {
          emails: emails.join(','),
          type: 'registration'
        }
        const res = await this.$api.userCongressVerifyEmail(params).catch(err => err)
        if ((res.code === 200 || res.code === 0) && !res.data) {
          return null
        }
        return res?.data || null
      },
      addAttendee() {
        this.groupForm.registrationList.push({ lastName: '', firstName: '', email: '' })
      },
      removeAttendee(index) {
        this.groupForm.registrationList.splice(index, 1)
      },
      groupFormValidate() {
        this.$refs.groupFormRef && this.$refs.groupFormRef.validate(async (valid) => {
          if (valid) {
            if (this.groupForm.registrationList.length === 0) {
              this.$message.error('At least one attendee is required.')
              return
            }

            let emails = []
            for (let i = 0; i < this.groupForm.registrationList.length; i++) {
              const attendee = this.groupForm.registrationList[i]
              if (!attendee.lastName || !attendee.firstName || !attendee.email) {
                this.$message.error(`Attendee ${i + 1} has incomplete information.`)
                return
              }
              emails.push(attendee.email)
            }
            const existEmails = await this.isEmailRegistered(emails)
            if (Array.isArray(existEmails) && existEmails.length > 0) {
              this.$message.error(`Duplicate Registration. The Email ${existEmails.join(',')} is already registered.`)
              return
            }

            this.isComplete = this.groupForm.modeOfPayment === 'bankTransfer'
            this.currentStep = 3
          } else {
            console.log('Validation failed')
          }
        })
      },
      payClick() {
        // todo: test
        // this.paymentToken = 'QLyXzOWRFPXZG-7ojwH45JM5CvzerBk3MsIjlMcl3UoQTK0_LbRN1yRU8Zl5EdMs3hefBu0h7gI8yUaoOeA1KqmSQO5oCPYpj-woianzYyGdM3zaP-780jEIrzLytaRFlB1FZ-aM81c5EMnZlLA5b0lR-FN0'
        // this.showPaymentDialog = true
        this.$refs.payFormRef && this.$refs.payFormRef.validate((valid) => {
          if (valid) {
            this.payForm.totalAmount = this.totalAmount
            const data = {
              ...this.payForm,
              ...this.individualForm,
              ...this.groupForm,
              ...this.submitterForm,
              ...this.abstractForm,
              congressId: this.$route.query.id,
            }
            this.userCongressRegistrationSubmitFn(data)
          } else {
            console.log('Payment validation failed')
          }
        })
      },
      goToOwnPage() {
        this.changeActiveId('/mine')
        this.$router.push('/mine')
      },
      userCongressRegistrationInitFn() {
        this.$api.userCongressRegistrationInit({
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.individualForm = {
              lastName: res.data.lastname,
              firstName: res.data.nickname,
              email: res.data.email,
              fmfId: res.data.fmfId,
              phone: res.data.telephone,
              townCity: res.data.city,
              postCode: res.data.postCode,
              country: res.data.country,
              title: res.data.title,
              grade: res.data.grade,
              gradeOther: res.data.gradeOther,
              institution: res.data.institution,
              registrationType: 'individual',
              visaDocument: '1',
              dateOfBirth: res.data.birthday,
              passportNumber: '',
              dateOfIssue: '',
              countryOfIssue: '',
            }
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      },
      userCongressRegistrationSubmitFn(data) {
        if(this.isIndividual) {
          this.$api.userCongressRegistrationSubmit(data).then(res => {
            if ((res.code === 200 || res.code === 0) && res.data) {
              if(data.modeOfPayment == 'online') {
                this.createPayTokenFn(res.data.totalAmount, res.data.currency, res.data.orderId)
              } else {
                this.isComplete = true
              }
            }
          }).catch((err) => {
            console.log('err:', err)
          })
        } else {
           this.$api.userCongressGroupRegistrationSubmit(data).then(res => { 
            if ((res.code === 200 || res.code === 0) && res.data) {
              if(data.modeOfPayment == 'online') {
                this.createPayTokenFn(res.data.totalAmount, res.data.currency,res.data.orderId)
              }else{
                this.isComplete = true
              }
            }
          }).catch((err) => {
            console.log('err:', err)
          })
        }
      },
      createPayTokenFn(amount, currency, orderId, transactionType = 'SALE') {
        this.$api.createPayToken({
          amount: amount,
          currency: currency,
          orderId: orderId,
          transactionType: transactionType
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            // this.paymentToken = res.data.tokenId
            // this.showPaymentDialog = true
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      },
      websiteCongressGetFn() {
        this.$api.websiteCongressGet({
          id: this.$route.query.id
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.congressInfo = res.data
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      }
    },
    created() {
      this.getCompanyList();
      this.websiteCongressGetFn()
      this.userCongressRegistrationInitFn()
    }
  }
</script>

<style lang="scss" scoped>
  .congress-signup {
    min-height: calc(100% - 200px);
    padding: 100px 0 20px;
    background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
    .congress-signup-title {
      font-weight: bold;
      font-size: 38px;
      color: #0E3045;
      margin-bottom: 10px;
      text-align: center;
    }
    .congress-signup-subtitle {
      font-size: 16px;
      color: #656B6F;
      text-align: center;
    }
    .congress-signup-steps {
      margin: 40px 0 24px;
    }
    .congress-signup-content {
      font-weight: bold;
      font-size: 18px;
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
        margin-bottom: 20px;
      }
      .sc-subtitle {
        font-size: 16px;
        color: #0E3045;
      }
      .form-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        ::v-deep .el-form-item {
          width: 544px;
          margin-bottom: 0;
          .el-form-item__label {
            padding-bottom: 0;
            font-weight: bold;
            font-size: 18px;
            color: #0E3045;
          }
          .el-input, .el-select {
            width: 100%;
          }
        }
        .tip {
          font-weight: normal;
          font-size: 18px;
          color: #8A9094;
        }
        .submit-btn {
          font-weight: bold;
          font-size: 18px;
          color: #FFFFFF;
          background-color: #036FC0;
          border-radius: 8px;
        }
        .group-container {
          width: 100%;
          background-color: #F5F5F5;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          .group-title {
            font-weight: bold;
            font-size: 18px;
            color: #0E3045;
          }
        }
        .registrationList-container {
          padding: 0 !important;
          margin-top: 0 !important;
          .attendee-item {
            background-color: #f5f5f5;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            .attendee-index {
              font-weight: bold;
              color: #0e3045;
            }
            .el-form-item__label {
              font-weight: bold;
              color: #0e3045;
            }
          }
          ::v-deep .el-form-item {
            width: 520px !important;
          }
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
      padding: 30px 0;
      font-size: 16px;
      color: #23272A;
      .comletion-img {
        width: 128px;
        height: 90px;
        object-fit: cover;
        margin-bottom: 30px;
      }
      .completion-tip {
        width: 500px;
        margin: 0 auto 60px;
      }
      .pay-container {
        min-height: 64px;
        font-weight: bold;
        font-size: 18px;
        color: #0E3045;
        padding: 10px 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        background-color: #EFF5F8;
        display: block;
        .numlist{
          display: flex;
          justify-content: space-between;
          line-height: 32px;
        }
      }
      .total-fee {
        margin-left: 5px;
        font-weight: bold;
        font-size: 16px;
        color: #D90202;
      }
    }
  }
</style>

<style lang="scss">
  .congress-signup-steps {
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
  .registrationtype-radio-group {
    width: 100%;
    display: flex;
    gap: 30px;
    cursor: pointer;
    .el-radio-button {
      width: 100%;
      height: 400px;
      .el-radio-button__inner {
        width: 100%;
        padding: 40px 0 50px; 
        text-align: left;
        border-radius: 16px;
        border-width: 2px;
        border-left: 2px solid #DCDFE6;
        box-shadow: none;
        .registrationtype-radio-img {
          width: 80px;
          height: 80px;
        }
        .registrationtype-radio-title {
          font-weight: bold;
          font-size: 24px;
          color: #0E3045;
          margin: 16px auto 11px;
        }
        .registrationtype-radio-tip {
          font-size: 18px;
          color: #8A9094;
        }
        .registrationtype-radio-price {
          font-weight: bold;
          font-size: 40px;
          color: #036fc0;
          margin: 30px auto 7px;
        }
        .registrationtype-radio-desc {
          font-size: 18px;
          color: #23272A;
        }
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        border-color: #036FC0;
        background-color: #F4FAFF;
      }
    }
  }
  .modeOfPayment-radio-group {
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
          font-size: 16px;
          font-weight: bold;
          color: #656B6F;
          margin-bottom: 8px;
        }
        .radio-desc {
          font-size: 16px;
          color: #8A9094;
        }
        .radio-icon-online {
          width: 30px;
          height: 22px;
          margin-right: 5px;
        }
        .radio-icon-bank {
          width: 26px;
          height: 26px;
          margin-right: 5px;
        }
        .radio-icon {
          width: 28px;
          height: 22px;
          margin-right: 5px;
        }
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        border-color: #a6d9ff;
        background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
      }
    }
  }
</style>
