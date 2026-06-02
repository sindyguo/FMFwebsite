<template>
  <div class="fill hcontainer coursedetail" :class="{'mobile-drawer-open': showMobileMenu}">

    <!-- Mobile top bar: visible only on mobile -->
    <div class="mobile-topbar">
      <button class="mobile-menu-btn" @click="showMobileMenu = true">
        <i class="el-icon-s-unfold"></i>
      </button>
      <span class="mobile-chapter-title o-line-1">{{ chapterData.categoryTitle || chapterData.coursesTitle || (listFlatData[curChapterIndex] && listFlatData[curChapterIndex].categoryName) || '' }}</span>
      <el-select v-show="languageOptions.length" v-model="curLanguage" size="mini" class="mobile-lang-sel" @change="websiteCourseFn">
        <el-option v-for="item in languageOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>

    <!-- Backdrop for drawer -->
    <div class="mobile-backdrop" v-show="showMobileMenu" @click="showMobileMenu = false"></div>

    <div class="vcontainer left-content">
      <!-- Drawer header: visible only on mobile -->
      <div class="drawer-header">
        <span class="drawer-title o-line-1">{{ categoryName }}</span>
        <button class="drawer-close-btn" @click="showMobileMenu = false"><i class="el-icon-close"></i></button>
      </div>
      <div class="left-content-tree">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="1">
            <div slot="title" class="fill hcontainer vcenter flex-between left-top">
              <span class="fill left-title o-line-1" :title="categoryName">{{ categoryName }}</span>
            </div>
            <el-tree
              ref="courseTreeRef"
              :data="listData"
              :props="{children: 'childrenList', label: 'categoryName'}"
              :expand-on-click-node="false"
              highlight-current
              default-expand-all
              node-key="id"
              class="fill"
              @node-click="nodeClick">
              <div class="fill hcontainer vcenter flex-between chapter-item" slot-scope="{ node, data }">
                <span :class="['fill', {'chapter-item-leaf': node.isLeaf}]" :title="data.categoryName">{{ data.categoryName }}</span>
                <template v-if="courseData.type != 'Webinar/Other records'">
                  <span v-if="data.level == 1">{{ courseData.learningCount || 0 }}/{{ courseData.totalCount || 0 }}</span>
                  <span v-else-if="node.isLeaf && data.hasLearning"><i class="el-icon-check"></i></span>
                </template>
              </div>
            </el-tree>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="hcontainer vcenter hcenter exam-btn-container">
        <el-button
          v-if="courseData.type != 'Webinar/Other records'"
          type="primary"
          plain
          :class="['exam-btn',!(courseData.totalCount && courseData.learningCount == courseData.totalCount)?'disabledBtn':'']"
          style="font-size: 14px !important;"
          :disabled="!(courseData.totalCount && courseData.learningCount == courseData.totalCount)"
          @click="rightBtnClick('exam')">
          Final test
        </el-button>
      </div>
    </div>
    <div class="fill vcontainer right-content">
      <template v-if="courseData.learningCount && courseData.learningCount === courseData.totalCount">
        <div class="vcontainer vcenter learning-finish">
          <div class="finished-title">All Done</div>
          <img src="@/assets/img/img_succ1.png" class="succ-img" alt="">
          <span>Congratulations! You have completed all the lessons in your current course and are now eligible to take the final exam to earn your Course Completion Certificate. Upon obtaining the certificate, your name will be featured on our website's Global List of Completers!</span>
          <div class="hcontainer vcenter mt-55">
            <div class="right-btn" @click="rightBtnClick('learning')">Back to Course</div>
            <div v-if="!chapterData.status && courseData.type != 'Webinar/Other records'" class="right-btn ml-20" @click="rightBtnClick('exam')">Start Exam</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="hcontainer vcenter flex-between right-top">
          <span class="right-title">{{ chapterData.categoryTitle || chapterData.coursesTitle || listFlatData[curChapterIndex]?.categoryName || '' }}</span>
          <el-select v-model="curLanguage" size="mini" class="w-150 desktop-lang-sel" @change="websiteCourseFn">
            <el-option
              v-for="item in languageOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div v-if="chapterData.content?.content || (chapterData.pictureList && chapterData.pictureList.length) || (chapterData.videoList && chapterData.videoList.length)"
          class="fill vcontainer">
          <div class="fill hcontainer pr-20 mainCenter" style="overflow-y: auto" ref="contentContainerRef" @click="handleContentClick">
            <RichView :content="chapterData.content?.content" class="fill"></RichView>
            <div :class="((chapterData.pictureList && chapterData.pictureList.length) || (chapterData.videoList && chapterData.videoList.length))? 'attachment-container': 'w-240'">
              <div
                v-for="(item, index) in (chapterData.videoList || [])"
                :key="item.id"
                class="attachment-item">
                <video
                  :src="item.url"
                  :key="item.id || item.url" 
                  :autoplay="index === 0"
                  :loop="index === 0"
                  :preload="index === 0 ? 'auto' : 'metadata'"
                  :poster="item.posterUrl || item.generatedPoster"
                  class="attachment-video"
                  controls
                  playsinline
                  webkit-playsinline
                  @loadedmetadata="generatePoster(index, item)">
                </video>
                <div v-if="item.note"
                  :class="['desc', {'collapsed': !expandedNotes[`video_${index}`] && item.note.length > 100}]"
                  @click="toggleNote(`video_${index}`)">
                  {{ item.note }}
                  <span
                    v-if="!expandedNotes[`video_${index}`] && item.note.length > 100"
                    class="expand-text">
                    ...
                    <span class="more-link">More</span>
                  </span>
                </div>
              </div>

              <div
                v-for="(item, index) in (chapterData.pictureList || [])"
                :key="item.id"
                class="attachment-item">
                <img class="attachment-img" :src="item.url" alt="" />
                <div v-if="item.note"
                  :class="['desc',{'collapsed': !expandedNotes[`pic_${index}`] && item.note.length > 100}]"
                  @click="toggleNote(`pic_${index}`)">
                  {{ item.note }}
                  <span
                    v-if="!expandedNotes[`pic_${index}`] && item.note.length > 100"
                    class="expand-text">
                    ...
                    <span class="more-link">More</span>
                  </span>
                </div>
              </div>
              
            </div>
          </div>
          <div v-if="chapterContentIds.length > 1" class="hcontainer vcenter flex-between">
            <span class="page-tip">Please continue to the next page</span>
            <el-pagination
              layout="->, prev, pager, next, total"
              hide-on-single-page
              class="hcontainer vcenter flex-end mv-10 total-page"
              :current-page.sync="curPage"
              :page-size="1"
              :page-count="5"
              :total="chapterContentIds.length || 0"
              @current-change="websiteCourseFn">
            </el-pagination>
          </div>
        </div>
        <el-empty v-else class="fill vcontainer vcenter" :image="require('@/assets/img/img_nodata.png')" description="No content"></el-empty>
        <div class="hcontainer vcenter flex-between right-bottom">
          <div class="nav-prev">
            <div v-show="curChapterIndex > 0"
              class="vcontainer flex-start"
              style="cursor: pointer;"
              @click="chapterChange(curChapterIndex - 1,'banck')">
              <span class="changeBtn"><i class="el-icon-back"></i>Back</span>
              <span class="chapter-other">{{ listFlatData[curChapterIndex-1]?.categoryName || '' }}</span>
            </div>
          </div>
          <div class="nav-center">
            <template v-if="courseData.type != 'Webinar/Other records'">
              <div v-show="(listFlatData[curChapterIndex]?.categoryType == 'lesson' || chapterData.categoryType == 'lesson') && chapterData.content?.content && curPage === chapterContentIds.length && currentData.questionCount > 0" class="right-btn" @click="rightBtnClick('test')">Chapter Test</div>
              <div v-show="currentData.questionCount < 1" class="right-btn" @click="rightBtnClick('test')">Lesson complete</div>
            </template>
          </div>
          <div class="nav-next">
            <div v-show="curChapterIndex < listFlatData.length - 1"
              class="vcontainer flex-end align-end"
              style="cursor: pointer;"
              @click="chapterChange(curChapterIndex + 1,'next')">
              <span class="changeBtn">Next<i class="el-icon-right"></i></span>
              <span class="chapter-other">{{ listFlatData[curChapterIndex+1]?.categoryName || '' }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <ChapterTestDialog
      :visible="showChapterTestDialog"
      :categoryId="chapterData.categoryId || listFlatData[this.curChapterIndex]?.id || ''"
      :categoryName="chapterData.categoryTitle || chapterData.coursesTitle"
      :description="'No test for this lesson, please continue to the next lesson'"
      @close="chapterTestDialogClose" />
    <el-dialog
      class="full-dialog"
      :visible.sync="showFullDialog"
      :append-to-body="true"
      destroy-on-close
      @close="fullDialogClose">
      <div class="fulldialog-container"> 
        <video
          v-if="curAttachmentType == 'video'"
          class="fulldialog-item"
          ref="fullscreenVideo"
          controls
          preload="auto"
          playsinline
          webkit-playsinline
          :src="curAttachmentUrl"
          :autoplay="showFullDialog"
          :key="time">
        </video>
        <img v-else class="fulldialog-item" :src="curAttachmentUrl" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import RichView from '@/components/RichView.vue'
  import ChapterTestDialog from '@/components/ChapterTestDialog.vue'
  export default {
    name: 'CourseDetailPage',
    components: {
      RichView,
      ChapterTestDialog
    },
    data() {
      return {
        currentData: {},
        categoryName: '',
        activeName: '1',
        curLanguage: '',
        languageOptions: [],
        chapterData: {},
        listData: [],
        listFlatData: [],
        curChapterIndex: 0,
        courseData: {},
        chapterContentIds: [],
        curPage: 1,
        showChapterTestDialog: false,

        expandedNotes: {},
        showFullDialog: false,
        curAttachmentUrl: '',
        curAttachmentType: '',
        time: 0,
        showMobileMenu: false
      }
    },
    methods: {
      generatePoster(index, videoItem) {
      // 仅为非自动播放的视频生成
      if (index === 0 || videoItem.generatedPoster) return

      const video = document.createElement('video')
      video.src = videoItem.url
      video.crossOrigin = 'anonymous'
      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        // 跳转到第一帧附近
        video.currentTime = 0.1
        video.onloadeddata = () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth || 338
          canvas.height = video.videoHeight || 253
          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          // 将生成的封面存入视频对象
          videoItem.generatedPoster = canvas.toDataURL('image/png')
        }
      }
    },
      scrollToTop() {
        this.$nextTick(() => {
          if (this.$refs.mainPage) {
            this.$refs.mainPage.scrollTop = 0
          }
          
        })
          
          
        var mainPageDom = document.querySelector('.mainPage')
        if (mainPageDom) {
          mainPageDom.scrollTo(0, 0)
        }


        var mainCenter = document.querySelector('.mainCenter')
        if (mainCenter) { 
          mainCenter.scrollTop = 0
        }
      },
      scrollToTopOfWindow() {
        // 滚动整个窗口到顶部
        // window.scrollTo({
        //   top: 0,
        //   behavior: 'smooth'
        // });

        
      },
      toggleNote(key) {
        this.$set(this.expandedNotes, key, !this.expandedNotes[key])
      },
      fullDialogClose() {
        if (this.curAttachmentType === 'video' && this.$refs.fullscreenVideo) {
          this.$refs.fullscreenVideo.pause()
        }
        this.showFullDialog = false
        this.curAttachmentUrl = ''
        this.curAttachmentType = ''
      },
      pauseAllVideos() {
        const videoElements = Array.from(document.getElementsByTagName('video'))
        videoElements.forEach(video => {
          video.pause()
        })
      },
      handleContentClick(event) {
        if (event.target.tagName === 'VIDEO') {
          event.preventDefault()
          event.stopPropagation()

          // 如果点击的是视频控制条，不触发全屏
          const rect = event.target.getBoundingClientRect()
          const isControlBar = event.clientY > rect.bottom - 40 // 假设控制条高度约40px
          if (isControlBar) {
            return
          }

          event.target.pause()
          this.pauseAllVideos()

          this.curAttachmentUrl = event.target.src
          this.curAttachmentType = 'video'
          this.time = Date.now()
          this.showFullDialog = true
          
          this.$nextTick(() => {
            if (this.$refs.fullscreenVideo) {
              // 延迟播放确保DOM完全加载
              setTimeout(() => {
                this.$refs.fullscreenVideo.play().catch(err => {
                  console.log('全屏视频播放失败:', err)
                })
              }, 300)
            }
          })
        } else if (event.target.tagName === 'IMG') {
          event.preventDefault()
          event.stopPropagation()
          this.pauseAllVideos()

          this.curAttachmentType = 'image'
          this.time = Date.now()
          this.showFullDialog = true
          this.curAttachmentUrl = event.target.src
        }
      },
      resetData() {
        this.curLanguage = ''
        this.languageOptions = []
        this.chapterData = {}
        this.listData = []
        this.listFlatData = []
        this.curChapterIndex = 0
        this.chapterContentIds = []
        this.courseData = {}
        this.curPage = 1
      },
      chapterChange(newChapterIndex,type) {
        this.pauseAllVideos()

        setTimeout(() => {
          this.curChapterIndex = newChapterIndex
          const curChapterItem = this.listFlatData[newChapterIndex] || {}
          this.currentData = curChapterItem
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.courseTreeRef?.setCurrentKey(curChapterItem.id)
              this.scrollToTreeNode()
            })
          }, 600)
          if (!curChapterItem.contentIds) {
            this.curLanguage = ''
            this.languageOptions = []
            this.chapterContentIds = []
            this.curPage = 1
            this.chapterData = {
              coursesTitle: curChapterItem.categoryName
            }
            if(type == 'next') {
              this.chapterChange(this.curChapterIndex + 1)
            } else {
              if(this.curChapterIndex < 1) {
                this.chapterChange(0)
              } else {
                this.chapterChange(this.curChapterIndex - 1)
              }
            }
            
            this.scrollToTop()
            return
          }
          this.chapterContentIds = curChapterItem.contentIds.split(',')
          this.curPage = 1
          this.curLanguage = ''
          this.languageOptions = []
          this.websiteCourseFn()
          this.$router.replace({ query: { ...this.$route.query, chapterId: curChapterItem.id } }).catch(() => {})
          this.scrollToTop()
        }, 100)
      },
      nodeClick(data) {
        this.showMobileMenu = false
        this.scrollToTopOfWindow();
        console.log('点击的节点数据：', data);
        this.currentData = data
        
        this.curChapterIndex = this.listFlatData.findIndex(item => item.id === data.id)
        if (!data.contentIds) {
          this.curLanguage = ''
          this.languageOptions = []
          this.chapterContentIds = []
          this.curPage = 1
          this.chapterData = {
            coursesTitle: data.categoryName
          }
          this.chapterChange(this.curChapterIndex + 1)
          this.scrollToTop()
          return
          
        }
        if (data.contentIds.includes(this.chapterContentIds[this.curPage - 1])) {
          return
        }
        this.chapterContentIds = data.contentIds.split(',')
        this.curPage = 1
        this.curLanguage = ''
        this.languageOptions = []
        this.websiteCourseFn()
        this.$router.replace({ query: { ...this.$route.query, chapterId: data.id } }).catch(() => {})
        this.scrollToTop()
        this.scrollToTreeNode()
      },
      scrollToTreeNode() {
        this.$nextTick(() => {
          const treeNode = document.querySelector('.el-tree-node.is-current')
          if (treeNode && this.curChapterIndex) { // curChapterIndex避免第一个元素时滚动到中间
            treeNode.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
      },
      chapterTestDialogClose(isFinishDone) {
        this.showChapterTestDialog = false
        if (isFinishDone) {
          this.websiteArticleNavigationFn(false)
        }
      },
      rightBtnClick(type) {
        if (type === 'test') {
          // 提前调用一次接口，避免一进入测试弹框页面调用接口401又出现过期弹框
          this.$api.webuserCourseExercises({
            categoryId: this.chapterData.categoryId || this.listFlatData[this.curChapterIndex]?.id
          }).then(async (res) => {
            if ((res.code === 200 || res.code === 0) && res.data.length > 0) {
              this.showChapterTestDialog = true
            }else{
              await this.websiteArticleNavigationFn(false);
              this.chapterChange(this.curChapterIndex + 1,'next');
            }
          }).catch((err) => {
            console.log('err:', err)
          })
        } else if (type === 'learning') {
          this.curLanguage = ''
          this.languageOptions = []
          this.chapterData = {}
          this.chapterContentIds = []
          this.curChapterIndex = 0
          this.curPage = 1
          this.courseData = {
            ...this.courseData,
            learningCount: 0
          }
          this.$nextTick(() => {
            this.$refs.courseTreeRef?.setCurrentKey(this.courseData.id)
          })
          if (this.courseData.contentIds) {
            this.chapterContentIds = this.courseData.contentIds.split(',')
            this.websiteCourseFn()
          }
          this.scrollToTop()
        } else if (type === 'exam') {
          this.$utils.startExam(this.courseData.id, this.courseData.categoryName || this.chapterData.coursesTitle)
        }
      },
      websiteCourseFn() {
        this.pauseAllVideos()

        const reqData = {
          id: this.chapterContentIds[this.curPage - 1],
          language: this.curLanguage || ''
        }
        this.$api.websiteCourse(reqData).then(resp => {
          if ((resp.code === 200 || resp.code === 0) && resp.data) {
            this.chapterData = resp.data
            if (Array.isArray(this.chapterData.languages) && this.chapterData.languages.length > 0) {
              this.languageOptions = this.chapterData.languages
            }
            this.curLanguage = this.chapterData.content?.language || ''
          } else {
            this.languageOptions = []
            this.chapterData = {}
          }
          this.scrollToTop()
        }).catch(err => {
          this.chapterData = {}
          console.log('err:', err)
          this.scrollToTop()
        })
      },
      // false不更新当前选中及右侧数据，只更新左侧完成状态、数量等
      websiteArticleNavigationFn(isUpdateChapterData = true) {
        const reqData = {
          categoryName: this.categoryName
        }
        this.$api.websiteArticleNavigation(reqData).then(resp => {
          if ((resp.code === 200 || resp.code === 0) && Array.isArray(resp.data) && resp.data.length > 0) {
            this.listData = resp.data
            this.courseData = this.listData[0] || {}
            this.listFlatData = this.$utils.flatTree(this.listData, 'childrenList', false)
            if (isUpdateChapterData) {
              const savedChapterId = this.$route.query.chapterId
              const savedIdx = savedChapterId
                ? this.listFlatData.findIndex(item => String(item.id) === String(savedChapterId))
                : -1

              if (savedIdx !== -1) {
                this.chapterChange(savedIdx)
              } else {
                this.$nextTick(() => {
                  this.$refs.courseTreeRef?.setCurrentKey(this.courseData.id)
                  this.scrollToTreeNode()
                })
                if (this.courseData.contentIds) {
                  this.chapterContentIds = this.courseData.contentIds.split(',')
                  this.websiteCourseFn()
                }
              }
            }
          } else {
            this.listData = []
            this.listFlatData = []
            this.resetData()
          }
        }).catch(err => {
          console.log('err:', err)
        })
      }
    },
    created() {
      this.resetData()
      this.categoryName = this.$route.query.categoryName || ''
      this.websiteArticleNavigationFn()
    },
    beforeRouteUpdate(to, from, next) {
      if (to.query.categoryName === from.query.categoryName) {
        next()
        return
      }
      this.resetData()
      this.categoryName = to.query.categoryName || ''
      this.websiteArticleNavigationFn()
      next()
    },
    beforeDestroy() {
      // 组件销毁时清理所有视频
      this.pauseAllVideos();
    }
  }
</script>

<style lang="scss" scoped>
  .coursedetail {
    height: calc(100% - 116px);
    // margin: 0 200px;
    width: 1488px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #ffffff;
    margin-top: 100px;
    .left-content {
      height: 100%;
      min-width: 344px;
      max-width: 344px;
      width: 344px;
      padding: 30px 10px 0;
      border-right: 1PX solid #DCE4EA;
      .left-content-tree {
        height: 100%;
        width: 100%;
        overflow: auto;
        
        .left-top {
          width: 100%;
          padding-right: 5px;
          .left-title {
            color: #0E3045;
            font-size: 18px;
            font-weight: bold;
          }
          .updating {
            min-width: 68px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            color: #49D5BE;
            font-size: 13px;
            border-radius: 4px;
            background-color: #E1FDF3;
          }
          .finished {
            min-width: 68px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            color: #0E3045;
            font-size: 13px;
            border-radius: 4px;
            background-color: #EEF3F6;
          }
        }
        .chapter-item {
          width: 100%;
          color: #0E3045;
          font-size: 18px;
          .chapter-item-leaf {
            display: inline-block;
            width: 260px;
            line-height: 18px;
            color: #656B6F;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            // white-space: pre-wrap
            // 超出省略号
          }
        }
        
        ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
          background-color: #e1f1fd !important;
          font-weight: bold;
        }
        
      }
      .exam-btn-container {
        width: 100%;
        height: 110px;
      }
    }
    .right-content {
      height: 100%;
      padding: 30px 20px 0;
      overflow: auto;
      .right-btn {
        min-width: 160px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        color: #FFFFFF;
        border-radius: 4px;
        font-size: 14px;
        background-color: #036fc0;
        // font-weight: bold;
        cursor: pointer;
      }
      .changeBtn{
        color: #036fc0;
        font-size: 14px;
      }
      .right-top {
        margin-bottom: 20px;
        .right-title {
          color: #0070c0;
          font-size: 24px;
          font-weight: bold;
        }
      }
      .page-tip {
        font-size: 12pt;
        font-weight: bold;
      }
      .total-page {
        color: #0E3045;
        font-size: 14px;
        font-weight: bold;
      }
      .right-bottom {
        width: 100%;
        height: 100px;
        color: #8A9094;
        border-top: 1PX solid #DCE4EA;
        margin-top: 10px;
        .nav-prev,
        .nav-next {
          width: 220px;
          flex-shrink: 0;
          word-break: normal;
          overflow-wrap: normal;
        }
        .nav-prev {
          text-align: left;
        }
        .nav-next {
          text-align: right;
          .chapter-other {
            text-align: right;
          }
        }
        .nav-center {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .chapter-other {
          // font-weight: bold;
          font-size: 14px;
          color: #0E3045;
          word-break: normal;
          overflow-wrap: normal;
        }
      }
      .learning-finish {
        width: 100%;
        margin-top: 69px;
        padding: 0 30px;
        font-size: 14px;
        color: #0E3045;
        .finished-title {
          font-size: 20px;
          font-weight: bold;
          color: #0E3045;
          margin-bottom: 32px;
        }
        .succ-img {
          margin-bottom: 20px;
        }
      }
      .attachment-container {
        width: 338px;
        margin-left: 20px;
        .attachment-item {
          width: 338px;
          margin-top: 34px;
          // background: #0e3045;
          margin-bottom: 20px;
          .attachment-img {
            display: block;
            width: 100%;
          }
          .attachment-video {
            display: block;
            width: 100%;
            height: 253px;
            background: #000;
            object-fit: contain;
            // Safari特定修复
            &::-webkit-media-controls {
              opacity: 1 !important;
            }
            // 防止双击全屏
            &:focus {
              outline: none;
            }
          }
          .desc {
            background-color: #1e6ec3;
            line-height: 22px;
            color: #ffffff;
            font-size: 12px;
            cursor: pointer;
            position: relative;
            padding: 6px 12px;
            .expand-text {
              color: #a0d0ff;
            }
            .more-link {
              text-decoration: underline;
            }
            &:hover {
              background-color: #1a5dad;
            }
          }
          .collapsed {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }


  .attachment-video {
    display: block;
    width: 100%;
    height: 253px;
    background: #000;
    object-fit: contain;
    background-size: cover;
    background-position: center;
    &::-webkit-media-controls { opacity: 1 !important; }
    &:focus { outline: none; }
  }

  // New elements: hidden on desktop by default
  .mobile-topbar { display: none; }
  .mobile-backdrop { display: none; }
  .drawer-header { display: none; }

  /* ===== 1024px ~ 1279px: laptops ===== */
  @media (max-width: 1279px) {
    .coursedetail {
      width: 100% !important;
      margin-top: 80px;
      .left-content {
        min-width: 280px;
        max-width: 280px;
        width: 280px;
        padding: 20px 8px 0;
        .left-content-tree {
          .left-top .left-title { font-size: 16px; }
          .chapter-item {
            font-size: 16px;
            .chapter-item-leaf { width: 200px; }
          }
        }
      }
      .right-content {
        padding: 20px 16px 0;
        .right-top .right-title { font-size: 20px; }
      }
    }
  }

  /* ===== 768px ~ 1023px: tablets ===== */
  @media (max-width: 1023px) {
    .coursedetail {
      .left-content {
        min-width: 220px;
        max-width: 220px;
        width: 220px;
        padding: 16px 6px 0;
        .left-content-tree {
          .left-top .left-title { font-size: 15px; }
          .chapter-item {
            font-size: 14px;
            .chapter-item-leaf { width: 152px; }
          }
        }
        .exam-btn-container { height: 80px; }
      }
      .right-content {
        padding: 16px 12px 0;
        .right-top {
          margin-bottom: 14px;
          .right-title { font-size: 18px; }
        }
        .attachment-container {
          width: 240px;
          .attachment-item {
            width: 240px;
            .attachment-video { height: 180px; }
          }
        }
      }
    }
  }

  // ─────────────────────────────────────────────
  // Shared drawer styles — reused across all mobile breakpoints
  // ─────────────────────────────────────────────
  @mixin mobile-drawer($drawer-width, $topbar-height) {
    .coursedetail {
      width: 100% !important;
      // Let the page scroll naturally — no fixed height or overflow:hidden
      height: auto !important;
      overflow: visible !important;
      flex-direction: column !important;
      // MainPage.vue's .centerBox already has margin-top: 72px (header height)
      // so no extra margin needed here
      margin-top: 0 !important;

      // ── Mobile top bar ──────────────────────────────
      .mobile-topbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        height: $topbar-height;
        min-height: $topbar-height;
        background: #0E3045;
        color: #ffffff;
        // Header is 72px; stick the topbar right below it when scrolling
        position: sticky !important;
        top: 72px !important;
        z-index: 99 !important;

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          padding: 5px 8px;
          border-radius: 4px;
          flex-shrink: 0;
          i { font-size: 17px; margin-right: 2px; }
          &:hover { background: rgba(255, 255, 255, 0.12); }
        }

        .mobile-chapter-title {
          flex: 1;
          min-width: 0;
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        ::v-deep .mobile-lang-sel {
          flex-shrink: 0;
          width: 120px !important;
          .el-input__inner {
            background: rgba(255, 255, 255, 0.14);
            border-color: rgba(255, 255, 255, 0.28);
            color: #ffffff;
            height: 26px;
            line-height: 26px;
            font-size: 13px !important;
            padding-right: 24px;
          }
          .el-select__caret { color: #ffffff; font-size: 13px !important; }
        }
      }

      // ── Drawer backdrop ──────────────────────────────
      .mobile-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 299;
        background: rgba(0, 0, 0, 0.45);
      }

      // ── Left sidebar → slide-in drawer ──────────────
      .left-content {
        position: fixed !important;
        left: -($drawer-width + 20px);
        top: 0;
        bottom: 0;
        z-index: 300;
        min-width: 0 !important;
        max-width: $drawer-width !important;
        width: $drawer-width !important;
        height: 100% !important;
        padding: 0 !important;
        border-right: 1px solid #DCE4EA;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.22);
        transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        background: #ffffff;
        display: flex !important;
        flex-direction: column !important;

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 16px;
          height: 52px;
          min-height: 52px;
          background: #f5f8fa;
          border-bottom: 1px solid #DCE4EA;
          flex-shrink: 0;

          .drawer-title {
            font-size: 14px;
            font-weight: 700;
            color: #0E3045;
            flex: 1;
            min-width: 0;
          }

          .drawer-close-btn {
            background: none;
            border: none;
            font-size: 18px;
            color: #8A9094;
            cursor: pointer;
            padding: 4px 6px;
            border-radius: 4px;
            flex-shrink: 0;
            line-height: 1;
            &:hover { color: #0E3045; background: #e8edf0; }
          }
        }

        .left-content-tree {
          flex: 1;
          height: 0;
          overflow-y: auto;
          padding: 8px 6px 0;

          ::v-deep .el-collapse-item__header { display: none !important; }
          ::v-deep .el-collapse-item__wrap { border-bottom: none; }
          ::v-deep .el-collapse-item__content { padding-bottom: 0; }

          .left-top { display: none; }
          .chapter-item {
            font-size: 13px;
            .chapter-item-leaf { width: 100%; }
          }
        }

        .exam-btn-container {
          height: 68px;
          flex-shrink: 0;
          border-top: 1px solid #DCE4EA;
        }
      }

      &.mobile-drawer-open .left-content { left: 0; }

      // ── Right content ────────────────────────────────
      .right-content {
        // Let content height be natural — page-level scroll
        flex: none !important;
        height: auto !important;
        overflow: visible !important;
        // top: 16px base + 46px topbar height so content clears the sticky bar
        padding: 62px 14px 72px !important;

        // Desktop title bar is hidden; title lives in mobile-topbar
        .right-top { display: none !important; }
        .desktop-lang-sel { display: none !important; }

        // Inner flex content wrapper: stop flex-fill, let it grow naturally
        > .vcontainer {
          flex: none !important;
          height: auto !important;
        }

        // Rich text + attachment row → stack as column
        .mainCenter {
          flex-direction: column !important;
          flex: none !important;
          height: auto !important;
          // Override the inline style="overflow-y: auto"
          overflow: visible !important;
          overflow-x: visible !important;
          overflow-y: visible !important;
          padding-right: 0 !important;
          .w-240 { display: none !important; }
        }

        .attachment-container {
          width: 100% !important;
          margin-left: 0 !important;
          margin-top: 16px;
          .attachment-item {
            width: 100% !important;
            .attachment-video { height: 196px; }
          }
        }

        // Fixed bottom navigation bar
        .right-bottom {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 99 !important;
          width: 100% !important;
          height: auto !important;
          box-sizing: border-box !important;
          background: #ffffff;
          border-top: 1px solid #DCE4EA;
          padding: 10px 14px 12px !important;
          margin-top: 0 !important;
          .nav-prev, .nav-next { width: 130px; }
          .chapter-other { font-size: 12px; }
        }

        .right-btn {
          min-width: 110px;
          height: 38px;
          line-height: 38px;
          font-size: 13px;
          padding: 0 12px;
        }
        .changeBtn { font-size: 13px; }
        .page-tip { font-size: 11pt; }
        .total-page { font-size: 13px; }

        .learning-finish {
          margin-top: 24px;
          padding: 0 8px;
          font-size: 13px;
          .finished-title { font-size: 17px; margin-bottom: 20px; }
          .succ-img { width: 150px; height: auto; }
          .mt-55 { margin-top: 24px !important; }
        }
      }
    }
  }

  /* ===== < 768px: phones — drawer + page-scroll ===== */
  @media (max-width: 767px) {
    @include mobile-drawer(290px, 46px);
  }

  /* ===== < 480px: smaller phones ===== */
  @media (max-width: 479px) {
    @include mobile-drawer(270px, 44px);
    .coursedetail {
      .mobile-topbar {
        padding: 0 10px;
        .mobile-menu-btn { font-size: 11px; padding: 4px 6px; }
        .mobile-chapter-title { font-size: 14px; }
        ::v-deep .mobile-lang-sel { width: 110px !important; }
      }
      .left-content {
        .left-content-tree .chapter-item { font-size: 12px; }
        .exam-btn-container { height: 60px; }
      }
      .right-content {
        padding: 72px 12px 68px !important;
        .right-btn { min-width: 96px; height: 36px; line-height: 36px; font-size: 12px; padding: 0 10px; }
        .changeBtn { font-size: 12px; }
        .right-bottom .nav-prev, .right-bottom .nav-next { width: 112px; }
        .right-bottom .chapter-other { font-size: 12px; }
        .learning-finish {
          .finished-title { font-size: 15px; }
          .succ-img { width: 130px; }
        }
      }
    }
  }

  /* ===== < 360px: very small phones ===== */
  @media (max-width: 359px) {
    @include mobile-drawer(250px, 42px);
    .coursedetail {
      .right-content {
        padding: 52px 10px 64px !important;
        .right-btn { min-width: 84px; height: 34px; line-height: 34px; font-size: 11px; padding: 0 8px; }
        .right-bottom .chapter-other { font-size: 11px; }
      }
    }
  }
</style>

<style lang="scss">
  /* Mobile language selector dropdown option font size */
  .mobile-lang-sel + .el-select-dropdown .el-select-dropdown__item {
    font-size: 13px !important;
  }

  .el-tree-node__content {
    height: auto !important;
    min-height: 36px !important;
  }
  .full-dialog {
    .fulldialog-container {
      width: 100%;
      height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      .fulldialog-item {
        width: 100%;
        height: 100%;
        object-fit: contain;
        &::-webkit-media-controls {
          display: flex !important;
          opacity: 1 !important;
        }
        // 防止Safari中的全屏问题
        &::-webkit-media-controls-fullscreen-button {
          display: none;
        }
      }
    }
  }
  .exam-btn{
    background: #036fc0 !important;
    color: #fff !important;
    line-height: 48px;
    height: 48px;
    padding: 0 20px;
  }
  .disabledBtn{
    background: #c0c0c0 !important;
    border: #c0c0c0 solid 1px;
    border-color: #c0c0c0 !important;
  }
  .preview-content *{
    // font-size: 18px !important;
  }

  /* ── Mobile: force fixed bottom nav & sticky topbar (global, no scoped attr issues) ── */
  @media (max-width: 767px) {
    /* Fixed bottom navigation bar — always at viewport bottom */
    .coursedetail .right-content .right-bottom {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 200 !important;
      background: #ffffff !important;
      border-top: 1px solid #DCE4EA !important;
      padding: 10px 14px 12px !important;
      height: auto !important;
      margin-top: 0 !important;
      box-sizing: border-box !important;
    }

    /* Sticky topbar: header is 72px on all mobile sizes, so always top: 72px */
    .coursedetail .mobile-topbar {
      position: sticky !important;
      top: 72px !important;
      z-index: 150 !important;
    }

    /* No extra margin on coursedetail — MainPage.vue's .centerBox handles it */
    .coursedetail {
      margin-top: 0 !important;
    }
  }

  @media (max-width: 479px) {
    .coursedetail .right-content .right-bottom {
      padding: 8px 12px 10px !important;
    }
  }

  /* Override text-align:justify in rich text content on mobile */
  @media (max-width: 767px) {
    .coursedetail .right-content .mainCenter * {
      text-align: left !important;
    }
    .coursedetail .right-content .mainCenter h1,
    .coursedetail .right-content .mainCenter h2,
    .coursedetail .right-content .mainCenter h3,
    .coursedetail .right-content .mainCenter h4 {
      text-align: left !important;
    }
  }
</style>