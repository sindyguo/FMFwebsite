<template>
  <div class="myLicence">
    <p class="myLicence-desc">
      Your personal FMF license is now available to you, and it is valid for a period of 12 months from the date of each download.<br/>
      The license gives you access to all methods of screening for chromosomal abnormalities and preeclampsia.<br/>
      If you wish to exclude some markers from risk calculation, please do so through the Options page within your software.<br/>
      Please select the appropriate license version below, depending on the software used in your clinic.
    </p>
    <div class="myLicence-versions-box">
      <div class="hcontainer flex-between licence-version-item">
        <div class="vcontainer">
          <span class="licence-version-title">V2 version</span>
          <span class="licence-version-info">FMF FTS - old software</span>
          <span class="licence-version-info">Astraia: 1.24.7 upto 1.25.2</span>
          <span class="licence-version-info">ViewPoint: version 5.6.9 or higher</span>
        </div>
        <div class="vcontainer licence-version-actions">
          <el-button type="text" class="mine-btn" @click="handleShowDetails('v1')">Details</el-button>
          <el-button type="text" class="mine-btn" @click="downloadLicenceFn('v1')">Download</el-button>
        </div>
      </div>
      <div class="hcontainer flex-between licence-version-item licence-version-item--last">
        <div class="vcontainer">
          <span class="licence-version-title">V3 version</span>
          <span class="licence-version-info">Astraia: version 1.26 or higher</span>
        </div>
        <div class="vcontainer licence-version-actions">
          <el-button type="text" class="mine-btn" @click="handleShowDetails('v2')">Details</el-button>
          <el-button type="text" class="mine-btn" @click="downloadLicenceFn('v2')">Download</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      :visible="dialogObj.visible"
      title="Details"
      custom-class="licence-details-dialog"
      :append-to-body="true"
      :destroy-on-close="true"
      top="0"
      width="520px"
      @close="dialogObj.visible = false">
      <div class="licence-dialog-body">
        <template v-if="dialogObj.type === 'v1'">
          <p><strong>V2 version:</strong></p>
          <p>This license is valid for the software versions:</p>
          <ul>
            <li>FMF FTS - old software</li>
            <li>astraia: version <strong>1.24.7 up to 1.25.2</strong></li>
            <li>ViewPoint: version <strong>5.6.9 or higher</strong></li>
          </ul>
          <p><strong>Do not open the file.</strong> Save the file to a convenient location, enter Options in the software, and import the license.</p>
        </template>
        <template v-else>
          <p><strong>V3 version:</strong></p>
          <p>This license is valid only for astraia version <strong>1.26 or higher</strong></p>
          <p><strong>Do not open the file.</strong> Save the file to a convenient location, enter Options in the software, and import the license.</p>
        </template>
      </div>
      <div slot="footer" class="hcontainer vcenter hcenter">
        <el-button class="w-150" @click="dialogObj.visible = false">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'MyLicence',
    data() {
      return {
        dialogObj:{
          visible: false,
          type: 'v1'
        },
        showLicenceDetailsV1: false,
        showLicenceDetailsV2: false,
      }
    },
    methods: {
      handleShowDetails(version) {
        this.dialogObj.visible = true
        this.dialogObj.type = version
      },
      async downloadLicenceFn(version) {
        try {
          if (version === 'v1') {
            await this.$api.downloadLicenceV1()
          } else {
            await this.$api.downloadLicenceV2()
          }
        } catch (error) {
          this.$message.error('Failed to download licence')
          console.error('Error downloading licence:', error)
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.myLicence {
  &-desc {
    font-size: 14px;
    color: #0E3045;
    line-height: 2;
    margin-top: 16px;
    margin-bottom: 20px;
    text-align: justify;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  &-versions-box {
    border-radius: 8px;
    overflow: hidden;

    .licence-version-item {
      padding: 24px 28px;
      align-items: flex-start;
      margin-bottom: 20px;
      background-color: #F7FCFF;
      flex-wrap: wrap;

      &.licence-version-item--last { border-bottom: none; }

      .licence-version-title {
        font-size: 16px;
        font-weight: bold;
        color: #036FC0;
        margin-bottom: 12px;
      }
      .licence-version-info {
        font-size: 13px;
        color: #656B6F;
        line-height: 1.9;
        word-break: break-word;
      }
      .licence-version-actions {
        align-items: flex-end;
        flex-shrink: 0;
        padding-top: 2px;
        gap: 2px;
      }
    }
  }
}
  
  
/* My Licence — Details modal: vertically + horizontally centered in viewport */
  .el-dialog__wrapper:has(> .licence-details-dialog) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
    box-sizing: border-box;
  }

  .el-dialog.licence-details-dialog {
    width: min(520px, calc(100vw - 32px)) !important;
    max-width: calc(100vw - 32px);
    box-sizing: border-box;
    /* override Element UI inline marginTop from `top` prop */
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .licence-details-dialog .el-dialog__header {
    padding: 18px 20px 12px;
  }

  .licence-details-dialog .el-dialog__title {
    font-size: 17px;
    line-height: 1.35;
    word-break: break-word;
  }

  .licence-details-dialog .el-dialog__body {
    padding: 8px 20px 16px !important;
    max-height: min(520px, calc(100vh - 180px));
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }

  .licence-details-dialog .el-dialog__footer {
    padding: 8px 20px 20px;
  }

  .licence-dialog-body {
    padding: 10px 0;
    font-size: 14px;
    color: #0E3045;
    line-height: 1.8;
    word-break: break-word;
    overflow-wrap: anywhere;

    p {
      margin-bottom: 12px;
    }

    ul {
      margin: 8px 0 16px 20px;
      padding-right: 0;

      li {
        list-style: disc;
        margin-bottom: 6px;
      }
    }
  }

  .licence-details-dialog .el-dialog__footer .w-150 {
    min-width: 120px;
  }

  @media (max-width: 480px) {
    .el-dialog__wrapper:has(> .licence-details-dialog) {
      padding: 12px;
    }

    .el-dialog.licence-details-dialog {
      width: calc(100vw - 24px) !important;
      max-width: calc(100vw - 24px);
    }

    .licence-details-dialog .el-dialog__header {
      padding: 14px 14px 8px;
    }

    .licence-details-dialog .el-dialog__title {
      font-size: 16px;
    }

    .licence-details-dialog .el-dialog__body {
      padding: 4px 14px 12px !important;
      max-height: calc(100vh - 160px);
    }

    .licence-details-dialog .el-dialog__footer {
      padding: 6px 14px 16px;
    }

    .licence-dialog-body {
      font-size: 13px;
      line-height: 1.65;

      ul {
        margin-left: 18px;
        margin-right: 0;
      }
    }

    .licence-details-dialog .el-dialog__footer .w-150 {
      width: 100%;
      max-width: 100%;
    }
  }

  /* Fallback when :has() is not supported (wrapper flex centering skipped) */
  @supports not (selector(:has(*))) {
    .el-dialog.licence-details-dialog {
      margin-top: 10vh !important;
    }
  }
</style>