<template>
  <el-dialog
    :visible="dialogObj.visible"
    :title="dialogTitle"
    custom-class="login-account-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :destroy-on-close="true"
    v-loading="loading"
    element-loading-text="Please wait..."
    top="50vh"
    width="660px"
    @close="handleClose">
    <div id="loginConfirm-container" class="loginConfirm-container vcontainer vcenter hcenter content">
      <div class="loginConfirm-container-description">
        On the previous FMF website, this email address was linked to multiple accounts.
        Please select the FMF ID you would like to use to log in this time.
      </div>
      <div class="loginConfirm-container-section">
        <div class="loginConfirm-container-section-item" :class="{active: loginConfirmForm.fmfId == item.fmfId}" v-for="item in dialogObj.form.duplicateUserList" :key="item.id" @click="loginConfirmForm.fmfId=item.fmfId">
          <div class="loginConfirm-container-section-item-label">FMF ID: {{ item.fmfId }}<span v-if="item.lastChoice == 1">(lastChoice)</span></div>
          <el-radio v-model="loginConfirmForm.fmfId" :label="item.fmfId"> </el-radio>
        </div>
        <div class="loginConfirm-container-btn">
          <el-button type="primary" size="large" @click="handleLogin">login</el-button>
        </div>
        <el-checkbox v-model="loginConfirmForm.defaultAccount" true-label="1" false-label="0" :indeterminate="false">Set this account as the default for future logins.</el-checkbox>
        <div class="loginConfirm-container-note">
          Note: Other accounts linked to this email will no longer be able to log in using this email.
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
 export default {
  props: {
    loginForm: Object,
    innerOperate: Boolean,
    dialogObj: {
      type: Object,
      default: () => ({
        visible: false,
        form: {
          
        },
      })
    },
    loginMode: {
      type: String,
      default: 'password'
    }
  },
  computed: {
    dialogTitle() {
      return 'Select an Account'
    },
  },
  data() {
    return {
      loading: false,
      loginConfirmForm: {
        fmfId: null,
        defaultAccount: '0'
      }
    }
  },
  mounted() {
    this.dialogObj.form.duplicateUserList.map(item=> {
      if(item.lastChoice == 1) {
        this.loginConfirmForm.fmfId = item.fmfId
      }
    })
  },
  methods: {
    ...mapActions('user', ['login', 'emailCodeLogin', 'changeActiveId']),
    handleLogin() {
      let data = {
        ...this.loginForm,
        lastChoice: 1,
        ...this.loginConfirmForm
      }
      const loginAction = this.loginMode === 'code' ? this.emailCodeLogin : this.login
      loginAction(data).then((resp) => {
        if (resp.code === 200 || resp.code === 0) {
          if(resp.data.accessToken) {
            if(this.innerOperate) {
              this.$emit('update:visible', false)
            } else {
              this.changeActiveId('')
              if(localStorage.getItem('currentUrl') && localStorage.getItem('currentUrl').substring(1)){
                this.$router.replace({ path: localStorage.getItem('currentUrl').substring(1) });
              }else{
                this.$router.replace({ path: '/' });
              }
            }
          }
        }
      }).catch((err) => {
        console.log('Login failed:', err);
      });
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
  }
 }
</script>

<style lang="scss">
.loginConfirm-container {
  max-width: 100%;
  box-sizing: border-box;

  &-description {
    line-height: 24px;
    margin-bottom: 32px;
    font-size: 14px;
    word-break: break-word;
    overflow-wrap: anywhere;
    hyphens: auto;
  }
  &-section {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px 12px;
      background: #eee;
      padding: 16px 12px;
      margin-bottom: 16px;
      border-radius: 6px;
      color: #333;
      min-width: 0;
      box-sizing: border-box;
      &-label {
        font-size: 16px;
        flex: 1 1 auto;
        min-width: 0;
        word-break: break-word;
        overflow-wrap: anywhere;
        span {
          color: #999;
          margin-left: 12px;
        }
      }
      .el-radio__inner {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        &::after {
          width: 10px;
          height: 13px;
          background: transparent;
          content: '√';
          color: #fff;
        }
      }
      .el-radio__label {
        display: none;
      }
      &.active {
        background: rgba($color: #c6dffa, $alpha: .3);
      }
    }

    .el-checkbox {
      width: 100%;
      align-items: flex-start;
      white-space: normal;
    }

    .el-checkbox__label {
      font-size: 16px;
      white-space: normal;
      line-height: 1.45;
      word-break: break-word;
      overflow-wrap: anywhere;
    }
  }
  &-btn {
    width: 100%;
    text-align: center;
    padding: 40px 0 28px;
    box-sizing: border-box;

    .el-button {
      width: min(280px, 100%);
      max-width: 100%;
      box-sizing: border-box;
    }
  }
  &-note {
    color: red;
    font-size: 15px;
    padding-top: 12px;
    line-height: 1.45;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}

/* Multi-account dialog: fit narrow viewports (append-to-body) */
.el-dialog.login-account-dialog {
  width: min(660px, calc(100vw - 24px)) !important;
  max-width: 100%;
  box-sizing: border-box;
  margin-left: auto !important;
  margin-right: auto !important;
  transform: translateY(-50%);
}

.el-dialog.login-account-dialog .el-dialog__header {
  padding: 12px 16px;
  box-sizing: border-box;
}

.el-dialog.login-account-dialog .el-dialog__title {
  line-height: 1.35;
  word-break: break-word;
  padding-right: 28px;
}

.el-dialog.login-account-dialog .el-dialog__body {
  padding: 12px 16px 20px !important;
  box-sizing: border-box;
  max-height: min(75vh, calc(100vh - 120px));
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 480px) {
  .el-dialog.login-account-dialog {
    width: calc(100vw - 16px) !important;
    transform: translateY(-50%);
  }

  .el-dialog.login-account-dialog .el-dialog__body {
    padding: 10px 12px 16px !important;
    max-height: calc(100vh - 100px);
  }

  .loginConfirm-container {
    &-description {
      font-size: 13px;
      margin-bottom: 20px;
    }

    &-section-item {
      padding: 12px 10px;

      &-label {
        font-size: 14px;
      }
    }

    &-btn {
      padding: 24px 0 20px;

      .el-button {
        width: 100%;
      }
    }

    .el-checkbox__label {
      font-size: 14px;
    }

    &-note {
      font-size: 13px;
    }
  }
}
</style>