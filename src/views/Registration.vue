<template>
  <div class="registration">
    <div class="registration-content">
      <div class="registration-content-box">
        <div class="registration-content-box-header">
          <div class="registration-content-box-header-top">
            <h1>Registration</h1>
            <div class="login-link">
              <span>Existing account?</span>
              <a href="#" @click="$router.replace('/login')">Login</a>
              <img src="@/assets/img/icon/icon_jt.png" alt="">
            </div>
          </div>
          <!-- <p>If you want to proceed with the course, please register. Required fields are highlighted in red.</p> -->
        </div>
        <el-tabs :value="currentStep">
          <el-tab-pane label="①Create login credentials" name="1" disabled>
            <RegistrationStep1 @nextSuccess="step1NextSuccess"></RegistrationStep1>
          </el-tab-pane>
          <el-tab-pane label="②Supplemental information" name="2" disabled>
            <RegistrationStep2 @preSuccess="currentStep = '1'" @nextSuccess="step2NextSuccess"></RegistrationStep2>
          </el-tab-pane>
          <el-tab-pane label="③Registration completed" name="3" disabled>
            <RegistrationStep3></RegistrationStep3>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="hcontainer vcenter flex-between footer">
        <span>© 2026 The Fetal Medicine Foundation</span>
        <!-- <div class="contact"><a href="#">Contact us</a></div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import RegistrationStep1 from '@/components/RegistrationStep1.vue'
  import RegistrationStep2 from '@/components/RegistrationStep2.vue'
  import RegistrationStep3 from '@/components/RegistrationStep3.vue'

  export default {
    name: 'RegistrationPage',
    components: {
      RegistrationStep1,
      RegistrationStep2,
      RegistrationStep3
    },
    data() {
      return {
        currentStep: '1',
        registrationForm: {
          password: '',
          email: ''
        }
      }
    },
    methods: {
      step1NextSuccess(password, email) {
        console.log('password:', password, 'email:', email)
        this.registrationForm.password = password;
        this.registrationForm.email = email
        this.currentStep = '2'
      },
      step2NextSuccess(registrationData) {
        const self = this
        const reqData = {
          ...this.registrationForm,
          ...registrationData
        }
        this.$api.register(reqData).then(res => {
          if (res.code === 200 || res.code === 0) {
            self.currentStep = '3'
          }
        }).catch(err => {
          console.log('err:', err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
/* ── Page shell ─────────────────────────────────────────── */
.registration {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  background: linear-gradient(160deg, #eef4fb 0%, #f5f7fa 60%);
}

/* ── Content wrapper ─────────────────────────────────────── */
.registration-content {
  width: 100%;
  max-width: 960px;
  padding: 0 20px 40px;
  margin: 80px auto 0;
  box-sizing: border-box;
}

/* ── Main card ───────────────────────────────────────────── */
.registration-content-box {
  width: 100%;
  height: auto;
  padding: 36px 48px 32px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(14, 48, 69, 0.09), 0 2px 8px rgba(14, 48, 69, 0.05);
  overflow: visible;
}

/* ── Card header ─────────────────────────────────────────── */
.registration-content-box-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;

  h1 {
    font-size: 26px;
    font-weight: 700;
    color: #0e3045;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .login-link {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
    color: #8a9094;
    flex-shrink: 0;

    a {
      color: #036fc0;
      font-weight: 600;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    img {
      width: 14px;
      opacity: 0.7;
    }
  }
}

/* ── Footer ──────────────────────────────────────────────── */
.footer {
  padding: 18px 0;
  margin-top: 16px;
  border-top: 1px solid #e8edf3;
  font-size: 13px;
  color: #aab3bc;
  text-align: center;
}

/* ── El-Tabs — step bar ──────────────────────────────────── */
::v-deep .el-tabs {
  width: 100%;
}

::v-deep .el-tabs__header {
  margin-bottom: 0;
  border-bottom: none !important;
}

::v-deep .el-tabs__nav-wrap {
  background: #f0f5fb;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 8px;

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
  width: 33.33%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 8px;
  white-space: normal;
  word-break: break-word;
  line-height: 1.35;
  height: auto;
  color: #7a8b99 !important;
  border: none !important;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;

  &:hover { color: #036fc0 !important; }
}

::v-deep .el-tabs__item.is-active {
  background: #ffffff !important;
  color: #036fc0 !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(3, 111, 192, 0.15);
}

::v-deep .el-tabs__item.is-disabled {
  cursor: default;
}

::v-deep .el-tabs__active-bar {
  display: none !important;
}

::v-deep .el-form-item {
  margin-bottom: 20px !important;
}

/* ── Responsive ──────────────────────────────────────────── */

/* Tablet: ≤ 960px */
@media (max-width: 960px) {
  .registration-content {
    margin-top: 56px;
  }
  .registration-content-box {
    padding: 28px 32px 28px;
  }
}

/* Mobile: ≤ 767px */
@media (max-width: 767px) {
  .registration-content {
    margin-top: 24px;
    padding: 0 12px 32px;
  }
  .registration-content-box {
    padding: 20px 18px 24px;
    border-radius: 12px;
  }
  .registration-content-box-header-top {
    margin-bottom: 20px;
    h1 { font-size: 20px; }
    .login-link { font-size: 13px; }
  }

  ::v-deep .el-tabs__item {
    font-size: 12px;
    padding: 8px 4px;
  }
  ::v-deep .el-tabs__nav-wrap {
    border-radius: 10px;
    padding: 3px;
  }
}

/* Small mobile: ≤ 479px */
@media (max-width: 479px) {
  .registration-content {
    margin-top: 16px;
    padding: 0 8px 24px;
  }
  .registration-content-box {
    padding: 16px 14px 20px;
    border-radius: 10px;
  }
  .registration-content-box-header-top {
    h1 { font-size: 18px; }
  }

  ::v-deep .el-tabs__item {
    font-size: 11px;
    padding: 6px 2px;
  }
}
</style>