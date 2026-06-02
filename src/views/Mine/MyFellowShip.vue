<template>
  <div class="myCourses">
    <div class="myCourses-left vcontainer flex-around">
      <div class="hcontainer vcenter mine-item-header">
        <span class="mine-item-title">{{ item.certificate }}</span>
      </div>
      <div class="hcontainer vcenter flex-between">
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Course</span>
          <span class="mine-item-value">{{ item.course || '-' }}</span>
        </div>
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Practical Date</span>
          <span class="mine-item-value">{{ defineFormat(item.practicalDate) }}</span>
        </div>
        <div class="hcontainer vcenter">
          <span class="mine-item-label">Certified</span>
          <span class="mine-item-value">{{ defineFormat(item.certified) }}</span>
        </div>
      </div>
    </div>
    <div class="vcontainer myCourses-btns flex-around">
      <el-button
        type="text"
        class="mine-btn"
        :disabled="!item.certificateUrl"
        @click="certClick(item)">
        Certificate
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
      },
      userInfo: {
        type: Object,
        default: () => {},
      }
    },
    data() {
      return {
        
      }
    },
    methods: {
      async certClick(row) {
        try {
          const resData = await this.$api.websiteCourseCompletionCertificate(row.courseId, this.userInfo.fmfId).catch(err => err)
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