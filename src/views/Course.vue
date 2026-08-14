<template>
  <div class="fill vcontainer course">
    <section class="course-hero">
      <TopBanner class="course-hero-banner" height="260px" :listData="topBannerList" />
    </section>

    <section class="course-library">
      <div class="main-container">
        <div class="course-completion-section">
          <div class="course-completion-title">
            List of healthcare professionals who have completed theoretical courses
          </div>
          <div class="course-completion-list">
            <button
              v-for="course in listData"
              :key="course.id || course.categoryName"
              class="completion-chip"
              type="button"
              @click="openCompletionMap(course)"
            >
              {{ course.categoryName }}
            </button>
          </div>
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

    <div v-if="isCompletionModalOpen" class="completion-modal" @click.self="closeCompletionModal">
      <div class="completion-modal-card">
        <div class="completion-modal-header">
          <div class="completion-modal-title">{{ selectedCompletionCourse.name }}</div>
          <button class="completion-modal-close" type="button" @click="closeCompletionModal">Close</button>
        </div>
        <div class="completion-modal-body">
          <div class="completion-map-layout">
            <div class="completion-map-panel">
              <div v-if="isCompletionMapLoading" class="completion-map-loading">Loading map data...</div>
              <div v-else ref="completionMap" class="completion-map"></div>
            </div>
            <div class="completion-list-panel">
              <div class="completion-list-title">
                <span>{{ completionCountryLabel }}</span>
                <span v-if="completionCountryCount !== null" class="completion-list-count">{{ completionCountryCount }}</span>
              </div>
              <div class="completion-list-subtitle">
                Click a country to view the list of course completers.
              </div>
              <div v-if="isCompletionCountryLoading" class="completion-list-loading">Loading completers...</div>
              <div v-else class="completion-list-content">
                <div
                  v-for="person in completionCountryPeople"
                  :key="person.id + person.name"
                  class="completion-person-row">
                  <span class="completion-person-name">{{ formatName(person.first_name, person.last_name) }}</span>
                  <span class="completion-person-id">{{ person.exam_time.slice(0,10) }}</span>
                </div>
                <div v-if="!completionCountryPeople.length" class="completion-empty-state">
                  Select a country to see its course completers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TopBanner from '@/components/TopBanner.vue'
  import * as echarts from 'echarts'

  export default {
    name: 'CoursePage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/online_course_header.png'),
          title: '',
          desc: ''
        }],
        listData: [],
        searchQuery: "",
        selectedCategory: "all",
        onlineCoursesPreset: [],
        selectedCompletionCourse: { name: 'Course completers', slug: '' },
        isCompletionModalOpen: false,
        isCompletionMapLoading: false,
        completionChartInstance: null,
        completionNameToCode: {},
        completionMapCounts: {},
        completionCountryLabel: 'No country selected',
        completionCountryCount: null,
        completionCountryPeople: [],
        isCompletionCountryLoading: false,
        completionWorldMap: null,
        currentCourse: null
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
        console.log(this.listData)
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
      formatName(first, last) {
        // 仅对纯英文单词做首字母大写、其余小写处理，非英文字符保持原样
        const fmt = w => {
          if (!w) return ''
          return /^[A-Za-z\s'-]+$/.test(w)
            ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
            : w
        }
        return [fmt(first), fmt(last)].filter(Boolean).join(' ')
      },
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
        // if (categoryName === 'Online Courses') {
        //   this.listData = [...this.onlineCoursesPreset].sort((a, b) => a.sort - b.sort)
        //   this.selectedCategory = 'all'
        //   return
        // }
        this.$api.websiteCourseNavigation(reqData).then(resp => {
          console.log('websiteCourseNavigation:', resp)
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
      },
      async openCompletionMap(course) {
        const slug = (course?.categoryName || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        this.selectedCompletionCourse = {
          name: course.categoryName || 'Course completers',
          slug
        }
        this.isCompletionModalOpen = true
        this.completionCountryLabel = 'No country selected'
        this.completionCountryCount = null
        this.completionCountryPeople = []
        this.isCompletionCountryLoading = false
        await this.$nextTick()
        await this.loadCompletionMapData(course)
        this.currentCourse = course
      },
      closeCompletionModal() {
        this.isCompletionModalOpen = false
        if (this.completionChartInstance) {
          this.completionChartInstance.dispose()
          this.completionChartInstance = null
        }
        window.removeEventListener('resize', this.resizeCompletionMap)
      },
      async loadCompletionMapData(course) {
        this.isCompletionMapLoading = true
        // const slug = this.selectedCompletionCourse.slug
        try {
          // const resp = await fetch(`/website/data/fmf-course-completions/${slug}_counts.json`, { cache: 'force-cache' })
          // const data = await resp.json()
          // this.completionMapCounts = data.counts || {}
          // console.log('completionMapCounts:', this.completionMapCounts)
          this.$api.getCourseCountry({courseId: course.id}).then(res=>{
            console.log('getCourseCountry:', res)
            this.completionMapCounts = res.data.counts || {}
            this.isCompletionMapLoading = false
            this.$nextTick(() => {
              this.initCompletionMap()
            })
          })
        } catch (err) {
          this.completionMapCounts = {}
        } finally {
          console.log('completionMapCounts:', this.completionMapCounts)
        }
      },
      async initCompletionMap() {
        if (!this.$refs.completionMap) {
          return
        }
        if (this.completionChartInstance) {
          this.completionChartInstance.dispose()
          this.completionChartInstance = null
        }
        const worldJson = await this.loadCompletionWorldMap()
        echarts.registerMap('world', worldJson)

        const formatter = new Intl.DisplayNames(['en'], { type: 'region' })
        const values = this.completionMapCounts
        const nameToCode = {}
        const mapData = Object.keys(values).map((code) => {
          let name = code
          if (code && code.length === 2 && formatter) {
            name = formatter.of(code) || code
          }
          nameToCode[name] = code
          return { name, value: values[code] }
        })
        this.completionNameToCode = nameToCode

        this.completionChartInstance = echarts.init(this.$refs.completionMap)
        this.completionChartInstance.setOption({
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: '#2E73BE',
            padding: [10, 15],
            textStyle: { color: '#455a64' },
            extraCssText: 'box-shadow: 0 4px 20px rgba(46, 115, 190, 0.15); border-radius: 8px; backdrop-filter: blur(4px);',
            formatter: (p) => (p.value ? `<b>${p.name}</b><br/><span style="color:#2E73BE; font-size:18px; font-weight:bold;">${p.value}</span> Completed` : p.name)
          },
          visualMap: {
            left: 40,
            bottom: 40,
            min: 0,
            max: Math.max(5, ...Object.values(values)),
            inRange: {
              color: ['#EBF5F7', '#C0D8E6', '#93B8D4', '#5F93C2', '#2E73BE']
            },
            text: ['High', 'Low'],
            textStyle: { color: '#5F93C2' },
            outOfRange: { color: '#ffffff' }
          },
          series: [{
            type: 'map',
            map: 'world',
            roam: true,
            zoom: 1.2,
            itemStyle: {
              areaColor: '#f3f9ff',
              borderColor: '#C0D8E6',
              borderWidth: 1,
              shadowColor: 'rgba(95, 147, 194, 0.15)',
              shadowBlur: 10,
              shadowOffsetY: 4
            },
            emphasis: {
              label: { show: false },
              itemStyle: {
                areaColor: '#C8ACD6',
                shadowBlur: 25,
                shadowColor: 'rgba(200, 172, 214, 0.6)',
                shadowOffsetX: 6,
                shadowOffsetY: 8
              }
            },
            select: {
              itemStyle: {
                areaColor: '#C8ACD6',
                shadowBlur: 0,
                shadowColor: 'transparent'
              }
            },
            data: mapData
          }]
        })

        this.completionChartInstance.on('click', (params) => {
          if (params.componentType !== 'series') return
          const code = this.completionNameToCode[params.name] || params.name
          console.log(params)
          this.loadCompletionCountryList(code, params.name)
        })
        this.completionChartInstance.getZr().on('click', (event) => {
          if (!event.target) {
            this.completionCountryLabel = 'No country selected'
            this.completionCountryCount = null
            this.completionCountryPeople = []
          }
        })
        window.addEventListener('resize', this.resizeCompletionMap)
      },
      resizeCompletionMap() {
        if (this.completionChartInstance) {
          this.completionChartInstance.resize()
        }
      },
      async loadCompletionWorldMap() {
        if (this.completionWorldMap) {
          return this.completionWorldMap
        }
        const resp = await fetch('/website/data/world.json')
        const data = await resp.json()
        this.completionWorldMap = data
        return data
      },
      async loadCompletionCountryList(code, name) {
        const count = this.completionMapCounts[code] ?? this.completionMapCounts[name]
        if (!count) {
          this.completionCountryLabel = 'No data for selected country'
          this.completionCountryCount = null
          this.completionCountryPeople = []
          return
        }
        this.isCompletionCountryLoading = true
        const slug = this.selectedCompletionCourse.slug
        console.log('loadCompletionCountryList:', slug, code, name)
        const countryKey = code && code.length <= 3 ? code : this.slugifyCountryName(name || code)
        try {
          console.log(slug, countryKey)
          // const resp = await fetch(`/website/data/fmf-course-completions/${slug}/${countryKey}.json`, { cache: 'force-cache' })
          this.$api.getCourseCountryUserList({courseId: this.currentCourse.id, country: name}).then(res=>{
            console.log('getCourseCountryUserList:', res)
            // const data = await resp.json()
            this.completionCountryLabel = res.data.country
            this.completionCountryCount = res.data.count || null
            this.completionCountryPeople = res.data.people || []
            console.log('completionCountryPeople:', this.completionCountryPeople)
          })
          // const data = await resp.json()
          // this.completionCountryLabel = data.country || name || code
          // this.completionCountryCount = data.count || null
          // this.completionCountryPeople = data.people || []
        } catch (err) {
          this.completionCountryLabel = 'Unable to load country data'
          this.completionCountryCount = null
          this.completionCountryPeople = []
        } finally {
          this.isCompletionCountryLoading = false
        }
      },
      slugifyCountryName(value) {
        if (!value) return ''
        return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
    },
    created() {
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
    // padding-top: 72px;
    min-height: calc(100% - 200px);
    background: #f5f7fb;
    .course-hero {
      position: relative;
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
    .course-completion-section {
      margin-bottom: 24px;
      padding: 18px 20px;
      border-radius: 16px;
      background: #ffffff;
      border: 1px solid #e6eef5;
      box-shadow: 0 8px 24px rgba(14, 48, 69, 0.08);
    }
    .course-completion-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f5aa4;
      margin-bottom: 14px;
    }
    .course-completion-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .completion-chip {
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid #d7e2ee;
      background: #f7fbff;
      color: #0e3045;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .completion-chip:hover {
      border-color: #036fc0;
      color: #036fc0;
      background: #eef6ff;
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
      background: #e6f1ff;
      color: #0f5aa4;
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

    .completion-modal {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 24px;
    }

    .completion-modal-card {
      width: min(1800px, 98vw);
      max-height: 98vh;
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .completion-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e6eef5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #f8fbff;
    }

    .completion-modal-title {
      font-size: 18px;
      font-weight: 700;
      color: #0e3045;
    }

    .completion-modal-close {
      border: none;
      background: #036fc0;
      color: #ffffff;
      border-radius: 999px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .completion-modal-body {
      padding: 20px 24px 24px;
      overflow: auto;
    }

    .completion-map-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.9fr) minmax(0, 0.9fr);
      gap: 20px;
    }

    .completion-map-panel,
    .completion-list-panel {
      background: #ffffff;
      border: 1px solid #e6eef5;
      border-radius: 14px;
      padding: 20px;
      min-height: 560px;
    }

    .completion-map {
      width: 100%;
      height: 560px;
      border-radius: 12px;
    }

    .completion-map-loading,
    .completion-list-loading {
      color: #6b7380;
      font-size: 14px;
      text-align: center;
      padding: 24px 0;
    }

    .completion-list-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 700;
      color: #0e3045;
      margin-bottom: 6px;
    }

    .completion-list-count {
      background: #e6f1ff;
      color: #036fc0;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
    }

    .completion-list-subtitle {
      font-size: 13px;
      color: #6b7380;
      margin-bottom: 12px;
    }

    .completion-list-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 480px;
      overflow: auto;
    }

    .completion-person-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 14px;
      color: #4a5b67;
      padding-bottom: 6px;
      border-bottom: 1px dashed #e6eef5;
    }

    .completion-person-name {
      font-weight: 600;
      color: #0e3045;
    }

    .completion-person-id {
      color: #6b7380;
      font-size: 12px;
    }

    .completion-empty-state {
      color: #8a9aa6;
      font-size: 13px;
      text-align: center;
      padding: 20px 0;
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
      .course-grid             { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
      .course-completion-title { font-size: 16px; }
      .course-results-title    { font-size: 20px; }
      .completion-map-layout   { grid-template-columns: 1fr; }
      .completion-map-panel,
      .completion-list-panel   { min-height: 420px; }
      .completion-map          { height: 420px; }
    }

    /* Large phone: 480px ~ 767px */
    @media (min-width: 480px) and (max-width: 767px) {
      .main-container {
        width: 100% !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .course-library            { padding: 8px 0 24px; }
      .course-completion-section { padding: 14px; margin-bottom: 16px; }
      .course-completion-title   { font-size: 15px; margin-bottom: 10px; }
      .completion-chip           { padding: 6px 12px; font-size: 12px; }
      .course-results-title      { font-size: 18px; }
      .course-results-sub        { font-size: 13px; }
      .course-grid               { grid-template-columns: 1fr; gap: 12px; }
      .course-card-body          { padding: 16px; gap: 8px; }
      .course-card-title         { font-size: 15px; }
      .course-card-desc          { font-size: 13px; line-height: 20px; }
      .completion-modal          { padding: 12px; }
      .completion-modal-header   { padding: 14px 16px; }
      .completion-modal-title    { font-size: 15px; }
      .completion-modal-body     { padding: 12px 14px 16px; }
      .completion-map-layout     { grid-template-columns: 1fr; gap: 12px; }
      .completion-map-panel,
      .completion-list-panel     { min-height: unset; padding: 14px; }
      .completion-map            { height: 280px; }
      .completion-list-content   { max-height: 320px; }
    }

    /* Small phone: 360px ~ 479px */
    @media (min-width: 360px) and (max-width: 479px) {
      .main-container {
        width: 100% !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .course-library            { padding: 6px 0 20px; }
      .course-completion-section { padding: 12px; margin-bottom: 14px; }
      .course-completion-title   { font-size: 14px; margin-bottom: 8px; }
      .completion-chip           { padding: 5px 10px; font-size: 11px; }
      .course-results-title      { font-size: 16px; }
      .course-results-sub        { font-size: 12px; }
      .course-grid               { grid-template-columns: 1fr; gap: 10px; }
      .course-card-body          { padding: 14px; gap: 7px; }
      .course-card-title         { font-size: 14px; }
      .course-card-desc          { font-size: 12px; line-height: 18px; }
      .course-badge              { font-size: 11px; padding: 4px 8px; }
      .completion-modal          { padding: 8px; }
      .completion-modal-header   { padding: 12px 14px; }
      .completion-modal-title    { font-size: 14px; }
      .completion-modal-body     { padding: 10px 12px 14px; }
      .completion-map-layout     { grid-template-columns: 1fr; gap: 10px; }
      .completion-map-panel,
      .completion-list-panel     { min-height: unset; padding: 12px; }
      .completion-map            { height: 240px; }
      .completion-list-content   { max-height: 280px; }
    }

    /* Very small: < 360px */
    @media (max-width: 359px) {
      .main-container {
        width: 100% !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
      .course-library            { padding: 6px 0 16px; }
      .course-completion-section { padding: 10px; margin-bottom: 12px; }
      .course-completion-title   { font-size: 13px; margin-bottom: 8px; }
      .completion-chip           { padding: 5px 9px; font-size: 11px; }
      .course-results-title      { font-size: 15px; }
      .course-results-sub        { font-size: 12px; }
      .course-grid               { grid-template-columns: 1fr; gap: 8px; }
      .course-card-body          { padding: 12px; gap: 6px; }
      .course-card-title         { font-size: 13px; }
      .course-card-desc          { font-size: 12px; line-height: 18px; }
      .course-badge              { font-size: 11px; padding: 3px 7px; }
      .completion-modal          { padding: 6px; }
      .completion-modal-header   { padding: 10px 12px; }
      .completion-modal-title    { font-size: 13px; }
      .completion-modal-body     { padding: 8px 10px 12px; }
      .completion-map-layout     { grid-template-columns: 1fr; gap: 8px; }
      .completion-map-panel,
      .completion-list-panel     { min-height: unset; padding: 10px; }
      .completion-map            { height: 200px; }
      .completion-list-content   { max-height: 240px; }
    }
  }
</style>
