<template>
  <div class="home-page">
    <div style="flex-shrink: 0;" class="banner-wrapper">
      <TopBanner /> 
    </div>

    <div class="main-container">
      <div class="home-layout">
        <!-- Left Navigation -->
        <aside class="left-sidebar">
          <div class="sidebar-card">
            <h3 class="sidebar-title">Explore</h3>
            <div class="nav-list">
              <template v-for="(item, index) in leftListData">
                <el-popover
                  v-if="item.showPop"
                  :key="`popover-${index}`"
                  v-model="item.popVisible"
                  placement="right-start" 
                  :visible-arrow="false"
                  trigger="hover"
                  popper-class="modern-popover"
                  :offset="10">
                  
                  <!-- Popover Content -->
                  <div class="popover-content">
                    <div class="popover-header">
                      <span>{{ item.title }}</span>
                    </div>
                    <div class="popover-body">
                      <div v-if="!item.children || item.children.length == 0" class="empty-state">
                        No data available
                      </div>
                      <div
                        v-else
                        v-for="subItem in (item.children ||[])"
                        :key="subItem.categoryName"
                        class="popover-item"
                        @click="leftItemClick(item, subItem)">
                        <div class="popover-item-dot"></div>
                        <span>{{ subItem.categoryName }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Trigger -->
                  <div slot="reference" :class="['nav-item', `nav-item-${index}`]" @click="itemClick(item)">
                    <div class="nav-item-icon-box">
                      <svg v-if="index === 0" class="nav-item-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4.5 5.5c0-1.1.9-2 2-2h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3h-6a2 2 0 0 0-2 2z" />
                        <path d="M19.5 5.5c0-1.1-.9-2-2-2h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6a2 2 0 0 1 2 2z" />
                      </svg>
                      <svg v-else-if="index === 1" class="nav-item-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="4" y="3.5" width="16" height="17" rx="2" />
                        <path d="M8 8h8M8 12h3m2 0h3M8 16h3m2 0h3" />
                      </svg>
                      <svg v-else class="nav-item-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3.5" y="4" width="17" height="12" rx="2" />
                        <path d="M8 20h8M10 16v4M14 16v4" />
                      </svg>
                    </div>
                    <div class="nav-item-info">
                      <span class="nav-item-title">{{ item.categoryName }}</span>
                    </div>
                    <i class="el-icon-arrow-right nav-arrow"></i>
                  </div>
                </el-popover>

                <div
                  v-else
                  :key="`item-${index}`"
                  :class="['nav-item', `nav-item-${index}`]"
                  @click="itemClick(item)">
                  <div class="nav-item-icon-box">
                    <svg v-if="index === 0" class="nav-item-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4.5 5.5c0-1.1.9-2 2-2h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3h-6a2 2 0 0 0-2 2z" />
                      <path d="M19.5 5.5c0-1.1-.9-2-2-2h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6a2 2 0 0 1 2 2z" />
                    </svg>
                    <svg v-else-if="index === 1" class="nav-item-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="4" y="3.5" width="16" height="17" rx="2" />
                      <path d="M8 8h8M8 12h3m2 0h3M8 16h3m2 0h3" />
                    </svg>
                    <svg v-else class="nav-item-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3.5" y="4" width="17" height="12" rx="2" />
                      <path d="M8 20h8M10 16v4M14 16v4" />
                    </svg>
                  </div>
                  <div class="nav-item-info">
                    <span class="nav-item-title">{{ item.categoryName }}</span>
                  </div>
                  <i class="el-icon-arrow-right nav-arrow"></i>
                </div>
              </template>
            </div>
          </div>
        </aside>

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
                    <div class="carousel-tag">Featured</div>
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
              <h2>Upcoming Events</h2>
              <div class="header-line"></div>
            </div>

            <div class="upcoming-grid">
              <div class="upcoming-card">
                <h3 class="upcoming-title">Next FMF lecture</h3>
                <div class="upcoming-meta">
                  <span class="upcoming-meta-label">Topic</span>
                  <span class="upcoming-meta-text">Cholestasis in pregnancy by Catherine Williamson.</span>
                </div>
                <div class="upcoming-meta">
                  <span class="upcoming-meta-label">Date</span>
                  <span class="upcoming-meta-text">20th February at 13:30</span>
                </div>
              </div>

              <div class="upcoming-card">
                <div class="upcoming-title">New FMF Supported Webinar Series</div>
                <div class="upcoming-subtitle">Research Training Program in Obstetrics, Maternal-Fetal Medicine and Reproductive Health.</div>
                <p class="upcoming-text">
                  This free-of-charge course is organised by <strong>The Fetal Medicine Foundation Asia Pacific</strong> and is supported by the <strong>FMF.</strong>
                </p>
                <p class="upcoming-text">
                  <strong>First lecture - Thursday 26 February 2026</strong>
                  <a
                    class="upcoming-link"
                    href="https://news.fetalmedicine.org/l/nf150IUqqCfSF3uQNp9PZg/IrpEyQzDCxooAUy0rIsvAQ/20wbHD763GZeYXhX67J8920QzA"
                    target="_blank"
                    rel="noopener"
                  >
                    Click here to register
                  </a>
                </p>
                <p class="upcoming-text">
                  <strong>Each webinar lasts for 60-90 minutes and will be held on the last Thursday of each month at 10 am GMT (6 pm HKT, 9 pm AEDT, 11 am CET).</strong>
                </p>
                <ul class="upcoming-list">
                  <li>The course offers a structured program of training from basic to advanced research skills, data analysis and statistics and ensures that participants gain both theoretical knowledge and practical application.</li>
                  <li>The curriculum is tailored to meet the needs of healthcare professionals and individuals aspiring to pursue medical research. By combining interactive learning, expert guidance, and practical exercises, the program aims to strengthen research capacity and foster innovation in obstetrics and maternal-fetal medicine.</li>
                </ul>
                <p class="upcoming-text">
                  <strong>Faculty:</strong> Liona Poon, Jon Hyett, Daniel Rolnik, Ben Mol, Fabricio Da Silva Costa, Long Nguyen-Hoang, Piya Chaemsaithong, Clarissa Velayo, Constance Chen, Valeria Rolle, Mar Gil
                </p>
              </div>
            </div>
          </div>

          <!-- News -->
          <div class="news-section">
            <div class="section-header">
              <h2>News</h2>
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
        leftListData: [
          {
            popVisible: false,
            showPop: false,
            categoryName: 'Online Courses',
            title: 'Course List',
            routePath: '/course?categoryName=Online Courses',
            children: []
          }, {
            popVisible: false,
            showPop: false,
            linkUrl: 'https://www.fetalmedicine.org',
            categoryName: 'Calculators',
            title: 'Calculator Tools',
            routePath: '/calculators'
          }, {
            popVisible: false,
            showPop: false,
            linkUrl: 'https://fmf.refractionx.com/download?direct=true',
            categoryName: 'FMF software',
            title: 'FMF software',
          }
        ],
        carouselListData: [],
        researchList: [
          { icon: require('@/assets/img/icon/icon_research.png'),
            text: ' '
          },
        ]
      }
    },
    methods: {
      itemClick(e) {
        if (e.routePath) {
          this.$router.push(e.routePath)
          return
        }
        if (e.linkUrl) {
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
      leftItemClick(item, subItem) {
        item.popVisible = false;
        const self = this
        if (subItem.routePath) {
          self.$router.push(subItem.routePath)
          return
        }
        self.$utils.checkLoginAndContinue(() => {
          self.changeActiveId('/courseDetail')
          self.$router.push('/courseDetail?categoryName=' + subItem.categoryName)
        })
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
      this.initListData();
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
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 32px;
    align-items: start;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  /* Left Sidebar */
  .left-sidebar {
    position: sticky;
    top: 24px;
  }

  .sidebar-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: 24px;
    border: 1px solid var(--border-light);
  }

  .sidebar-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 20px;
    padding-left: 8px;
    border-left: 4px solid var(--color-accent);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: var(--radius-md);
    background: var(--bg-body);
    transition: all 0.12s ease;
    cursor: pointer;
    border: 1px solid transparent;

    &:hover {
      background: #F0F9FF; /* Very light blue */
      border-color: #BAE6FD;
      transform: translateX(4px);
      
      .nav-item-icon-box {
        background: var(--color-accent);
        color: #ffffff;
      }
      .nav-arrow {
        opacity: 1;
        transform: translateX(0);
        color: var(--color-accent);
      }
    }
  }

  .nav-item-icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #E0F2FE; /* Sky 100 */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    transition: all 0.12s ease;
    color: var(--color-accent);
    
    .nav-item-icon {
      width: 36px;
      height: 36px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: all 0.12s ease;
    }
  }
  
  .nav-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .nav-item-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-main);
    }
  }

  .nav-arrow {
    font-size: 16px;
    color: var(--text-light);
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.12s ease;
  }

  /* Right Content */
  .right-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    
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
    background: #fff;
    
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
    background: linear-gradient(to right, #ffffff 90%, rgba(255,255,255,0));
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
    color: var(--text-main);
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
    gap: 20px;
  }

  .upcoming-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .upcoming-card {
    background: #ffffff;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
    box-shadow: var(--shadow-sm);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .upcoming-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
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

  .upcoming-meta-label {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
  }

  .upcoming-meta-text {
    font-size: 15px;
    color: var(--text-regular);
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

  .upcoming-link {
    margin-left: 8px;
    color: var(--color-accent);
    font-weight: 600;
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
    gap: 20px;
  }

  .info-card {
    background: #FFFBF0; /* Warm sticky note bg */
    border: 1px solid #FEF3C7;
    border-radius: var(--radius-md);
    padding: 24px;
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
