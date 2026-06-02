<template>
  <div class="resetEmail">
    <div class="vcontainer">
      <div class="hcontainer vcenter flex-between page-header">
        <span class="header-title">Change my email address</span>
        <div class="order-back" @click="handleBack"></div>
      </div>
      <div class="fill vcontainer resetEmail-info-content">
        <span class="resetEmail-info-content-desc">Please verify your current login email address before changing to a new email address.</span>
        <el-form
          :model="formData"
          :rules="formRules"
          :label-width="labelWidth"
          :label-position="labelPosition"
          ref="formRef">
          <el-tabs :value="currentStep" stretch>
            <el-tab-pane label="① Fill in information" name="1" disabled>
              <div class="vcontainer hcenter step-body">
                <el-form-item label="Current email address" prop="email">
                  <el-input v-model="formData.email" readonly placeholder="Enter current email">
                    <template #append>
                      <el-button :disabled="countdown > 0" @click="resendCode">
                        {{ countdown > 0 ? `Verify my email (${countdown}s)` : 'Verify my email' }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="Verification code" prop="code">
                  <el-input v-model="formData.code" placeholder="Enter verification code"></el-input>
                </el-form-item>
              </div>
              <div class="hcontainer hcenter">
                <el-button type="primary" class="next-btn" @click="nextClick">Next</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="② Verification Information" name="2" disabled>
              <div class="vcontainer step-body">
                <el-form-item label="New email address" prop="newEmail">
                  <el-input v-model="formData.newEmail" placeholder="Enter new email">
                    <template #append>
                      <el-button :disabled="countdown > 0" @click="resendCode">
                        {{ countdown > 0 ? `Resend (${countdown}s)` : 'Verify my email' }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="Verification code" prop="code">
                  <el-input v-model="formData.code" placeholder="Enter verification code"></el-input>
                </el-form-item>
                <div class="fill"></div>
                <div class="hcontainer hcenter">
                  <el-button type="primary" class="next-btn" @click="submitClick">Submit</el-button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="③ Completed" name="3" disabled>
              <div class="vcontainer vcenter finish-container">
                <span class="finish-title">All Done!</span>
                <img src="@/assets/img/img_succ1.png" class="succ-icon" alt="">
                <span class="finish-desc">
                  Perfect! You have successfully changed your email address. Log in now and start using it!
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
  </div>
</template>

<script>
export default {
  name: 'ChangeEmail',
  data() {
    return {
      currentStep: '1',
      formData: {
        email: '',
        newEmail: '',
        code: ''
      },
      formRules: {
        email: [
          { required: true, message: 'Please input your current email', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email', trigger: ['blur', 'change'] }
        ],
        newEmail: [
          { required: true, message: 'Please input your new email', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email', trigger: ['blur', 'change'] }
        ],
        code: [{ required: true, message: 'Please input verification code', trigger: 'blur' }]
      },
      countdown: 0,
      countdownInterval: null,
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
    }
  },
  mounted() {
    this.formData.email = this.userInfo.email
    this._onResize = () => { this.windowWidth = window.innerWidth }
    window.addEventListener('resize', this._onResize)
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
    resendCode() {
      if (this.countdown > 0) return
      this.sendEmailCodeFn()
    },
    sendEmailCodeFn() {
      var reqData = {}
      if (this.currentStep == '1') {
        reqData = { email: this.formData.email }
      }
      if (this.currentStep == '2') {
        reqData = { newEmail: this.formData.newEmail }
      }

      this.$api.sendMailCodeForEditEmail(reqData).then(res => {
        if (res.code === 200 || res.code === 0) {
          this.startCountdown()
        }
      }).catch(err => {
        console.error('Failed to send email code:', err)
      })
    },
    startCountdown() {
      this.countdown = 60
      this.countdownInterval = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          this.clearCountdown()
        }
      }, 1000)
    },
    clearCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      }
      this.countdown = 0
    },
    resetStepData() {
      this.formData.code = ''
      this.clearCountdown()
    },
    nextClick() {
      this.$refs.formRef.validateField(['email', 'code'], valid => {
        if (!valid) {
          const reqData = {
            email: this.formData.email,
            code: this.formData.code
          }
          this.$api.resetEmail(reqData).then(res => {
            if (res.code === 200 || res.code === 0) {
              this.currentStep = '2'
              this.resetStepData()
            } else {
              this.$message.error('Failed to proceed to next step')
            }
          }).catch(err => {
            console.error('Failed to reset email:', err)
          })
        }
      })
    },
    submitClick() {
      this.$refs.formRef.validateField(['newEmail', 'code'], valid => {
        if (!valid) {
          const reqData = {
            newEmail: this.formData.newEmail,
            code: this.formData.code
          }
          this.$api.resetEmail(reqData).then(res => {
            if (res.code === 200 || res.code === 0) {
              this.currentStep = '3'
            } else {
              this.$message.error('Failed to submit new email')
            }
          }).catch(err => {
            console.error('Failed to reset email:', err)
          })
        }
      })
    }
  },
  beforeDestroy() {
    this.clearCountdown()
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize)
    }
  }
}
</script>

<style lang="scss" scoped>
/* Aligned with ResetPwd.vue — page shell, card, pill tabs, form, breakpoints */

.resetEmail {
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

.vcontainer {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

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

.resetEmail-info-content {
  font-size: 15px;
  color: #0e3045;
  padding: 36px 44px 32px;
  margin-bottom: 20px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 40px rgba(14, 48, 69, 0.1), 0 2px 10px rgba(14, 48, 69, 0.05);
  box-sizing: border-box;

  &-desc {
    display: block;
    line-height: 1.65;
    color: #4a6880;
    font-size: 14px;
    margin-bottom: 8px;
  }
}

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

::v-deep .el-input-group__append {
  border-radius: 0 10px 10px 0 !important;
  border-color: #cddae8 !important;
  background: #f4f8fd !important;
  font-size: 14px !important;
  padding: 0 16px !important;
}

.step-body {
  padding: 20px 0 4px;
  min-height: 280px;
}

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

@media (max-width: 900px) {
  .vcontainer {
    max-width: 600px;
  }

  .resetEmail-info-content {
    padding: 32px 36px 28px;
  }
}

@media (max-width: 768px) {
  .resetEmail {
    padding: 24px 14px;
  }

  .header-title {
    font-size: 19px;
  }

  .resetEmail-info-content {
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

@media (max-width: 640px) {
  .resetEmail {
    padding: 16px 10px;
  }

  .header-title {
    font-size: 17px;
  }

  .resetEmail-info-content {
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

@media (max-width: 420px) {
  .resetEmail-info-content {
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
