<template>
  <div class="resetpwd">
    <div class="vcontainer">
      <div class="hcontainer vcenter flex-between page-header">
        <span class="header-title">Request a new password</span>
        <div class="order-back" @click="handleBack"></div>
      </div>
      <div class="fill vcontainer resetpwd-info-content">
        <el-form
          :model="formData"
          :rules="formRules"
          :label-width="labelWidth"
          :label-position="labelPosition"
          ref="formRef">
          <el-tabs :value="currentStep" stretch>
            <el-tab-pane label="① Info" name="1" disabled>
              <div class="vcontainer hcenter step-body">
                <el-form-item label="Your email address" prop="email">
                  <el-input v-model="formData.email" placeholder="Enter your email" :readonly="!!userInfo.email"></el-input>
                </el-form-item>
              </div>
              <div class="hcontainer hcenter">
                <el-button type="primary" class="next-btn" @click="nextClick">Next</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="② Verification" name="2" disabled>
              <div class="vcontainer step-body">
                <el-form-item label="Email verification code" prop="code">
                  <el-input v-model="formData.code" placeholder="Enter verification code">
                    <template #append>
                      <el-button :disabled="countdown > 0" @click="resendCode">
                        {{ countdown > 0 ? `Resend (${countdown}s)` : 'Resend' }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="Select your FMF ID" prop="fmfId">
                  <el-select v-model="formData.fmfId" placeholder="Please select" style="width: 100%;" popper-class="resetPwd-select">
                    <el-option v-for="item in userList" :key="item.fmfId" :label="item.fmfId" :value="item.fmfId">
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fmfId }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="New password" prop="password">
                  <el-input v-model="formData.password" show-password placeholder="Enter new password"></el-input>
                </el-form-item>
                <el-form-item label="Confirm password" prop="confirmPassword">
                  <el-input v-model="formData.confirmPassword" show-password placeholder="Confirm password"></el-input>
                </el-form-item>
                <div class="fill"></div>
                <div class="hcontainer hcenter">
                  <el-button type="primary" class="next-btn" @click="nextClick">Next</el-button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="③ Done" name="3" disabled>
              <div class="vcontainer vcenter finish-container">
                <span class="finish-title">All Done!</span>
                <img src="@/assets/img/img_succ1.png" class="succ-icon" alt="">
                <span class="finish-desc">
                  Perfect! You have successfully reset your FMF platform account password. Log in now and start using it!
                </span>
                <div class="hcontainer hcenter">
                  <el-button type="primary" class="next-btn" @click="$router.replace('/login')">Sign In Now</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </div>

    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="captchaSize"
      @success="verifySuccess" />
  </div>
</template>

<script>
  import Verify from '@/components/verifition/Verify'
  import { showBackupEmailDialog } from '@/utils/showAlternativeEmailDialog'
  export default {
    name: 'ResetPwd',
    components: {
      Verify
    },
    data() {
      const validateConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input confirm password'));
        } else if (value !== this.formData.password) {
          callback(new Error('Passwords do not match'));
        } else {
          callback();
        }
      };
      return {
        currentStep: '1',
        formData: {
          email: '',
          code: '',
          password: '',
          confirmPassword: '',
          fmfId: ''
        },
        formRules: {
          email: [
            { required: true, message: 'Please input your email', trigger: 'blur' },
            { type: 'email', message: 'Please input correct email', trigger: ['blur', 'change'] }
          ],
          code: [{ required: true, message: 'Please input verification code', trigger: 'blur' }],
          password: [
            { required: true, message: 'Please input password', trigger: 'blur' },
            { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
          ],
          confirmPassword: [
            { validator: validateConfirmPassword, trigger: ['blur', 'change'] }
          ],
          fmfId: [
            { required: true, message: 'Please select your FMF ID', trigger: 'blur' }
          ]
        },
        countdown: 0,
        countdownInterval: null,
        userList: [],
        windowWidth: window.innerWidth
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo || {}
      },
      labelPosition() {
        return this.windowWidth <= 640 ? 'top' : 'right'
      },
      labelWidth() {
        if (this.windowWidth <= 640) return 'auto'
        if (this.windowWidth <= 900) return '180px'
        return '220px'
      },
      captchaSize() {
        const w = Math.min(this.windowWidth - 40, 400)
        return { width: w + 'px', height: Math.round(w / 2) + 'px' }
      }
    },
    mounted() {
      this.formData.email = this.userInfo.email
      this._onResize = () => { this.windowWidth = window.innerWidth }
      window.addEventListener('resize', this._onResize)
    },
    beforeDestroy() {
      this.clearCountdown()
      window.removeEventListener('resize', this._onResize)
    },
    methods: {
      handleBack() {
        this.$confirm('Are you sure to discard changes?', 'Warning', {
          confirmButtonText: 'Discard',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$router.back();
        }).catch(() => {})
      },
      async verifySuccess() {
        try {
          this.sendEmailCodeFn(() => {
            this.currentStep = '2'
          })
        } catch {
          console.log('验证码验证失败')
        }
      },
      resendCode() {
        if (this.countdown > 0) return
        this.sendEmailCodeFn()
      },
      nextClick() {
        const self = this
        switch (this.currentStep) {
          case '1':
            {
              this.$utils.validateFormFields(this.$refs.formRef, ['email']).then(result => {
                if (result.isValid) {
                  self.$refs.verify.show()
                }
              }).catch(err => err)
              break
            }
          case '2':
            {
              this.$utils.validateFormFields(this.$refs.formRef, ['code', 'fmfId', 'password', 'confirmPassword']).then(result => {
                if (result.isValid) {
                  self.resetPwdFn()
                  self.clearCountdown()
                }
              }).catch(err => err)
              break
            }
          default:
            break
        }
      },
      sendEmailCodeFn(cb = {}) {
        const reqData = { email: this.formData.email }
        this.$api.sendEmailCode(reqData).then(res => {
          if (res.code === 200 || res.code === 0) {
            console.log(res)
            if (!res.data || !Array.isArray(res.data.userList) || res.data.userList.length === 0) {
              if(res.data && res.data.alternativeEmailForLoginEmailList.length > 0) {
                showBackupEmailDialog(res.data.alternativeEmailForLoginEmailList.join(','));
                return
              }else{
                this.$message.error('Sending email code not return userList!')
                return
              }
              
            }
            this.userList = res.data.userList
            if (this.userList.length === 1) {
              this.formData.fmfId = this.userList[0].fmfId
            }
            
            this.$message.success('Verification code sent successfully')
            if (typeof cb === 'function') cb()
            this.startCountdown()
          }
        }).catch(err => err)
      },
      resetPwdFn() {
        const reqData = {
          email: this.formData.email,
          code: this.formData.code,
          password: this.formData.password,
          fmfId: this.formData.fmfId
        }
        this.$api.emailResetPassword(reqData).then(res => {
          if (res.code === 200 || res.code === 0) {
            this.currentStep = '3'
          }
        }).catch(err => err)
      },
      startCountdown() {
        this.countdown = 60
        this.countdownInterval = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) this.clearCountdown()
        }, 1000)
      },
      clearCountdown() {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval)
          this.countdownInterval = null
        }
        this.countdown = 0
      }
    }
  }
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════════════════════════════
   PAGE SHELL
   ═══════════════════════════════════════════════════════════ */
.resetpwd {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background: linear-gradient(150deg, #e8f2fb 0%, #f0f4f8 55%, #edf5f0 100%);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 20px;
}

/* ═══════════════════════════════════════════════════════════
   CONTENT COLUMN
   ═══════════════════════════════════════════════════════════ */
.vcontainer {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

/* ═══════════════════════════════════════════════════════════
   CARD HEADER
   ═══════════════════════════════════════════════════════════ */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
  margin-bottom: 12px;
}

.header-title {
  font-weight: 700;
  font-size: 22px;
  color: #0e3045;
  letter-spacing: -0.2px;
}

.order-back {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,0.8) url('#{$svgUrl}/icon_back.svg') center no-repeat;
  background-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
  border: 1px solid #d4e5f5;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(14,48,69,0.1);
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN CARD
   ═══════════════════════════════════════════════════════════ */
.resetpwd-info-content {
  font-size: 15px;
  color: #0e3045;
  padding: 36px 44px 32px;
  margin-bottom: 20px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 40px rgba(14, 48, 69, 0.1), 0 2px 10px rgba(14, 48, 69, 0.05);
  box-sizing: border-box;
}

/* ═══════════════════════════════════════════════════════════
   STEP TAB BAR  (pill style — same as Registration)
   ═══════════════════════════════════════════════════════════ */
::v-deep .el-tabs__header {
  margin-bottom: 0;
  border-bottom: none !important;
}

::v-deep .el-tabs__nav-wrap {
  background: #f0f5fb;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 4px;

  &::after { display: none !important; }
}

::v-deep .el-tabs__nav {
  width: 100%;
  border: none !important;
  border-radius: 10px;
  display: flex;
}

::v-deep .el-tabs__item {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 8px;
  white-space: normal;
  word-break: break-word;
  line-height: 1.3;
  height: auto;
  color: #7a8b99 !important;
  border: none !important;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
  cursor: default;
}

::v-deep .el-tabs__item.is-active {
  background: #ffffff !important;
  color: #036fc0 !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(3, 111, 192, 0.15);
}

::v-deep .el-tabs__item.is-disabled {
  cursor: not-allowed;
}

::v-deep .el-tabs__active-bar {
  display: none !important;
}

/* ═══════════════════════════════════════════════════════════
   FORM FIELDS
   ═══════════════════════════════════════════════════════════ */
::v-deep .el-form-item {
  margin-bottom: 20px !important;
}

::v-deep .el-form-item__label {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #3d5166 !important;
  line-height: 1.5 !important;
}

::v-deep .el-input__inner {
  height: 46px !important;
  line-height: 46px !important;
  font-size: 15px !important;
  border-radius: 10px !important;
  border-color: #cddae8 !important;
  color: #0e3045 !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;

  &:focus {
    border-color: #036fc0 !important;
    box-shadow: 0 0 0 3px rgba(3, 111, 192, 0.12) !important;
  }
}

/* append slot (Resend button) */
::v-deep .el-input-group__append {
  border-radius: 0 10px 10px 0 !important;
  border-color: #cddae8 !important;
  background: #f4f8fd !important;
  font-size: 14px !important;
  padding: 0 16px !important;
}

::v-deep .el-select .el-input__inner {
  border-radius: 10px !important;
}

/* ═══════════════════════════════════════════════════════════
   STEP BODY
   ═══════════════════════════════════════════════════════════ */
.step-body {
  padding: 20px 0 4px;
  min-height: 280px;
}

/* ═══════════════════════════════════════════════════════════
   NEXT / SUBMIT BUTTON
   ═══════════════════════════════════════════════════════════ */
.next-btn {
  width: 240px;
  height: 50px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  letter-spacing: 0.3px !important;
  background: linear-gradient(135deg, #036fc0 0%, #0256a0 100%) !important;
  border-color: #036fc0 !important;
  box-shadow: 0 4px 14px rgba(3, 111, 192, 0.3) !important;
  margin-top: 24px;
  transition: opacity 0.2s, box-shadow 0.2s !important;

  &:hover {
    opacity: 0.92 !important;
    box-shadow: 0 6px 18px rgba(3, 111, 192, 0.38) !important;
  }
}

/* ═══════════════════════════════════════════════════════════
   STEP 3 — SUCCESS STATE
   ═══════════════════════════════════════════════════════════ */
.finish-container {
  font-size: 14px;
  color: #0e3045;
  text-align: center;
  padding: 20px 16px 12px;
  min-height: 280px;
  justify-content: center;

  .finish-title {
    font-size: 24px;
    font-weight: 700;
    color: #0e3045;
    letter-spacing: -0.3px;
    margin-bottom: 4px;
  }

  .finish-desc {
    max-width: 440px;
    font-size: 15px;
    line-height: 1.75;
    color: #4a6880;
    margin: 0 auto;
  }
}

.succ-icon {
  width: 140px;
  height: auto;
  margin: 20px 0 20px;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

/* Tablet: ≤ 900px */
@media (max-width: 900px) {
  .vcontainer {
    max-width: 600px;
  }

  .resetpwd-info-content {
    padding: 32px 36px 28px;
  }
}

/* Large mobile: ≤ 768px */
@media (max-width: 768px) {
  .resetpwd {
    padding: 24px 14px;
  }

  .header-title {
    font-size: 19px;
  }

  .resetpwd-info-content {
    padding: 28px 22px 24px;
    border-radius: 14px;
  }

  .step-body {
    min-height: auto;
    padding-top: 14px;
  }

  .next-btn {
    width: 100%;
    max-width: 320px;
    height: 46px !important;
    margin-top: 16px;
  }

  .finish-container {
    padding: 12px 4px;
    min-height: auto;
    .finish-desc { max-width: 100%; }
  }

  .succ-icon {
    width: 110px;
    margin: 14px 0 16px;
  }

  ::v-deep .el-tabs__item {
    font-size: 13px;
    padding: 8px 4px;
  }
}

/* Mobile: ≤ 640px — labels go top (computed in JS) */
@media (max-width: 640px) {
  .resetpwd {
    padding: 16px 10px;
  }

  .header-title {
    font-size: 17px;
  }

  .resetpwd-info-content {
    padding: 22px 16px 20px;
    border-radius: 12px;
  }

  .next-btn {
    max-width: none;
    height: 44px !important;
    font-size: 15px !important;
    border-radius: 10px !important;
  }

  ::v-deep .el-form-item {
    margin-bottom: 14px !important;
  }

  ::v-deep .el-form-item__label {
    font-size: 13px !important;
    padding-bottom: 4px !important;
  }

  ::v-deep .el-input__inner {
    height: 44px !important;
    line-height: 44px !important;
    font-size: 14px !important;
  }

  ::v-deep .el-tabs__item {
    font-size: 12px;
    padding: 6px 3px;
  }
}

/* Small mobile: ≤ 420px */
@media (max-width: 420px) {
  .resetpwd-info-content {
    padding: 18px 12px 16px;
    border-radius: 10px;
  }

  .header-title {
    font-size: 15px;
  }

  ::v-deep .el-tabs__item {
    font-size: 11px;
    padding: 5px 2px;
  }

  ::v-deep .el-tabs__nav-wrap {
    padding: 3px;
    border-radius: 10px;
  }

  .finish-container {
    .finish-title { font-size: 20px; }
  }
}
</style>
