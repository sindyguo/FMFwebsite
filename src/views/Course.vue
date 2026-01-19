<template>
  <div class="fill vcontainer course">
    <section class="course-hero">
      <div class="course-hero-bg"></div>
      <div class="course-hero-overlay"></div>
      <div class="course-hero-content main-container">
        <div class="course-hero-title">Online Learning</div>
        <div class="course-hero-subtitle">
          Internet-based courses, free of charge, available in several languages.
        </div>
      </div>
    </section>

    <section class="course-welcome">
      <div class="main-container course-welcome-card">
        <div class="course-welcome-header">
          <div class="course-welcome-icon"></div>
          <div>
            <div class="course-welcome-title">FMF Online Learning</div>
            <div class="course-welcome-text">
              Welcome to FMF's central portal for online learning. Increase your knowledge,
              advance your career, and improve patient outcomes with clinically relevant education.
            </div>
          </div>
        </div>
        <div class="course-welcome-divider"></div>
        <div class="course-welcome-actions">
          <div>
            <div class="course-welcome-subtitle">Getting Started</div>
            <div class="course-welcome-text">
              If you are registered or have purchased a course, access your content by logging in
              using the same credentials as your FMF account.
            </div>
          </div>
          <div class="course-welcome-buttons">
            <button class="course-btn primary">My Activity</button>
          </div>
        </div>
      </div>
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
            <div class="course-card-media">
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
              <div class="course-card-meta">{{ item.moduleCount || 0 }} modules</div>
            </div>
            <div class="course-card-body">
              <div class="course-card-title" :title="item.categoryName">
                {{ item.categoryName }}
              </div>
              <div class="course-card-desc" v-html="item.content || ''"></div>
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

    <section class="course-cta">
      <div class="course-cta-inner main-container">
        <div class="course-cta-title">Start Your Learning Journey Today</div>
        <div class="course-cta-text">
          Access world-class fetal medicine education, completely free of charge.
        </div>
        <button class="course-cta-button">Browse All Courses</button>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'CoursePage',
    data() {
      return {
        listData: [],
        searchQuery: "",
        selectedCategory: "all"
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
      websiteCourseNavigationFn(categoryName) {
        const reqData = {
          categoryName: categoryName
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
      height: 260px;
      background: linear-gradient(120deg, #0b4b8d, #0f5aa4 55%, #0b4b8d);
      overflow: hidden;
      .course-hero-bg {
        position: absolute;
        inset: 0;
        background: url("#{$imgUrl}/course_hero.jpg") center/cover no-repeat;
        opacity: 0.25;
        transform: scale(1.02);
      }
      .course-hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(8, 40, 80, 0.82), rgba(10, 70, 120, 0.68));
      }
      .course-hero-content {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        color: #fff;
        .course-hero-title {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .course-hero-subtitle {
          margin-top: 8px;
          font-size: 16px;
          max-width: 680px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .course-welcome {
      margin-top: -12px;
      margin-bottom: 28px;
      position: relative;
      z-index: 2;
      .course-welcome-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 26px;
        box-shadow: 0 18px 34px rgba(15, 42, 67, 0.12);
      }
      .course-welcome-header {
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }
      .course-welcome-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: linear-gradient(135deg, #0f5aa4, #32a1ff);
      }
      .course-welcome-title {
        font-size: 22px;
        font-weight: 700;
        color: #0e3045;
      }
      .course-welcome-subtitle {
        font-size: 18px;
        font-weight: 700;
        color: #0e3045;
      }
      .course-welcome-text {
        margin-top: 6px;
        font-size: 14px;
        color: #6b7380;
        line-height: 22px;
        max-width: 880px;
      }
      .course-welcome-divider {
        margin: 18px 0;
        height: 1px;
        background: #e6edf5;
      }
      .course-welcome-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      .course-welcome-buttons {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
    }

    .course-btn {
      border-radius: 999px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 600;
      border: 1px solid transparent;
      cursor: pointer;
    }
    .course-btn.primary {
      background: #0f5aa4;
      color: #ffffff;
    }
    .course-btn.ghost {
      background: #ffffff;
      border-color: #0f5aa4;
      color: #0f5aa4;
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
      border-radius: 18px;
      box-shadow: 0 16px 32px rgba(15, 42, 67, 0.08);
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .course-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 22px 42px rgba(15, 42, 67, 0.14);
    }
    .course-card-media {
      position: relative;
      height: 140px;
      background: linear-gradient(135deg, #0b4b8d, #4aa6ff);
      overflow: hidden;
    }
    .course-card-media::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.24), transparent 55%);
    }
    .course-card-badges {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 1;
    }
    .course-card-meta {
      position: absolute;
      left: 16px;
      bottom: 14px;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      z-index: 1;
    }
    .course-card-body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: center;
    }
    .course-card-title {
      font-size: 18px;
      font-weight: 700;
      color: #0e3045;
      white-space: normal;
      word-break: break-word;
      text-align: center;
    }
    .course-card-desc {
      font-size: 13px;
      color: #6b7380;
      line-height: 20px;
      min-height: 0;
      word-break: break-word;
      text-align: center;
    }
    .course-card-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
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
      background: linear-gradient(120deg, #0b4b8d, #0f5aa4 55%, #0b4b8d);
      padding: 48px 0 56px;
      color: #fff;
      .course-cta-inner {
        text-align: center;
      }
      .course-cta-title {
        font-size: 28px;
        font-weight: 700;
      }
      .course-cta-text {
        margin-top: 8px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
      }
      .course-cta-button {
        margin-top: 20px;
        padding: 10px 24px;
        border-radius: 999px;
        border: none;
        background: #fff;
        color: #0f5aa4;
        font-weight: 700;
        cursor: pointer;
      }
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
      .course-welcome-actions {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 768px) {
      .course-hero {
        height: 220px;
        .course-hero-title {
          font-size: 32px;
        }
      }
      .course-grid {
        grid-template-columns: 1fr;
      }
      .course-welcome-card {
        padding: 20px;
      }
      .course-search-row {
        max-width: 100%;
      }
    }
  }
</style>
