<template>
  <div class="fill hcontainer coursedetail">
    <div class="vcontainer left-content">
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
                <span v-if="data.level == 1">{{ courseData.learningCount || 0 }}/{{ courseData.totalCount || 0 }}</span>
                <span v-else-if="node.isLeaf && data.hasLearning"><i class="el-icon-check"></i></span>
              </div>
            </el-tree>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="hcontainer vcenter hcenter exam-btn-container">
        <el-button
          type="primary"
          plain
          :disabled="!(courseData.totalCount && courseData.learningCount == courseData.totalCount)"
          @click="rightBtnClick('exam')">
          Take an exam
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
            <div v-if="!chapterData.status" class="right-btn ml-20" @click="rightBtnClick('exam')">Start Exam</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="hcontainer vcenter flex-between right-top">
          <span class="right-title">{{ chapterData.categoryTitle || chapterData.coursesTitle || listFlatData[curChapterIndex]?.categoryName || '' }}</span>
          <el-select v-model="curLanguage" size="mini" class="w-150" @change="websiteCourseFn">
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
          <div class="fill hcontainer pr-20" style="overflow-y: auto" ref="contentContainerRef" @click="handleContentClick">
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
                  :preload="index === 0 ? 'auto' : 'none'" 
                  class="attachment-video"
                  controls>
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
              :pager-count="5"
              :total="chapterContentIds.length || 0"
              @current-change="websiteCourseFn">
            </el-pagination>
          </div>
        </div>
        <el-empty v-else class="fill vcontainer vcenter" :image="require('@/assets/img/img_nodata.png')" description="No content"></el-empty>
        <div class="hcontainer vcenter flex-between right-bottom">
          <div>
            <div v-show="curChapterIndex > 0"
              class="vcontainer flex-start"
              style="cursor: pointer;"
              @click="chapterChange(curChapterIndex - 1,'banck')">
              <span class="changeBtn"><i class="el-icon-back"></i>Back</span>
              <span class="chapter-other">{{ listFlatData[curChapterIndex-1]?.categoryName || '' }}</span>
            </div>
          </div>
          <div v-show="(listFlatData[curChapterIndex]?.categoryType == 'lesson' || chapterData.categoryType == 'lesson') && chapterData.content?.content && curPage === chapterContentIds.length" class="right-btn" @click="rightBtnClick('test')">Chapter Test</div>
          <div>
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
        time: 0
      }
    },
    methods: {
      scrollToTop() {
        this.$nextTick(() => {
          if (this.$refs.contentContainerRef) {
            this.$refs.contentContainerRef.scrollTop = 0
          }
        })
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
          this.$nextTick(() => {
            this.$refs.courseTreeRef?.setCurrentKey(curChapterItem.id)
            this.scrollToTreeNode()
          })
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
          this.scrollToTop()
        }, 100)
      },
      nodeClick(data) {
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
          }).then(res => {
            if ((res.code === 200 || res.code === 0)) {
              this.showChapterTestDialog = true
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
              this.$nextTick(() => {
                this.$refs.courseTreeRef?.setCurrentKey(this.courseData.id)
                this.scrollToTreeNode()
              })
              if (this.courseData.contentIds) {
                this.chapterContentIds = this.courseData.contentIds.split(',')
                this.websiteCourseFn()
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
    height: 100%;
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
          font-size: 12pt;
          .chapter-item-leaf {
            display: inline-block;
            width: 260px;
            line-height: 18px;
            color: #656B6F;
            white-space: pre-wrap
          }
        }
        
        ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
          background-color: #e1f1fd !important;
          font-weight: bold;
        }
        
      }
      .exam-btn-container {
        width: 100%;
        height: 80px;
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
        font-weight: bold;
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
        .chapter-other {
          font-weight: bold;
          font-size: 14px;
          color: #0E3045;
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
</style>

<style lang="scss">
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
</style>