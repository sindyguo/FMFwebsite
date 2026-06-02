<template>
  <el-dialog
    :visible="visible"
    title="The Fetal Medicine Foundation"
    class="terms-dialog"
    append-to-body
    top="5vh"
    width="800px"
    @close="handleClose">
    <div class="terms-content">
      <div class="terms-scroll">
        <h2 class="section-title">Terms and Conditions</h2>
        <ol class="terms-list">
          <li class="term-item">
            You consent to the Fetal Medicine Foundation (FMF) storing your personal data, your progress in FMF courses.
          </li>
          <li class="term-item">
            You consent to receive occasional email messages from the FMF promoting congresses, updates to the software or new initiatives in prenatal medicine. However, you will always be able to unsubscribe from these messages.
          </li>
          <li class="term-item">
            The FMF will not pass your details to any third party unless requested to do so by you.
          </li>
          <li class="term-item">
            Any text or images displayed in the FMF courses may be copied for educational purposes provided that the source of the copied information is stated, preferably with a link to the FMF website.
          </li>
          <li class="term-item">
            The FMF continually reviews and updates the information in its courses; however, it does not accept any liability for any errors or omissions in its materials.
          </li>
        </ol>
      </div>
      <div class="hcontainer vcenter flex-between cme-section">
        <span @click="cmeClick" class="cme-link"></span>
        <el-button type="primary" class="terms-close-btn" @click="handleClose">Close</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'TermsDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
      }
    },
    methods: {
      handleClose() {
        this.$emit('close')
      },
      cmeClick() {
        const { origin, pathname } = window.location 
        window.open(`${origin}${pathname}#/cme`, '_blank')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .terms-dialog {
    .terms-content {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      box-sizing: border-box;
    }

    .terms-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px 20px 8px;
      box-sizing: border-box;
    }

    .section-title {
      color: #0e3045;
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 16px;
      word-break: break-word;
    }

    .terms-list {
      padding-left: 20px;
      margin: 0;
      box-sizing: border-box;

      .term-item {
        color: #0e3045;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 15px;
        text-align: left;
        word-break: break-word;
        overflow-wrap: anywhere;
        hyphens: auto;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .cme-section {
      flex-shrink: 0;
      padding: 16px 20px 20px;
      border-top: 1px solid #ecf1f5;
      gap: 12px;
      flex-wrap: wrap;
      box-sizing: border-box;
    }

    .terms-close-btn {
      flex-shrink: 0;
    }

    .cme-link {
      color: #036fc0;
      font-size: 14px;
      text-decoration: underline;
      cursor: pointer;
      min-width: 0;
      word-break: break-word;

      &:hover {
        color: #004080;
      }
    }
  }

  ::v-deep .el-dialog {
    width: min(800px, calc(100vw - 24px)) !important;
    max-width: 100%;
    margin-left: auto !important;
    margin-right: auto !important;
    margin-bottom: 8px !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 10vh);
  }

  ::v-deep .el-dialog__header {
    flex-shrink: 0;
    background-color: #ecf1f5;
    color: #0e3045;
    font-size: 16px;
    padding: 12px 16px;
    text-align: center;
    box-sizing: border-box;
  }

  ::v-deep .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.35;
    white-space: normal;
    word-break: break-word;
    padding: 0 8px;
    display: inline-block;
    max-width: 100%;
  }

  ::v-deep .el-dialog__body {
    flex: 1 1 auto;
    min-height: 0;
    padding: 0;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 480px) {
    .terms-dialog {
      .terms-scroll {
        padding: 12px 14px 6px;
      }

      .section-title {
        font-size: 16px;
      }

      .terms-list .term-item {
        font-size: 13px;
      }

      .cme-section {
        padding: 12px 14px 16px;
        flex-direction: column;
        align-items: stretch !important;

        .terms-close-btn {
          width: 100%;
          margin-left: 0 !important;
        }
      }
    }

    ::v-deep .el-dialog {
      width: calc(100vw - 16px) !important;
    }

    ::v-deep .el-dialog__header {
      padding: 10px 12px;
    }

    ::v-deep .el-dialog__title {
      font-size: 14px;
    }
  }
</style>