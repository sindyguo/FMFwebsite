<template>
  <el-dialog
    title="Tip"
    :visible.sync="dialogVisible"
    width="min(520px, calc(100vw - 16px))"
    top="8vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    custom-class="profile-incomplete-dialog">
    <template v-if="isFirstLogin">
      <p class="dialog-message">
        An account has been automatically created for this email address.
      </p>
      <p class="dialog-message">
        Please set your password and complete your profile in Own Page to ensure the
        correct details appear on your course certificate and other official documents.
      </p>
    </template>
    <template v-else>
      <p class="dialog-message">
        Your personal details have not yet been completed.
      </p>
      <p class="dialog-message">
        Please update your profile information prompty to ensure the correct details
        appear on your course certificate and other official documents.
      </p>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateNow">Update now</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProfileIncompleteDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    isFirstLogin() {
      return this.$store.state.user.loginCount === 0
    }
  },
  methods: {
    updateNow() {
      this.$emit('update:visible', false)
      this.$router.push('/personalInformation?isEdit=true')
    }
  }
}
</script>

<style lang="scss">
.profile-incomplete-dialog {
  border-radius: 8px;
  max-width: calc(100vw - 16px);
  box-sizing: border-box;

  .el-dialog__header {
    padding: 20px 24px 12px;
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #0E3045;
    }
  }

  .el-dialog__body {
    padding: 12px 24px 8px;
    box-sizing: border-box;
    max-height: min(70vh, calc(100vh - 160px));
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    .dialog-message {
      font-size: 15px;
      color: #4a5568;
      line-height: 1.7;
      margin: 0;
      word-break: break-word;
      overflow-wrap: anywhere;
      text-align: justify;
    }

    .dialog-message + .dialog-message {
      margin-top: 10px;
    }
  }

  .el-dialog__footer {
    padding: 12px 24px 20px;
    text-align: center;

    .el-button--primary {
      background-color: #036fc0;
      border-color: #036fc0;
      padding: 10px 40px;
      font-size: 15px;
      border-radius: 4px;
      white-space: normal;
      word-break: break-word;

      &:hover {
        background-color: #005a9c;
        border-color: #005a9c;
      }
    }
  }
}

@media (max-width: 480px) {
  .profile-incomplete-dialog {
    .el-dialog__header {
      padding: 16px 16px 10px;
      .el-dialog__title {
        font-size: 16px;
      }
    }

    .el-dialog__body {
      padding: 10px 16px 8px;

      .dialog-message {
        font-size: 14px;
      }
    }

    .el-dialog__footer {
      padding: 10px 16px 16px;

      .el-button--primary {
        width: 100%;
        padding: 10px 16px;
        font-size: 14px;
      }
    }
  }
}
</style>
