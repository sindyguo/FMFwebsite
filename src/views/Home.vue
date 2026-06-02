<template>
  <div class="vcontainer home-page">
    <div style="flex-shrink: 0;">
      <TopBanner :listData="listData"/> 
    </div>
    <div class="main-container">
      <div class="home-layout">
        <!-- Right Content -->
        <main class="right-content">
          <!-- Main Carousel / Featured -->
          <div class="featured-section">
            <el-carousel 
              :height="carouselHeight"
              indicator-position="none"
              :interval="4000"
              direction="horizontal"
              motion-blur
              loop
              class="modern-carousel">
              <template v-for="(carouselItem, index) in carouselListData">
                <el-carousel-item :key="index">
                  <div class="carousel-card" @click="handleDetail(carouselItem)">
                    <div class="carousel-content">
                      <h2 class="carousel-title" :title="carouselItem.title" v-html="carouselItem.title"></h2>
                      
                      <div class="carousel-details">
                        <div class="detail-row">
                          <div class="icon-box">
                            <i class="el-icon-date"></i>
                          </div>
                          <div class="detail-text">
                            <span class="label">Date</span>
                            <span class="value">{{ formatFullDateRange(carouselItem.startTime, carouselItem.endTime) }}</span>
                          </div>
                        </div>
                        
                        <div class="detail-row">
                          <div class="icon-box">
                            <i class="el-icon-location-outline"></i>
                          </div>
                          <div class="detail-text">
                            <span class="label">Location</span>
                            <span class="value">{{ carouselItem.location || 'Online' }}</span>
                            <span class="sub-value" v-if="carouselItem.address">{{ carouselItem.address }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="carousel-action">
                        <span>View Details</span>
                        <i class="el-icon-right"></i>
                      </div>
                    </div>
                    
                    <div class="carousel-image-wrapper" v-for="(image, index) in carouselItem.homeCongressImageList" :key="index">
                      <div class="carousel-image-bg"></div>
                      <el-image :src="image.url" class="carousel-img" fit="cover" alt="" />
                    </div>
                  </div>
                </el-carousel-item>
              </template>
              
            </el-carousel>
          </div>

          <div class="upcoming-section">
            <div class="section-header">
              <h2>Monthly webinars</h2>
              <div class="header-line"></div>
            </div>

            <div class="upcoming-grid" :style="{ gridTemplateColumns: `repeat(${webinarGridCols}, minmax(0, 1fr))` }">
              

              <div class="upcoming-card webinar-card" v-for="(item,index) in monthlyWebinars" :key="index">
                <div class="webinar-image" >
                  <img :src="getWebinarImageUrl(item)" alt="Monthly webinar" />
                </div>
                <div class="webinar-content" v-html="item.contentDescription">
                  <!-- <div class="upcoming-title">Research Training Program in Maternal-Fetal Medicine</div>
                  <div class="upcoming-meta">
                    <span class="upcoming-meta-text"><strong>Lecturers:</strong> Prof Liona Poon &amp; Prof Jon Hyett</span>
                    <span class="upcoming-meta-text"><strong>Date:</strong> Thursday 26 February 2026 @ 10:00 AM</span>
                    <a
                      class="upcoming-link"
                      href="https://news.fetalmedicine.org/l/nf150IUqqCfSF3uQNp9PZg/IrpEyQzDCxooAUy0rIsvAQ/20wbHD763GZeYXhX67J8920QzA"
                      target="_blank"
                      rel="noopener"
                    >
                      Register here
                    </a>
                  </div> -->
                </div>
              </div>

              <!-- <div class="upcoming-card webinar-card">
                <div class="webinar-image">
                  <img src="@/assets/img/home/monthly_webinar_3.jpg" alt="Monthly webinar" />
                </div>
                <div class="webinar-content">
                  <h3 class="upcoming-title">Labor Management</h3>
                  <div class="upcoming-meta">
                    <span class="upcoming-meta-text"><strong>Lecturer:</strong> Professor Vincenzo Berghella</span>
                    <span class="upcoming-meta-text"><strong>Date:</strong> 13th of March 2026</span>
                    <a
                      class="upcoming-link"
                      href="https://us02web.zoom.us/webinar/register/WN_lCbAS-YyRW6sBHl1Z9W6DA"
                      target="_blank"
                      rel="noopener"
                    >
                      Register here
                    </a>
                  </div>
                </div>
              </div> -->
            </div>
          </div>

          <!-- News -->
          <div class="news-section">
            <div class="section-header">
              <h2>News</h2>
              <div class="header-line"></div>
            </div>
            <div class="news-grid">
              <div class="upcoming-card news-card" v-for="(item,index) in news" :key="index" v-html="item.contentDescription">
                <!-- <div class="upcoming-title">FMF Supported Trial Published</div>
                <p class="upcoming-text">
                  The results of a FMF supported trial has recently been published in the Lancet.
                </p>
                <p class="upcoming-text">
                  The study showed that
                  <span class="news-highlight">
                    planned early-term birth based on risk stratification for pre-eclampsia at 36 weeks' gestation reduced the incidence of pre-eclampsia by 30%
                  </span>
                  , without increasing emergency caesarean section or neonatal care unit admission.
                </p>
                <p class="upcoming-text">
                  Goadsby J, Syngelaki A, Magee LA, von Dadelszen P, Akolekar R, Webster S, Wright A, Wright D, Nicolaides KH. Scheduled birth at term for the prevention of pre-eclampsia (PREVENT-PE): an open-label randomised controlled trial. Lancet. 2026;407:67-77.
                </p> -->
              </div>
            </div>
          </div>

          <!-- Notice -->
          <div class="news-section notice-section">
            <div class="section-header">
              <h2>Notice</h2>
              <div class="header-line"></div>
            </div>
            <div class="info-card" @click="goto('https://archive.fetalmedicine.org/fmf-fellowships')">
              <div class="info-icon">
                <i class="el-icon-info"></i>
              </div>
              <div class="info-content">
                <h4 class="info-title">System Update</h4>
                <p class="info-text">
                  As the new FMF website continues to evolve, the old FMF website has been moved to:
                </p>
                <p class="notice-archive-url">
                  <a
                    href="https://archive.fetalmedicine.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click.stop
                  >
                    https://archive.fetalmedicine.org
                  </a>
                </p>
                <p class="info-subtext">
                  Please use this address to access archived content from the previous FMF website.
                </p>
              </div>
              <div class="info-action">
                <i class="el-icon-link"></i>
              </div>
            </div>
          </div>
        </main>
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
    computed: {
      contentData() {
        const raw = this.$store.state.content.contentData
        if (!raw) return { content: {} }
        if (typeof raw === 'object') return raw
        try {
          return JSON.parse(raw) || { content: {} }
        } catch {
          return { content: {} }
        }
      },
      monthlyWebinars() {
        const content = this.contentData.content
        return (content && content.home && content.home.monthlyWebinars) || []
      },
      news() {
        const content = this.contentData.content
        return (content && content.home && content.home.news) || []
      },
      carouselHeight() {
        const w = this.windowWidth
        if (w < 360) return '340px'
        if (w < 480) return '400px'
        if (w < 768) return '460px'
        return '420px'
      },
      webinarGridCols() {
        const count = this.monthlyWebinars.length
        const w = this.windowWidth
        if (w < 768) return 1
        if (w < 1024) return Math.min(count || 1, 2)
        if (!count || count === 1) return 1
        if (count === 2) return 2
        if (count === 3) return 3
        if (count === 4) return 2
        return 3
      }
    },
    data() {
      return {
        windowWidth: window.innerWidth,
        educationList: [],
        listData: [
          {
            img: require('@/assets/img/home_top1.jpg'),
            title: 'Welcome to The Fetal Medicine Foundation',
            subTitle: '',
            desc: 'The Fetal Medicine Foundation (FMF) is a Registered Charity that aims to improve the health of pregnant women and their babies through research and training in fetal medicine. The FMF with the support of an international group of experts, has introduced an educational programme both for healthcare professionals and doctors and in the last 30 years the FMF has donated more than £75 million for scholarships, research grants and setting up fetal medicine units in developing countries. </br> <p style="margin-top: 12px;">The main sources of income for The Fetal Medicine Foundation are <a style="color: #036fc0;" target="_blank" href="http://fetalmedicine.com/">The Fetal Medicine Centre</a> and <a target="_blank" style="color: #036fc0" href="https://www.kingsfertility.co.uk/">King\'s Fertility.</a></p>',
            homeMark: true
          },
          {
            img: require('@/assets/img/home_top2.jpg'),
            title: 'Welcome to The Fetal Medicine Foundation',
            subTitle: '',
            desc: 'The Fetal Medicine Foundation (FMF) is a Registered Charity that aims to improve the health of pregnant women and their babies through research and training in fetal medicine. The FMF with the support of an international group of experts, has introduced an educational programme both for healthcare professionals and doctors and in the last 30 years the FMF has donated more than £75 million for scholarships and research grants. In 2016/2017, the FMF made a donation of £22 million to King\'s College Hospital NHS Foundation Trust for investment in the Trust\'s Fetal Medicine services.',
            homeMark: true
          },
          {
            img: require('@/assets/img/home_top3.jpg'),
            title: 'Welcome to The Fetal Medicine Foundation',
            subTitle: '',
            desc: 'The Fetal Medicine Foundation (FMF) is a Registered Charity that aims to improve the health of pregnant women and their babies through research and training in fetal medicine. The FMF with the support of an international group of experts, has introduced an educational programme both for healthcare professionals and doctors and in the last 30 years the FMF has donated more than £75 million for scholarships and research grants. In 2016/2017, the FMF made a donation of £22 million to King\'s College Hospital NHS Foundation Trust for investment in the Trust\'s Fetal Medicine services.',
            homeMark: true
          }
        ],
        leftListData: [
          {
            popVisible: false,
            showPop: true,
            icon: require('@/assets/img/svg/icon_courses.svg'),
            categoryName: 'Online Courses',
            title: 'Course List',
            children: []
          }, {
            popVisible: false,
            showPop: false,
            linkUrl: '/calculators',
            selfLink: true,
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
            icon: require('@/assets/img/svg/icon_Software.svg'),
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
      getWebinarImageUrl(item) {
        if (!item || !item.fileData) return ''
        try {
          const list = typeof item.fileData === 'string' ? JSON.parse(item.fileData) : item.fileData
          return (Array.isArray(list) && list[0] && list[0].url) ? list[0].url : ''
        } catch {
          return ''
        }
      },
      itemClick(e) {
        if(e.linkUrl){
          if(e.selfLink) {
            this.$router.push(e.linkUrl)
          }else{
            window.open(e.linkUrl)
          }
          
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
      if(row.congressType == 'Congress') {
        this.changeActiveId('/congress')
        this.$router.push(`/congress?categoryName=${row.title}`)
      } else if(row.congressType == 'Supported Courses') {
        this.changeActiveId('/fmf-supported-courses')
        this.$router.push(`/fmf-supported-courses?categoryName=${row.title}`)
      } else if(row.congressType == 'Advances Course') {
        this.changeActiveId('/fmf-advances-courses')
        this.$router.push(`/fmf-advances-courses?categoryName=${row.title}`)
      } 
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
      const startFormatted = `${startDay} ${startMonth}`;
      const endFormatted = `${endDay} ${endMonth} ${year}`;

      return `${startFormatted} - ${endFormatted}`;
    },

    formatFullDateRange1(startString) {

      const startDate = new Date(startString);

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
      const year = startDate.getFullYear();

      // const getOrdinalSuffix = (day) => {
      //   if (day > 3 && day < 21) return "th";
      //   switch (day % 10) {
      //     case 1:
      //       return "st";
      //     case 2:
      //       return "nd";
      //     case 3:
      //       return "rd";
      //     default:
      //       return "th";
      //   }
      // };

      const startFormatted = ` ${startDay} ${startMonth} ${year}`;
      return `${startFormatted}`;
    },

      leftItemClick(item, subItem) {
        item.popVisible = false;
        const self = this
        self.$utils.checkLoginAndContinue(() => {
          self.changeActiveId('/courseDetail')
          self.$router.push('/courseDetail?categoryName=' + subItem.categoryName)
        })
      },
      onWindowResize() {
        this.windowWidth = window.innerWidth
      },
      handleRouter(path) {
        this.changeActiveId('/congress');
        this.$router.replace(path);
      },
      getCongressList() {
        this.$api
        .websiteCongressList({
          page: 1,
          pageSize: 1,
          publishStatus: 1,
        }).then(res => {
          this.carouselListData = [];
          let list = res.data.list.filter(item => item.congressType != 'Supported Courses');
          if(list?.length == 1) {
            this.carouselListData = list; /** 单个数据时，直接赋值，避免触发轮播 */
          } else if(list?.length > 1) {
            this.carouselListData = [...list, ...list]  /** 多个数据时，复制一套数据，避免数量太少轮播效果不佳 */
          } else {
            this.carouselListData = []; /** 没有数据时，清空数组，避免触发轮播 */
          }
        })
      },
    },
    created() {
      this.initListData();
      this.getCongressList();
    },
    mounted() {
      window.addEventListener('resize', this.onWindowResize)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onWindowResize)
    },
  }
</script>

<style lang="scss" scoped>
  .home-page {
    min-height: 100vh;
    background-color: var(--bg-body);
    padding-bottom: 60px;
    
    .banner-wrapper {
      position: relative;
      z-index: 10;
      box-shadow: var(--shadow-md);
    }
  }

  .main-container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 24px;
    position: relative;
    z-index: 20;
  }

  .home-layout {
    display: block;
  }

  /* Right Content */
  .right-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
    margin-bottom: 12px;
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-main);
      white-space: nowrap;
    }
    
    .header-line {
      height: 1px;
      flex: 1;
      background: var(--border-color);
    }
  }

  /* Carousel */
  .modern-carousel {
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    background: var(--bg-card);
  }

  .carousel-card {
    display: flex;
    height: 100%;
    cursor: pointer;
    background: #EBF2FE;
    border-radius: 20px;
    overflow: hidden;
    
    @media (max-width: 768px) {
      flex-direction: column-reverse;
    }
  }

  .carousel-content {
    flex: 3;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
    background: linear-gradient(to right, #EBF2FE 90%, rgba(235,242,254,0));
  }

  .carousel-tag {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    background: #EFF6FF;
    color: var(--color-accent);
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 16px;
    width: fit-content;
  }

  .carousel-title {
    font-size: 28px;
    line-height: 1.3;
    font-weight: 800;
    color: #036FC0;
    margin-bottom: 24px;
    /* Removed line-clamp to show full title */
  }

  .carousel-details {
    display: flex;
    flex-direction: column;
    gap: 60px;
    margin-bottom: 32px;
  }

  .detail-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    
    .icon-box {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-accent);
      font-size: 20px;
      border: 1px solid var(--border-light);
    }
    
    .detail-text {
      display: flex;
      flex-direction: column;
      line-height: 28px;
      
      .label {
        font-size: 18px;
        color: var(--text-light);
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 2px;
      }
      .value {
        font-size: 18px;
        color: var(--text-regular);
        font-weight: 500;
        color: #666;
      }
      .sub-value {
        font-size: 18px;
        color: var(--text-secondary);
        margin-top: 2px;
        color: #666;
      }
    }
  }

  .carousel-action {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    color: var(--color-accent);
    font-weight: 600;
    transition: var(--transition-base);
    color: #036FC0;
    
    span { border-bottom: 2px solid transparent; transition: inherit; }
    
    &:hover {
      color: var(--color-accent-hover);
      span { border-bottom-color: var(--color-accent-hover); }
      i { transform: translateX(4px); }
      color: #036FC0;
    }
  }

  .carousel-image-wrapper {
    flex: 2;
    position: relative;
    overflow: hidden;
    min-width: 300px;
    
    .carousel-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 6s ease;
    }

    &:hover .carousel-img {
      transform: scale(1.05);
    }
  }

  .upcoming-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .section-header {
      margin-bottom: 0;
    }
  }

  .upcoming-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    /* column count is controlled dynamically via inline style */
  }

  .upcoming-card {
    background: #ffffff;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
    box-shadow: var(--shadow-sm);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .webinar-card {
    padding: 0;
    overflow: hidden;
    border-radius: 20px;
  }

  .webinar-image {
    width: 100%;
    position: relative;
    padding-top: 50%;
    overflow: hidden;
  }

  .webinar-image img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .webinar-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    /* 富文本内容基础样式：防止溢出 */
    ::v-deep * {
      max-width: 100%;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    ::v-deep img {
      max-width: 100%;
      height: auto;
    }
  }

  .upcoming-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-accent);
  }

  .upcoming-subtitle {
    font-size: 18px;
    color: var(--text-regular);
  }

  .upcoming-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .upcoming-meta-inline {
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
    column-gap: 8px;
    row-gap: 4px;
  }

  .upcoming-meta-label {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
  }

  .upcoming-meta-text {
    font-size: 18px;
    color: var(--text-regular);
    color: #666;
    strong{
      color: #000;
    }
  }

  .upcoming-topic {
    font-weight: 700;
    color: var(--text-main);
    font-size: 18px;
  }

  .upcoming-lead {
    font-size: 18px;
    color: var(--text-main);
  }

  .upcoming-text {
    font-size: 18px;
    color: var(--text-regular);
    line-height: 1.6 !important;
  }

  .news-highlight {
    font-weight: 700;
    color: var(--color-accent);
  }

  .upcoming-section .upcoming-card,
  .news-section .upcoming-card {
    background: #EBF2FE;
  }

  .upcoming-section .upcoming-title,
  .news-section .upcoming-title,
  .upcoming-section .upcoming-link,
  .news-section .upcoming-link,
  .news-section .news-highlight {
    color: #036FC0;
  }

  .upcoming-link {
    margin-left: 0;
    color: var(--color-accent);
    font-weight: 600;
    font-size: 18px;
    align-self: flex-start;
  }

  @media (max-width: 900px) {
    .upcoming-grid {
      grid-template-columns: 1fr;
    }
  }

  .upcoming-list {
    padding-left: 18px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--text-regular);
    font-size: 18px;
    line-height: 1.6;
  }

  /* News Section */
  .news-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .section-header {
      margin-bottom: 0;
    }
  }

  .news-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: #666;
  }

  .news-card {
    gap: 10px;
  }

  .notice-section .info-card {
    background: #EBF2FE;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);

    &:hover {
      box-shadow: var(--shadow-md);
    }

    .info-icon {
      background: rgba(3, 111, 192, 0.12);
      color: #036FC0;
    }

    .info-content {
      .info-title {
        color: #036FC0;
      }
      .info-text,
      .info-subtext {
        color: var(--text-regular);
      }
      .notice-archive-url {
        margin: 0 0 8px;
        font-size: 18px;
        line-height: 1.6;

        a {
          display: inline-block;
          color: #036FC0;
          font-weight: 600;
          text-decoration: underline;
          word-break: break-all;
        }
      }
    }

    .info-action {
      color: #036FC0;
    }
  }

  .info-card {
    border-radius: var(--radius-md);
    padding: 12px 24px 24px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    cursor: pointer;
    transition: var(--transition-base);

    &:hover {
      transform: translateY(-2px);
    }

    .info-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;

      .info-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .info-text {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 8px;
      }
      .info-subtext {
        font-size: 18px;
        line-height: 1.6;
      }
    }

    .info-action {
      font-size: 18px;
    }
  }

  /* ============================================================
     RESPONSIVE BREAKPOINTS
     ============================================================ */

  /* Tablet: 768px ~ 1023px */
  @media (min-width: 768px) and (max-width: 1023px) {
    .main-container {
      padding: 28px 20px;
    }

    .section-header h2 {
      font-size: 20px;
    }

    .webinar-content {
      ::v-deep p, ::v-deep span, ::v-deep strong, ::v-deep em,
      ::v-deep a, ::v-deep li, ::v-deep div, ::v-deep h1, ::v-deep h2,
      ::v-deep h3, ::v-deep h4 {
        font-size: 14px !important;
        line-height: 1.6 !important;
      }
      ::v-deep p { margin-bottom: 6px; }
    }

    .carousel-content {
      padding: 28px 28px;
      flex: 2;
    }

    .carousel-title {
      font-size: 22px;
      margin-bottom: 16px;
    }

    .carousel-details {
      gap: 24px;
      margin-bottom: 20px;
    }

    .detail-row {
      .detail-text {
        .label, .value, .sub-value { font-size: 14px; }
      }
    }

    .carousel-image-wrapper {
      flex: 1;
      min-width: 200px;
    }

    .upcoming-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .upcoming-meta-text,
    .upcoming-title,
    .upcoming-text,
    .upcoming-link {
      font-size: 15px;
    }

    .info-card {
      .info-content {
        .info-title, .info-text, .info-subtext, .notice-archive-url { font-size: 15px; }
      }
    }
  }

  /* Laptop: 1024px ~ 1279px */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .main-container {
      padding: 32px 20px;
    }

    .carousel-title {
      font-size: 26px;
    }

    .carousel-image-wrapper {
      min-width: 260px;
    }
  }

  /* Large phone: 480px ~ 767px */
  @media (min-width: 480px) and (max-width: 767px) {
    .main-container {
      padding: 20px 16px;
    }

    .webinar-content {
      ::v-deep p, ::v-deep span, ::v-deep strong, ::v-deep em,
      ::v-deep a, ::v-deep li, ::v-deep div, ::v-deep h1, ::v-deep h2,
      ::v-deep h3, ::v-deep h4 {
        font-size: 13px !important;
        line-height: 1.6 !important;
      }
      ::v-deep p { margin-bottom: 5px; }
    }

    .section-header h2 {
      font-size: 18px;
    }

    .modern-carousel {
      .carousel-card {
        height: 100%;
        flex-direction: column-reverse;
      }

      .carousel-image-wrapper {
        height: 180px;
        flex: none;
        min-width: unset;
        width: 100%;
      }
    }

    .carousel-content {
      padding: 20px;
      background: linear-gradient(to bottom, #EBF2FE 90%, rgba(235,242,254,0));
    }

    .carousel-title {
      font-size: 18px;
      margin-bottom: 14px;
    }

    .carousel-details {
      gap: 16px;
      margin-bottom: 14px;
    }

    .detail-row {
      .icon-box {
        width: 32px;
        height: 32px;
        font-size: 16px;
        flex-shrink: 0;
      }
      .detail-text {
        .label, .value, .sub-value { font-size: 13px; }
      }
    }

    .upcoming-grid {
      grid-template-columns: 1fr;
    }

    .upcoming-meta-text,
    .upcoming-title,
    .upcoming-text,
    .upcoming-link,
    .upcoming-topic,
    .upcoming-lead {
      font-size: 14px;
    }

    .info-card {
      padding: 12px 16px;

      .info-content {
        .info-title { font-size: 15px; }
        .info-text, .info-subtext, .notice-archive-url { font-size: 13px; }
      }
    }
  }

  /* Small phone: 360px ~ 479px */
  @media (min-width: 360px) and (max-width: 479px) {
    .main-container {
      padding: 16px 12px;
    }

    .webinar-content {
      ::v-deep p, ::v-deep span, ::v-deep strong, ::v-deep em,
      ::v-deep a, ::v-deep li, ::v-deep div, ::v-deep h1, ::v-deep h2,
      ::v-deep h3, ::v-deep h4 {
        font-size: 13px !important;
        line-height: 1.55 !important;
      }
      ::v-deep p { margin-bottom: 5px; }
    }

    .right-content {
      gap: 12px;
    }

    .section-header {
      padding-top: 8px;
      padding-bottom: 8px;
      margin-bottom: 8px;

      h2 { font-size: 16px; }
    }

    .modern-carousel {
      .carousel-card {
        height: 100%;
        flex-direction: column-reverse;
      }

      .carousel-image-wrapper {
        height: 150px;
        flex: none;
        min-width: unset;
        width: 100%;
      }
    }

    .carousel-content {
      padding: 16px;
      background: linear-gradient(to bottom, #EBF2FE 90%, rgba(235,242,254,0));
    }

    .carousel-title {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .carousel-details {
      gap: 12px;
      margin-bottom: 12px;
    }

    .detail-row {
      gap: 10px;

      .icon-box {
        width: 28px;
        height: 28px;
        font-size: 14px;
        flex-shrink: 0;
      }
      .detail-text {
        line-height: 22px;
        .label, .value, .sub-value { font-size: 12px; }
      }
    }

    .carousel-action {
      font-size: 13px;
    }

    .upcoming-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .upcoming-card {
      padding: 10px;
    }

    .webinar-card {
      padding: 0;
    }

    .webinar-content {
      padding: 12px;
    }

    .upcoming-meta-text,
    .upcoming-title,
    .upcoming-text,
    .upcoming-link,
    .upcoming-topic,
    .upcoming-lead {
      font-size: 13px;
    }

    .info-card {
      padding: 10px 14px;
      gap: 12px;

      .info-icon {
        width: 32px;
        height: 32px;
        font-size: 16px;
      }

      .info-content {
        .info-title { font-size: 14px; margin-bottom: 6px; }
        .info-text, .info-subtext, .notice-archive-url { font-size: 12px; }
      }
    }
  }

  /* Very small: < 360px */
  @media (max-width: 359px) {
    .main-container {
      padding: 12px 10px;
    }

    .webinar-content {
      ::v-deep p, ::v-deep span, ::v-deep strong, ::v-deep em,
      ::v-deep a, ::v-deep li, ::v-deep div, ::v-deep h1, ::v-deep h2,
      ::v-deep h3, ::v-deep h4 {
        font-size: 12px !important;
        line-height: 1.5 !important;
      }
      ::v-deep p { margin-bottom: 4px; }
    }

    .right-content {
      gap: 10px;
    }

    .section-header {
      padding-top: 6px;
      padding-bottom: 6px;
      margin-bottom: 6px;
      gap: 10px;

      h2 { font-size: 15px; }
    }

    .modern-carousel {
      .carousel-card {
        height: 100%;
        flex-direction: column-reverse;
      }

      .carousel-image-wrapper {
        height: 120px;
        flex: none;
        min-width: unset;
        width: 100%;
      }
    }

    .carousel-content {
      padding: 12px;
    }

    .carousel-title {
      font-size: 14px;
      margin-bottom: 8px;
    }

    .carousel-details {
      gap: 10px;
      margin-bottom: 10px;
    }

    .detail-row {
      gap: 8px;

      .icon-box {
        width: 24px;
        height: 24px;
        font-size: 12px;
        flex-shrink: 0;
      }
      .detail-text {
        line-height: 20px;
        .label, .value, .sub-value { font-size: 11px; }
      }
    }

    .carousel-action {
      font-size: 12px;
    }

    .upcoming-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .upcoming-card {
      padding: 8px;
    }

    .webinar-card { padding: 0; }
    .webinar-content { padding: 10px; }

    .upcoming-meta-text,
    .upcoming-title,
    .upcoming-text,
    .upcoming-link,
    .upcoming-topic,
    .upcoming-lead {
      font-size: 12px;
    }

    .info-card {
      padding: 8px 12px;
      gap: 10px;
      flex-direction: column;

      .info-icon { width: 28px; height: 28px; font-size: 14px; }

      .info-content {
        .info-title { font-size: 13px; }
        .info-text, .info-subtext, .notice-archive-url { font-size: 11px; }
      }

      .info-action { display: none; }
    }
  }

  /* Shared mobile adjustments (< 768px) */
  @media (max-width: 767px) {
    .home-page {
      padding-bottom: 40px;
    }
  }
</style>

<style lang="scss">
  /* Global overrides for popover to match new theme */
  .modern-popover.el-popover {
    padding: 0;
    border-radius: 16px;
    border: none;
    box-shadow: var(--shadow-xl);
    
    .popover-header {
      padding: 16px 20px;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      border-radius: 16px 16px 0 0;
      
      span {
        font-weight: 700;
        color: var(--text-main);
        font-size: 18px;
      }
    }
    
    .popover-body {
      padding: 8px;
      background: #fff;
      border-radius: 0 0 16px 16px;
    }
    
    .popover-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-regular);
      font-size: 18px;
      transition: all 0.2s;
      
      .popover-item-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #CBD5E1;
        margin-right: 12px;
        transition: all 0.2s;
      }
      
      &:hover {
        background: #F0F9FF;
        color: var(--color-accent);
        
        .popover-item-dot {
          background: var(--color-accent);
          transform: scale(1.5);
        }
      }
    }
    
    .empty-state {
      padding: 20px;
      text-align: center;
      color: var(--text-light);
      font-size: 18px;
    }
  }
</style>