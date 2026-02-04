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
          <p>If you want to proceed with the course, please register. Required fields are highlighted in red.</p>
        </div>
        <el-tabs :value="currentStep">
          <el-tab-pane label="①Set login name" name="1" disabled>
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
        <span>© 2025 The Fetal Medicine Foundation</span>
        <div class="contact"><a href="#">Contact us</a></div>
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
          username: '',
          password: ''
        }
      }
    },
    methods: {
      step1NextSuccess(username, password) {
        this.registrationForm.username = username;
        this.registrationForm.password = password;
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
.registration {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  background-color: #f5f7fa;
  &-content {
    width: 920px;
    margin: 95px auto 0;
    &-box {
      width: 100%;
      height: 847px;
      padding: 30px 40px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      &-header {
        h1 {
          font-size: 24px;
          color: #0E3045;
          margin: 0;
          font-weight: 600;
        }
        p {
          font-size: 14px;
          color: #8A9094;
          margin: 16px 0;
        }
        &-top {
          display: flex;
          justify-content: space-between;
          .login-link {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 14px;
            color: #8A9094;
            margin-top: 10px;
            a {
              color: #036fc0;
              text-decoration: none;
              font-weight: 600;
              margin-left: 5px;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
}

// .step-number {
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   background-color: #036fc0;
//   color: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: bold;
//   margin-bottom: 5px;
// }

// .step-text {
//   font-size: 14px;
//   color: #8A9094;
// }

// .form-content {
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// }

// .step-form {
//   display: block;
//   margin: 80px auto;
// }

// .el-form-item__label {
//   font-weight: normal;
//   color: #0E3045;
// }

// .el-form-item__content {
//   margin-left: 120px;
// }

// .el-input {
//   width: 100%;
// }

// .el-button--primary {
//   background-color: #036fc0;
//   border-color: #036fc0;
//   color: white;
// }

// .el-button--primary:hover {
//   background-color: #005a9c;
//   border-color: #005a9c;
// }

// .el-button--default {
//   background-color: #fff;
//   border-color: #dcdfe6;
//   color: #606266;
// }

// .step-buttons {
//   display: flex;
//   justify-content: flex-end;
//   margin-top: 30px;
// }

// .completion-screen {
//   text-align: center;
//   padding: 40px;
// }

// .success-icon {
//   font-size: 60px;
//   color: #4CAF50;
//   margin-bottom: 20px;
// }

// .success-message {
//   font-size: 24px;
//   color: #0E3045;
//   margin-bottom: 20px;
// }

// .confirmation-text {
//   font-size: 14px;
//   color: #8A9094;
//   margin-bottom: 30px;
//   line-height: 1.5;
// }

// .action-buttons {
//   display: flex;
//   justify-content: center;
// }

.footer {
  padding: 20px 0;
  border-top: 1px solid #e4e7ed;
  font-size: 14px;
  color: #8A9094;
  .contact a {
    color: #8A9094;
    text-decoration: none;
    &:hover {
      color: #036fc0;
      text-decoration: underline;
    }
  }
}

::v-deep .el-tabs__nav {
  width: 100%;
}
::v-deep .el-tabs {
  width: 100%;
}
::v-deep .el-tabs__item {
  width: 33.33%;
  text-align: center;
}

/* 覆盖禁用状态的样式，使其看起来和正常状态一样 */
::v-deep .el-tabs__item.is-disabled {
  color: #303133;
  /* 正常状态下的字体颜色 */
  cursor: not-allowed;
  /* 或者 default，根据需要 */
}
/* 如果需要，也可以覆盖激活状态的样式 */
::v-deep .el-tabs__item.is-active.is-disabled {
  color: #409EFF;
  /* 激活状态下的颜色 */
}
</style>