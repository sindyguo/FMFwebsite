<template>
  <div class="home-page">
    <div style="flex-shrink: 0;" class="banner-wrapper">
      <TopBanner /> 
    </div>

    <div class="main-container">
      <div class="home-layout">
        <!-- Right Content -->
        <main class="right-content">
          <!-- Main Carousel / Featured -->
          <div class="featured-section">
            <el-carousel 
              arrow="hover"
              height="420px"
              indicator-position="outside"
              class="modern-carousel">
              <el-carousel-item v-for="(carouselItem, index) in carouselListData" :key="index">
                <div class="carousel-card" @click="handleDetail(carouselItem)">
                  <div class="carousel-content">
                    <h2 class="carousel-title" :title="carouselItem.title">{{ carouselItem.title }}</h2>
                    
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
                  
                  <div class="carousel-image-wrapper">
                    <div class="carousel-image-bg"></div>
                    <el-image :src="require('@/assets/img/vienna_home.png')" class="carousel-img" fit="cover" alt="" />
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="upcoming-section">
            <div class="section-header">
              <h2>Monthly webinars</h2>
              <div class="header-line"></div>
            </div>

            <div class="upcoming-grid">
              <div class="upcoming-card webinar-card">
                <div class="webinar-image">
                  <img src="@/assets/img/home/monthly_webinar_1.jpeg" alt="Monthly webinar" />
                </div>
                <div class="webinar-content">
                  <h3 class="upcoming-title">Cholestasis in Pregnancy</h3>
                  <div class="upcoming-meta">
                    <span class="upcoming-meta-text"><strong>Lecturer:</strong> Prof Catherine Williamson</span>
                    <span class="upcoming-meta-text"><strong>Date:</strong> Friday 20 February 2026 @ 13:30</span>
                    <a
                      class="upcoming-link"
                      href="https://us02web.zoom.us/webinar/register/WN_gRbA-qKbSR69O83seSrV8Q#/registration"
                      target="_blank"
                      rel="noopener"
                    >
                      Register here
                    </a>
                  </div>
                </div>
              </div>

              <div class="upcoming-card webinar-card">
                <div class="webinar-image">
                  <img src="@/assets/img/home/monthly_webinar_2.jpeg" alt="Monthly webinar" />
                </div>
                <div class="webinar-content">
                  <div class="upcoming-title">Research Training Program in Maternal-Fetal Medicine</div>
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- News -->
          <div class="news-section">
            <div class="section-header">
              <h2>News</h2>
              <div class="header-line"></div>
            </div>
            <div class="news-grid">
              <div class="upcoming-card news-card">
                <div class="upcoming-title">FMF Supported Trial Published</div>
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
                </p>
              </div>
            </div>
          </div>

          <!-- Notice -->
          <div class="news-section notice-section">
            <div class="section-header">
              <h2>Notice</h2>
              <div class="header-line"></div>
            </div>
            <div class="info-card" @click="goto('https://www.fetalmedicine.org/fmf-fellowships')">
              <div class="info-icon">
                <i class="el-icon-info"></i>
              </div>
              <div class="info-content">
                <h4 class="info-title">System Update</h4>
                <p class="info-text">
                  Some features are currently under development. The previous website remains fully operational during this transition.
                </p>
                <p class="info-subtext">
                  You can continue to log in with existing credentials to access licenses and other legacy features.
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
    data() {
      return {
        educationList: [],
        carouselListData: [],
        researchList: [
          { icon: require('@/assets/img/icon/icon_research.png'),
            text: ' '
          },
        ]
      }
    },
    methods: {
      goto(e){
        window.open(e)
      },
      ...mapActions('user', ['changeActiveId']),
      handleDetail(row) {
        this.changeActiveId('/congress')
        this.$router.push(`/congress?categoryName=${row.title}`)
      },

      formatFullDateRange(startString, endString) {
        if (!startString || !endString) return "";
        const startDate = new Date(startString);
        const endDate = new Date(endString);
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const startDay = startDate.getDate();
        const startMonth = months[startDate.getMonth()];
        const endDay = endDate.getDate();
        const endMonth = months[endDate.getMonth()];
        const year = endDate.getFullYear();
        const getOrdinalSuffix = (day) => {
          if (day > 3 && day < 21) return "th";
          switch (day % 10) {
            case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th";
          }
        };
        const startFormatted = `${startDay}${getOrdinalSuffix(startDay)} ${startMonth}`;
        const endFormatted = `${endDay}${getOrdinalSuffix(endDay)} ${endMonth} ${year}`;
        return `${startFormatted} - ${endFormatted}`;
      },
      getCongressList() {
        this.$api.websiteCongressList({
          page: 1, pageSize: 1, publishStatus: 1,
        }).then(res => {
          if (res && res.data && Array.isArray(res.data.list)) {
            this.carouselListData = res.data.list
          } else {
            this.carouselListData = []
          }
        }).catch(() => {
          this.carouselListData = []
        })
      },
    },
    created() {
      this.getCongressList();
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
    font-size: 12px;
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
    gap: 20px;
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
      
      .label {
        font-size: 12px;
        color: var(--text-light);
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 2px;
      }
      .value {
        font-size: 16px;
        color: var(--text-regular);
        font-weight: 500;
      }
      .sub-value {
        font-size: 14px;
        color: var(--text-secondary);
        margin-top: 2px;
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
    
    span { border-bottom: 2px solid transparent; transition: inherit; }
    
    &:hover {
      color: var(--color-accent-hover);
      span { border-bottom-color: var(--color-accent-hover); }
      i { transform: translateX(4px); }
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
  }

  .upcoming-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-accent);
  }

  .upcoming-subtitle {
    font-size: 15px;
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
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
  }

  .upcoming-meta-text {
    font-size: 15px;
    color: var(--text-regular);
  }

  .upcoming-topic {
    font-weight: 700;
    color: var(--text-main);
  }

  .upcoming-lead {
    font-size: 15px;
    color: var(--text-main);
  }

  .upcoming-text {
    font-size: 14px;
    color: var(--text-regular);
    line-height: 1.6;
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
    font-size: 15px;
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
    font-size: 14px;
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
  }

  .news-card {
    gap: 10px;
  }

  .info-card {
    background: #FFFBF0; /* Warm sticky note bg */
    border: 1px solid #FEF3C7;
    border-radius: var(--radius-md);
    padding: 12px 24px 24px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    cursor: pointer;
    transition: var(--transition-base);
    
    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    
    .info-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #FEF3C7;
      color: #F59E0B;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    
    .info-content {
      flex: 1;
      
      .info-title {
        font-size: 16px;
        font-weight: 700;
        color: #92400E; /* Dark amber */
        margin-bottom: 8px;
      }
      .info-text {
        font-size: 14px;
        color: #B45309;
        line-height: 1.5;
        margin-bottom: 8px;
      }
      .info-subtext {
        font-size: 13px;
        color: #D97706;
      }
    }
    
    .info-action {
      color: #D97706;
      font-size: 18px;
    }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .main-container {
      padding: 24px 16px;
    }
    
    .modern-carousel {
      height: auto !important;
      
      .carousel-card {
        height: auto;
      }
      .carousel-image-wrapper {
        height: 200px;
        flex: none;
      }
    }
    
    .carousel-content {
      padding: 24px;
    }
    
    .carousel-title {
      font-size: 24px;
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
        font-size: 15px;
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
      font-size: 14px;
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
      font-size: 13px;
    }
  }
</style>
