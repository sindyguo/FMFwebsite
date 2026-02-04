<template>
  <el-dialog
    :visible="visible"
    :title="dialogTitle"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="chapter-test"
    width="800px"
    @close="handleClose">
    <template v-if="listData.length > 0"> 
      <span class="chapter-title">Chapter: {{ categoryName }}</span>
      <div class="vcontainer content">
        <div v-for="(item, index) in listData" :key="item.id" class="vcontainer item-container">
          <div class="hcontainer vcenter flex-between">
            <div class="hcontainer flex-start">
              <span>{{ index + 1 }}.</span>
              <div class="ml-5" v-html="item.question || ''"></div>
            </div>
            <div v-show="showResults">
              <i v-if="item.correctAnswer == selectedAnswers[index]" class="el-icon-check correct"></i>
              <i v-else class="el-icon-close error"></i>
            </div>
          </div>
          <el-radio-group v-model="selectedAnswers[index]" :disabled="showResults">
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
          <div v-if="showResults" class="vcontainer result-section">
            <span :class="[(item.correctAnswer == selectedAnswers[index] ? 'correct': 'error')]">Correct Answer: {{ item.correctAnswer }}</span>
            <span class="explanation"><p class="tip">Explanation: </p>{{ item.explanation || '' }}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="hcontainer vcenter hcenter footer">
        <el-button class="footer-btn w-150 mr-30" v-show="!showResults" @click="doneClick">Done</el-button>
        <el-button class="w-150" v-show="showResults" @click="handleClose">Close</el-button>
        <el-button class="footer-btn w-150" v-if="showResults" @click="webuserCourseExercisesFn">Retake Exam</el-button>
      </div>
    </template>
    <el-empty
      v-else 
      :description="description"
      :image="require('@/assets/img/img_nodata.png')"
      style="min-height: 400px;">
    </el-empty>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ChapterTestDialog',
    props: {
      description: {
        type: String,
        default: 'No test'
      },
      visible: {
        type: Boolean,
        default: false
      },
      categoryId: {
        type: String,
        default: ''
      },
      categoryName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogTitle: 'Chapter Test',
        showResults: false,
        selectedAnswers: [],
        listData: [],
        isFinishDone: false
      };
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.isFinishDone = false
          this.webuserCourseExercisesFn()
        }
      }
    },
    mounted() {
      this.selectedAnswers = new Array(this.listData.length).fill('')
    },
    methods: {
      handleClose() {
        this.$emit('close', this.isFinishDone)
      },
      doneClick() {
        this.isFinishDone = true
        this.showResults = true
      },
      webuserCourseExercisesFn() {
        this.showResults = false
        this.$api.webuserCourseExercises({
          categoryId: this.categoryId
        }).then(res => {
          if ((res.code === 200 || res.code === 0) && Array.isArray(res.data)) {
            this.listData = res.data
            this.selectedAnswers = new Array(this.listData.length).fill('')
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
    }
  }
</script>

<style lang="scss" scoped>
  .chapter-test {
    .chapter-title {
      color: #8A9094;
      font-size: 14px;
      font-weight: bold;
    }
    .content {
      height: 500PX;
      word-break: break-word;
      overflow-y: auto;
      padding-right: 10px;
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
      .error {
        color: #C40000;
      }
      .correct {
        color: #00BB5E;
      }
    }
    .footer {
      .footer-btn {
        background-color: #036fc0;
        color: #ffffff;
      }
    }
  }
::v-deep .el-dialog__header {
  background-color: #ECF1F5;
  color: #0E3045;
  font-size: 14px;
  padding: 10px 20px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  font-weight: bold;
}
</style>