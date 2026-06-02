<template>
  <div class="myCourses">
    <div class="myCourses-left vcontainer flex-around">
      <div class="hcontainer vcenter mine-item-header">
        <span class="mine-item-title">{{ item.coursesTitle }}</span>
        <!-- <span :class="['mine-item-status', (item.examResults === 1 ? 'pass' : (item.total ? 'failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'not-attempted': '')))]">
          {{ item.examResults === 1 ? 'Pass' : (item.total ? 'Failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'Not Attempted' : '-'))}}
        </span> -->


        <!-- <span :class="['mine-item-status', (item.examResults === 1 ? 'pass' : (item.total ? 'failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'not-attempted': '')))]">
          {{ item.examResults === 1 ? 'Pass' : (item.total ? 'Failed' : (item.updateStatus == 1 && item.coursesLearnCount == item.coursesTotal ? 'Not Attempted' : '-'))}}
        </span> -->


        <span class="mine-item-status pass" v-if="item.examResults === 1">Pass</span>
        <template v-if="item.examResults == 0">
          <span class="mine-item-status not-attempted" v-if="item.coursesLearnCount < item.coursesTotal">In Progress</span>
          <span class="mine-item-status examPending" v-if="item.coursesLearnCount == item.coursesTotal">Completed-Exam Pending</span>
        </template>

        <template v-if="item.examResults == 2">
          <span class="mine-item-status not-attempted">Failed</span>
        </template>
      </div>
      <div class="hcontainer vcenter flex-between">
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Update Status</span>
          <span class="mine-item-value">{{ item.updateStatus == 1 ? 'Updated' : 'Updating' }}</span>
        </div>
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Learning Progress</span>
          <span class="mine-item-value">{{ item.coursesLearnCount || 0 }}/{{ item.coursesTotal || 0}}</span>
        </div>
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Exam time</span>
          <span class="mine-item-value">{{ item.examTime | examTimeF}}</span>
        </div>
      </div>
    </div>
    <div class="vcontainer myCourses-btns flex-around">
      <el-button
        type="text"
        class="mine-btn"
        :disabled="item.examResults == 1 || item.updateStatus != 1 || item.coursesLearnCount != item.coursesTotal"
        @click="examClick(item)">
        Final test
      </el-button>
      <el-button
        type="text"
        class="mine-btn"
        :disabled="item.examResults != 1"
        @click="certClick(item)">
        Certification
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyCourses',
    props: {
      item: {
        type: Object,
        default: () => {},
      }
    },
    data() {
      return {
        
      }
    },
    filters: {
      examTimeF(val) {
        if (!val) {
          return '-'
        }
        return val.replace('T', ' ')
      }
    },
    methods: {
      examClick(row) {
        this.$utils.startExam(row.coursesId, row.coursesTitle)
      },
      async certClick(row) {
        try {
          const resData = await this.$api.websiteCourseCompletionCertificate(row.coursesId, row.userId).catch(err => err)
          const blob = new Blob([resData], { type: 'application/pdf' })
          const previewUrl = URL.createObjectURL(blob)
          const newWindow = window.open(previewUrl, '_blank')
          if (newWindow) {
            newWindow.onbeforeunload = () => {
              URL.revokeObjectURL(previewUrl)
            }
          }
        } catch (error) {
          this.$message.error('Failed to preview document')
          console.error('Error previewing document:', error)
        }
      },
    }
  }
</script>

<style lang="scss">
.myCourses {
  width: 100%;
  display: flex;
  flex-direction: row;
  &-left {
    flex: 1;
    height: 100%;
  }
  &-btns {
    margin-left: 50px;
  }
}
</style>