<template>
  <div class="fill vcontainer exam">
    <!-- 考试通过喝彩动效（与 ChapterTestDialog 一致） -->
    <div v-if="showCelebration" class="celebration-container">
      <div class="confetti" v-for="i in 80" :key="i" :style="{
        left: `${Math.random() * 100}%`,
        backgroundColor: ['#FF5252', '#FFD740', '#40C4FF', '#69F0AE', '#EA80FC', '#FF8A65', '#9C27B0'][Math.floor(Math.random() * 7)],
        animationDelay: `${Math.random() * 1.5}s`,
        animationDuration: `${1.5 + Math.random() * 1.5}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }"></div>
      <div class="celebration-text">
        <span>Congratulations! You have passed the test!</span>
      </div>
    </div>

    <div class="hcontainer vcenter flex-between header">
      <span>Exam Details</span>
      <span class="tip">Do not refresh the page while taking the exam</span>
      <div class="exit-btn" @click="closeClick">Exit</div>
    </div>
    <div class="fill vcontainer content">
      <div class="content-scroll">
        <span class="title">{{ title }}</span>
        <div v-if="isExamFinish" class="vcontainer content-top">
          <span :class="['result-message', (isExamPass ? 'mb-10 correct': 'mb-20 error')]">
            {{ isExamPass ? 'Congratulations on completing all lessons in this course and successfully passing the examination!' : 'Unfortunately, you did not pass this exam, Keep pushing forward!' }}
          </span>
          <template v-if="isExamPass">
            <span class="pass-tip">We will award you a Course Completion Certificate and add your name to the global list of course graduates.</span>
            <span class="pass-tip mb-20">Please <a href="#" class="download-link" @click="downloadClick">click here</a> to download your certificate</span>
          </template>
          <el-descriptions
            title=""
            direction="vertical"
            :column="resultDescColumns"
            :border="true"
            :label-style="{backgroundColor: '#DCE4EA', color: '#1E2224', fontWeight: 'bold', textAlign: 'center', border: 0}"
            :content-style="{color: '#1E2224', fontWeight: 'bold', textAlign: 'center'}">
            <el-descriptions-item label="Total">{{ resultData.total }}</el-descriptions-item>
            <el-descriptions-item label="Correct" :content-style="{color: '#00BB5E', fontWeight: 'bold', textAlign: 'center'}">{{ resultData.correct }}</el-descriptions-item>
            <el-descriptions-item label="Incorrect" :content-style="{color: '#C40000', fontWeight: 'bold', textAlign: 'center'}">{{ resultData.incorrect }}</el-descriptions-item>
            <el-descriptions-item label="PassingStandard">{{ resultData.passingStandard | percentF }}</el-descriptions-item>
            <el-descriptions-item label="answerAccuracy">{{ resultData.answerAccuracy | percentF }}</el-descriptions-item>
            <el-descriptions-item label="ExamResults" :content-style="{color: isExamPass ? '#00BB5E': '#C40000', fontWeight: 'bold', textAlign: 'center'}">{{ isExamPass ? 'Pass' : 'Failed' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-else class="hcontainer vcenter flex-between content-top">
          <div class="hcontainer vcenter timer">
            <i class="el-icon-time"></i>
            <span>{{ timeStr }}</span>
          </div>
        </div>
        <div class="vcontainer content-container">
        <div v-for="(item, index) in listData" :key="item.id" class="vcontainer item-container">
          <div class="hcontainer vcenter flex-between">
            <div class="hcontainer flex-start">
              <span>{{ index + 1 }}.</span>
              <div class="ml-5" v-html="item.question || ''"></div>
            </div>
            <div v-show="isExamFinish">
              <i v-if="resultData.userQuestionSaveReqVOList && resultData.userQuestionSaveReqVOList[index]?.correctAnswer == selectedAnswers[index]" class="el-icon-check correct"></i>
              <i v-else class="el-icon-close error"></i>
            </div>
          </div>
          <el-radio-group v-model="selectedAnswers[index]" :disabled="isExamFinish">
            <template v-if="item.questionType == 'true_or_false'">
              <el-radio class="item-option" label="A">
                <div class="hcontainer flex-start">
                  <span class="item-option-question">A.</span>
                  <div class="ml-5">True</div>
                </div>
              </el-radio>
              <el-radio class="item-option" label="B">
                <div class="hcontainer flex-start">
                  <span class="item-option-question">B.</span>
                  <div class="ml-5">False</div>
                </div>
              </el-radio>
            </template>
            <template v-else> 
              <el-radio
                v-for="optionItem in (item.questionOptionRespVO || [])"
                :key="optionItem.questionOption"
                :label="optionItem.questionOption"
                class="item-option">
                <div class="hcontainer flex-start">
                  <span class="item-option-question">{{ optionItem.questionOption }}.</span>
                  <div class="ml-5" v-html="optionItem.optionContent || ''"></div>
                </div>
              </el-radio>
            </template>
          </el-radio-group>
          <div v-if="isExamFinish" class="vcontainer result-section">
            <span :class="[(resultData.userQuestionSaveReqVOList && resultData.userQuestionSaveReqVOList[index]?.correctAnswer == selectedAnswers[index] ? 'correct': 'error')]">Correct Answer: {{ resultData.userQuestionSaveReqVOList[index]?.correctAnswer }}</span>
            <span class="explanation"><p class="tip">Explanation: </p>{{ resultData.userQuestionSaveReqVOList && resultData.userQuestionSaveReqVOList[index]?.explanation || '' }}</span>
          </div>
        </div>
        </div>
      </div>
      <div class="hcontainer hcenter vcenter footer">
        <el-button class="footer-btn w-180" v-if="listData.length && !isExamFinish" @click="submitExam">Done</el-button>
        <el-button :class="['w-200', 'mr-50', isExamPass ? 'footer-btn' : '']" v-if="isExamFinish" @click="goToEducation">Back to education</el-button>
        <el-button class="footer-btn w-180" v-if="isExamFinish && !isExamPass" @click="webuserCourseExaminationFn">Retake test</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ExamPage',
    data() {
      return {
        title: localStorage.getItem('courseTitle') || 'Education Exam',
        leftTime: 1800,
        timer: null,
        resultData: {
          total: undefined,
          correct: undefined,
          incorrect: undefined,
          passingStandard: '',
          answerAccuracy: '',
          examResults: ''
        },
        listData: [],
        selectedAnswers: [],
        isExamFinish: false,
        showCelebration: false,
        resultDescColumns: 6
      }
    },
    filters: {
      percentF(val) {
        if (!val || val == 0 || isNaN(val)) {
          return '-'
        }
        const percentage = Math.round(val * 100)
        return `${percentage}%`
      }
    },
    computed: {
      timeStr() {
        const m = String(Math.floor(this.leftTime / 60)).padStart(2, '0')
        const s = String(this.leftTime % 60).padStart(2, '0')
        return `${m}:${s}`
      },
      isExamPass() {
        return this.resultData.examResults === 1
      }
    },
    methods: {
      startTimer() {
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.leftTime = 1800
        this.timer = setInterval(() => {
          if (this.leftTime <= 0) {
            clearInterval(this.timer)
            this.leftTime = 0
            this.submitExam()
          } else {
            this.leftTime--
          }
        }, 1000)
      },
      submitExam() {
        let userQuestionSaveReqVOList = []
        this.listData.forEach((item, index) => {
          userQuestionSaveReqVOList.push({
            id: item.id,
            userAnswer: this.selectedAnswers[index]
          })
        })
        const reqData = {
          coursesId: localStorage.getItem('courseId'),
          userQuestionSaveReqVOList: userQuestionSaveReqVOList

        }
        this.$api.webuserSubmitCourseExamination(reqData).then(res => {
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.resultData = res.data
            this.isExamFinish = true
            if (this.timer) {
              clearInterval(this.timer)
              this.timer = null
            }
            // 考试通过时显示喝彩动效，4秒后自动消失
            if (this.resultData.examResults === 1) {
              this.showCelebration = true
              setTimeout(() => {
                this.showCelebration = false
              }, 4000)
            }
          }
        }).catch(err => {
          this.$message.error('Error submitting exam: ' + err.message)
        })
      },
      closeClick() {
        localStorage.removeItem('courseId')
        localStorage.removeItem('courseTitle')
        window.close()
      },
      goToEducation() {
        this.$router.push('/course?categoryName=Education')
      },
      downloadClick() {
        const courseId = localStorage.getItem('courseId')
        const fileUrl = process.env.VUE_APP_BASE_API + '/app-api/fmf/webuser/courseCompletionCertificate/' + courseId
        this.$utils.downloadUrl(fileUrl, this.title)
      },
      updateResultDescColumns() {
        if (typeof window === 'undefined') return
        const w = window.innerWidth
        if (w <= 480) this.resultDescColumns = 1
        else if (w <= 640) this.resultDescColumns = 2
        else if (w <= 900) this.resultDescColumns = 3
        else if (w <= 1100) this.resultDescColumns = 4
        else this.resultDescColumns = 6
      },
      webuserCourseExaminationFn() {
        this.isExamFinish = false
        const courseId = localStorage.getItem('courseId')
        if (!courseId) {
          this.$message.warning('Please start new exam from main page!')
          return
        }
        this.$api.webuserCourseExamination({
          courseId: courseId
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && Array.isArray(res.data)) {
            this.listData = res.data
            this.selectedAnswers = new Array(this.listData.length).fill('')
            this.startTimer()
          } else {
            this.listData = []
            this.selectedAnswers = []
          }
        }).catch((err) => {
          console.log('err:', err)
          this.listData = []
          this.selectedAnswers = []
        })
      }
    },
    created() {
      this.webuserCourseExaminationFn()
    },
    mounted() {
      this.updateResultDescColumns()
      window.addEventListener('resize', this.updateResultDescColumns)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateResultDescColumns)
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .exam {
    height: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
    .header {
      flex-shrink: 0;
      color: #0E3045;
      font-size: 16px;
      font-weight: bold;
      padding: 20px 40px;
      background-color: #ffffff;
      border-bottom: 1px solid #e4e7ed;
      .tip {
        color: #C40000;
        font-weight: normal;
      }
      .exit-btn {
        color: #036fc0;
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
      }
    }
    .content {
      background-color: #ffffff;
      padding: 32px 72px 0;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      min-height: 0;
      overflow: hidden;

      .content-scroll {
        flex: 1 1 auto;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 8px;
      }

      .error {
        color: #C40000;
      }
      .correct {
        color: #00BB5E;
      }
      .title {
        color: #1E2224;
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
      }
      .content-top {
        margin-bottom: 30px;
        font-size: 14px;
        color: #1E2224;
        .pass-tip {
          font-size: 14px;
          text-align: center;
          .download-link {
            color: #409EFF;
            cursor: pointer;
          }
        }
        .timer {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #909399;
          i {
            margin-right: 8px;
            color: #909399;
          }
        }
        .result-message {
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        }
      }
      .content-container {
        word-break: break-word;
        .item-container {
          color: #0E3045;
          font-size: 14px;
          font-weight: bold;
          margin-top: 15px;
          > .hcontainer.flex-between {
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 8px 12px;
            > .hcontainer.flex-start {
              flex: 1 1 0;
              min-width: 0;
            }
          }
          .item-header {
            margin-bottom: 10px;
          }
          .item-option {
            display: flex !important;
            white-space: normal !important;
            color: #0E3045 !important;
            margin-top: 10px;
            align-items: flex-start;
            .item-option-question {
              min-width: 15PX;
            }
          }
          ::v-deep .el-radio-group {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
        }
        .result-section {
          padding: 15px;
          .explanation {
            color: #0E3045;
            font-size: 14px;
            font-weight: normal;
            .tip {
              display: inline-block;
            }
          }
        }
      }
      .footer {
        flex-shrink: 0;
        margin: 10px 0;
        padding-bottom: 24px;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        .footer-btn {
          background-color: #036fc0;
          color: #ffffff;
        }
        ::v-deep .el-button {
          max-width: 100%;
        }
      }
    }
  }

  @media (max-width: 992px) {
    .exam {
      .header {
        padding: 16px 24px;
        flex-wrap: wrap;
        row-gap: 10px;
        column-gap: 12px;
        .tip {
          order: 3;
          flex: 1 0 100%;
          text-align: center;
          font-size: 14px;
        }
        .exit-btn {
          margin-left: auto;
        }
      }
      .content {
        padding: 24px 28px 0;
        .title {
          font-size: 22px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .exam {
      .header {
        padding: 14px 16px;
        font-size: 15px;
        .tip {
          font-size: 13px;
        }
      }
      .content {
        padding: 20px 16px 0;
        .title {
          font-size: 20px;
        }
        .content-top .result-message {
          font-size: 15px;
        }
        .content-container .item-container {
          > .hcontainer.flex-between > .hcontainer.flex-start {
            flex: 1 1 100%;
          }
        }
        .footer {
          flex-direction: column;
          align-items: stretch;
          ::v-deep .el-button {
            width: 100%;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .exam {
      .content {
        padding: 16px 12px 0;
        .title {
          font-size: 18px;
        }
      }
    }
  }

  // 喝彩动效（与 ChapterTestDialog 一致）
  .celebration-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9999;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .confetti {
    position: absolute;
    width: 8px;
    height: 20px;
    border-radius: 3px;
    top: -20px;
    opacity: 0.8;
    animation: confetti-fall linear forwards;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  .celebration-text {
    text-align: center;
    z-index: 10;
    padding: 20px 40px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: calc(100vw - 32px);
    box-sizing: border-box;

    span {
      font-size: 32px;
      font-weight: 800;
      color: #036fc0;
      display: block;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 768px) {
    .celebration-text {
      padding: 16px 20px;
      span {
        font-size: 22px;
      }
    }
  }
</style>