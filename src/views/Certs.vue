<template>
  <div class="fill vcontainer main-container certs">
    <div class="userInfo">
      <span>
        USERNAME:{{userInfo.username}}
      </span>
      <span>FMFID:{{userInfo.fmfId}}</span>
    </div>
    <div class="hcontainer vcenter flex-between mh-10 mv-20">
      
      <span class="certs-title">Course Learning Progress</span>
      <el-pagination
        layout="total, prev, pager, next"
        :current-page.sync="pageConfig.current"
        :page-size.sync="pageConfig.pageSize"
        :total="pageConfig.total"
        :pager-count="5"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="getCertsFn"
        @current-change="getCertsFn">
      </el-pagination>
    </div>
    <el-table
      :data="listData"
      :header-cell-style="{backgroundColor: '#F1F7FB', color: '#1E2224', textAlign: 'center'}"
      height="400">
      <el-table-column v-if="listData.length > 0" type="index" label="No." width="50"></el-table-column>
      <el-table-column prop="coursesTitle" label="Course Title" min-width="180">
        <template #default="{ row }">
          <span>{{ row.coursesTitle || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateStatus" label="Update Status" :align="'center'" min-width="120">
        <template #default="{ row }">
          <span>{{ row.updateStatus == 1 ? 'Finished' : 'Updateing' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Learning Progress" :align="'center'" min-width="150">
        <template #default="{ row }">
          <span>{{ row.coursesLearnCount || 0 }}/{{ row.coursesTotal || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="examTime" label="Exam time" :align="'center'" width="180">
        <template #default="{ row }">
          <span>{{ row.examTime | examTimeF }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="examResults" label="Exam Results" :align="'center'" min-width="120">
        <template #default="{ row }">
          <span :style="{color: row.examResults === 1 ? '#00BB5E': (row.total ? '#C40000' : '')}">
            {{ row.examResults === 1 ? 'Pass' : (row.total ? 'Failed' : (row.updateStatus == 1 && row.coursesLearnCount == row.coursesTotal ? 'Not Attempted' : '-'))}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Toolbar" :align="'center'" width="120">
        <template #default="{ row }">
          <el-button
            type="text"
            icon="el-icon-edit-outline"
            :disabled="row.examResults == 1 || row.updateStatus != 1 || row.coursesLearnCount != row.coursesTotal"
            @click="examClick(row)">
            Take an exam
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Certification" :align="'center'" width="120">
        <template #default="{ row }">
          <el-button
            type="text"
            icon="el-icon-view"
            :disabled="row.examResults != 1"
            @click="viewResult(row)">
          </el-button>
          <el-button
            type="text"
            icon="el-icon-download"
            :disabled="row.examResults != 1"
            @click="downloadCertificate(row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'CertsPage',
    data() {
      return {
        pageConfig: {
          current: 1,
          pageSize: 5,
          total: 0
        },
        listData: []
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo
      }
    },
    filters: {
      percentF(val) {
        if (!val || val == 0 || isNaN(val)) {
          return '-'
        }
        const percentage = Math.round(val * 100)
        return `${percentage}%`
      },
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
      downloadCertificate(row) {
        const fileUrl = process.env.VUE_APP_BASE_API + '/app-api/fmf/webuser/courseCompletionCertificate/' + row.coursesId
        this.$utils.downloadUrl(fileUrl, row.coursesTitle)
      },
      async viewResult(row) {
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
      getCertsFn() {
        const reqData = {
          pageNo: this.pageConfig.current,
          pageSize: this.pageConfig.pageSize
        }
        this.$api.webUserLearingProcessPage(reqData).then((res) => {
          if ((res.code === 200 || res.code === 0) && res.data && Array.isArray(res.data.list)) {
            this.listData = res.data.list
            this.pageConfig.total = res.data.total
          } else {
            this.listData = []
            this.pageConfig.total = 0
          }
        }).catch((err) => {
          console.log('err:', err)
          this.listData = []
          this.pageConfig.total = 0
        })
      }
    },
    mounted() {
      this.getCertsFn()
    }
  }
</script>

<style lang="scss" scoped>
  .certs {
    padding: 20px;
    margin: 20px auto;
    background-color: #ffffff;
    .certs-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
    }
  }
  .userInfo{
    display: flex;
    gap: 20px;
  }
</style>