<template>
  <div v-loading="loading" class="vcontainer supported-courses">
    <TopBanner class="supported-hero-banner" height="260px" :listData="topBannerList" />


    <section class="supported-list">
      <div class="main-container">
        <div class="course-list">
          <div v-for="course in courses" :key="course.title" class="course-card">
            <div class="course-image">
              <img :src="course.congressImageList[0].url" :alt="course.title" />
            </div>
            <div class="course-info">
              <div class="course-title">
                <a
                  v-if="course.registrationHostedBy == 1"
                  class="course-title-link"
                  :href="course.externalLinks"
                  target="_blank"
                  rel="noopener"
                >
                  {{ course.title }}
                </a>
                <el-link type="primary" v-else class="course-title-link" @click="handleRouter(course)">
                  {{ course.title }}
                </el-link>
              </div>
              <div class="course-meta">
                <div class="meta-item">
                  <span class="meta-label">Date</span>
                  <span class="meta-value">{{ (course.startTime && course.endTime) ? formatFullDateRange(course.startTime, course.endTime) : 'Multiple dates' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Location</span>
                  <span class="meta-value">{{ course.location }}({{ course.courseFormat }})</span>
                </div>
              </div>
              <div v-if="course.email" class="course-email">Email: {{ course.email }}</div>
            </div>
            <div class="course-action">
              <a v-if="course.registrationHostedBy == 1" class="course-link" :href="course.externalLinks" target="_blank" rel="noopener">
                <span class="course-arrow" aria-hidden="true"></span>
              </a>
              <el-link v-else class="course-link" @click="handleRouter(course)">
                <span class="course-arrow" aria-hidden="true"></span>
              </el-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'SupportedCoursesPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/supported_courses_header.jpeg'),
          title: 'FMF Supported Courses',
          desc: ''
        }],
        courses: [],
        loading: false
      }
    },
    methods: {
      getCongressInfo() {
        this.loading = true
        this.$api
        .websiteCongressList({
          page: 1,
          pageSize: 100,
          publishStatus: 1,
          congressType: 'Supported Courses'
        })
        .then((res) => {
          if (!res || (res.code !== 200 && res.code !== 0) || !res.data || !Array.isArray(res.data.list)) {
            this.courses = []
            setTimeout(() => {
              this.loading = false
            }, 500)
            return
          }
          this.courses = res.data.list;
          setTimeout(() => {
            this.loading = false;
          }, 500)
        })
      },
      handleRouter(obj) {
        this.$router.push(`/fmf-supported-course-detail?categoryName=${obj.title}`)
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
        const startYear = startDate.getFullYear();
        const endDay = endDate.getDate();
        const endMonth = months[endDate.getMonth()];
        const endYear = endDate.getFullYear();
        let startFormatted = `${startDay}`;
        if(startMonth != endMonth || startYear != endYear) {
          startFormatted = `${startFormatted} ${startMonth}`;
        }
        if(startYear != endYear) {
          startFormatted = `${startFormatted} ${startYear}`;
        }
        const endFormatted = `${endDay} ${endMonth} ${endYear}`;
        return `${startFormatted} - ${endFormatted}`;
      },
    },
    created() {
      this.getCongressInfo();
    }
  }
</script>

<style lang="scss" scoped>
  .supported-courses {
    background: #f7fbff;
  }

  ::v-deep .top-banner .top-banner-content .title {
    text-shadow: 0 2px 6px rgba(6, 32, 68, 0.7), 0 0 2px rgba(6, 32, 68, 0.9);
  }



  .supported-list {
    padding: 32px 0 48px;
  }

  .center {
    text-align: center;
  }

  .course-list {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .course-card {
    background: #fff;
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 10px 24px rgba(14, 48, 69, 0.08);
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr) 40px;
    gap: 16px;
    align-items: center;
  }

  .course-image img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
  }

  .course-title {
    font-size: 18px;
    font-weight: 700;
    color: #036fc0;
    margin-bottom: 8px;
  }

  .course-title-link {
    color: inherit;
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
  }

  .course-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px 12px;
    font-size: 15px;
    color: #4a5b67;
  }

  .meta-label {
    font-weight: 600;
    color: #0e3045;
    display: block;
  }

  .course-email {
    margin-top: 8px;
    font-size: 15px;
    color: #4a5b67;
  }

  .course-action {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .course-link {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #0f5aa4;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .course-arrow {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 10px solid #ffffff;
    display: block;
  }

  /* ============================================================
     RESPONSIVE BREAKPOINTS
     ============================================================ */

  /* Tablet: 768px ~ 1279px */
  @media (min-width: 768px) and (max-width: 1279px) {
    .main-container {
      width: 100% !important;
      padding-left: 32px !important;
      padding-right: 32px !important;
    }
    .course-card {
      grid-template-columns: 160px minmax(0, 1fr) 40px;
    }
    .course-title-link { font-size: 16px; }
    .course-meta       { font-size: 14px; }
    .course-email      { font-size: 14px; }
  }

  /* Large phone: 480px ~ 767px */
  @media (min-width: 480px) and (max-width: 767px) {
    .main-container {
      width: 100% !important;
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    .supported-list { padding: 20px 0 32px; }
    .course-card {
      grid-template-columns: 130px minmax(0, 1fr) 36px;
      gap: 12px;
      padding: 12px;
    }
    .course-image img  { height: 90px; }
    .course-title      { font-size: 15px; margin-bottom: 6px; }
    .course-title-link { font-size: 15px; }
    .course-meta       { font-size: 13px; grid-template-columns: 1fr; }
    .course-email      { font-size: 13px; }
  }

  /* Small phone: 360px ~ 479px */
  @media (min-width: 360px) and (max-width: 479px) {
    .main-container {
      width: 100% !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
    }
    .supported-list { padding: 16px 0 24px; }
    .course-card {
      grid-template-columns: 110px minmax(0, 1fr) 32px;
      gap: 10px;
      padding: 10px;
    }
    .course-image img  { height: 76px; }
    .course-title      { font-size: 14px; margin-bottom: 4px; }
    .course-title-link { font-size: 14px; }
    .course-meta       { font-size: 12px; grid-template-columns: 1fr; gap: 4px; }
    .course-email      { font-size: 12px; }
  }

  /* Very small: < 360px */
  @media (max-width: 359px) {
    .main-container {
      width: 100% !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    .supported-list { padding: 12px 0 20px; }
    .course-card {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 10px;
    }
    .course-image img  { height: 140px; }
    .course-action     { justify-content: flex-start; }
    .course-title      { font-size: 14px; }
    .course-title-link { font-size: 14px; }
    .course-meta       { font-size: 12px; grid-template-columns: 1fr; }
    .course-email      { font-size: 12px; }
  }
</style>
