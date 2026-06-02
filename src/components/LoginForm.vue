<template>
  <div>
    <div class="fill vcontainer loginForm">
      <div class="form-header">
        <span class="please">Please log in</span>
        <div class="mode-toggle" v-if="!isOAuthMode && innerOperate" @click="toggleMode">
          <span v-if="loginMode === 'password'">Login with verification code</span>
          <span v-else>Login with password</span>
          <img src="@/assets/img/icon/icon_jt.png" alt="">
        </div>
      </div>

      <!-- Password login form -->
      <el-form
        v-if="loginMode === 'password'"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        ref="loginForm"
        class="login-form"
        @keyup.enter.native="handleLogin"
        label-width="130px">
        <el-form-item label="Email" prop="email">
          <el-input v-model="loginForm.email" placeholder="Please enter" clearable></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="loginForm.password" placeholder="Please enter"
            show-password @keyup.enter="handleLogin"></el-input>
        </el-form-item>
      </el-form>

      <!-- Verification code login form -->
      <el-form
        v-if="loginMode === 'code'"
        :model="codeForm"
        :rules="codeRules"
        label-position="left"
        ref="codeForm"
        class="login-form"
        label-width="160px">
        <el-form-item label="Email" prop="email">
          <div class="hcontainer email-row">
            <el-input v-model="codeForm.email" placeholder="Please enter" clearable style="flex:1"></el-input>
            <el-button
              class="verify-btn"
              :disabled="countdown > 0"
              @click="sendVerifyCode">
              {{ countdown > 0 ? `Resend (${countdown}s)` : 'Verify my email' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="Verification code" prop="code">
          <el-input v-model="codeForm.code" placeholder="Please enter" @keyup.enter.native="handleCodeLogin"></el-input>
        </el-form-item>
      </el-form>

      <el-button class="login-submit-btn" type="primary" @click="loginMode === 'password' ? handleLogin() : handleCodeLogin()" style="width: 100%;">
        {{ loginMode === 'password' ? 'Login' : 'Login or create an account using this email' }}
      </el-button>
      <div class="hcontainer vcenter flex-between footer-links" v-if="!innerOperate">
        <a class="registration" @click="goto('/registration')">New registration</a>
        <a class="reset-pwd" @click="goto('/resetPwd')">Forgotten your password?</a>
      </div>
    </div>
    <loginConfirmDialog v-if="dialogObj.visible" :loginMode="loginMode" :loginForm="loginMode === 'password' ? loginForm : codeForm" :visible.sync="dialogObj.visible" :innerOperate="innerOperate" :dialogObj="dialogObj" />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import loginConfirmDialog from '@/components/loginConfirmDialog'
  import { showAlternativeEmailDialog, showAlternativeEmailForCodeLoginDialog } from '@/utils/showAlternativeEmailDialog'
  export default {
    name: 'loginPage',
    props: ['innerOperate', 'loginModeProp'],
    components: {
      loginConfirmDialog
    },
    data() {
      const validateEmail = (rule, value, callback) => {
        if (!value) {
          callback(new Error('Please input your email'));
        } else {
          callback();
        }
      };

      return {
        loginMode: 'password',
        loginForm: {
          email: '',
          password: '',
          login_user_type: 'student'
        },
        loginRules: {
          email: [
            { required: true, trigger: 'blur', validator: validateEmail }
          ],
          password: [
            { required: true, message: 'Please input your password', trigger: 'blur' }
          ]
        },
        codeForm: {
          email: '',
          code: '',
          login_user_type: 'student'
        },
        codeRules: {
          email: [
            { required: true, trigger: 'blur', validator: validateEmail }
          ],
          code: [
            { required: true, message: 'Please input verification code', trigger: 'blur' }
          ]
        },
        countdown: 0,
        countdownTimer: null,
        dialogObj: {
          visible: false,
          form: {}
        },
        isOAuthMode: false,
        oauthParams: {}
      }
    },
    methods: {
      ...mapActions('user', ['login', 'emailCodeLogin', 'changeActiveId']),
      toggleMode() {
        this.loginMode = this.loginMode === 'password' ? 'code' : 'password';
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.login(this.loginForm).then((resp) => {
              if (resp.code === 200 || resp.code === 0) {
                if (resp.data.accessToken) {
                  this.changeActiveId('')
                  this.setPendingProfileCheck()
                  if (this.isOAuthMode) {
                    this.handleOAuthRedirect()
                  } else if (localStorage.getItem('currentUrl') && localStorage.getItem('currentUrl').substring(1)) {
                    this.$router.replace({ path: localStorage.getItem('currentUrl').substring(1) });
                  } else {
                    this.$router.replace({ path: '/' });
                  }
                } else {
                  if(resp.data.alternativeEmailForLoginEmailList && resp.data.alternativeEmailForLoginEmailList.length > 0) {
                    showAlternativeEmailDialog(resp.data.alternativeEmailForLoginEmailList.join(','));
                  }else {
                    this.dialogObj.visible = true;
                    this.dialogObj.form = resp.data;
                  }
                }
              }
            }).catch(() => {
              console.log('Login failed');
            });
          }
        });
      },
      sendVerifyCode() {
        if (!this.codeForm.email) {
          this.$message.warning('Please input your email first');
          return;
        }
        this.$api.sendLoginEmailCode({ email: this.codeForm.email }).then(resp => {
          if (resp.code === 200 || resp.code === 0) {
            if (resp.data.alternativeEmailForLoginEmailList && resp.data.alternativeEmailForLoginEmailList.length > 0) {
              showAlternativeEmailForCodeLoginDialog(resp.data.alternativeEmailForLoginEmailList);
            } else {
              this.$message.success('Verification code sent to your email');
              this.countdown = 60;
              this.countdownTimer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                  clearInterval(this.countdownTimer);
                }
              }, 1000);
            }
          }
        }).catch(() => {
          this.$message.error('Failed to send verification code');
        });
      },
      handleCodeLogin() {
        this.$refs.codeForm.validate(valid => {
          if (valid) {
            this.emailCodeLogin(this.codeForm).then((resp) => {
              if (resp.code === 200 || resp.code === 0) {
                if (resp.data.accessToken) {
                  this.changeActiveId('')
                  this.setPendingProfileCheck()
                  if (this.isOAuthMode) {
                    this.handleOAuthRedirect()
                  } else if (localStorage.getItem('currentUrl') && localStorage.getItem('currentUrl').substring(1)) {
                    this.$router.replace({ path: localStorage.getItem('currentUrl').substring(1) });
                  } else {
                    this.$router.replace({ path: '/' });
                  }
                } else {
                  this.dialogObj.visible = true;
                  this.dialogObj.form = resp.data;
                }
              }
            }).catch(() => {
              console.log('Login failed');
            });
          }
        });
      },
      async handleOAuthRedirect() {
        try {
          const res = await this.$api.oauthAuthorize(this.oauthParams)
          if ((res.code === 200 || res.code === 0) && res.data) {
            window.location.href = res.data
          }
        } catch (error) {
          console.error('OAuth authorize failed:', error)
        }
      },
      setPendingProfileCheck() {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
          if (!userInfo.firstName || !userInfo.lastName) {
            localStorage.setItem('pendingProfileCheck', '1')
          }
        } catch {
          // ignore
        }
      },
      goto(e) {
        this.$router.push(e)
      }
    },
    created() {
      this.loginModeProp && (this.loginMode = this.loginModeProp);
      const query = this.$route.query
      if (query.response_type) {
        this.isOAuthMode = true
        this.oauthParams = {
          response_type: query.response_type,
          client_id: query.client_id,
          state: query.state,
          scope: query.scope,
          redirect_uri: query.redirect_uri
        }
      }
    },
    beforeDestroy() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
    }
  }
</script>

<style lang="scss" scoped>
/* ── Form container ──────────────────────────────────────── */
.loginForm {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  color: #8a9094;

  /* ── Heading row ─────────────────────────────────────── */
  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .please {
    font-size: 22px;
    font-weight: 700;
    color: #0e3045;
    letter-spacing: -0.3px;
  }

  /* ── Mode toggle link ────────────────────────────────── */
  .mode-toggle {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 13px;
    font-weight: 500;
    color: #036fc0;
    cursor: pointer;
    flex-shrink: 0;
    border: 1px solid #cde0f2;
    border-radius: 20px;
    padding: 4px 10px;
    background: #f0f7ff;
    transition: background 0.2s, border-color 0.2s;

    img {
      width: 12px;
      opacity: 0.7;
    }

    &:hover {
      background: #dceffe;
      border-color: #036fc0;
    }
  }

  /* ── Verify-email button (code-login mode) ───────────── */
  .email-row {
    display: flex;
    align-items: stretch;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
    min-width: 0;

    .el-input {
      flex: 1 1 0;
      min-width: 0;
    }

    .verify-btn {
      white-space: nowrap;
      height: 42px;
      border-radius: 10px !important;
      background-color: #036fc0;
      border-color: #036fc0;
      color: #ffffff;
      font-weight: 600;

      &:hover:not(.is-disabled) {
        background-color: #005a9c;
        border-color: #005a9c;
      }

      &.is-disabled {
        background-color: #a0c4e0;
        border-color: #a0c4e0;
        color: #fff;
      }
    }
  }

  .login-submit-btn {
    white-space: normal;
    word-break: break-word;
    line-height: 1.35;
    height: auto;
    min-height: 42px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  /* ── Footer links ────────────────────────────────────── */
  .footer-links {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #edf2f7;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;

    .registration {
      color: #036fc0;
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    .reset-pwd {
      color: #7a8b99;
      cursor: pointer;
      text-decoration: none;
      font-size: 13px;
      &:hover { color: #036fc0; }
    }
  }
}

/* ── Responsive ──────────────────────────────────────────── */

/* Mobile: ≤ 767px */
@media (max-width: 767px) {
  .loginForm {
    .please { font-size: 19px; }

    .mode-toggle {
      font-size: 12px;
      padding: 3px 8px;
    }

    ::v-deep .login-form .el-form-item {
      display: block;
      margin-bottom: 10px;
    }

    ::v-deep .login-form .el-form-item__label {
      float: none;
      display: block;
      width: 100% !important;
      text-align: left;
      line-height: 1.35;
      padding: 0 0 4px;
      white-space: normal;
    }

    ::v-deep .login-form .el-form-item__content {
      margin-left: 0 !important;
      width: 100%;
      min-width: 0;
    }

    .footer-links {
      margin-top: 16px;
      padding-top: 14px;
      font-size: 13px;
    }
  }
}

/* Small mobile: ≤ 479px */
@media (max-width: 479px) {
  .loginForm {
    .please { font-size: 17px; }

    .email-row {
      flex-direction: column;
      align-items: stretch;
    }

    .email-row .verify-btn {
      width: 100%;
      white-space: normal;
    }

    .footer-links {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
}
</style>

