<template>
  <div class="personal-info">
    <div class="vcontainer main-container">
      <div class="hcontainer vcenter flex-between">
        <span class="orderdetail-title">Personal information</span>
        <div class="order-back" @click="handleBack"></div>
      </div>

      <div class="fill vcontainer personal-info-content">
        <!-- 表单区域 -->
        <el-form ref="form" :model="formData" :rules="rules" class="form-grid">
          <!-- 第一行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="formData.email" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="FMF ID" prop="fmfId">
                <el-input v-model="formData.fmfId" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="First name" prop="firstName">
                <el-input v-model="formData.firstName" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="Last name" prop="lastName">
                <el-input v-model="formData.lastName" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第三行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Title" prop="title">
                <el-select v-model="formData.title" :disabled="!isEditing" placeholder="Please Select" style="width: 100%">
                  <el-option label="Professor" value="Professor"></el-option>
                  <el-option label="Dr" value="Dr"></el-option>
                  <el-option label="Ms" value="Ms"></el-option>
                  <el-option label="Mr" value="Mr"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="Department" prop="department">
                <el-input v-model="formData.department" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第四行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Institution" prop="institution">
                <el-select v-model="formData.institution" placeholder="Please Select" :disabled="!isEditing" style="width: 100%">
                  <el-option label="Hospital" value="Hospital"></el-option>
                  <el-option label="University" value="University"></el-option>
                  <el-option label="Private practice" value="Private practice"></el-option>
                  <el-option label="Pharmaceutical company" value="Pharmaceutical company"></el-option>
                  <el-option label="Medical device company" value="Medical device company"></el-option>
                  <el-option label="Other" value="Other"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="Institution name" prop="institutionName">
                <el-input v-model="formData.institutionName" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第五行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Clinical specialty" prop="clinicalSpecialty">
                <el-select v-model="formData.clinicalSpecialty" placeholder="Please select" :disabled="!isEditing" style="width: 100%">
                  <el-option v-for="item in grades" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" v-if="formData.clinicalSpecialty == 'Other'">
              <el-form-item label="Other clinical specialties" prop="otherClinicalSpecialties">
                <el-input v-model="formData.otherClinicalSpecialties" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第六行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Telephone" prop="telephone">
                <el-input v-model="formData.telephone" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="Date of birth" prop="birthday">
                <el-date-picker
                  v-model="formData.birthday"
                  :disabled="!isEditing"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select date"
                  style="width: 100%;">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第七行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Country" prop="country">
                <el-select v-model="formData.country" filterable placeholder="Please select" :disabled="!isEditing" style="width: 100%;">
                  <el-option v-for="item in countries" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="City" prop="city">
                <el-input v-model="formData.city" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第八行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Postcode" prop="postCode">
                <el-input v-model="formData.postCode" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="Preferred language" prop="preferredLanguage">
                <el-select v-model="formData.preferredLanguage" placeholder="Please select" :disabled="!isEditing" style="width: 100%;">
                  <el-option v-for="item in languages" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第九行 -->
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Street and number" prop="streetAndNumber">
                <el-input v-model="formData.streetAndNumber" :disabled="!isEditing"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="Alternative email" prop="emailAlternative">
                <el-input v-model="formData.emailAlternative" :disabled="!isEditing"></el-input>
                <p class="alt-email-tip">Backup email is for recovery only and cannot be used to sign in.</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" size="small" @click="toggleEdit">{{ isEditing ? 'Save' : 'Edit' }}</el-button>
          <el-button 
          plain size="small" @click="changePassword" v-if="!isEditing">Change password</el-button>
          <el-button 
          plain size="small" @click="changeEmail" v-if="!isEditing">Change email</el-button>
          <el-button 
          plain size="small" type="danger" @click="deleteMyAccount" v-if="!isEditing">Delete my account</el-button>
        </div>
      </div>
    </div>

    <!-- 删除账户确认弹窗 -->
    <el-dialog
      title="Delete my account"
      :visible.sync="deleteDialogVisible"
      custom-class="delete-account-dialog"
      width="420px"
      :append-to-body="true"
      :close-on-click-modal="false"
      @open="onDeleteDialogOpen"
      @close="onDeleteDialogClose">
      <p class="delete-dialog-desc">Deleting your account is permanent. This action cannot be undone. After deletion, you will no longer be able to sign in, and your profile and related data will be permanently removed.</p>
      <p class="delete-dialog-tip" :class="{ 'is-error': deleteConfirmError }">
        Please type <strong>{{ deleteConfirmText }}</strong> in the box below to confirm.
      </p>
      <el-input
        v-model="deleteAccountInput"
        placeholder=""
        clearable
        class="delete-confirm-input"
        :class="{ 'is-error': deleteConfirmError }"
        @input="deleteConfirmError = false" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="confirmDeleteAccount">Confirm delete</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PersonalInformation',
  data() {
    return {
      isEditing: false,
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
      ],
      formData: {
        email: '',
        fmfId: '',
        firstName: '',
        lastName: '',
        title: '',
        department: '',
        institution: '',
        institutionName: '',
        clinicalSpecialty: '',
        otherClinicalSpecialties: '',
        telephone: '',
        dateOfBirth: '',
        country: '',
        city: '',
        postCode: '',
        preferredLanguage: '',
        streetAndNumber: '',
        emailAlternative: ''
      },
      originalData: {},
      countries: [],
      languages: [
        { value: 'en', label: 'English' },
        { value: 'zh', label: 'Chinese' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'es', label: 'Spanish' },
        { value: 'ja', label: 'Japanese' }
      ],
      rules: {
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
      deleteDialogVisible: false,
      deleteAccountInput: '',
      deleteConfirmError: false,
      deleteConfirmText: 'Delete my account'
    }
  },
  methods: {
    ...mapActions('user', ['changeActiveId']),
    getLanguagesFn() {
        this.$api.getLanguages().then(res => {
          if ((res.code === 200 || res.code === 0) && Array.isArray(res.data)) {
            this.languages = res.data
          }
        }).catch((err) => {
          console.log('err:', err)
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
    async fetchUserData() {
      try {
        const res = await this.$api.getOwnUserInfo()
        if (res.code === 0 && res.data) {
          this.formData = { ...res.data }
          this.originalData = { ...res.data }
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    },
    async saveUserData() {
      try {
        const valid = await this.$refs.form.validate();
    
        if (!valid) return; // 验证失败，直接退出

        const res = await this.$api.updateOwnUserInfo(this.formData)
        if (res.code === 0) {
          this.$message.success('User information updated successfully!')
          this.isEditing = false
          try {
            const existing = JSON.parse(localStorage.getItem('userInfo') || '{}')
            const updated = res.data && typeof res.data === 'object' ? res.data : this.formData
            localStorage.setItem('userInfo', JSON.stringify({ ...existing, ...updated }))
          } catch (e) {
            console.error('Failed to update userInfo in localStorage:', e)
          }
        } else {
          this.$message.error('Failed to update user information.')
        }
      } catch (error) {
        console.error('Failed to save user info:', error)
        this.$message.error('An error occurred while saving.')
      }
    },
    toggleEdit() {
      if (this.isEditing) {
        this.saveUserData()
      } else {
        this.isEditing = true
      }
    },
    changePassword() {
      // alert('Redirecting to change password page...')
      this.$router.push('/resetPwd')
    },
    changeEmail() {
      // alert('Redirecting to change email page...')
      this.$router.push('/changeEamil')
    },
    deleteMyAccount() {
      const userId = this.formData.id
      if (!userId) {
        this.$message.error('Unable to get user id.')
        return
      }
      this.deleteDialogVisible = true
    },
    onDeleteDialogOpen() {
      this.deleteAccountInput = ''
      this.deleteConfirmError = false
    },
    onDeleteDialogClose() {
      this.deleteAccountInput = ''
      this.deleteConfirmError = false
    },
    confirmDeleteAccount() {
      const trimmed = (this.deleteAccountInput || '').trim()
      if (trimmed !== this.deleteConfirmText) {
        this.deleteConfirmError = true
        return
      }
      this.deleteConfirmError = false
      const userId = this.formData.id
      this.$api.deleteOwnUserList({ids: userId}).then((res) => {
        if (res.code === 0 || res.code === 200) {
          this.$message.success('Account deleted successfully.')
          this.deleteDialogVisible = false
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          this.$router.replace('/login')
        } else {
          this.$message.error(res.msg || 'Failed to delete account.')
        }
      }).catch((err) => {
        this.$message.error(err?.msg || err?.message || 'Failed to delete account.')
      })
    },
    handleBack() {
      if(this.isEditing) {
        this.$confirm('Are you sure to discard changes?', 'Warning', {
          confirmButtonText: 'Discard',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.isEditing = false;
          this.$refs.form.clearValidate();
          this.formData = { ...this.originalData }; // 重置表单数据到原始状态
        }).catch(() => {})
      } else {
        this.$router.back();
      }
    }
  },
  created() {
    if(this.$route.query.isEdit){
      this.isEditing = true
    }
    this.getLanguagesFn()
    this.getCountriesFn()
    this.fetchUserData()
  }
}
</script>

<style lang="scss" scoped>
.personal-info {
  padding: 100px 0 20px;
  background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
}

.orderdetail-title {
  font-weight: bold;
  font-size: 24px;
  color: #0E3045;
}

.order-back {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  background: url('#{$svgUrl}/icon_back.svg') center no-repeat;
  background-size: contain;
  cursor: pointer;
}

.personal-info-content {
  font-size: 14px;
  color: #0E3045;
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
  border-radius: 8px;
  background-color: #FFFFFF;
  box-shadow: 0px 10px 20px 1px rgba(14,48,69,0.1);
}

.form-grid {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
}

.el-button {
  padding: 8px 16px;
  font-size: 14px;
}

.alt-email-tip {
  margin-top: 6px;
  font-size: 13px;
  color: #e00;
  font-weight: bold;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.delete-dialog-desc {
  margin: 0 0 16px;
  font-size: 14px;
  color: #0E3045;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
}
.delete-dialog-tip {
  margin: 0 0 10px;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
  strong {
    font-weight: 600;
    color: #0e3045;
  }
  &.is-error {
    color: #f56c6c;
    strong {
      color: inherit;
    }
  }
}
.delete-confirm-input {
  margin-bottom: 0;
  font-size: 14px;
  &.is-error ::v-deep .el-input__inner {
    border-color: #f56c6c;
  }
  ::v-deep .el-input__inner {
    font-size: 14px;
  }
}

/* ─── Responsive ─────────────────────────────────────────── */

/* Override global .main-container fixed 1200px */
.personal-info .main-container {
  width: 100% !important;
  max-width: 1200px;
  box-sizing: border-box;
  padding: 0 24px;
}

/* Tablet ≤ 960px */
@media (max-width: 960px) {
  .personal-info .main-container {
    padding: 0 16px;
  }
}

/* Mobile ≤ 767px */
@media (max-width: 767px) {
  .personal-info {
    padding: 70px 0 20px;
    overflow-x: hidden;
  }

  .personal-info .main-container {
    padding: 0 12px !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .orderdetail-title {
    font-size: 18px;
  }

  .personal-info-content {
    padding: 16px 12px;
    margin-top: 8px;
  }

  /* Make gutter smaller so columns don't overflow */
  ::v-deep .el-row {
    margin-left: -8px !important;
    margin-right: -8px !important;
  }
  ::v-deep .el-col {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  /* Labels sit above inputs (label-position top) */
  ::v-deep .el-form-item {
    margin-bottom: 14px;
  }
  ::v-deep .el-form-item__label {
    float: none !important;
    display: block !important;
    width: 100% !important;
    text-align: left !important;
    padding: 0 0 4px !important;
    line-height: 1.4 !important;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }

  /* Action buttons: wrap and fill width on very small screens */
  .action-buttons {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: stretch;
  }
  .action-buttons .el-button {
    flex: 1 1 auto;
    min-width: 120px;
  }
}

/* Small mobile ≤ 479px */
@media (max-width: 479px) {
  .personal-info {
    padding-top: 60px;
  }

  .personal-info .main-container {
    padding: 0 8px !important;
  }

  .personal-info-content {
    padding: 12px 10px;
  }

  ::v-deep .el-form-item__label {
    font-size: 13px !important;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>

<style lang="scss">
/* Delete account dialog: compact width + viewport center (append-to-body) */
.el-dialog__wrapper:has(> .delete-account-dialog:not(.is-fullscreen)) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  box-sizing: border-box;
}

.el-dialog.delete-account-dialog:not(.is-fullscreen) {
  margin: 0 auto !important;
  margin-top: 0 !important;
  max-width: 420px !important;
  width: min(420px, calc(100vw - 32px)) !important;
  box-sizing: border-box;
}

.el-dialog.delete-account-dialog .el-dialog__body {
  padding: 16px 20px 8px;
  box-sizing: border-box;
}

.el-dialog.delete-account-dialog .el-dialog__footer {
  padding: 8px 20px 16px;
}

@supports not (selector(:has(*))) {
  .el-dialog.delete-account-dialog:not(.is-fullscreen) {
    margin-top: 12vh !important;
  }
}
</style>