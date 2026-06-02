<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view v-if="isRefresh"/>
    <AutoHelpRobot />
    <el-dialog
      title="login"
      :visible.sync="dialogObj.visible"
      custom-class="congress-login-dialog"
      append-to-body
      top="33vh"
      width="min(620px, calc(100vw - 16px))"
      @close="dialogObj.visible = false"
      >
        <div class="congress-login-dialog-body">
          <LoginForm v-if="dialogObj.visible" :innerOperate="true" loginModeProp="code"/>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'
import AutoHelpRobot from '@/components/AutoHelpRobot.vue'
import { mapActions } from 'vuex'
let designWidth = 1920;
let designHeight = 1080;
export default {
  name: 'App',
  components: {
    AutoHelpRobot,
    LoginForm
  },
  provide() {
    return {
      refreshTokenFn: this.refreshTokenFn
    }
  },
  data() {
    return {
      loginMode: 'password',
      contentData: {},
      timer: null,
      dialogObj: {
        visible: false,
        form: {}
      },
      isRefresh: true,
    };
  },
  computed: {
    needLogin() {
      return this.$store.state.user.needLogin;
    },
  },
  watch: {
    needLogin(newVal) {
      if(newVal) {
        this.dialogObj.visible = true;
      } else {
        this.dialogObj.visible = false;
        this.isRefresh = false;
        this.$nextTick(() => {
          this.isRefresh = true
        })
      }
    }
  },
  mounted() {
    // this.keepFit();
    // window.addEventListener('resize', () => {
    //   this.keepFit();
    // });
    // console.log(process.env)
  },
  methods: {
    ...mapActions('content', ['getContentData']),
    getConfigurationFn() { 
      this.$api.getConfiguration().then(res => { 
        this.contentData = this.transformContentData(res.data.list)
        console.log(this.contentData)
      })
    },
    keepFit() {
      let dom = document.querySelector('#app');
      let clientWidth = document.documentElement.clientWidth;
      let clientHeight = document.documentElement.clientHeight;
      let scale = (clientWidth / clientHeight < designWidth / designHeight) ? (clientWidth / designWidth) : (clientHeight / designHeight);
      /** +1 目的为处理精度计算丢失问题，通过overflow：hidden控制缩放后由于精度丢失导致浏览器出现宽度或高度空白区域问题 */
      dom.style.height = `${Math.ceil(1 + clientHeight / scale)}px`;
      dom.style.width = `${Math.ceil(1 + clientWidth / scale)}px`;
      dom.style.transformOrigin = `0 0`;

      console.log(scale);
      dom.style.transform = `scale(${scale})`;
    },
    async refreshTokenFn(force = true) {
      if(!this.$store.state.user.refreshToken) {
        this.$store.commit('user/SET_TOKEN', '');
        this.$store.commit('user/SET_REFRESH_TOKEN', '');
        if(force) {
          this.$store.commit('user/SET_NEED_LOGIN', true);
        }
        return;
      } else {
        try {
          const res = await this.$api.refreshToken(this.$store.state.user.refreshToken);
          if (res.code === 0) {
            this.$store.commit('user/SET_TOKEN', res.data?.accessToken || '');
            this.$store.commit('user/SET_REFRESH_TOKEN', res.data?.refreshToken || '');
          }
        } catch (error) {
          console.log('刷新token失败', error)
        }
      }
      
    },
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  async created() { 
    await this.getContentData()
  },
}
</script>
<style lang="scss">
  html,body{
    font-family: Helvetica !important;
  }
  .cursor {
    cursor: pointer;
  }
  .link-span {
    @extend .cursor;
    color: #036FC0 !important;
    &:hover {
      color: #5fb3f4 !important;
      div, span {
        color: #5fb3f4 !important;
      }
    }
  }
  .el-input__inner{
    font-size: 18px !important;
  }
  .el-form-item__label{
    font-size: 18px !important;
    font-weight: normal !important;
  }
  .el-select-dropdown__item{
    font-size: 18px !important;
  }
  .el-tree-node__expand-icon{
    color: #036fc0;
  }
  .el-textarea__inner{
    font-size: 18px !important;
    font-family: Helvetica;
  }
  .el-button--primary{
    background-color: #036fc0 !important;
    border-color: #036fc0 !important;
  }
  .el-submenu__title{
    font-size: 18px !important;
  }

  /* Login dialog (group/individual unauthenticated) */
  .congress-login-dialog-body {
    padding: 20px;
    box-sizing: border-box;
  }

  ::v-deep .el-dialog.congress-login-dialog {
    width: min(620px, calc(100vw - 24px)) !important;
    max-width: calc(100vw - 16px);
    margin-left: auto !important;
    margin-right: auto !important;
    transform: none !important;
    box-sizing: border-box;
  }

  ::v-deep .el-dialog.congress-login-dialog .el-dialog__header {
    padding: 12px 16px;
    box-sizing: border-box;
  }

  ::v-deep .el-dialog.congress-login-dialog .el-dialog__title {
    line-height: 1.35;
    word-break: break-word;
    padding-right: 24px;
  }

  ::v-deep .el-dialog.congress-login-dialog .el-dialog__body {
    padding: 0 !important;
    max-height: min(76vh, calc(100vh - 120px));
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  ::v-deep .el-dialog.congress-login-dialog .el-button {
    white-space: normal !important;
    word-break: break-word;
    line-height: 1.35;
    height: auto !important;
    min-height: 40px;
  }

  /* Only affect LoginForm rendered in this dialog */
  @media (max-width: 767px) {
    .congress-login-dialog-body {
      padding: 14px;
    }

    ::v-deep .el-dialog.congress-login-dialog .login-form .el-form-item {
      display: block !important;
      width: 100% !important;
      margin-bottom: 10px !important;
    }

    ::v-deep .el-dialog.congress-login-dialog .login-form .el-form-item__label {
      display: block !important;
      width: 100% !important;
      text-align: left !important;
      padding-bottom: 4px !important;
      padding-right: 0 !important;
      font-size: 13px !important;
      line-height: 1.35 !important;
      white-space: normal !important;
    }

    ::v-deep .el-dialog.congress-login-dialog .login-form .el-form-item__content {
      margin-left: 0 !important;
      width: 100%;
      min-width: 0;
    }

    ::v-deep .el-dialog.congress-login-dialog .email-row {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      flex-wrap: wrap;
      min-width: 0;
    }

    ::v-deep .el-dialog.congress-login-dialog .email-row .el-input {
      width: 100% !important;
      min-width: 0;
    }

    ::v-deep .el-dialog.congress-login-dialog .email-row .verify-btn {
      width: 100% !important;
      margin-left: 0 !important;
    }
  }

  @media (max-width: 480px) {
    .congress-login-dialog-body {
      padding: 12px;
    }

    ::v-deep .el-dialog.congress-login-dialog {
      width: calc(100vw - 16px) !important;
      max-width: calc(100vw - 16px);
      margin-top: 3vh !important;
    }
  }
.form_subTitle {
  line-height: 30px;
  padding-left: 8px;
  color: #000;
  background: #f0f5f7;
  border: 1px solid #d1e9f3;
  font-weight: bold;
}
</style>

