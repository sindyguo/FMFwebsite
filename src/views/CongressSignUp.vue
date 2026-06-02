<template>
  <div class="congress-signup" v-loading="loading">
    <div class="vcontainer main-container">
      <span class="congress-signup-title">Attendee Registration</span>
       <!-- • {{congressInfo.startTime?.slice(0,10)}} - {{congressInfo.endTime?.slice(0,10)}} -->
      <span class="congress-signup-subtitle" v-html="congressInfo.title +', '+  congressInfo.city+', '+ congressInfo.country"></span>
      <el-steps :active="currentStep" align-center class="congress-signup-steps">
        <el-step title="Registration type"></el-step>
        <el-step title="Registration information"></el-step>
        <el-step title="Payment information"></el-step>
      </el-steps>
      <div class="fill vcontainer congress-signup-content">
        <template v-if="currentStep === 1">
          <span class="sc-title">Select registration type</span>
          <el-radio-group v-model="individualForm.registrationType"
            class="fill hcontainer flex-between registrationtype-radio-group">
            <el-radio-button label="IndividualRegistration">
              <div class="vcontainer vcenter">
                <el-image :src="require('@/assets/img/icon/icon_individual.png')" class="registrationtype-img" />
                <span class="registrationtype-radio-title">Individual Registration</span>
                <span class="registrationtype-radio-tip">Register as a single attendee</span>
                <span class="registrationtype-radio-price">{{currency == "GBP" ? "£" : "€" || ""}}{{minFeeAmount}}</span>
                <span class="registrationtype-radio-desc">Registration fee per person</span>
              </div>
            </el-radio-button>
            <el-radio-button label="GroupRegistration">
              <div class="vcontainer vcenter">
                <el-image :src="require('@/assets/img/icon/icon_group.png')" class="registrationtype-img" />
                <span class="registrationtype-radio-title">Company Registration</span>
                <span class="registrationtype-radio-tip">Register one or multiple attendees</span>
                <span class="registrationtype-radio-price">{{currency == "GBP" ? "£" : "€" || ""}}{{minFeeAmount}}</span>
                <span class="registrationtype-radio-desc">Registration fee per person</span>
              </div>
            </el-radio-button>
          </el-radio-group>
          <div class="hcontainer flex-end action-buttons">
            <el-button type="primary" @click="handleStep1">Continue</el-button>
          </div>
        </template>
        <div v-if="currentStep === 2">
          <span class="sc-title">Registration information</span>
          <el-form
            v-if="isIndividual"
            :model="individualForm"
            :rules="individualRules"
            ref="individualFormRef"
            class="form-container"
            label-width="150px"
            label-position="top">
            <el-form-item label="First name" prop="firstName">
              <el-input v-model="individualForm.firstName" disabled placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Last name" prop="lastName">
              <el-input v-model="individualForm.lastName" disabled placeholder=""></el-input>
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
            <el-form-item label="Clinical specialty" prop="clinicalSpecialty">
              <el-select v-model="individualForm.clinicalSpecialty" placeholder="Please select" @change="onGradeChange">
                <el-option v-for="item in clinicalSpecialty" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="Institution" prop="institution">
              <el-select v-model="individualForm.institution" placeholder="Please Select">
                <el-option label="Hospital" value="Hospital"></el-option>
                
                <el-option label="University" value="University"></el-option>
                <el-option label="Private practice" value="Private practice"></el-option>
                <el-option label="Pharmaceutical company" value="Pharmaceutical company"></el-option>
                <el-option label="Medical device company" value="Medical device company"></el-option>
                <el-option label="Other" value="Other"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="individualForm.clinicalSpecialty =='Other'" label="Other Clinical Specialties" prop="gradeOther"
              :rules="{ required: true, message: 'Please enter other Clinical specialty', trigger: 'blur' }">
              <el-input v-model="individualForm.gradeOther"  placeholder="Please enter" clearable></el-input>
            </el-form-item>
            
            <el-form-item label="Institution name" prop="institutionName">
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
            <el-form-item label="Postcode" prop="postcode">
              <el-input v-model="individualForm.postcode" placeholder="Please enter"></el-input>
            </el-form-item>
            <el-form-item label="Alternative email" prop="emailAlternative">
              <el-input v-model="individualForm.emailAlternative" placeholder="Please enter"></el-input>
            </el-form-item>
            <el-form-item label="Do you agree to share your name and email address with sponsors?" prop="disclosureStatus" style="width: 100%;">
              <el-radio-group v-model="individualForm.disclosureStatus">
                <el-radio label="Agree">Agree</el-radio>
                <el-radio label="Not agree">Not agree</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <div class="tip">Tick "agree" if you are happy for us to share your name and email address with exhibitors.</div> -->
            <el-form-item label="Visa document required?" prop="visaDocument" style="width: 100%;">
              <div class="vcontainer">
                <el-radio-group v-model="individualForm.visaDocument">
                  <el-radio label="1">Required</el-radio>
                  <el-radio label="0">Not required</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <template v-if="individualForm.visaDocument == 1">
              <el-form-item label="Date of birth" prop="dateOfBirth"
                :rules="{ required: true, messge: 'Please Select Date of birth', trigger: 'change'}">
                <el-date-picker
                  v-model="individualForm.dateOfBirth"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Passport number" prop="passportNumber"
                :rules="{ required: true, messge: 'Please Select Passport number', trigger: 'change'}">
                <el-input v-model="individualForm.passportNumber" placeholder="Please enter"></el-input>
              </el-form-item>
              <el-form-item label="Passport date of issue" prop="dateOfIssue"
                :rules="{ required: true, messge: 'Please Select Passport date of issue', trigger: 'change'}">
                <el-date-picker
                  v-model="individualForm.dateOfIssue"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Passport country of issue" prop="countryOfIssue"
                :rules="{ required: true, messge: 'Please Select Passport country of issue', trigger: 'change'}">
                <el-select v-model="individualForm.countryOfIssue" placeholder="Please Select" filterable>
                  <el-option v-for="(item, index) in companyList" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <div class="hcontainer flex-between action-buttons">
              <el-button @click="currentStep = 1" :style="{visibility: congressInfo.congressType == 'Supported Courses' ? 'hidden' : 'visible'}">Back</el-button>
              <el-button type="primary" @click="individualFormValidate">Continue</el-button>
            </div>
          </el-form>
          <el-form
            v-else
            :model="groupForm"
            :rules="groupRules"
            class="form-container form-container--group-step2"
            ref="groupFormRef"
            label-width="150px"
            label-position="top">
            <!-- <div class="vcontainer group-container">
              <span class="group-title">Company information</span>
              <div class="hcontainer" style="gap: 30px;">
                <el-form-item label="Company/Institution name" prop="companyName">
                  <el-input v-model="groupForm.companyName" placeholder="Please Enter"></el-input>
                </el-form-item>
                <el-form-item label="Contact number" prop="contactNumber">
                  <el-input v-model="groupForm.contactNumber" placeholder="Please Enter"></el-input>
                </el-form-item>
              </div>
            </div> -->
            <el-form-item label="Mode of payment" prop="modeOfPayment" style="width: 100%">
              <el-radio-group v-model="groupForm.modeOfPayment"
                class="fill hcontainer flex-between modeOfPayment-radio-group">
                <el-radio-button label="online">
                  <div class="hcontainer">
                    <el-image :src="require('@/assets/img/icon/icon_online.png')" class="radio-icon-online" />
                    <div class="fill vcontainer">
                      <span class="radio-label">Online payment</span>
                      <span class="radio-desc">Complete the payment online after adding registration list</span>
                    </div>
                  </div>
                </el-radio-button>
                <el-radio-button label="bankTransfer">
                  <div class="hcontainer">
                    <el-image :src="require('@/assets/img/icon/icon_bank_transfer.png')" class="radio-icon-bank" />
                    <div class="fill vcontainer">
                      <span class="radio-label">Bank transfer</span>
                      <span class="radio-desc">Complete registration after adding registration list</span>
                    </div>
                  </div>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <div v-if="groupForm.modeOfPayment == 'bankTransfer'" class="group-billing-grid">
              <el-form-item label="Company name" prop="companyName2">
                <el-input v-model="groupForm.companyName2" placeholder="Please Enter"></el-input>
              </el-form-item>
              <el-form-item label="VAT" prop="vat">
                <el-input v-model="groupForm.vat" placeholder="Please Enter"></el-input>
              </el-form-item>
              <el-form-item label="Address" prop="address2">
                <el-input v-model="groupForm.address2" placeholder="Please Enter"></el-input>
              </el-form-item>
              <el-form-item label="Town/City" prop="townCity2">
                <el-input v-model="groupForm.townCity2" placeholder="Please Enter"></el-input>
              </el-form-item>
              <el-form-item label="Postcode" prop="postcode2">
                <el-input v-model="groupForm.postcode2" placeholder="Please Enter"></el-input>
              </el-form-item>
              <el-form-item label="Country" prop="country2">
                <el-select v-model="groupForm.country2" placeholder="Please Select" filterable>
                  <el-option v-for="(item, index) in companyList" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Phone" prop="phone2">
                <el-input v-model="groupForm.phone2" placeholder="Please Enter"></el-input>
              </el-form-item>
            </div>
            




            <div class="vcontainer w-full">
              <div class="hcontainer vcenter flex-between mb-5">
                <span>Registration list Information</span>
                <el-button type="primary" @click="addAttendee">Add attendee</el-button>
              </div>
              <div class="vcontainer group-container registrationList-container">
                <div v-for="(attendee, index) in groupForm.registrationList"
                  :key="index"
                  class="vcontainer attendee-item">
                  <div class="hcontainer flex-between vcenter">
                    <span class="attendee-index">Attendee {{ index + 1 }}</span>
                    <el-button v-if="index > 0" size="small" type="danger" icon="el-icon-delete" @click="removeAttendee(index)"></el-button>
                  </div>
                  <div class="hcontainer attendee-name-row" style="gap: 30px;">
                    <el-form-item label="First name" :prop="'registrationList.' + index + '.firstName'" :rules="attendeeRules.firstName">
                      <el-input v-model="attendee.firstName" placeholder="Please Enter"></el-input>
                    </el-form-item>
                    <el-form-item label="Last name" :prop="'registrationList.' + index + '.lastName'" :rules="attendeeRules.lastName">
                      <el-input v-model="attendee.lastName" placeholder="Please Enter"></el-input>
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
                {{ groupForm.modeOfPayment == 'online' ? 'Your registration is complete' : 'Your registration has been submitted. Please complete your registration by bank transfer and email your payment confirmation to education@fetalmedicine.org'}}
              </span>
              <span v-else class="completion-tip">Your registration is complete</span>
            </div>
            <div class="hcontainer hcenter vcenter action-buttons">
              <el-button type="primary" @click="goToOwnPage">Own Page</el-button>
            </div>
          </template>
          <template v-else>
            <el-form
              :model="payForm"
              :rules="payRules"
              ref="payFormRef"
              class="form-container form-container--payment"
              label-width="150px"
              label-position="top">
              <el-row style="width: 100%;">
                <el-col :span="24" :offset="0">
                  <el-form-item label=" " prop="" v-for="(item, index) in typeOfFeeList"  :key="index" style="width: 100%;">
                    <div class="hcontainer" style="display: flex;justify-content: space-between;border-bottom: 1px solid #ccc">
                      <span class="sc-title">{{ item.feeType }}</span>
                      <span class="sc-title">{{currency == "GBP" ? "£" : "€" || ""}} {{ congressInfo.typeOfFeeList[index].id? congressInfo.typeOfFeeList[index]['feeAmount']:0 }} × {{ pepleCount }}</span>
                    </div>
                    <div class="hcontainer vcenter pay-container">
                      <div class="modeOfPayment-radio-group fee-options-row">
                        <div
                          v-for="obj in item.detailList"
                          :class="['fee-option-card', { active: congressInfo.typeOfFeeList[index].id == obj.id }]"
                          :key="obj.id"
                          @click="selectFee(item, obj, index)">
                          <div class="numlist" style="width: 100%;">
                            <div style="color: #656B6F;text-align: center;padding: 6px 0;font-size: 20px;">{{obj.feeName}}</div>
                            <div style="text-align: center;font-size: 24px;color: #186ba2;font-weight: bold;">{{item.currency == "GBP" ? "£" : "€" || ""}} {{obj.feeAmount}}</div>
                          </div>
                          <img v-if="congressInfo.typeOfFeeList[index].id == obj.id" src="@/assets/img/checked.png" width="16px" style="position: absolute; top: 12px;right: 12px;" alt="">
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              
              
              <el-row style="width: 100%;">
                <el-col :span="24" :offset="0">
                  <div v-if="payForm.payType=='credit'" style="display: flex;justify-content: space-between;border-bottom: 1px solid #ccc">
                    <span class="sc-title">Handling</span>
                    <span class="sc-title">{{currency == "GBP" ? "£" : "€" || ""}} {{ congressInfo.handling }} </span>
                  </div>
                  <div class="hcontainer vcenter flex-end" style="padding: 12px 0;">
                    <span style="font-weight:normal;font-size: 16px;color: #186ba2;">Total registration fee  <span style="font-size: 24px;color: #186ba2;margin-left: 12px">{{currency == "GBP" ? "£" : "€" || ""}}</span></span>
                    <span class="total-fee">{{totalAmount}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="showSupportingDocuments">
                <el-col :span="24" :offset="0">
                  <el-form-item label="Supporting Documents" prop="supportingDocumentsImgList">
                    <el-upload
                      action=""
                      accept=".jpg,.png,.pdf"
                      :limit="10"
                      :auto-upload="false"
                      :on-change="uploadFileChange"
                      :file-list="payForm.supportingDocumentsImgList"
                      :on-exceed="handleExceed">
                      <el-button size="small" type="primary">Upload</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-form-item label="Payment" prop="payType" style="width: 100%">
                <el-radio-group v-model="payForm.payType" class="modeOfPayment-radio-group">
                  <el-radio-button label="credit">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_credit.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Credit card</span>
                        <span class="radio-desc">An additional fee is required.</span>
                      </div>
                    </div>
                  </el-radio-button>
                  <el-radio-button label="debit">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_debit.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Debit card</span>
                        <span class="radio-desc">No additinal fee is required.</span>
                      </div>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Documentation" prop="documentType" style="width: 100%">
                <el-radio-group v-model="payForm.documentType" class="modeOfPayment-radio-group">
                  <el-radio-button label="receipt" v-if="isIndividual">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_receipt.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Request receipt</span>
                        <span class="radio-desc">No additional information needs to be provided.</span>
                      </div>
                    </div>
                  </el-radio-button>
                  <el-radio-button label="invoice">
                    <div class="hcontainer">
                      <el-image :src="require('@/assets/img/icon/icon_invoice.png')" class="radio-icon" />
                      <div class="fill vcontainer">
                        <span class="radio-label">Request invoice</span>
                        <span class="radio-desc">Invoice information needs to be provided.</span>
                      </div>
                    </div>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <!-- Conditionally render invoice fields only when documentType is 'invoice' -->
              <template v-if="payForm.documentType === 'invoice'">
                <div class="invoice-billing-grid">
                  <el-form-item label="Company name" prop="companyName2"
                    :rules="{ required: true, message: 'Please enter Company name', trigger: 'blur' }">
                    <el-input v-model="payForm.companyName2" placeholder="Please Enter"></el-input>
                  </el-form-item>
                  <el-form-item label="VAT" prop="vat"
                    :rules="{ required: false, message: 'Please enter vat', trigger: 'blur' }">
                    <el-input v-model="payForm.vat" placeholder="Please Enter"></el-input>
                  </el-form-item>
                  <el-form-item label="Address" prop="address2"
                    :rules="{ required: true, message: 'Please enter address', trigger: 'blur' }">
                    <el-input v-model="payForm.address2" placeholder="Please Enter"></el-input>
                  </el-form-item>
                  <el-form-item label="Town/City" prop="townCity2"
                    :rules="{ required: true, message: 'Please enter town/city', trigger: 'blur' }">
                    <el-input v-model="payForm.townCity2" placeholder="Please Enter"></el-input>
                  </el-form-item>
                  <el-form-item label="Postcode" prop="postcode2">
                    <el-input v-model="payForm.postcode2" placeholder="Please Enter"></el-input>
                  </el-form-item>
                  <el-form-item label="Country" prop="country2"
                    :rules="{ required: true, message: 'Please enter country', trigger: 'blur' }">
                    <el-select v-model="payForm.country2" placeholder="Please Select" filterable>
                      <el-option v-for="(item, index) in companyList" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="Phone" prop="phone2" v-if="!isIndividual">
                    <el-input v-model="payForm.phone2" placeholder="Please Enter"></el-input>
                  </el-form-item>
                </div>
              </template>
              <div class="hcontainer vcenter flex-between action-buttons">
                <el-button @click="currentStep = 2">Back</el-button>
                <el-button type="primary" :loading="isPaying" :disabled="isPaying" @click="payClick">{{ isPaying ? 'Processing Payment...' : 'Pay' }}</el-button>
              </div>
            </el-form>
          </template>
        </div>
      </div>
    </div>
    <PaymentDialog
      :visible="showPaymentDialog"
      :paymentToken="paymentToken"
      :stripeOrderId="stripeOrderId"
      :stripeQuantity="pepleCount"
      :stripePayType="payForm.payType"
      @close="paymentClose"
      @success="paymentSuccess" />
    <ProfileIncompleteDialog :visible.sync="profileDialogVisible" />

    <el-dialog
      title="login"
      :visible.sync="dialogObj.visible"
      custom-class="congress-login-dialog"
      append-to-body
      top="33vh"
      width="min(620px, calc(100vw - 16px))"
      @close="!isLogin?currentStep = 1: ''"
      >
        <div class="congress-login-dialog-body">
          <LoginForm :innerOperate="true" loginModeProp="code"/>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import { MessageBox } from 'element-ui'
  import PaymentDialog from '@/components/PaymentDialog.vue'
  import ProfileIncompleteDialog from "@/components/ProfileIncompleteDialog.vue";
  import LoginForm from "@/components/LoginForm.vue";
  import store from '@/store'
  import { mapActions } from 'vuex'
  export default {
    name: 'CongressSignupPage',
    components: {
      PaymentDialog,
      ProfileIncompleteDialog,
      LoginForm
    },
    inject: ['refreshTokenFn'],
    data() {
      const validateUniqueEmail = (rule, value, callback) => {
        const emails = this.groupForm.registrationList.map(attendee => attendee.email);
        const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
        
        if (duplicateEmails.length > 0) {
          callback(new Error('Email addresses must be unique.'));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        currentStep: null,
        individualForm: {
          registrationType: 'IndividualRegistration',
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
          emailAlternative: '',
          disclosureStatus: 'Agree',
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
          clinicalSpecialty: [{ required: true, message: 'Please select Clinical specialty', trigger: 'change' }],
          institution: [{ required: true, message: 'Please select institution', trigger: 'change' }],
          institutionName: [{ required: true, message: 'Please enter Institution name', trigger: 'blur' }],
          phone: [{ required: true, message: 'Please enter phone', trigger: 'blur' }],
          address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
          townCity: [{ required: true, message: 'Please enter town/city', trigger: 'blur' }],
          country: [{ required: true, message: 'Please select country', trigger: 'change' }],
          disclosureStatus: [{ required: true, message: 'Please select disclosure status', trigger: 'change' }],
          visaDocument: [{ required: true, messge: 'Please Select Visa document required', trigger: 'change'}]
        },
        groupForm: {
          companyName2: '',
          contactNumber: '',
          modeOfPayment: 'online',
          vat: '',
          address2: '',
          townCity2: '',
          country2: '',
          postcode2: '',
          phone2: '',
          registrationList: [
            { lastName: '', firstName: '', email: '' }
          ],
        },
        groupRules: {
          companyName2: [{ required: true, message: 'Please enter company/Institution name', trigger: 'blur' }],
          // contactNumber: [{ required: true, message: 'Please enter Contact number', trigger: 'blur' }],
          modeOfPayment: [{ required: true, message: 'Please select Mode of payment', trigger: 'change' }],
          vat: [],
          address2: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
          townCity2: [{ required: true, message: 'Please enter town/city', trigger: 'blur' }],
          country2: [{ required: true, message: 'Please select country', trigger: 'change' }],
          phone2: [{ required: true, message: 'Please enter phone', trigger: 'blur' }]
        },
        attendeeRules: {
          lastName: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
          firstName: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
          email: [
            { required: true, message: 'Please enter email', trigger: 'blur' },
            { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
            { validator: validateUniqueEmail, trigger: 'blur' }
          ]
        },
        payForm: {
          payType: 'debit',
          documentType:  'invoice',
          companyName2: '',
          vat: '',
          address2: '',
          postcode2: '',
          townCity2: '',
          country2: '',
          handling: 0, 
          totalAmount: 0,
          paymentToken: '',
          phone2: '',
          supportingDocumentsImgList: []
        },
        payRules: { 
          payType: [
            { required: true, message: 'Please select a payment method', trigger: 'change' }
          ],
          phone2: [{ required: true, message: 'Please enter phone', trigger: 'blur' }],
        },
        isComplete: false,
        congressInfo: {},
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
        paymentToken: '',
        showPaymentDialog: false,
        stripeOrderId: '',
        companyList: [],
        isPaying: false,
        profileDialogVisible: false,
        dialogObj: {
          visible: false,
          component: 'LoginForm'
        },
        typeOfFeeList: []
      }
    },
    watch: {
      'individualForm.visaDocument': {
        handler() {
          this.individualForm.dateOfBirth = "";
          this.individualForm.passportNumber = "";
          this.individualForm.dateOfIssue = "";
          this.individualForm.countryOfIssue = "";
        },
      },
      isLogin: {
        handler() {
          this.dialogObj.visible = false;
        },
      },
      currentStep: {
        handler() {
          let dom = document.querySelector('.mainPage')
          dom.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
      }
    },
    computed: {
      isLogin() {
        return this.$store.getters['user/isLogin']
      },
      isIndividual() {
        let isIndividual = (this.individualForm.registrationType || '').toLowerCase().includes('individual');
        return isIndividual;
      },
      totalAmount() { 
        if(this.payForm.payType == 'debit'){
          return this.congressInfo.typeOfFeeList?.reduce((sum, prev) => prev.id && (sum + prev.feeAmount) || sum, 0)* this.pepleCount
        }else{
          return this.congressInfo.typeOfFeeList?.reduce((sum, prev) => prev.id && (sum + prev.feeAmount) || sum, 0)* this.pepleCount + Number(this.congressInfo.handling)
        }
      },
      minFeeAmount() {
        return Math.min(
          ...this.typeOfFeeList
          .flatMap(item => item.detailList || []) // 兼容 detailList 为空的情况
          .map(detail => detail.feeAmount)
        )
      },
      currency() {
        return this.typeOfFeeList?.[0]?.currency || ''
      },
      pepleCount() { 
        if ((this.individualForm.registrationType || '').toLowerCase().includes('group')) {
          return this.groupForm.registrationList.length
        } else {
          return 1
        }
      },
      showSupportingDocuments() {
        return this.congressInfo.typeOfFeeList.some(item =>item.supportingDocuments == '1')
      }
    },
    methods: {
      ...mapActions('user', ['changeActiveId']),
      isProfileIncomplete() {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
          return !userInfo.firstName || !userInfo.lastName
        } catch {
          return false
        }
      },
      async handleStep1() {
        if(this.isIndividual) {
          if(!this.isLogin) {
            this.$confirm('Login has expired, please log in again', 'Tip', {
              confirmButtonText: 'Re login',
              cancelButtonText: 'Cancel',
              type: 'none'
            }).then(() => {
              store.dispatch('user/logout')
              this.$router.push('/login')
            }).catch(() => {})
          } else if(this.isProfileIncomplete()) {
            this.profileDialogVisible = true
            return
          } else {
            this.currentStep = 2;
            await this.refreshTokenFn();
            this.userCongressRegistrationInitFn()
          }
        } else {
          this.currentStep = 2;
          if(!this.isLogin) {
            this.dialogObj.visible = true;
          }
        }
      },
      getCompanyList() {
        this.$api.getCountries().then((res) => {
          this.companyList = res.data || [];
        });
      },
      paymentSuccess() {
        this.showPaymentDialog = false
        this.isComplete = true
      },
      paymentClose() {
        this.showPaymentDialog = false
        this.isPaying = false
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
            const isContinue = await this.isEmailContinue([this.individualForm.email])
            if (!isContinue) {
              return
            }
            this.isComplete = false
            this.currentStep = 3
          } else {
            console.log('Validation failed')
          }
        })
      },
      async isEmailContinue(emails) {
        const params = {
          congressId: this.congressInfo.id,
          emails: emails.join(','),
          type: 'registration'
        }
        const res = await this.$api.userCongressVerifyEmail(params).catch(err => err)
        if ((res.code === 200 || res.code === 0)) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            MessageBox.confirm(`Duplicate Registration. The Email ${res.data.join(',')} is already registered.`, 'Duplicate', {
              confirmButtonText: 'Cancel',
              showCancelButton: false,
              type: 'none'
            }).then(() => {}).catch(() => {})
            return false
          } else {
            return true
          }
        }
        return false
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
            this.loading = true
            const isContinue = await this.isEmailContinue(emails)
            if (!isContinue) {
              this.loading = false
              return
            }
            if (this.groupForm.modeOfPayment === 'bankTransfer') {
              this.payForm.totalAmount = this.totalAmount              
              const reqData = {
                
                // ...this.individualForm,
                
                ...this.payForm,
                vat: this.groupForm.vat,
                ...this.groupForm,
                congressId: this.$route.query.id,
                handling: this.congressInfo.handling,
                currency: this.currency,
                typeOfFeeList: this.typeOfFeeList.map(item => ({...item , ...item.detailList[0]}))
              }
              this.$api.userCongressGroupRegistrationSubmit(reqData).then(res => { 
                if ((res.code === 200 || res.code === 0) && res.data) {
                  this.isComplete = true
                  this.currentStep = 3
                  this.loading = false
                }
              }).catch((err) => {
                this.loading = false
                console.log('err:', err)
              })
            } else {
              this.isComplete = false
              this.currentStep = 3
              this.loading = false
            }
            this.payForm.documentType = 'invoice'
          } else {
            console.log('Validation failed')
          }
        })
      },
      validateFeeType() {
        if(this.congressInfo.mustTypeOfFee && this.congressInfo.typeOfFeeList.length === 0) {
          this.$message.error('Please select fee type')
          return false;
        } else if(this.congressInfo.mustTypeOfFee.length && this.congressInfo.typeOfFeeList.length) {
          let mustTypeOfFee = this.congressInfo.mustTypeOfFee.split(',')
          this.congressInfo.typeOfFeeList.forEach(item => {
            if(mustTypeOfFee.includes(item.feeTypeId + '') && !item.feeAmount) {
              this.$message.error(`Please select ${item.feeType}`)
              return false;
            }
          })
          if(this.congressInfo.typeOfFeeList.some(item =>item.supportingDocuments == '1')) {
            if(!this.payForm.supportingDocumentsImgList.length) {
              this.$message.error('Please upload supporting documents')
              return false;
            }
            return true;
          }
        }
        return true;
      },
      async payClick() {
        if (this.isPaying) return
        this.isPaying = true

        // todo: connecte pay test
        // this.paymentToken = 'QLyXzOWRFPXZG-7ojwH45JM5CvzerBk3MsIjlMcl3UoQTK0_LbRN1yRU8Zl5EdMs3hefBu0h7gI8yUaoOeA1KqmSQO5oCPYpj-woianzYyGdM3zaP-780jEIrzLytaRFlB1FZ-aM81c5EMnZlLA5b0lR-FN0'
        // this.showPaymentDialog = true

        // todo: stripe pay test
        // this.stripePaymentToken = 'cs_test_a1IilK0dZfCVm9aXUSJ3ps4p18PmCm7t31LQ9z9UmRNdq2Sqx4cEM6gwXq_secret_fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0VnNRMV1GZmhGQFVIakl%2FdD1zUE5ETjAwMTZGVmlvS0tDT0tTazVuf29DTndtQ25zdU40Tl80UE1WX2BSNlBLV01jfzxBf2pwbEJscnZSVEs8XG8xYV1VNTViSWp3dk90aScpJ3BsSGphYCc%2FJ2BoZ2BhYWBhJyknaWR8anBxUXx1YCc%2FJ3Zsa2JpYFpscWBoJyknd2BhbHdgZnFKa0ZqaHVpYHFsamsnPydkaXJkfHYnKSdnZGZuYndqcGthRmppancnPycmY2NjY2NjJ3gl'
        // this.showStripePaymentDialog = true
        try {
          this.$refs.payFormRef && this.$refs.payFormRef.validate(async (valid) => {
            if (valid) {
              let validateFeeTypeFlag = this.validateFeeType();
              if(!validateFeeTypeFlag) {
                return;
              }
              this.payForm.totalAmount = this.totalAmount          
              let data = {};
              if(this.isIndividual) {
                data = {
                  ...this.individualForm,
                  ...this.payForm,
                  currency: this.currency,
                  congressId: this.$route.query.id,
                  handling: this.payForm.payType=='debit' ? '0' : this.congressInfo.handling,
                  modeOfPayment: this.payForm.payType,
                  typeOfFeeList: this.congressInfo.typeOfFeeList.filter(item => item.id),
                }
              } else {
                data = {
                  ...this.groupForm,
                  ...this.payForm,
                  currency: this.currency,
                  congressId: this.$route.query.id,
                  handling: this.payForm.payType=='debit' ? '0' : this.congressInfo.handling,
                  modeOfPayment: this.groupForm.modeOfPayment == 'online' ? this.payForm.payType : this.groupForm.modeOfPayment,
                  typeOfFeeList: this.congressInfo.typeOfFeeList.filter(item => item.id),
                }
              }
              await this.userCongressRegistrationSubmitFn(data)
            } else {
              console.log('Payment validation failed')
            }
          })
        } finally {
          this.isPaying = false
        }
      },
      goToOwnPage() {
        this.changeActiveId('/mine')
        this.$router.push('/mine')
      },
      userCongressRegistrationInitFn() {
        this.loading = true
        this.$api.userCongressRegistrationInit({
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.individualForm = {
              lastName: res.data.lastName,
              firstName: res.data.firstName,
              email: res.data.email,
              fmfId: res.data.fmfId,
              phone: res.data.telephone,
              townCity: res.data.city,
              postcode: res.data.postcode,
              country: res.data.country,
              title: res.data.title,
              grade: res.data.grade,
              gradeOther: res.data.gradeOther,
              institution: res.data.institution,
              registrationType: 'IndividualRegistration',
              visaDocument: '1',
              dateOfBirth: res.data.birthday,
              passportNumber: '',
              dateOfIssue: '',
              countryOfIssue: '',
            }
          }
          setTimeout(() => {
            this.loading = false
          }, 500)
        }).catch((err) => {
          console.log('err:', err)
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
      },
      userCongressRegistrationSubmitFn(data) {
        this.loading = true
        if(this.isIndividual) {
          this.$api.userCongressRegistrationSubmit(data).then(res => {
            if ((res.code === 200 || res.code === 0) && res.data) {
              // if(data.modeOfPayment == 'online') {
                  this.toPay(res.data)
              // } else {
                // this.isComplete = true
              // }
            }
            setTimeout(() => {
              this.loading = false
            }, 500)
          }).catch((err) => {
            console.log('err:', err)
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
        } else {
          this.$api.userCongressGroupRegistrationSubmit(data).then(res => { 
            if ((res.code === 200 || res.code === 0) && res.data) {
              if(data.modeOfPayment == 'online' ||data.modeOfPayment == 'debit' || data.modeOfPayment == 'credit') {
                this.toPay(res.data)
              } else {
                this.isComplete = true
              }
            }
            setTimeout(() => {
              this.loading = false
            }, 500)
          }).catch((err) => {
            console.log('err:', err)
            setTimeout(() => {
              this.loading = false
            }, 500)
          })
        }
      },
      toPay(resData) {
        console.log('[toPay] resData:', JSON.stringify(resData))
        // 兼容后端不同字段名：orderId / id
        const orderId = resData.orderId || resData.id || null
        const totalAmount = resData.totalAmount || resData.amount || 0
        console.log('[toPay] orderId:', orderId, '  totalAmount:', totalAmount)
        this.createPayTokenFn(totalAmount, this.currency, orderId)
      },
      createPayTokenFn(amount, currency, orderId, transactionType = 'SALE') {
        this.$api.createPayToken({
          amount: amount,
          currency: currency,
          orderId: orderId,
          transactionType: transactionType
        }).then(res => {
          console.log('[createPayTokenFn] createPayToken response:', JSON.stringify(res.data))
          if ((res.code === 200 || res.code === 0)) {
            if (res.data && res.data.tokenId) {
              // createPayToken 响应里也可能携带 orderId，优先用它；否则用入参 orderId
              const finalOrderId = res.data.orderId || res.data.id || orderId
              this.stripeOrderId = finalOrderId
              console.log('[createPayTokenFn] stripeOrderId set to:', this.stripeOrderId)
              this.paymentToken = res.data.tokenId
              this.showPaymentDialog = true
            } else {
              this.$message.error('Create payment token failed, please refresh and try again')
            }
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
            this.typeOfFeeList = res.data.typeOfFeeList.map(item => ({...item, originId: item.id}))
            this.congressInfo = {
              ...res.data,
            }
            this.congressInfo.typeOfFeeList = this.typeOfFeeList.map(item => ({...item, ...item.detailList[0]}))
            if(this.congressInfo.congressType == 'Supported Courses') {
              this.currentStep = 2;
              this.individualForm.registrationType = 'individual'
              this.userCongressRegistrationInitFn()
            } else {
              this.currentStep = 1;
            }
          }
        }).catch((err) => {
          console.log('err:', err)
        })
      },
      selectFee(item, obj, index) {
        let mustTypeOfFee = this.congressInfo.mustTypeOfFee.split(",");
        const isMustFee = mustTypeOfFee.includes(item.originId + '');
        if(this.congressInfo.typeOfFeeList[index].id == obj.id) {
          if(isMustFee) {
            return
          } else {
            this.$set(this.congressInfo.typeOfFeeList[index], 'id', null)
            this.$set(this.congressInfo.typeOfFeeList[index], 'feeAmount', 0)
          }
        } else {
          this.$set(this.congressInfo.typeOfFeeList[index], 'id', obj.id)
          this.$set(this.congressInfo.typeOfFeeList[index], 'feeAmount', obj.feeAmount)
        }
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
          this.payForm.supportingDocumentsImgList.push({
            id: res.id,
            name: file.name,
            url: res.url
          })
        } catch {
          this.$message.error('Failed to upload')
        }
      },
      handleExceed(files) {
        this.$message.warning(`current uploaded ${files.length} files`)
      },
    },
    created() {
      this.getCompanyList();
      this.websiteCongressGetFn()
    }
  }
</script>

<style lang="scss" scoped>
  .congress-signup {
    width: 100%;
    box-sizing: border-box;
    min-height: calc(100% - 200px);
    padding: 100px 20px 24px;
    overflow-x: hidden;
    background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);

    .main-container {
      width: 100% !important;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
      min-width: 0;
    }

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
          }
          .el-input, .el-select {
            width: 100%;
          }
        }
        .tip {
          width: 100%;
          font-weight: normal;
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
            max-width: 520px;
            width: 100% !important;
          }
        }

        .attendee-name-row {
          flex-wrap: wrap;
        }

        /* Step 3 — Payment: single column on desktop to avoid two 544px items per row overlapping */
        &.form-container--payment {
          flex-direction: column;
          flex-wrap: nowrap;
          align-items: stretch;
          gap: 0;

          ::v-deep .el-row {
            width: 100%;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          ::v-deep .el-col {
            max-width: 100%;
          }

          ::v-deep .el-form-item {
            flex: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 20px;
          }

          ::v-deep .el-form-item__content {
            min-width: 0;
          }

          /* 开票信息：与团体银行转账区块一致，桌面双列、窄屏单列 */
          .invoice-billing-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 24px;
            row-gap: 0;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            flex: none;

            ::v-deep .el-form-item {
              margin-bottom: 18px !important;
              max-width: none !important;
              width: 100% !important;
              min-width: 0;
            }
          }

          @media (max-width: 992px) {
            .invoice-billing-grid {
              grid-template-columns: 1fr;
            }
          }
        }

        /* Step 2 — Group registration: payment 整行；银行转账信息桌面双列、小屏单列 */
        &.form-container--group-step2 {
          flex-direction: column;
          flex-wrap: nowrap;
          align-items: stretch;

          ::v-deep > .el-form-item {
            flex: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          ::v-deep > .el-form-item .el-form-item__content {
            min-width: 0;
          }

          .group-billing-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 24px;
            row-gap: 0;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            flex: none;

            ::v-deep .el-form-item {
              margin-bottom: 18px !important;
              max-width: none !important;
              width: 100% !important;
              min-width: 0;
            }
          }

          @media (max-width: 992px) {
            .group-billing-grid {
              grid-template-columns: 1fr;
            }
          }
        }
      }
      .action-buttons {
        width: 100%;
        font-weight: bold;
        font-size: 16px;
        margin-top: 30px;
        flex-wrap: wrap;
        gap: 12px;
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
        max-width: 100%;
      }
      .completion-tip {
        width: 100%;
        max-width: 500px;
        text-align: center;
        margin: 0 auto 60px;
        word-break: break-word;
        padding: 0 8px;
        box-sizing: border-box;
      }
      .pay-container {
        min-height: 64px;
        font-weight: bold;
        font-size: 18px;
        color: #0E3045;
        padding: 10px 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        display: block;
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        .numlist{
          line-height: 32px;
        }
      }

      .fee-options-row {
        width: 100%;
        flex-direction: row !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
        justify-content: flex-start;
        align-items: stretch;
      }

      .fee-option-card {
        position: relative;
        display: flex;
        /* 一行最多 4 个，gap 12px×3；超过自动换行 */
        flex: 0 1 calc((100% - 36px) / 4);
        max-width: calc((100% - 36px) / 4);
        width: auto;
        min-width: 0;
        min-height: 100px;
        border-radius: 8px;
        background: rgba(131, 178, 210, 0.1);
        cursor: pointer;
        box-sizing: border-box;

        &.active {
          border: 1px solid #a6d9ff;
          background: linear-gradient(135deg, #fcffff 0%, #f6fbff 100%);
        }
      }

      .total-fee {
        margin-left: 5px;
        font-weight: bold;
        font-size: 24px;
        color: #186ba2;
      }
    }
  }

  @media (max-width: 1200px) {
    .congress-signup {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  @media (max-width: 900px) {
    .congress-signup {
      padding-top: 88px;
      .congress-signup-title {
        font-size: 28px;
      }
      .congress-signup-content {
        padding: 22px 20px !important;
      }
    }
  }

  @media (max-width: 768px) {
    .congress-signup {
      padding: 72px 12px 20px;

      .congress-signup-title {
        font-size: 22px;
        line-height: 1.25;
        padding: 0 4px;
      }

      .congress-signup-subtitle {
        font-size: 14px;
        line-height: 1.5;
        display: block;
        padding: 0 8px;
      }

      .congress-signup-steps {
        margin: 24px 0 16px;
      }

      .congress-signup-content {
        padding: 16px 14px 20px !important;
        font-size: 16px;

        .sc-title {
          font-size: 17px;
        }

        .form-container {
          ::v-deep .el-form-item {
            max-width: 100% !important;
          }
        }

        .registrationList-container {
          ::v-deep .el-form-item {
            max-width: 100% !important;
          }
        }

        .attendee-name-row {
          flex-direction: column !important;
          gap: 12px !important;
        }
      }

      .completion {
        padding: 16px 0;

        .completion-tip {
          margin-bottom: 32px;
        }

        .fee-option-card {
          flex: 0 1 calc(50% - 8px);
          max-width: calc(50% - 8px);
        }
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch !important;
        justify-content: stretch !important;

        .el-button {
          width: 100%;
          margin-left: 0 !important;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .congress-signup {
      padding: 64px 10px 16px;

      .congress-signup-title {
        font-size: 19px;
      }

      .congress-signup-content {
        padding: 14px 12px 16px !important;
        border-radius: 10px;
      }

      .completion .fee-option-card {
        flex: 1 1 100%;
        max-width: 100%;
        width: 100%;
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
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px 20px;
    box-sizing: border-box;
    color: #656B6F;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    /* 横向时各占一半并允许收缩；勿对两个子项都用 width:100%，否则会撑破容器 */
    .el-radio-button {
      flex: 1 1 calc(50% - 10px);
      min-width: 0;
      max-width: 100%;
      vertical-align: top;
      .el-radio-button__inner {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        display: block !important;
        white-space: normal !important;
        word-break: break-word;
        overflow-wrap: anywhere;
        line-height: 1.45;
        height: auto !important;
        min-height: 0;
        padding: 14px 12px 16px;
        text-align: left;
        border-radius: 4px;
        border-left: 1px solid #DCDFE6;
        box-shadow: none;
        .hcontainer {
          align-items: flex-start;
          width: 100%;
          min-width: 0;
          flex-wrap: nowrap;
        }
        .fill.vcontainer,
        .vcontainer.fill {
          flex: 1 1 auto;
          min-width: 0;
        }
        .radio-label {
          display: block;
          font-size: 16px;
          font-weight: bold;
          color: #656B6F;
          margin-bottom: 8px;
          white-space: normal;
          word-break: break-word;
        }
        .radio-desc {
          display: block;
          font-size: 14px;
          font-weight: normal;
          color: #8A9094;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
          line-height: 1.5;
        }
        .radio-icon-online {
          width: 30px;
          height: 22px;
          margin-right: 8px;
          flex-shrink: 0;
        }
        .radio-icon-bank {
          width: 26px;
          height: 26px;
          margin-right: 8px;
          flex-shrink: 0;
        }
        .radio-icon {
          width: 28px;
          height: 22px;
          margin-right: 8px;
          flex-shrink: 0;
        }
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        border-color: #a6d9ff;
        background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
      }
    }
    .active {
      border: 1px solid #a6d9ff !important;
      background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
    }
  }

  /* 平板及以下：支付方式改纵向，避免窄宽双列仍显挤 */
  @media (max-width: 992px) {
    .modeOfPayment-radio-group:not(.fee-options-row) {
      flex-direction: column;
      flex-wrap: nowrap;
      gap: 14px;

      .el-radio-button {
        flex: none !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      .el-radio-button .el-radio-button__inner {
        padding: 14px 12px 16px;
      }

      .el-radio-button .el-radio-button__inner .hcontainer {
        align-items: flex-start;
      }

      .el-radio-button .el-radio-button__inner .radio-desc {
        font-size: 13px;
      }
    }
  }

  @media (max-width: 768px) {
    .registrationtype-radio-group {
      flex-direction: column;
      gap: 16px;

      .el-radio-button {
        height: auto;
        min-height: 280px;
        max-width: 100%;

        .el-radio-button__inner {
          padding: 28px 16px 36px;
        }

        .registrationtype-radio-title {
          font-size: 20px;
        }

        .registrationtype-radio-tip,
        .registrationtype-radio-desc {
          font-size: 15px;
        }

        .registrationtype-radio-price {
          font-size: 32px;
        }
      }
    }

    .congress-signup-steps {
      .el-step__line {
        margin: 0 8px !important;
        top: 22px !important;
      }

      .el-step__title {
        font-size: 12px;
        line-height: 1.35;
        white-space: normal;
        word-break: break-word;
        padding: 0 2px;
      }

      .el-step__icon {
        width: 44px;
        height: 44px;
        font-size: 16px;
      }

      .el-step__main {
        flex-basis: 33%;
      }
    }
  }

  @media (max-width: 480px) {
    .registrationtype-radio-group .el-radio-button {
      min-height: 240px;

      .registrationtype-radio-price {
        font-size: 28px;
      }
    }

    .modeOfPayment-radio-group:not(.fee-options-row) .el-radio-button__inner {
      padding: 12px 10px 14px;
    }

    .modeOfPayment-radio-group .radio-label {
      font-size: 15px;
    }

    .congress-signup-steps .el-step__title {
      font-size: 11px;
    }
  }

</style>