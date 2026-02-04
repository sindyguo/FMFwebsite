<template>
  <div class="fill vcontainer exam">
    <div class="hcontainer vcenter flex-between header">
      <span>Exam Details</span>
      <span class="tip">Do not refresh the page while taking the exam</span>
      <div class="exit-btn" @click="closeClick">Exit</div>
    </div>
    <div class="fill vcontainer content">
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
          :column="6"
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
      <div class="fill vcontainer content-container">
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
            <span :class="[(resultData.userQuestionSaveReqVOList && resultData.userQuestionSaveReqVOList[index]?.correctAnswer == selectedAnswers[index] ? 'correct': 'error')]">Correct Answer: {{ item.correctAnswer }}</span>
            <span class="explanation"><p class="tip">Explanation: </p>{{ resultData.userQuestionSaveReqVOList && resultData.userQuestionSaveReqVOList[index]?.explanation || '' }}</span>
          </div>
        </div>
      </div>
      <div class="hcontainer hcenter vcenter footer">
        <el-button class="footer-btn w-180" v-if="listData.length && !isExamFinish" @click="submitExam">Done</el-button>
        <el-button class="w-200 mr-50" v-if="isExamFinish" @click="goToEducation">Back To Education</el-button>
        <el-button class="footer-btn w-180" v-if="isExamFinish" @click="webuserCourseExaminationFn">Retake Exam</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ExamPage',
    data() {
      return {
        title: sessionStorage.getItem('courseTitle') || 'Education Exam',
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
        isExamFinish: false
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
          if (this.left <= 0) {
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
          coursesId: sessionStorage.getItem('courseId'),
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
          }
        }).catch(err => {
          this.$message.error('Error submitting exam: ' + err.message)
        })
      },
      closeClick() {
        sessionStorage.removeItem('courseId')
        sessionStorage.removeItem('courseTitle')
        window.close()
      },
      goToEducation() {
        this.$router.push('/course?categoryName=Education')
      },
      downloadClick() {
        const courseId = sessionStorage.getItem('courseId')
        const fileUrl = process.env.VUE_APP_BASE_API + '/app-api/fmf/webuser/courseCompletionCertificate/' + courseId
        this.$utils.downloadUrl(fileUrl, this.title)
      },
      webuserCourseExaminationFn() {
        this.isExamFinish = false
        const courseId = sessionStorage.getItem('courseId')
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
    beforeDestroy() {
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
    .header {
      color: #0E3045;
      font-size: 16px;
      font-weight: bold;
      padding: 20px 40px;
      background-color: #ffffff;
      border-bottom: 1px solid #e4e7ed;
      .tip {
        color: #C40000;
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
      width: 1200px;
      margin: 0 auto;
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
        height: 100%;
        word-break: break-word;
        overflow-y: auto;
        .item-container {
          color: #0E3045;
          font-size: 14px;
          font-weight: bold;
          margin-top: 15px;
          .item-header {
            margin-bottom: 10px;
          }
          .item-option {
            display: flex !important;
            white-space: normal !important;
            color: #0E3045 !important;
            margin-top: 10px;
            .item-option-question {
              min-width: 15PX;
            }
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
        margin: 10px 0;
        .footer-btn {
          background-color: #036fc0;
          color: #ffffff;
        }
      }
    }
  }
</style>