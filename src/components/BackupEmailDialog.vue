<template>
  <el-dialog
    title="Tip"
    :visible.sync="visible"
    width="min(620px, calc(100vw - 16px))"
    top="8vh"
    custom-class="backup-email-dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    :destroy-on-close="true"
    @closed="handleClosed">
    <div class="backup-email-dialog-body">
      <p class="line-red">
        This email is registered as an alternative email and cannot be used to sign in.
      </p>
      <p class="line-blue">
        Please reset with your login email:<strong>{{ loginEmail }}</strong>.
      </p>
      <p class="line-blue">
        You may register a new account using this email; however, your existing data may not be transferred.
      </p>
      <p class="line-blue">
        If you no longer have access to your login email and wish to use your backup email for sign-in, please contact the site administrator for assistance.
      </p>
      <a class="line-link" href="mailto:education@fetalmedicine.org">education@fetalmedicine.org</a>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleReset">Reset with login email</el-button>
      <el-button type="primary" @click="handleGoRegistration">Go to registration</el-button>
    </span>
  </el-dialog>
</template>

<script>
import router from '@/router'

export default {
  name: 'BackupEmailDialog',
  data() {
    return {
      visible: false,
      loginEmail: ''
    }
  },
  methods: {
    handleReset() {
      this.visible = false
    },
    handleGoRegistration() {
      this.visible = false
      router.push('/registration')
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
.backup-email-dialog-body {
  padding: 0 4px;
  line-height: 1.7;
  word-break: break-word;
  overflow-wrap: anywhere;

  p {
    margin-bottom: 10px;
  }

  .line-red {
    color: #e00;
    font-size: 14px;
  }

  .line-blue {
    color: #1a6fa8;
    font-size: 14px;
  }

  .line-link {
    display: inline-block;
    color: #1a6fa8;
    font-size: 14px;
    text-decoration: underline;
  }
}
</style>

<style lang="scss">
.el-dialog.backup-email-dialog {
  max-width: calc(100vw - 16px);
}

.el-dialog.backup-email-dialog .el-dialog__body {
  max-height: min(72vh, calc(100vh - 140px));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.el-dialog.backup-email-dialog .dialog-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.el-dialog.backup-email-dialog .dialog-footer .el-button {
  white-space: normal;
}

@media (max-width: 480px) {
  .el-dialog.backup-email-dialog {
    margin-top: 6vh !important;
  }

  .el-dialog.backup-email-dialog .el-dialog__body {
    max-height: calc(100vh - 120px);
  }

  .el-dialog.backup-email-dialog .dialog-footer .el-button {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
