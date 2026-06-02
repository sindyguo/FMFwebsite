<template>
  <el-dialog
    title="Tip"
    :visible.sync="visible"
    width="min(620px, calc(100vw - 16px))"
    top="8vh"
    custom-class="alt-email-dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    :destroy-on-close="true"
    @closed="handleClosed">
    <div class="alt-email-dialog-body">
      <p class="alt-email-dialog-primary">
        This email is registered as an alternative email and cannot be used to sign in.
      </p>
      <p class="alt-email-dialog-secondary">
        Please sign in using your login email：<strong>{{ loginEmail }}</strong>，or contact us if you no longer have access to your login email.
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">Use another email</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AlternativeEmailDialog',
  data() {
    return {
      visible: false,
      loginEmail: ''
    }
  },
  methods: {
    handleClose() {
      this.visible = false
    },
    handleClosed() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
      this.$destroy()
    }
  }
}
</script>

<style lang="scss" scoped>
.alt-email-dialog-body {
  padding: 0 4px;
  line-height: 1.6;
  word-break: break-word;
  overflow-wrap: anywhere;

  .alt-email-dialog-primary {
    color: #e00;
    font-size: 14px;
    margin-bottom: 12px;
  }

  .alt-email-dialog-secondary {
    color: #1a6fa8;
    font-size: 14px;
  }
}
</style>

<style lang="scss">
.el-dialog.alt-email-dialog {
  max-width: calc(100vw - 16px);
}

.el-dialog.alt-email-dialog .el-dialog__body {
  max-height: min(72vh, calc(100vh - 140px));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.el-dialog.alt-email-dialog .dialog-footer .el-button {
  max-width: 100%;
  white-space: normal;
}

@media (max-width: 480px) {
  .el-dialog.alt-email-dialog {
    margin-top: 6vh !important;
  }

  .el-dialog.alt-email-dialog .el-dialog__body {
    max-height: calc(100vh - 120px);
  }

  .el-dialog.alt-email-dialog .dialog-footer {
    display: flex;
    justify-content: center;
  }

  .el-dialog.alt-email-dialog .dialog-footer .el-button {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
