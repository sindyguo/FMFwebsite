<template>
  <div class="fill vcontainer course">
    <div class="vcontainer hcenter course-top-container">
      <div class="vcontainer course-top">
        <span class="course-top-title">Online Courses</span>
        <span class="tip">Internet-based courses, which are free of charge and will be available in several languages.</span>
      </div>
    </div>
    <div class="hcontainer course-content">
      <div class="course-container">
        <div class="vcontainer course-container-left">
          <div class="course-title">Course List</div>
          <div
            v-for="item in listData"
            :key="item.id"
            class="hcontainer vcenter flex-between course-item"
            @click="itemClick(item)">
            <div class="fill hcontainer vcenter">
              <div class="course-icon el-icon-caret-right"></div>
              <span class="fill o-line-1" :title="item.categoryName">{{ item.categoryName }}</span>
            </div>
            <span v-if="isLogin && item.totalCount" class="course-progress">{{ item.learningCount || 0 }}/{{ item.totalCount || 0 }}</span>
          </div>
        </div>
        <div class="fill hcontainer flex-wrap course-container-right">
          <div
            v-for="(item) in listData"
            :key="item.id"
            class="vcontainer flex-between course-container-right-container course-card"
            @click="itemClick(item)">
            <div class="vcontainer">
              <div class="hcontainer flex-between">
                <span class="fill o-line-1 course-title" :title="item.categoryName">{{ item.categoryName }}</span>
                
                <div :class="[item.featured == 1 ? 'new' : '']" v-if="item.featured == 1">New</div>
                <div v-else :class="[item.updateStatus == 1 ? 'finished' : 'updating']">{{ item.updateStatus === 1 ? 'Updated' : 'Updating' }}</div>
                <!-- <div class="new" v-if="index == 0 || index < 7">New</div>
                <div class="updating" v-if="index > 6">Updated</div> -->
              </div>
              <span class="tip" v-html="item.content || ''"></span>
            </div>
            <div class="hcontainer vcenter">
              <div v-if="isLogin && item.learningCount" class="vcontainer">
                <div class="hcontainer vcenter flex-between course-count">
                  <span>Learning Progress</span>
                  <div class="hcontainer vcenter" style="font-weight: bold;">
                    <span style="color:#3391C9">{{ item.learningCount || 0 }}</span>
                    <span>/{{ item.totalCount || 0 }}</span>
                  </div>
                </div>
                <el-progress
                  :percentage="(item.learningCount && item.totalCount) ? Math.floor(item.learningCount / item.totalCount * 100) : 0"
                  color="#48BBFF"
                  define-back-color="#EEF9FF"
                  :stroke-width="14"
                  :show-text="false">
                </el-progress>
              </div>
              <span v-else class="module-count">{{ item.moduleCount || 0 }} modules</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'CoursePage',
    data() {
      return {
        listData: []
      }
    },
    computed: {
      ...mapGetters('user', ['isLogin'])
    },
    methods: {
      ...mapActions('user', ['changeActiveId']),
      itemClick(item) {
        const self = this
        self.$utils.checkLoginAndContinue(() => {
          self.changeActiveId(item.id)
          self.$router.push('/courseDetail?categoryName=' + item.categoryName)
        })
      },
      websiteCourseNavigationFn(categoryName) {
        const reqData = {
          categoryName: categoryName
        }
        this.$api.websiteCourseNavigation(reqData).then(resp => {
          if ((resp.code === 200 || resp.code === 0) && Array.isArray(resp.data)) {
            this.listData = resp.data
          } else {
            this.listData = []
          }
        }).catch(err => {
          console.log('err:', err)
        })
      }
    },
    mounted() {
      this.websiteCourseNavigationFn(this.$route.query.categoryName)
    },
    beforeRouteUpdate(to, from, next) {
      this.websiteCourseNavigationFn(to.query.categoryName)
      next()
    }
  }
</script>

<style lang="scss" scoped>
  .course {
    // padding-top: 72px;
    min-height: calc(100% - 200px);
    .course-top-container {
      width: 100%;
      height: 120px;
      margin-bottom: 20px;
      background-color: #ffffff;
      margin-top: 0;
      // position: sticky;
      // top: 72px;
      .course-top {
        width: 1200px;
        margin: 0 auto;
        .course-top-title {
          font-size: 32px;
          color: #0E3045;
          font-weight: bold;
        }
      }
    }
    .course-content {
      width: 100%;
      margin: 0 auto 40px;
      .course-container { 
        width: 1200px;
        margin: 0 auto;
        border-radius: 4px;
        background: #F5F7F9;
        &-left {
          display: inline-block;
          width: 388px;
          background: #fff;
          padding: 18px 20px;
          border-radius: 4px 4px 4px 4px;
          .course-title {
            font-weight: bold;
            font-size: 24px;
            color: #0E3045;
            text-align: left;
            font-style: normal;
            text-transform: none;
            margin-bottom: 22px;
          }
          .course-item {
            font-weight: bold;
            font-size: 18px;
            color: #036fc0;
            text-align: left;
            font-style: normal;
            text-transform: none;
            margin-bottom: 25px;
            cursor: pointer;
            .course-icon {
              font-size: 14px;
              margin-right: 5px;
            }
            .course-progress {
              min-width: 50px;
              color: #0E3045;
              font-size: 14px;
              font-weight: normal;
              margin-left: 10px;
              text-align: right;
            }
          }
        }
        &-right {
          float: right;
          width: 796px;
          .course-card {
            flex-shrink: 0;
            width: 388px;
            min-height: 174px;
            background: #fff;
            padding: 28px 20px;
            border-radius: 4px 4px 4px 4px;
            &:hover {
              transition: all .2s ease-in-out;
              .course-title {
                color: #036fc0;
              }
            }
            cursor: pointer;
            &:nth-child(odd) {
              margin-right: 14px;
            }
            &:nth-child(n+3) {
              margin-top: 12px;
            }
            .course-title {
              font-weight: bold;
              font-size: 18px;
              color: #0E3045;
              text-align: left;
              font-style: normal;
            }
            .updating {
              min-width: 74px;
              color: #49D5BE;
              font-size: 13px;
              padding: 6px 8px;
              border-radius: 4px;
              background-color: #E1FDF3;
            }
            .finished {
              min-width: 74px;
              color: #0E3045;
              font-size: 13px;
              padding: 6px 8px;
              border-radius: 4px;
              background-color: #EEF3F6;
              text-align: center;
            }
            .new {
              min-width: 74px;
              color: #036fc0;
              font-size: 13px;
              padding: 6px 8px;
              border-radius: 4px;
              background-color: #e8f5ff;
              text-align: center;
            }
            .course-count {
              color: #0E3045;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .module-icon {
              width: 13px;
              height: 16px;
              margin-right: 5px;
              background: url('#{$iconUrl}/icon_zj.png') center no-repeat;
              background-size: contain;
            }
            .module-count {
              color: #8A9094;
              font-size: 13px;
            }
          }
        }
      }
      
    }
    .tip {
      font-weight: 400;
      font-size: 14px;
      color: #8A9094;
      line-height: 22px;
      text-align: justify;
      font-style: normal;
      margin-top: 16px;
    }
  }
</style>