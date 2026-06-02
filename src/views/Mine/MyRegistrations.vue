<template>
  <div class="myRegistrations w100 flex-row">
    <div class="myRegistrations-left w100 vcontainer flex-around" style="height: 100%">
      <div class="hcontainer vcenter mine-item-header">
        <el-link :type="(item.publishStatus != '1' || (item.congressType == 'Supported Courses' && item.registrationHostedBy !== '0')) ? 'info':'primary'" class="mine-registration-title" :disabled="item.publishStatus != '1' || (item.congressType == 'Supported Courses' && item.registrationHostedBy !== '0')" @click="handleRouter(item)">{{ item.congressTitle }}</el-link>
        <span :class="['mine-item-status', (item.registrationStatus || '').toLowerCase().replace(' ', '-')]">{{ item.registrationStatus }}</span>
      </div>
      <div class="hcontainer vcenter flex-between">
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Order ID</span>
          <span class="mine-item-link" @click="$router.push('/orderDetail?id=' + item.orderId)">{{ item.orderId }}</span>
        </div>
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Registration type</span>
          <span class="mine-item-value">{{ item.registrationType | registrationTypeF }}</span>
        </div>
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Congress type</span>
          <span class="mine-item-value">{{ item.congressType }}</span>
        </div>
      </div>
    </div>
    <div class="myRegistrations-right vcontainer flex-around ml-50">
      <el-button type="text" class="mine-btn"
        :disabled="!(((item.registrationType || '').toLowerCase().includes('group') || (item.registrationType == 'Manual')) && item.registrationStatus === 'Incomplete Registration')"
        @click="registerClick(item)">Register</el-button>
      <el-button type="text" :disabled="!item.visaUrl" class="mine-btn" @click="letterClick('/app-api/fmf/user/congress' +item.visaUrl)">
        Visa Letter
      </el-button>
      <!-- Desktop: show individually -->
      <el-button type="text" :disabled="!item.certificateUrl" class="mine-btn reg-desktop-only" @click="letterClick('/app-api/fmf/user/congress' +item.certificateUrl)">
        Certificate
      </el-button>
      <el-button type="text" class="mine-btn reg-desktop-only" :class="{ 'mine-btn--contest-active': isImageContestEnabled(item) }" :disabled="!isImageContestEnabled(item)" @click="imageContestClick(item)">
        Image Contest
      </el-button>
      <!-- Mobile: collapse into More dropdown -->
      <el-dropdown class="reg-more-btn" trigger="click" @command="handleRegMoreAction($event, item)">
        <span class="mine-btn reg-more-trigger">More <i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="!item.certificateUrl" command="certificate">Certificate</el-dropdown-item>
          <el-dropdown-item command="imageContest" :disabled="!isImageContestEnabled(item)">
            <span :class="{ 'reg-more-contest-active': isImageContestEnabled(item) }">Image Contest</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :visible.sync="imageContestClosedDialog"
      title="FMF Clinical Image Contest"
      width="min(480px, calc(100vw - 32px))"
      :append-to-body="true"
      :destroy-on-close="true">
      <p style="line-height:1.7;color:#333;font-size:15px;margin:0;">
        Submissions for the FMF Image Contest are now closed. If you have any questions, please contact
        <a href="mailto:education@fetalmedicine.org" style="color:#036fc0;text-decoration:none;">education@fetalmedicine.org</a>
      </p>
      <div slot="footer">
        <el-button type="primary" @click="imageContestClosedDialog = false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
  export default {
    name: 'MyRegistrations',
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    inject: ['letterClick'],
    data() {
      return {
        imageContestClosedDialog: false,
      }
    },
    methods:{
      ...mapActions('user', ['changeActiveId']),
      handleRouter(row) {
        if(row.publishStatus == 1) {
          if(row.congressType == 'Congress') {
            this.changeActiveId('/congress')
            this.$router.push(`/congress?categoryName=${row.congressTitle}`)
          } else if(row.congressType == 'Supported Courses' && row.registrationHostedBy === '0') {
            this.changeActiveId('/fmf-supported-courses')
            this.$router.push(`/fmf-supported-course-detail?categoryName=${row.congressTitle}`)
          } else if(row.congressType == 'Advances Course') {
            this.changeActiveId('/fmf-advances-courses')
            this.$router.push(`/fmf-advances-courses?categoryName=${row.congressTitle}`)
          } 
        }
      },
      isImageContestEnabled(item) {
        if (item.registrationStatus !== 'Registered') return false
        const parseDate = (str) => str ? new Date(str.replace(' ', 'T')).getTime() : null
        const start = parseDate(item.contestStartTime)
        const end = parseDate(item.contestEndTime)
        const now = Date.now()
        if (start && now < start) return false
        if (end && now > end) return false
        return true
      },
      handleRegMoreAction(command, item) {
        if (command === 'certificate') {
          if (!item.certificateUrl) return
          this.letterClick('/app-api/fmf/user/congress' + item.certificateUrl)
        } else if (command === 'imageContest') {
          this.imageContestClick(item)
        }
      },
      async imageContestClick(item) {
        if (item.registrationStatus !== 'Registered') {
          this.$message.warning('Please complete your congress registration before participating in the Image Contest.')
          return
        }
        try {
          const imageRes = await this.$api.getImageContestPage({
            congressId: item.congressId,
            pageSize: 1,
          })
          if (!imageRes || (imageRes.code !== 200 && imageRes.code !== 0)) return
          const submission = imageRes.data && Array.isArray(imageRes.data.list) && imageRes.data.list[0]
          const hasUploadedFile = submission && Array.isArray(submission.imageList) && submission.imageList.length > 0
          if (hasUploadedFile) {
            this.$router.push(`/imageContest?id=${item.congressId}&readonly=true`)
          } else {
            const parseDate = (str) => str ? new Date(str.replace(' ', 'T')).getTime() : null
            const end = parseDate(item.contestEndTime)
            if (end && Date.now() > end) {
              this.imageContestClosedDialog = true
            } else {
              this.$router.push(`/participate?id=${item.congressId}`)
            }
          }
        } catch {
          this.$message.error('Failed to check image contest status.')
        }
      },
      registerClick(row) {
        this.$router.push(`/mineReg?id=${row.id}&congressId=${row.congressId}`)
      },
    }
  }
</script>

<style lang="scss" scoped>
.myRegistrations {
  width: 100%;

  /* More dropdown hidden by default on desktop */
  .reg-more-btn {
    display: none;
  }
}

/* ≤ 900px — data row items start wrapping */
@media (max-width: 900px) {
  .myRegistrations-left {
    .hcontainer.vcenter.flex-between {
      flex-wrap: wrap;
      gap: 4px 16px;
    }
  }
}

/* ≤ 768px — stack buttons below content, collapse extras into More */
@media (max-width: 768px) {
  .myRegistrations {
    flex-direction: column !important;

    &-left {
      width: 100%;
    }

    &-right {
      flex-direction: row !important;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      margin-left: 0 !important;
      margin-top: 10px;
      gap: 4px;

      /* Hide individual Certificate / Image Contest buttons */
      .reg-desktop-only {
        display: none !important;
      }

      /* Show More dropdown */
      .reg-more-btn {
        display: inline-flex !important;
        align-items: center;
      }
    }
  }
}

/* ≤ 480px — label/value pairs can wrap */
@media (max-width: 480px) {
  .myRegistrations-left {
    .hcontainer.vcenter {
      flex-wrap: wrap;
      gap: 2px 6px;
    }
  }
}
</style>