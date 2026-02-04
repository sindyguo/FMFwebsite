<template>
  <div class="resetpwd">
    <div class="vcontainer content">
      <div class="vcontainer header">
        <div class="hcontainer vcenter flex-between mb-10">
          <span class="header-title">Request A New Password</span>
          <div class="hcontainer vcenter flex-end">
            <span>Existing account?</span>
            <div class="login-link" @click="$router.replace('/login')">Login</div>
            <img src="@/assets/img/icon/icon_jt.png" alt="" />
          </div>
        </div>
        <span>If your account can be logged in via email, please enter your email address to reset the login password.</span>
      </div>
      <el-form
        :model="formData"
        :rules="formRules"
        label-width="180px"
        label-position="right"
        ref="formRef">
        <el-tabs :value="currentStep" stretch>
          <el-tab-pane label="① Fill in information" name="1" disabled>
            <div class="vcontainer hcenter mh-50">
              <el-form-item label="Your email address" prop="email" class="mt-40">
                <el-input v-model="formData.email" placeholder="Enter your email"></el-input>
              </el-form-item>
            </div>
            <div class="hcontainer hcenter">
              <el-button type="primary" class="next-btn" @click="nextClick">Next</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="② Verification Information" name="2" disabled>
            <div class="vcontainer mh-50">
              <span class="tip">Your registration verification code has been sent to the email you provided</span>
              <el-form-item label="Email verification code" prop="code" class="mt-30">
                <div class="fill hcontainer vcenter"> 
                  <el-input v-model="formData.code" class="mr-20" placeholder="Enter verification code"></el-input>
                  <el-button :disabled="countdown > 0" size="medium" @click="resendCode">{{ countdown > 0 ? `Resend (${countdown}s)` : 'Resend' }}</el-button>
                </div>
              </el-form-item>
              <el-form-item label="Select your username" prop="fmfId" class="mt-30">
                <el-select v-model="formData.fmfId" placeholder="Please select" style="width: 100%;">
                  <el-option v-for="item in userList" :key="item.fmfId" :label="item.username" :value="item.fmfId">
                    <span style="float: left">USERNAME:{{ item.username }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">FMFID:{{ item.fmfId }}</span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="Password" prop="password" class="mt-50">
                <el-input v-model="formData.password" show-password placeholder="Enter new password"></el-input>
              </el-form-item>
              <el-form-item label="Password confirmation" prop="confirmPassword" class="mt-30">
                <el-input v-model="formData.confirmPassword" show-password placeholder="Confirm password"></el-input>
              </el-form-item>

              <div class="fill"></div>
              <div class="hcontainer hcenter">
                <el-button type="primary" class="next-btn" @click="nextClick">Next</el-button>
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="③ Reset password" name="3" disabled>
            <div class="vcontainer mh-50">
              <el-form-item label="Password" prop="password" class="mt-50">
                <el-input v-model="formData.password" show-password placeholder="Enter new password"></el-input>
              </el-form-item>
              <el-form-item label="Password confirmation" prop="confirmPassword" class="mt-30">
                <el-input v-model="formData.confirmPassword" show-password placeholder="Confirm password"></el-input>
              </el-form-item>
              <div class="fill"></div>
              <div class="hcontainer hcenter">
                <el-button type="primary" class="next-btn" @click="nextClick">Next</el-button>
              </div>
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="③ Completed" name="3" disabled>
            <div class="vcontainer vcenter finish-container">
              <span class="finish-title">All Done!</span>
              <img src="@/assets/img/img_succ1.png" class="succ-icon" alt="">
              <span style="width:465px">Perfect! You have successfully reset your FMF platform account password. Log in now and start using it!</span>
              <div class="hcontainer hcenter">
                <el-button type="primary" class="next-btn" @click="$router.replace('/login')">Sign In Now</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>

    <!-- 图形验证码 -->
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="verifySuccess" />

    <div class="hcontainer vcenter flex-between footer">
      <span>© 2025 The Fetal Medicine Foundation</span>
      <span class="contactus">Contact us</span>
    </div>
  </div>
</template>

<script>
  import Verify from '@/components/verifition/Verify'
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
            { required: true, message: 'Please select your username', trigger: 'blur' }
          ]
        },
        countdown: 0,
        countdownInterval: null,
        userList: []
      }
    },
    methods: {
      verifySuccess() { 
        this.currentStep = '2'
        this.sendEmailCodeFn()
      },
      resendCode() {
        if (this.countdown > 0) {
          return
        }
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
              this.$utils.validateFormFields(this.$refs.formRef, ['code', 'fmfId','password', 'confirmPassword']).then(result => {
                if (result.isValid) {
                  self.resetPwdFn()
                  self.clearCountdown()
                }
              }).catch(err => err)
              break
            }
          // case '3':
          //   {
          //     this.$utils.validateFormFields(this.$refs.formRef, ['password', 'confirmPassword']).then(result => {
          //       if (result.isValid) {
          //         self.resetPwdFn()
          //       }
          //     }).catch(err => err)
          //     break
          //   }
          default:
            break;
        }
      },
      sendEmailCodeFn() {
        const reqData = {
          email: this.formData.email
        }
        this.$api.sendEmailCode(reqData).then(res => {
          if (res.code === 200 || res.code === 0) {
            if (!res.data || !Array.isArray(res.data.userList) || res.data.userList.length === 0 ) {
              this.$message.error('Sending email code not return userList!')
              return
            }
            this.userList = res.data.userList
            if (this.userList.length === 1) {
              this.formData.fmfId = this.userList[0].fmfId
            }
            this.$message.success('Verification code sent successfully')
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
      }
    },
    beforeDestroy() {
      this.clearCountdown()
    }
  }
</script>

<style lang="scss" scoped>
  .resetpwd {
    width: 100%;
    height: 100%;
    .content {
      width: 1000px;
      min-height: 544px;
      border-radius: 8px;
      padding: 30px;
      margin: 95px auto 0;
      background-color: #ffffff;
      .header {
        color: #8A9094;
        font-size: 14px;
        margin-bottom: 30px;
        .header-title {
          font-size: 24px;
          color: #0E3045;
          font-weight: bold;
        }
        .login-link {
          color: #036fc0;
          margin: 0 5px;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
        }
      }
      .tip {
        color: #8A9094;
        font-size: 14px;
        margin: 50px auto;
      }
      .next-btn {
        width: 244px;
        height: 48px;
        background-color: #036fc0;
        border-radius: 4px;
        margin-top: 40px;
      }
      .finish-container {
        font-size: 14px;
        color: #0E3045;
        text-align: center;
        padding: 20px 40px;
        .finish-title {
          font-size: 20px;
          font-weight: bold;
        }
      }
      .succ-icon {
        width: 126px;
        height: 86px;
        margin: 20px 0 10px;
      }
    }
    .footer {
      width: 1000px;
      margin: 20px auto 0;
      font-size: 14px;
      color: #8A9094;
      .contactus {
        color: #8A9094;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          color: #036fc0;
        }
      }
    }
  }
  /* 覆盖禁用状态的样式，使其看起来和正常状态一样 */
  ::v-deep .el-tabs__item.is-disabled {
    color: #8A9094;
    cursor: not-allowed;
  }
  /* 覆盖激活状态的样式 */
  ::v-deep .el-tabs__item.is-active.is-disabled {
    color: #3391C9;
  }
  ::v-deep .el-tabs__active-bar {
    background-color: #3391C9;
  }
</style>