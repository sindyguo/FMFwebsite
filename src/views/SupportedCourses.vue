<template>
  <div class="vcontainer supported-courses">
    <TopBanner class="supported-hero-banner" height="260px" :listData="topBannerList" />


    <section class="supported-list">
      <div class="main-container">
        <div class="course-list">
          <div v-for="course in sortedCourses" :key="course.title" class="course-card">
            <div class="course-image">
              <img :src="course.image" :alt="course.title" />
            </div>
            <div class="course-info">
              <div class="course-title">{{ course.title }}</div>
              <div class="course-meta">
                <div class="meta-item">
                  <span class="meta-label">Date</span>
                  <span class="meta-value">{{ course.date }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Location</span>
                  <span class="meta-value">{{ course.location }}</span>
                </div>
              </div>
              <div v-if="course.email" class="course-email">Email: {{ course.email }}</div>
            </div>
            <div class="course-action">
              <a v-if="course.external" class="course-link" :href="course.link" target="_blank" rel="noopener">
                <span class="course-arrow" aria-hidden="true"></span>
              </a>
              <router-link v-else class="course-link" :to="course.link">
                <span class="course-arrow" aria-hidden="true"></span>
              </router-link>
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
        courses: [
          {
            title: 'Baltic Symposium on Fetal and Maternal Medicine',
            date: '16 May 2026',
            startDate: '2026-05-16',
            location: 'AC Hotel by Marriott Vilnius conference center, Vilnius, Lithuania',
            email: '',
            link: '/fmf-supported-course',
            external: false,
            image: require('@/assets/img/bsfm2026_cover.png'),
            displayOrder: 3
          },
          {
            title: 'III Fundamentals and Updates in Fetal Medicine',
            date: '20-21 March 2026',
            startDate: '2026-03-20',
            location: 'USA (Online and in-person)',
            email: '',
            link: 'https://cmetracker.net/NORTHWELL/Publisher?page=pubOpen#/EventID/104074/',
            external: true,
            image: require('@/assets/img/supported_courses/fundamentals_updates.png'),
            displayOrder: 1
          },
          {
            title: 'Fetal Ultrasound: From first trimester to advanced fetal anomalies',
            date: '10-12 April 2026',
            startDate: '2026-04-10',
            location: 'USA (In-person only)',
            email: '',
            link: 'https://www.eventbrite.com/e/fetal-ultrasound-from-first-trimester-to-advanced-fetal-anomalies-tickets-1978301279381?aff=oddtdtcreator',
            external: true,
            image: require('@/assets/img/supported_courses/fetal_ultrasound_anomalies.png'),
            displayOrder: 2
          },
          {
            title: 'Diplomado de Tamizaje del 1er. Trimestre del Embarazo (FMF)',
            date: '20 February 2026 - December 2026',
            startDate: '2026-02-20',
            location: 'Mexico City - Hybrid (Online and In Person)',
            email: 'educacion@fmm-ac.org',
            link: 'https://fetalmedicinemexico.com/diplomados-fmm/',
            external: true,
            image: require('@/assets/img/supported_courses/mexico_city.webp'),
            displayOrder: 4
          },
          {
            title: 'NT Courses - Australia',
            date: 'Multiple dates',
            startDate: '',
            location: 'Australia',
            email: '',
            link: 'https://www.nuchaltrans.edu.au',
            external: true,
            image: require('@/assets/img/supported_courses/nt_courses.jpg'),
            displayOrder: 5
          },
          {
            title: 'NT Courses - USA',
            date: 'Multiple dates',
            startDate: '',
            location: 'USA',
            email: '',
            link: 'https://www.fetalmedicineusa.com',
            external: true,
            image: require('@/assets/img/supported_courses/nt_courses.jpg'),
            displayOrder: 6
          }
        ]
      }
    },
    computed: {
      sortedCourses() {
        const hasManualOrder = this.courses.some((course) => typeof course.displayOrder === 'number')
        if (hasManualOrder) {
          return [...this.courses].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        }
        const today = new Date()
        return [...this.courses].sort((a, b) => {
          const aDate = a.startDate ? new Date(a.startDate) : null
          const bDate = b.startDate ? new Date(b.startDate) : null
          const aFuture = aDate ? aDate >= today : false
          const bFuture = bDate ? bDate >= today : false

          if (aFuture !== bFuture) return aFuture ? -1 : 1
          if (aDate && bDate) return aDate - bDate
          if (aDate) return -1
          if (bDate) return 1
          return a.title.localeCompare(b.title)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supported-courses {
    background: #f7fbff;
    padding-top: 72px;
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

  @media (max-width: 900px) {
    .course-card {
      grid-template-columns: 1fr;
    }

    .course-action {
      justify-content: flex-start;
    }
  }
</style>
