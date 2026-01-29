<template>
  <div class="fill vcontainer course">
    <section class="course-hero">
      <BabyScanHeader class="course-hero-scan">
        <div class="course-hero-content main-container">
          <div class="course-hero-title">Online Learning</div>
          <div class="course-hero-subtitle">
            Internet-based courses, free of charge, available in several languages.
          </div>
        </div>
      </BabyScanHeader>
    </section>

    <section class="course-library">
      <div class="main-container">
        <div class="course-search-row">
          <el-input
            v-model="searchQuery"
            placeholder="Search courses..."
            clearable
            prefix-icon="el-icon-search"
            class="course-search-input"
          ></el-input>
        </div>
        <div class="course-category-row">
          <button
            v-for="option in categoryOptions"
            :key="option.id"
            :class="['course-chip', selectedCategory === option.id ? 'is-active' : '']"
            @click="setCategory(option.id)"
          >
            {{ option.label }}
          </button>
        </div>
        <div class="course-results">
          <div class="course-results-title">{{ selectedCategoryLabel }}</div>
          <div class="course-results-sub">{{ filteredList.length }} courses available</div>
        </div>
        <div class="course-grid">
          <div
            v-for="item in filteredList"
            :key="item.id"
            class="course-card"
            @click="itemClick(item)"
          >
            <div class="course-card-body">
              <div class="course-card-badges">
                <span
                  v-if="item.featured == 1"
                  class="course-badge course-badge-new"
                >
                  New
                </span>
                <span
                  v-else
                  :class="[
                    'course-badge',
                    item.updateStatus == 1 ? 'course-badge-updated' : 'course-badge-updating'
                  ]"
                >
                  {{ item.updateStatus === 1 ? 'Updated' : 'Updating' }}
                </span>
              </div>
              <div class="course-card-title" :title="item.categoryName">
                {{ item.categoryName }}
              </div>
              <div class="course-card-desc">{{ getCourseDesc(item.content) }}</div>
              <div class="course-card-footer">
                <div v-if="isLogin && item.learningCount" class="course-progress-block">
                  <div class="course-progress-header">
                    <span>Learning Progress</span>
                    <div class="course-progress-value">
                      <span class="course-progress-accent">{{ item.learningCount || 0 }}</span>
                      <span>/{{ item.totalCount || 0 }}</span>
                    </div>
                  </div>
                  <el-progress
                    :percentage="(item.learningCount && item.totalCount) ? Math.floor(item.learningCount / item.totalCount * 100) : 0"
                    color="#3aa8ff"
                    define-back-color="#eaf5ff"
                    :stroke-width="10"
                    :show-text="false"
                  ></el-progress>
                </div>
                <div v-else class="course-module">
                  <span class="course-module-count">{{ item.moduleCount || 0 }} modules</span>
                  <span class="course-module-cta">View Course</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredList.length === 0" class="course-empty">
            <div class="course-empty-icon"></div>
            <div class="course-empty-title">No courses found</div>
            <div class="course-empty-text">Try adjusting your search term.</div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import BabyScanHeader from '@/components/BabyScanHeader.vue'

  export default {
    name: 'CoursePage',
    components: {
      BabyScanHeader
    },
    data() {
      return {
        listData: [],
        searchQuery: "",
        selectedCategory: "all",
        onlineCoursesPreset: [
          {
            id: '1989284455255666689',
            categoryName: 'Fetal echocardiography',
            content: 'Provides key diagnostic features of common fetal cardiac defects through concise videos and explanatory text.',
            featured: 1,
            updateStatus: 1,
            moduleCount: 9,
            sort: 1
          },
          {
            id: '1989307716978896898',
            categoryName: 'Fetal neurosonography',
            content: 'Summarizes the diagnosis, associated abnormalities, management, and prognosis of major fetal brain conditions.',
            featured: 1,
            updateStatus: 1,
            moduleCount: 10,
            sort: 2
          },
          {
            id: '1989312171468156929',
            categoryName: 'Genetics for fetal medicine',
            content: 'Introduces core genetic principles essential for fetal medicine and explains their clinical application.',
            featured: 1,
            updateStatus: 1,
            moduleCount: 7,
            sort: 3
          },
          {
            id: '1989422258010484738',
            categoryName: 'Topics in maternal medicine',
            content: 'Summarizes the causes, diagnosis, management, prevention, and long-term effects of major maternal medical disorders during and after pregnancy.',
            featured: 1,
            updateStatus: 0,
            moduleCount: 13,
            sort: 4
          },
          {
            id: '1996163011516592129',
            categoryName: 'Intrapartum ultrasound',
            content: 'Describes key ultrasound techniques for labor assessment and reviews current evidence on their clinical indications.',
            featured: 1,
            updateStatus: 1,
            moduleCount: 2,
            sort: 5
          },
          {
            id: '2004961251519148033',
            categoryName: 'Twin pregnancies',
            content: 'This course summarizes the differences in outcomes and management between dichorionic and monochorionic twin pregnancies.',
            featured: 1,
            updateStatus: 0,
            moduleCount: 5,
            sort: 6
          },
          {
            id: '2005404637984239617',
            categoryName: 'The 11-13 weeks scan',
            content: 'This course covers all the important aspects of the 11-13 weeks scan.',
            featured: 0,
            updateStatus: 1,
            moduleCount: 5,
            sort: 7
          },
          {
            id: '1989374664949395458',
            categoryName: 'Cervical assessment',
            content: 'Explains cervical length measurement and its clinical use in predicting and preventing preterm birth and managing labor‑related complications.',
            featured: 0,
            updateStatus: 1,
            moduleCount: 8,
            sort: 8
          },
          {
            id: '1989379308115226626',
            categoryName: 'Fetal abnormalities',
            content: 'Provides an overview of the diagnosis, associated anomalies, investigations, management, prognosis, and recurrence risks of fetal abnormalities.',
            featured: 0,
            updateStatus: 1,
            moduleCount: 13,
            sort: 9
          },
          {
            id: '1989368262591803394',
            categoryName: 'Placenta accreta spectrum disorders',
            content: 'Highlights the key diagnostic features of PAS disorders using images, diagrams, videos, and concise text.',
            featured: 0,
            updateStatus: 1,
            moduleCount: 2,
            sort: 10
          },
          {
            id: '1992547864730415106',
            categoryName: 'Fetal cardiac scanning',
            content: 'Covers the essential techniques and views required for comprehensive fetal cardiac assessment.',
            featured: 0,
            updateStatus: 1,
            moduleCount: 6,
            sort: 11
          },
          {
            id: '1989364592269619202',
            categoryName: 'Preeclampsia screening',
            content: 'Covers the essential principles and methods for screening preeclampsia across all trimesters.',
            featured: 0,
            updateStatus: 1,
            moduleCount: 5,
            sort: 12
          },
          {
            id: '2001688356038684673',
            categoryName: 'FMF lectures',
            content: 'These lectures are given by leading international experts and are held on the 3rd Friday of each month.',
            featured: 1,
            updateStatus: 0,
            moduleCount: 11,
            sort: 13
          }
        ]
      }
    },
    computed: {
      ...mapGetters('user', ['isLogin']),
      categoryOptions() {
        const options = this.listData.map((item) => ({
          id: item.categoryName,
          label: item.categoryName
        }))
        return [{ id: 'all', label: 'View All' }].concat(options)
      },
      selectedCategoryLabel() {
        if (this.selectedCategory === 'all') {
          return 'All Courses'
        }
        const match = this.listData.find((item) => item.categoryName === this.selectedCategory)
        return match ? match.categoryName : 'All Courses'
      },
      filteredList() {
        const query = this.searchQuery.trim().toLowerCase()
        return this.listData.filter((item) => {
          const name = (item.categoryName || '').toLowerCase()
          const content = (item.content || '').toLowerCase()
          const matchesQuery = !query || name.includes(query) || content.includes(query)
          const matchesCategory = this.selectedCategory === 'all' || item.categoryName === this.selectedCategory
          return matchesQuery && matchesCategory
        })
      }
    },
    methods: {
      ...mapActions('user', ['changeActiveId']),
      setCategory(id) {
        this.selectedCategory = id
      },
      itemClick(item) {
        const self = this
        self.$utils.checkLoginAndContinue(() => {
          self.changeActiveId(item.id)
          self.$router.push('/courseDetail?categoryName=' + item.categoryName)
        })
      },
      getCourseDesc(content) {
        if (!content) return ''
        return content
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;|&#160;/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      },
      getCourseImage(name) {
        // Default cover
        let coverName = 'cover_ultrasound'
        
        if (!name) return require(`@/assets/img/course_covers/${coverName}.png`)
        
        const label = name.toLowerCase()

        if (label.includes('echo') || label.includes('cardiography') || label.includes('heart') || label.includes('cardiac')) {
          coverName = 'cover_heart'
        }
        else if (label.includes('brain') || label.includes('neuro')) {
          coverName = 'cover_brain'
        }
        else if (label.includes('dna') || label.includes('genetic')) {
          coverName = 'cover_dna'
        }
        
        try {
          return require(`@/assets/img/course_covers/${coverName}.png`)
        } catch (e) {
          return require('@/assets/img/course_covers/cover_ultrasound.png')
        }
      },
      websiteCourseNavigationFn(categoryName) {
        const reqData = {
          categoryName: categoryName
        }
        if (categoryName === 'Online Courses') {
          this.listData = [...this.onlineCoursesPreset].sort((a, b) => a.sort - b.sort)
          this.selectedCategory = 'all'
          return
        }
        this.$api.websiteCourseNavigation(reqData).then(resp => {
          if ((resp.code === 200 || resp.code === 0) && Array.isArray(resp.data)) {
            this.listData = resp.data
          } else {
            this.listData = []
          }
          if (categoryName) {
            const match = this.listData.find((item) => item.categoryName === categoryName)
            this.selectedCategory = match ? match.categoryName : 'all'
          } else {
            this.selectedCategory = 'all'
          }
        }).catch(err => {
          console.log('err:', err)
        })
      }
    },
    mounted() {
      this.websiteCourseNavigationFn(this.$route.query.categoryName)
    },
    beforeRouteUpdate(to, from, next) {
      this.websiteCourseNavigationFn(to.query.categoryName)
      next()
    }
  }
</script>

<style lang="scss" scoped>
  .course {
    padding-top: 72px;
    min-height: calc(100% - 200px);
    background: #f5f7fb;
    .course-hero {
      position: relative;
      height: 850px; /* Increased to 850px to ensure full fetus contour is visible */
      background: #000;
      overflow: hidden;
      
      .course-hero-scan {
        width: 100%;
        height: 100%;
      }

      .course-hero-content {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        color: #fff;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5); /* Added text shadow for legibility over scan */
        
        .course-hero-title {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .course-hero-subtitle {
          margin-top: 12px;
          font-size: 18px;
          max-width: 680px;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    .course-library {
      padding: 12px 0 40px;
    }
    .course-search-row {
      max-width: 520px;
      margin-bottom: 16px;
    }
    .course-search-input ::v-deep .el-input__inner {
      height: 50px;
      border-radius: 14px;
      border-color: #d5dee8;
      font-size: 15px;
    }
    .course-category-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 22px;
    }
    .course-chip {
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid #d7e2ee;
      background: #ffffff;
      color: #0e3045;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .course-chip.is-active {
      background: #0f5aa4;
      color: #ffffff;
      border-color: #0f5aa4;
      box-shadow: 0 10px 20px rgba(15, 90, 164, 0.2);
    }
    .course-results {
      margin-bottom: 18px;
    }
    .course-results-title {
      font-size: 22px;
      font-weight: 700;
      color: #0e3045;
    }
    .course-results-sub {
      margin-top: 4px;
      font-size: 14px;
      color: #6b7380;
    }
    .course-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
    }
    .course-card {
      background: #ffffff;
      border-radius: 14px;
      box-shadow: 0 14px 28px rgba(15, 42, 67, 0.08);
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-left: 4px solid #0f5aa4;
    }
    .course-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 36px rgba(15, 42, 67, 0.12);
    }
    .course-card-badges {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .course-card-body {
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: left;
      height: 100%;
    }
    .course-card-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f5aa4;
      white-space: normal;
      word-break: break-word;
      text-align: left;
    }
    .course-card-desc {
      font-size: 14px;
      color: #3c4a5c;
      line-height: 22px;
      min-height: 0;
      word-break: break-word;
      text-align: left;
      flex: 1 1 auto;
    }
    .course-card-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .course-badge {
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 999px;
      font-weight: 600;
    }
    .course-badge-new {
      background: #ffe2db;
      color: #ff3c00;
    }
    .course-badge-updated {
      background: #eef3f6;
      color: #0e3045;
    }
    .course-badge-updating {
      background: #e1fdf3;
      color: #49d5be;
    }
    .course-progress-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
    .course-progress-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: #0e3045;
      width: 100%;
      max-width: 240px;
    }
    .course-progress-value {
      display: flex;
      gap: 4px;
      font-weight: 600;
    }
    .course-progress-accent {
      color: #1a7ccd;
    }
    .course-module {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
      color: #8a9094;
    }
    .course-module-cta {
      color: #0f5aa4;
      font-weight: 600;
    }
    .course-empty {
      grid-column: 1 / -1;
      background: #ffffff;
      border-radius: 18px;
      padding: 32px;
      text-align: center;
      color: #6b7380;
      box-shadow: 0 14px 30px rgba(15, 42, 67, 0.08);
    }
    .course-empty-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #f1f6fb;
      margin: 0 auto 12px;
    }
    .course-empty-title {
      font-size: 16px;
      font-weight: 700;
      color: #0e3045;
    }
    .course-empty-text {
      margin-top: 6px;
      font-size: 13px;
    }

    .course-cta {
      display: none;
    }

    .tip {
      font-weight: 400;
      font-size: 14px;
      color: #8A9094;
      line-height: 22px;
      text-align: justify;
      font-style: normal;
      margin-top: 16px;
    }

    @media (max-width: 1024px) {
      .course-grid {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .course-hero {
        height: 420px;
        .course-hero-title {
          font-size: 32px;
        }
      }
      .course-grid {
        grid-template-columns: 1fr;
      }
      .course-search-row {
        max-width: 100%;
      }
    }
  }
</style>
