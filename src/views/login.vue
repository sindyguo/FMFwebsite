<template>
  <div class="vcontainer vcenter hcenter login">
    <div class="hcontainer login-container">
      <div class="vcontainer flex-between login-left">
        <img src="@/assets/img/logo.svg" class="logo-img cursor" alt="" @click="$router.replace('/')">
        <span class="markInfo">Note to new users: if you don't have an account on FMF website, please register to attend the FMF courses. </span>
      </div>
      <div class="login-right">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import LoginForm from '@/components/LoginForm'
  import { showAlternativeEmailDialog, showAlternativeEmailForCodeLoginDialog } from '@/utils/showAlternativeEmailDialog'
  export default {
    name: 'loginPage',
    components: {
      LoginForm,
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
/* ── Page shell ──────────────────────────────────────────── */
.login {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(150deg, #e8f2fb 0%, #f0f4f8 55%, #edf5f0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  box-sizing: border-box;
}

/* ── Main card ───────────────────────────────────────────── */
.login-container {
  width: 100%;
  max-width: 900px;
  min-height: 460px;
  height: auto;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(14, 48, 69, 0.12), 0 4px 16px rgba(14, 48, 69, 0.06);
  overflow: hidden;
  padding: 0;

  /* ── Left info panel ─────────────────────────────────── */
  .login-left {
    flex-shrink: 0;
    width: 360px;
    padding: 48px 36px;
    background: linear-gradient(170deg, #f0f7ff 0%, #e4eff9 100%);
    border-right: 1px solid #d4e5f5;
    justify-content: center;
    gap: 28px;

    .logo-img {
      width: 160px;
      height: auto;
      cursor: pointer;
      flex-shrink: 0;
    }
  }

  /* ── Right form panel ────────────────────────────────── */
  .login-right {
    flex: 1;
    min-width: 0;
    padding: 48px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

/* ── Note text ───────────────────────────────────────────── */
.markInfo {
  font-size: 14px;
  line-height: 1.7;
  color: #5a7a99;
  text-align: left;
  background: rgba(255,255,255,0.55);
  border-left: 3px solid #92c0e8;
  border-radius: 0 6px 6px 0;
  padding: 10px 14px;
}

/* ── Responsive ──────────────────────────────────────────── */

/* Tablet: ≤ 960px */
@media (max-width: 960px) {
  .login-container {
    max-width: 740px;
    .login-left {
      width: 300px;
      padding: 40px 28px;
    }
    .login-right {
      padding: 40px 32px;
    }
  }
}

/* Mobile: ≤ 767px */
@media (max-width: 767px) {
  .login {
    padding: 20px 14px 32px;
  }

  .login-container {
    flex-direction: column !important;
    max-width: 100%;
    min-height: auto;
    border-radius: 16px;

    .login-left {
      flex-direction: row !important;
      align-items: center;
      width: 100%;
      padding: 20px 20px;
      border-right: none;
      border-bottom: 1px solid #d4e5f5;
      background: linear-gradient(135deg, #f0f7ff 0%, #e8f2fb 100%);
      gap: 14px;
      justify-content: flex-start;

      .logo-img {
        width: 110px;
        height: auto;
      }
    }

    .login-right {
      padding: 28px 22px 32px;
    }
  }

  .markInfo {
    font-size: 12px;
    line-height: 1.6;
    flex: 1;
    border-left-width: 2px;
    padding: 8px 10px;
  }
}

/* Small mobile: ≤ 479px */
@media (max-width: 479px) {
  .login {
    padding: 12px 10px 24px;
  }

  .login-container {
    border-radius: 12px;

    .login-left {
      padding: 16px 16px;
      .logo-img { width: 92px; }
    }

    .login-right {
      padding: 22px 16px 28px;
    }
  }
}
</style>

<style lang="scss">
/* ── Global form overrides (used inside LoginForm) ────────── */
.login-form {
  margin: 24px 0 20px;

  .el-form-item {
    margin-bottom: 18px !important;
  }

  .el-form-item__label {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #3d5166 !important;
    line-height: 1.4 !important;
  }

  .el-input__inner {
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

  /* password eye icon alignment */
  .el-input__suffix {
    display: flex;
    align-items: center;
  }
}

/* ── Primary button (global, inside login page) ───────────── */
.login .el-button--primary,
.loginForm .el-button--primary {
  height: 50px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  letter-spacing: 0.3px !important;
  background: linear-gradient(135deg, #036fc0 0%, #0256a0 100%) !important;
  border-color: #036fc0 !important;
  box-shadow: 0 4px 14px rgba(3, 111, 192, 0.3) !important;
  transition: opacity 0.2s, box-shadow 0.2s !important;

  &:hover {
    opacity: 0.92 !important;
    box-shadow: 0 6px 18px rgba(3, 111, 192, 0.38) !important;
  }
}

/* Mobile: compact form */
@media (max-width: 767px) {
  .login-form {
    margin: 16px 0 16px;

    .el-input__inner {
      height: 44px !important;
      line-height: 44px !important;
    }
  }
}
</style>
