<template>
  <div class="hcontainer hcenter education">
    <div class="vcontainer left-content">
      <div class="vcontainer left-container">
        <span class="left-title">Education</span>
        <span class="tip mv-5">Internet-based courses, which are free of charge and available in several languages:</span>
        <div
          v-for="item in educationList"
          :key="item.id"
          class="hcontainer vcenter left-item"
          @click="itemClick(item)">
          <div class="left-icon"></div>
          <span class="fill o-line-1" :title="item.categoryName">{{ item.categoryName }}</span>
        </div>
      </div>
      <div class="vcontainer left-container">
        <span class="left-title">Calculators</span>
        <div
          v-for="item in calculatorList"
          :key="item.id"
          class="hcontainer vcenter left-item"
          aria-disabled="true"
          >
          <!-- @click="itemClick(item)" -->
          <div class="left-icon"></div>
          <span class="fill o-line-1" :title="item.categoryName">{{ item.categoryName }}</span>
        </div>
      </div>
      <div class="vcontainer left-container">
        <span class="left-title">Case reports</span>
        <div class="hcontainer vcenter left-item">
          <span class="tip">To view case reports</span>
          <a href="#" class="ml-5 link">click here</a>
        </div>
      </div>
    </div>
    <div class="vcontainer right-content">
      <div class="vcontainer right-container">
        <span class="wel-title">Welcome to the Fetal Medicine Foundation</span>
        <span class="tip">The Fetal Medicine Foundation (FMF) is a Registered Charity that aims to improve the health of pregnant women and their babies through research and training in fetal medicine. The FMF with the support of an international group of experts, has introduced an</span>
        <div class="hcontainer vcenter mt-10 flex-wrap">
          <span class="tip">The main sources of income for The Fetal Medicine Foundation are</span>
          <a href="#" class="link ml-5">The Fetal Medicine Centre</a>
          <span class="tip mh-5">and</span>
          <a href="#" class="link">King's Fertility</a>
          <span class="tip">.</span>
        </div>
      </div>
      <div class="vcontainer right-container">
        <span class="medicine-title">Advances in Fetal Medicine Course 2025</span>
        <span class="tip">6-7 December 2025, London, UK</span>
        <div class="hcontainer vcenter mt-10">
          <span class="tip">For more information</span>
          <a href="#" class="link ml-5">click here</a>
        </div>
        <div class="hcontainer vcenter mt-10">
          <span class="tip">For online registration</span>
          <a href="#" class="link ml-5">click here</a>
        </div>
      </div>
      <div class="vcontainer right-container">
        <span class="right-title">FMF supported research</span>
        <div
          v-for="item in researchList"
          :key="item.id"
          class="hcontainer vcenter right-item">
          <div class="dot"></div>
          <span>{{ item.categoryName }}</span>
        </div>
      </div>
      <div class="vcontainer right-container">
        <span class="right-title">Fetal Medicine Software</span>
        <div class="hcontainer vcenter mt-10">
          <span class="tip">The Fetal Medicine Software is now available. For more information</span>
          <a href="#" class="link ml-5">click here</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'EducationPage',
    data() {
      return {
        educationList: [],
        calculatorList: [],
        researchList: [
          { id: '1', categoryName: 'Research publications', linkUrl: null },
          { id: '2', categoryName: 'Completed randomized trials', linkUrl: null },
          { id: '3', categoryName: 'Ongoing randomized trials', linkUrl: null }
        ]
      }
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
      async websiteNavigationFn(categoryName) {
        const reqData = {
          categoryName: categoryName
        }
        const resp = await this.$api.websiteNavigation(reqData).catch(err => err)
        if ((resp.code === 200 || resp.code === 0) &&
          Array.isArray(resp.data) && resp.data[0] &&
          Array.isArray(resp.data[0].childrenList)) {
          return resp.data[0].childrenList
        } else {
          return []
        }
      },
      initListData() {
        this.websiteNavigationFn('Education').then(listData => {
          this.educationList = listData
        })
        this.websiteNavigationFn('Calculators').then(listData => {
          this.calculatorList = listData
        })
      }
    },
    mounted() {
      this.initListData()
    }
  }
</script>

<style lang="scss" scoped>
  .education {
    margin-top: 85px;
    font-size: 14px;
    flex-wrap: wrap;
    gap: 16px;
    padding: 0 24px 32px;
    box-sizing: border-box;
    .left-content {
      flex: 1 1 280px;
      max-width: 420px;
      margin-right: 0;
      .left-container {
        padding: 15px 20px;
        margin-bottom: 20px;
        border-radius: 4px;
        background-color: #ffffff;
        .left-title {
          color: #0E3045;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .left-item {
          font-size: 14px;
          color: #036fc0;
          margin-top: 10px;
          cursor: pointer;
          .left-icon {
            width: 12px;
            height: 9px;
            margin-right: 5px;
            background: url('#{$iconUrl}/icon_jt.png') center no-repeat;
            background-size: contain;
          }
        }
      }
    }
    .right-content {
      flex: 2 1 520px;
      min-width: 0;
      .right-container {
        padding: 15px 20px;
        margin-bottom: 20px;
        background-color: #ffffff;
        .wel-title {
          color: #0E3045;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .medicine-title {
          color: #036fc0;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .right-title {
          color: #0E3045;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .right-item {
          font-size: 14px;
          color: #036fc0;
          margin-top: 10px;
          cursor: pointer;
          .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 5px;
            background-color: #3391C9;
          }
        }
      }
    }
    .tip {
      color: #8A9094;
    }
    .link {
      color: #036fc0;
      cursor: pointer;
      text-decoration: none;
    }
    @media (max-width: 1024px) {
      padding: 0 16px 28px;
      .left-content,
      .right-content {
        max-width: 100%;
        width: 100%;
      }
    }
  }
</style>
