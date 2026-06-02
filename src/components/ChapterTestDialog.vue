<template>
  <el-dialog
    :visible="visible"
    :title="dialogTitle"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="chapter-test"
    :width="dialogWidth"
    :fullscreen="dialogFullscreen"
    :top="dialogTop"
    @close="handleClose">
    <!-- 烟花彩带碎片喝彩动效：核心修改部分 -->
    <div v-if="showCelebration" class="celebration-container">
      <!-- 彩带碎片（多颜色、多方向，保证动画随机感） -->
      <div class="confetti" v-for="i in 80" :key="i" :style="{
        left: `${Math.random() * 100}%`,
        backgroundColor: ['#FF5252', '#FFD740', '#40C4FF', '#69F0AE', '#EA80FC', '#FF8A65', '#9C27B0'][Math.floor(Math.random() * 7)],
        animationDelay: `${Math.random() * 1.5}s`,
        animationDuration: `${1.5 + Math.random() * 1.5}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }"></div>
      <!-- 中心祝贺文字 -->
      <div class="celebration-text">
        <span>🎉 Congratulations! 🎉</span>
        <p>All Answers Correct!</p>
      </div>
    </div>

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
        <!-- 未提交答案时显示Done按钮 -->
        <el-button class="footer-btn w-150 mr-30" v-show="!showResults" @click="doneClick">Done</el-button>
        
        <!-- 全对时只显示蓝色Continue按钮 -->
        <el-button class="footer-btn w-150" v-show="showResults && isAllCorrect" @click="handleContinue">Back to education</el-button>
        
        <!-- 未全对时显示原按钮 -->
        <el-button class="w-150" v-show="showResults && !isAllCorrect" @click="handleClose">Close</el-button>
        <el-button class="footer-btn w-150" v-if="showResults && !isAllCorrect" @click="webuserCourseExercisesFn">Retake exam</el-button>
      </div>
    </template>
    <el-empty
      v-else
      class="chapter-test-empty"
      :description="description"
      :image="require('@/assets/img/img_nodata.png')">
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
        isFinishDone: false,
        showCelebration: false, // 彩带动效显示开关
        isAllCorrect: false, // 是否全对
        dialogWidth: '800px',
        dialogFullscreen: false,
        dialogTop: '8vh'
      };
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.updateDialogLayout()
          this.isFinishDone = false
          this.webuserCourseExercisesFn()
        }
      }
    },
    mounted() {
      this.selectedAnswers = new Array(this.listData.length).fill('')
      this.updateDialogLayout()
      window.addEventListener('resize', this.updateDialogLayout)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateDialogLayout)
    },
    methods: {
      updateDialogLayout() {
        if (typeof window === 'undefined') return
        const w = window.innerWidth
        if (w <= 576) {
          this.dialogFullscreen = true
          this.dialogWidth = '100%'
          this.dialogTop = '0'
        } else {
          this.dialogFullscreen = false
          this.dialogTop = w <= 768 ? '2vh' : '8vh'
          if (w <= 768) this.dialogWidth = '94%'
          else if (w <= 1100) this.dialogWidth = '90%'
          else this.dialogWidth = '800px'
        }
      },
      handleClose() {
        this.$emit('close', this.isFinishDone)
      },
      // 继续学习按钮逻辑
      handleContinue() {
        this.isFinishDone = true
        this.$emit('continue', this.isFinishDone)
        this.handleClose()
      },
      doneClick() {
        this.isFinishDone = true
        this.showResults = true
        
        // 全对判断逻辑
        this.isAllCorrect = this.listData.every((item, index) => {
          return item.correctAnswer === this.selectedAnswers[index]
        })
        
        // 全对则显示彩带动效，4秒后自动消失
        if (this.isAllCorrect) {
          this.showCelebration = true
          setTimeout(() => {
            this.showCelebration = false
          }, 4000) // 动效持续4秒，和需求一致
        }
      },
      webuserCourseExercisesFn() {
        this.showResults = false
        this.isAllCorrect = false
        this.showCelebration = false // 重新答题重置动效
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
      display: block;
      margin-bottom: 8px;
      word-break: break-word;
    }
    .content {
      height: auto;
      max-height: min(500px, 52vh);
      word-break: break-word;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 10px;
      -webkit-overflow-scrolling: touch;
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
            min-width: 15px;
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
      .error {
        color: #C40000;
      }
      .correct {
        color: #00BB5E;
      }
    }
    .footer {
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

  .chapter-test-empty {
    min-height: 280px;
  }

  // 烟花彩带动效核心样式（重点）
  .celebration-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3); // 半透背景，突出动效
    z-index: 9999;
    pointer-events: none; // 不遮挡按钮点击
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 彩带碎片样式 + 扩散动画
  .confetti {
    position: absolute;
    width: 8px;
    height: 20px;
    border-radius: 3px;
    top: -20px;
    opacity: 0.8;
    animation: confetti-fall linear forwards;
  }

  // 彩带下落扩散关键帧
  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg); // 下落+旋转，模拟烟花散开
      opacity: 0;
    }
  }

// 中心祝贺文字样式
.celebration-text {
  text-align: center;
  z-index: 10; // 文字在彩带上方
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.9); // 添加半透明白色背景板
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); // 增加阴影提升层次感
  max-width: calc(100vw - 32px);
  box-sizing: border-box;

  span {
    font-size: 32px; // 增大主标题字号
    font-weight: 800; // 加粗字体
    color: #036fc0; // 保持品牌蓝色
    display: block;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 文字阴影增强可读性
  }

  p {
    font-size: 20px; // 增大副标题字号
    color: #333;
    margin: 0;
    font-weight: 600; // 副标题也加粗
  }
}

::v-deep .chapter-test.el-dialog {
  display: flex;
  flex-direction: column;
  max-height: 92vh;
  margin-bottom: 0;
  box-sizing: border-box;
}

::v-deep .chapter-test.el-dialog.is-fullscreen {
  max-height: 100vh;
  height: 100% !important;
  margin-top: 0 !important;
  margin-bottom: 0;
  border-radius: 0;
}

::v-deep .chapter-test.is-fullscreen .el-dialog__body {
  flex: 1 1 0;
  min-height: 0;
}

::v-deep .chapter-test.is-fullscreen .el-dialog__body .content {
  flex: 1 1 auto;
  min-height: 0;
  max-height: none;
  overflow-y: auto;
}

::v-deep .chapter-test .el-dialog__header {
  background-color: #ECF1F5;
  color: #0E3045;
  font-size: 14px;
  padding: 10px 20px;
  flex-shrink: 0;
}

::v-deep .chapter-test .el-dialog__title {
  font-size: 14px;
  font-weight: bold;
  word-break: break-word;
  padding-right: 8px;
}

::v-deep .chapter-test .el-dialog__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  box-sizing: border-box;
}

::v-deep .chapter-test .el-dialog__footer {
  flex-shrink: 0;
  padding: 12px 20px 16px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .chapter-test .content {
    max-height: calc(92vh - 200px);
  }

  .chapter-test .footer {
    flex-direction: column;
    align-items: stretch;
    ::v-deep .el-button {
      width: 100%;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }

  .celebration-text {
    padding: 16px 20px;
    span {
      font-size: 22px;
    }
    p {
      font-size: 16px;
    }
  }
}

@media (max-width: 576px) {
  ::v-deep .chapter-test .el-dialog__body {
    padding: 12px 14px;
  }

  ::v-deep .chapter-test .el-dialog__header {
    padding: 10px 14px;
  }

  ::v-deep .chapter-test .el-dialog__footer {
    padding: 10px 14px 14px;
  }

  .chapter-test .chapter-title {
    font-size: 13px;
  }

  .chapter-test-empty {
    min-height: 200px;
  }
}
</style>

<style lang="scss">
.el-dialog__wrapper:has(> .chapter-test:not(.is-fullscreen)) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  box-sizing: border-box;
}

.el-dialog.chapter-test:not(.is-fullscreen) {
  margin: 0 auto !important;
}

@supports not (selector(:has(*))) {
  .el-dialog.chapter-test:not(.is-fullscreen) {
    margin-top: 8vh !important;
  }
}
</style>