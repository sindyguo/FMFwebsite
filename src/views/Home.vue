<template>
  <div class="vcontainer home-page">
    <div style="flex-shrink: 0;">
      <TopBanner /> 
    </div>
    <!-- <section class="home-hero">
      <div class="home-hero-bg"></div>
      <div class="home-hero-inner main-container">
        <div class="home-hero-title">FMF Online Learning</div>
        <div class="home-hero-subtitle">
          Browse courses, congress updates, and clinical tools in one place.
        </div>
      </div>
    </section> -->
    <div class="hcontainer main-container">
      <div class="home-left-card">
        <div class="vcontainer left-container">
          <el-popover
            v-for="(item, index) in leftListData" 
            :key="index"
            v-model="item.popVisible"
            placement="right"
            :visible-arrow="false"
            popper-class="custom-popover"
            trigger="hover">
            <div class="vcontainer left-sel-container" v-show="item.showPop">
              <span class="left-sel-title">{{ item.title }}</span>
              <div v-if="!item.children || item.children.length == 0" class="left-empty">暂无数据</div>
              <span
                v-else
                v-for="subItem in (item.children ||[])"
                :key="subItem.categoryName"
                class="left-sel-item"
                @click="leftItemClick(item, subItem)">
                {{ subItem.categoryName }}
              </span>
            </div>
            <div slot="reference" :class="`hcontainer vcenter left-item left-item-${index+1}`" @click="itemClick(item)">
              <div class="left-item-icon-wrap">
                <el-image :src="item.icon" class="left-item-icon" alt="" />
              </div>
              <div class="vcontainer">
                <span class="left-item-title">{{ item.categoryName }}</span>
                <span class="left-item-desc">{{ item.title }}</span>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="fill vcontainer right-container">
        <el-carousel 
          arrow="never"
          height="400px"
          indicator-position="none"
          class="carousel-container">
          <el-carousel-item v-for="(carouselItem, index) in carouselListData" :key="index">
            <div class="vcontainer carousel-item-container">
              <span class="carousel-title" @click="handleDetail(carouselItem)">{{ carouselItem.title }}</span>
              <div class="fill hcontainer">
                <div class="fill vcontainer">
                  <div class="hcontainer vcenter" style="margin-top: 16px;">
                    <el-image :src="require('@/assets/img/icon/icon_date.png')" class="carousel-icon" alt="" />
                    <div class="vcontainer flex-between link-span">
                      <span class="carousel-label">Date</span>
                      <span class="carousel-value">{{ formatFullDateRange(carouselItem.startTime, carouselItem.endTime) }}</span>
                    </div>
                  </div>
                  <div class="hcontainer vcenter" style="margin-top: 36px;">
                    <el-image :src="require('@/assets/img/icon/icon_location1.png')" class="carousel-icon" alt="" />
                    <div class="vcontainer flex-between link-span">
                      <span class="carousel-label">Location</span>
                      <span class="carousel-value">{{ carouselItem.location || '' }}</span>
                      <span class="carousel-value">{{ carouselItem.address || '' }}</span>
                    </div>
                  </div>
                  <!-- <div class="hcontainer vcenter" style="margin-top: 16px;">
                    <el-image :src="require('@/assets/img/icon/icon_address.png')" class="carousel-icon" alt="" />
                    <div class="vcontainer flex-between link-span">
                      <span class="carousel-label">Address</span>
                      <span class="carousel-value">{{ carouselItem.address || '' }}</span>
                    </div>
                  </div> -->
                </div>
              </div>
              <el-image :src="require('@/assets/img/vienna_home.png')" class="carousel-img" alt="" />
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="vcontainer research-container" @click="goto('https://www.fetalmedicine.org/fmf-fellowships')">
          <span class="research-title cursor" style="margin-bottom: 18px;">Some features are currently under development and will be released in due course. Thank you for your patience.</span>
          <div v-for="(research, index) in researchList" :key="index"
            class="hcontainer vcenter research-item" style="font-weight: normal;"> 
            <!-- <el-image :src="research.icon" class="research-icon" alt="" /> -->
            <span class="link-span" style="
              font-size: 18px;
              color: #036FC0;">
                <p>During the transition, the previous website will remain fully operational. Users may continue to log in with their existing credentials and download their licence.</p>
                <p>Any functions not yet available on the new website can be accessed via the previous website.</p>
              </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'HomePage',
    components: {
      TopBanner
    },
    data() {
      return {
        educationList: [],
        leftListData: [
          {
            popVisible: false,
            showPop: true,
            icon: require('@/assets/img/icon/icon_course.png'),
            categoryName: 'Online Courses',
            title: 'Course List',
            children: []
          }, {
            popVisible: false,
            showPop: false,
            linkUrl: 'https://www.fetalmedicine.org',
            icon: require('@/assets/img/icon/icon_cal.png'),
            categoryName: 'Calculators',
            title: 'Calculator Tools',
            // children: [
            //   { categoryName: 'First Trimester Screening', path: '/' },
            //   { categoryName: 'Fetal Growth Assessment', path: '/' },
            //   { categoryName: 'Preeclampsia Risk', path: '/' },
            //   { categoryName: 'Gestational Age', path: '/' },
            //   { categoryName: 'All Calculators', path: '/' }
            // ]
          }, {
            popVisible: false,
            showPop: false,
            linkUrl: 'https://fmf.refractionx.com/download?direct=true',
            icon: require('@/assets/img/icon/icon_software.png'),
            categoryName: 'Software',
            title: 'FMF Software',
            // children: [
            //   { categoryName: 'FMF Software Download', path: '/' },
            //   { categoryName: 'Software Documentation', path: '/' },
            //   { categoryName: 'User Manual', path: '/' },
            //   { categoryName: 'Technical Support', path: '/' }
            // ]
          }
        ],
        carouselListData: [
          // {
          //   title: '23rd World Congress in Fetal Medicine',
          //   img: require('@/assets/img/img_congress.png'),
          //   date: '28th June - 2nd July 2026',
          //   location: 'Austria Center Vienna',
          //   address: 'Bruno-Kreisky-Platz 1, 1220 Wien, Austria'
          // },
        ],
        researchList: [
          { icon: require('@/assets/img/icon/icon_research.png'),
            text: ' '
          },
          // {
          //   icon: require('@/assets/img/icon/icon_completed.png'),
          //   text: 'Completed Randomized Trials'
          // },
          // {
          //   icon: require('@/assets/img/icon/icon_ongoing.png'),
          //   text: 'Ongoing Randomized Trials'
          // }
        ]
      }
    },
    methods: {
      itemClick(e) {
        if(e.linkUrl){
          window.open(e.linkUrl)
        }
      },
      goto(e){
        window.open(e)
      },
      ...mapActions('user', ['changeActiveId']),
      async websiteNavigationFn(categoryName) {
        const reqData = {
          categoryName: categoryName
        }
        // const resp = await this.$api.websiteNavigation(reqData).catch(err => err)
        // if ((resp.code === 200 || resp.code === 0) &&
        //   Array.isArray(resp.data) && resp.data[0] &&
        //   Array.isArray(resp.data[0].childrenList)) {
        //   return resp.data[0].childrenList
        // } else {
        //   return []
        // }

        const resp = await this.$api.websiteCourseNavigation(reqData).catch(err => err)
        if ((resp.code === 200 || resp.code === 0) &&
          Array.isArray(resp.data) && resp.data[0] &&
          Array.isArray(resp.data)) {
          return resp.data
        } else {
          return []
        }

      },
      initListData() {
        this.websiteNavigationFn('Education').then(listData => {
          this.leftListData[0].children = listData;
        })
      },
      formatDate(dateString) {
      if (!dateString) return "";

      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      // const year = date.getFullYear();

      // Get the day with ordinal suffix (st, nd, rd, th)
      const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      return `${day}${getOrdinalSuffix(day)} ${month}`;
    },

    handleDetail(row) {
      this.changeActiveId('/congress')
      this.$router.push(`/congress?categoryName=${row.title}`)
    },

    formatFullDateRange(startString, endString) {
      if (!startString || !endString) return "";

      const startDate = new Date(startString);
      const endDate = new Date(endString);

      // Define English month names explicitly
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const startDay = startDate.getDate();
      const startMonth = months[startDate.getMonth()];
      const endDay = endDate.getDate();
      const endMonth = months[endDate.getMonth()];
      const year = endDate.getFullYear();

      const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      const startFormatted = `${startDay}${getOrdinalSuffix(
        startDay
      )} ${startMonth}`;
      const endFormatted = `${endDay}${getOrdinalSuffix(
        endDay
      )} ${endMonth} ${year}`;

      return `${startFormatted} - ${endFormatted}`;
    },
      leftItemClick(item, subItem) {
        item.popVisible = false;
        const self = this
        self.$utils.checkLoginAndContinue(() => {
          self.changeActiveId('/courseDetail')
          self.$router.push('/courseDetail?categoryName=' + subItem.categoryName)
        })
      },
      getCongressList() {
        this.$api
        .websiteCongressList({
          page: 1,
          pageSize: 1,
          publishStatus: 1,
        }).then(res => {
          console.log('websiteCongressList:', res)
          this.carouselListData = res.data.list
        })
      },
    },
    created() {
      this.initListData();
      this.getCongressList();
    },
  }
</script>

<style lang="scss" scoped>
  .home-page {
    background-color: #F5F7F9;
    .main-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 48px;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;
      box-sizing: border-box;
    }
    .home-hero {
      position: relative;
      height: 220px;
      background: linear-gradient(120deg, #0b4b8d, #0f5aa4 55%, #0b4b8d);
      overflow: hidden;
      .home-hero-bg {
        position: absolute;
        inset: 0;
        background: url("#{$imgUrl}/home_top.jpg") center/cover no-repeat;
        opacity: 0.18;
      }
      .home-hero-inner {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        color: #fff;
      }
      .home-hero-title {
        font-size: 40px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .home-hero-subtitle {
        margin-top: 8px;
        font-size: 16px;
        max-width: 640px;
        color: rgba(255, 255, 255, 0.85);
      }
    }
    .home-left-card {
      width: 100%;
      max-width: 320px;
      flex: 1 1 260px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 12px 30px rgba(15, 42, 67, 0.08);
      padding: 18px;
      height: fit-content;
    }
    .left-container {
      gap: 12px;
    }
    .left-item {
      width: 100%;
      padding: 12px;
      border-radius: 14px;
      background: #f3f7fb;
      color: #0e3045;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      gap: 12px;
      align-items: center;
      border: 1px solid #e6edf5;
      &:hover {
        transform: translateY(-1px);
        background: #eaf2fb;
        border-color: #d8e6f5;
      }
    }
    .left-item-1,
    .left-item-2,
    .left-item-3 {
      background: #f3f7fb;
    }
    .left-item-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0f5aa4, #1d78d6);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .left-item-icon {
      width: 22px;
      height: 22px;
      filter: brightness(0) invert(1);
    }
    .left-item-title {
      font-size: 16px;
      font-weight: 700;
    }
    .left-item-desc {
      font-size: 12px;
      color: #6b7380;
      margin-top: 2px;
    }
    .left-empty {
      text-align: center;
      line-height: 40px;
      color: #8a9094;
    }
    .right-container {
      flex: 2 1 520px;
      min-width: 0;
      gap: 20px;
      .carousel-container {
        margin-bottom: 0;
        border-radius: 18px;
        background-color: #fff;
        box-shadow: 0 12px 30px rgba(15, 42, 67, 0.08);
        border: 1px solid #eef2f7;
        .el-carousel__arrow {
          background-color: rgba(15, 42, 67, 0.7);
        }
        .el-carousel__indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.2);
          &.is-active {
            background-color: #0f5aa4;
          }
        }
        .carousel-item-container {
          position: relative;
          height: 100%;
          padding: 36px 24px;
          cursor: pointer;
          .carousel-title {
            font-weight: 700;
            font-size: 30px;
            color: #0f5aa4;
            line-height: 42px;
          }
          .carousel-icon {
            width: 44px;
            height: 44px;
            vertical-align: middle;
            margin-right: 12px;
          }
          .carousel-label {
            font-weight: 600;
            font-size: 16px;
            color: #0E3045;
            margin-bottom: 6px;
          }
          .carousel-value {
            font-weight: 400;
            font-size: 14px;
            color: #6b7380;
          }
          .carousel-img {
            position: absolute;
            top: 50%;
            right: 24px;
            transform: translateY(-50%);
            min-width: 140px;
            width: 220px;
            height: 220px;
            object-fit: cover;
            border-radius: 50%;
            border: 6px solid #f3f7fb;
          }
        }
      }
      .research-container {
        padding: 24px;
        border-radius: 18px;
        background-color: #ffffff;
        border: 1px solid #eef2f7;
        box-shadow: 0 12px 30px rgba(15, 42, 67, 0.08);
        text-align: left;
        .research-title {
          font-weight: 700;
          font-size: 18px;
          color: #0f5aa4;
          line-height: 26px;
        }
        .research-item {
          font-weight: 400;
          font-size: 16px;
          color: #0E3045;
          text-align: left;
          margin-bottom: 16px;
          cursor: pointer;
          .research-icon {
            width: 32px;
            height: 32px;
            margin-right: 14px;
          }
        }
      }
    }

    .link-span {
      line-height: 26px;
      justify-content: center;
      gap: 4px;
      align-items: flex-start;
      p {
        margin-bottom: 15px;
      }
    }

    @media (max-width: 1024px) {
      .main-container {
        flex-direction: column;
        align-items: stretch;
        padding: 28px 20px 40px;
      }
      .home-left-card {
        width: 100%;
        max-width: 100%;
      }
      .right-container {
        width: 100%;
      }
      .right-container .carousel-container {
        height: auto;
      }
      .right-container .carousel-item-container {
        padding: 28px 20px;
      }
      .right-container .carousel-item-container .carousel-title {
        font-size: 24px;
        line-height: 34px;
      }
      .right-container .carousel-item-container .carousel-img {
        position: static;
        margin: 20px auto 0;
        width: 180px;
        height: 180px;
        transform: none;
      }
    }

    @media (max-width: 768px) {
      .main-container {
        padding: 20px 16px 32px;
      }
      .home-left-card,
      .right-container .carousel-item-container,
      .research-container {
        text-align: center;
      }
      .home-left-card {
        padding: 14px;
      }
      .left-item {
        padding: 10px;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .left-item .vcontainer {
        align-items: center;
      }
      .left-item-title {
        font-size: 15px;
      }
      .right-container .carousel-item-container {
        padding: 20px 16px;
      }
      .right-container .carousel-item-container .carousel-icon {
        width: 36px;
        height: 36px;
      }
      .right-container .carousel-item-container .carousel-title {
        font-size: 20px;
        line-height: 30px;
      }
      .right-container .carousel-item-container .carousel-img {
        width: 160px;
        height: 160px;
        transform: none;
      }
      .research-container {
        padding: 18px;
      }
      .research-container .research-title {
        font-size: 16px;
      }
    }

    @media (max-width: 480px) {
      .left-item {
        align-items: flex-start;
      }
      .left-item-desc {
        line-height: 1.3;
      }
      .right-container .carousel-item-container {
        padding: 18px 14px;
      }
      .right-container .carousel-item-container .carousel-title {
        font-size: 18px;
        line-height: 26px;
      }
      .right-container .carousel-item-container .carousel-img {
        width: 140px;
        height: 140px;
        transform: none;
      }
      .research-container {
        padding: 16px;
      }
      .link-span {
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
</style>
<style lang="scss">
  .custom-popover {
    background-color: #ffffff;
    box-shadow: 0px 18px 40px 1px rgba(14,48,69,0.12);
    border-radius: 12px;
    font-size: 14px;
    padding: 0;
    .left-sel-title {
      text-align: center;
      height: 48px;
      line-height: 48px;
      background: linear-gradient(135deg, #0f5aa4, #1d78d6);
      border-radius: 12px 12px 0px 0px;
      color: #ffffff;
    }
    .left-sel-item {
      padding: 10px 16px;
      color: #0E3045;
      cursor: pointer;
      &:hover {
        color: #0f5aa4;
        background: #f1f6fb;
      }
    }
  }
</style>
