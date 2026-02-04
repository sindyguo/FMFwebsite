<template>
  <el-dialog
    :visible="visible"
    title="The Fetal Medicine Foundation"
    class="terms-dialog"
    width="800px"
    @close="handleClose">
    <div class="terms-content">
      <h2 class="section-title">Terms and Conditions</h2>
      <ol class="terms-list">
        <li class="term-item">
          You consent to the Fetal Medicine Foundation storing your personal data, your progress in FMF courses and data and images submitted by you for the purpose of audit.
        </li>
        <li class="term-item">
          You consent to receive occasional email messages from the Fetal Medicine Foundation promoting congresses, updates to the First Trimester Screening software or new initiatives in prenatal medicine. However, you will always be able to un-subscribe from these messages.
        </li>
        <li class="term-item">
          The Fetal Medicine Foundation will not pass your details to any third party unless requested to do so by you.
        </li>
        <li class="term-item">
          Any text or images displayed in the FMF courses may be copied for educational purposes provided that the source of the copied information is stated, preferably with a link to the Fetal medicine Foundation website.
        </li>
        <li class="term-item">
          The Fetal Medicine Foundation continually reviews and updates the information in its courses; however, it does not accept any liability for any errors or omissions in its materials.
        </li>
      </ol>
      <div class="hcontainer vcenter flex-between cme-section">
        <span @click="cmeClick" class="cme-link">CME Disclosure information</span>
        <el-button @click="handleClose">Close</el-button>
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
      padding: 20px;
    }
    .section-title {
      color: #0E3045;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .terms-list {
      padding-left: 20px;
      margin-bottom: 30px;
      .term-item {
        color: #0E3045;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 15px;
        text-align: justify;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .cme-section {
      padding-top: 20px;
      border-top: 1px solid #ECF1F5;
    }
    .cme-link {
      color: #036fc0;
      font-size: 14px;
      text-decoration: underline;
      cursor: pointer;
      &:hover {
        color: #004080;
      }
    }
  }

  ::v-deep .el-dialog__header {
    background-color: #ECF1F5;
    color: #0E3045;
    font-size: 16px;
    padding: 15px 20px;
    text-align: center;
  }

  ::v-deep .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
  }
</style>