<template>
  <div class="vcontainer research-publications">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container publications-content">
      <div class="section">
        <div class="section-header">
          <div class="section-heading">
            <router-link class="back-link" to="/research">
              <span class="back-arrow" aria-hidden="true"></span>
              Go back to Research
            </router-link>
          </div>
          <div class="filters">
            <div class="filter-item">
              <label class="filter-label" for="publication-year">Year</label>
              <select id="publication-year" v-model="form.year" class="filter-select" @change="changeYear">
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="filter-item search">
              <label class="filter-label" for="publication-search">Search</label>
              <div class="search-box">
                <input
                  id="publication-search"
                  v-model="form.search"
                  type="text"
                  placeholder="Search by title or author"
                  @input="onSearchInput">
                <button type="button" class="search-clear" @click="clearSearch">Clear</button>
              </div>
            </div>
          </div>
        </div>
        <!-- 替换为 Element UI 分页组件 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :current-page="form.pageNo"
            :page-size="form.pageSize"
            :total="total"
            @current-change="handlePageChange"
            class="">
          </el-pagination>
        </div>
        <div class="pub-list">
          <div v-for="(item, index) in publications" :key="index" class="pub-item">
            <a
              v-if="item.url"
              class="pub-title pub-title-link"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span v-html="highlightText(item.title, form.search)"></span>
            </a>
            <div
              v-else
              class="pub-title"
              v-html="highlightText(item.title, form.search)"
            ></div>
            <div class="pub-authors" v-html="highlightText(item.authors, form.search)"></div>
            <div class="pub-journal-container">
              <div class="pub-journal" v-html="highlightText(item.journal, form.search)"></div>
              <span class="pub-journal">{{ item.pages }}</span>
            </div>
            
          </div>
        </div>
        <div v-if="publications.length === 0" class="empty-state">
          No publications match the selected filters.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBanner from '@/components/TopBanner.vue'
import debounce from 'lodash/debounce'

export default {
  name: 'ResearchPublicationsPage',
  components: {
    TopBanner
  },
  data() {
    return {
      topBannerList: [{
        img: require('@/assets/img/headers/research-header.jpeg'),
        title: '',
        desc: ''
      }],
      publications: [],
      form: {
        pageNo: 1,
        pageSize: 10,
        year: 'All',
        search: ''
      },
      total: 0,
      yearOptions: ['All', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
      loading: false
    }
  },
  computed: {
    filteredPublications() {
      const keyword = this.form.search.trim().toLowerCase()
      const yearFilter = this.form.year
      return this.publications.filter((item) => {
        if (yearFilter !== 'All') {
          const year = this.getYear(item)
          if (year !== yearFilter) {
            return false
          }
        }
        if (!keyword) {
          return true
        }
        const haystack = `${item.title} ${item.authors} ${item.journal}`.toLowerCase()
        return haystack.includes(keyword)
      })
    }
  },
  methods: {
    getYear(item) {
      const match = (item.journal || '').match(/20\d{2}/)
      return match ? match[0] : ''
    },
    
    getPublications() {
      this.publications=[]
      const params = { ...this.form };
      if(params.year == 'All') {
        params.year = ''
      }
      this.$api.getResearchPublications(params).then(res => {
        this.publications = res.data.list || [];
        this.total = res.data.total || 0;
      })
    },
    handlePageChange(page) {
      this.form.pageNo = page
      this.getPublications()
    },
    changeYear() { 
      this.form.pageNo = 1; // 改变年份时重置到第一页
      this.getPublications()
    },
    onSearchInput: debounce(function () {
      this.form.pageNo = 1
      this.getPublications()
    }, 300),
    clearSearch() {
      this.form.search = ''
      this.form.pageNo = 1
      this.getPublications()
    },
    highlightText(text, keyword) {
      if (!keyword) return text;
      const regex = new RegExp(`(${keyword})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }
  },
  created() {
    this.getPublications()
  }
}
</script>

<style lang="scss" scoped>
.research-publications {
  background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
  padding-bottom: 48px;
  font-family: 'Helvetica', Arial, sans-serif;
  font-size: 16px;
}

.research-publications ::v-deep .top-banner .top-banner-content {
  align-items: center;
  text-align: center;
  justify-content: center;
}

.research-publications ::v-deep .top-banner .top-banner-content .title {
  margin: 0;
  text-shadow: 0 2px 6px rgba(6, 32, 68, 0.7), 0 0 2px rgba(6, 32, 68, 0.9);
}

/* Override global .main-container fixed width for responsive layout */
.publications-content {
  width: 100%;
  max-width: 1200px;
  gap: 28px;
  padding: 24px 16px 0;
  box-sizing: border-box;
}

.section {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(14, 48, 69, 0.06);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.section-heading {
  flex: 1 1 auto;
  min-width: 0;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-end;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}

.filter-item.search {
  min-width: 260px;
}

.filter-label {
  font-size: 15px;
  font-weight: 600;
  color: #0e3045;
}

.filter-select {
  border: 1px solid #dbe7f1;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 16px;
  color: #0e3045;
  background: #ffffff;
  height: 48px;
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dbe7f1;
  border-radius: 10px;
  padding: 6px 14px;
  background: #ffffff;
  height: 48px;
}

.search-box input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 0;
  font-size: 16px;
  color: #0e3045;
  background: transparent;
}

.search-clear {
  border: none;
  background: #f1f6fb;
  color: #036fc0;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.pub-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.pub-journal-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
}

.pub-item {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e6eef5;
  background: #f7fbff;
  word-break: break-word;
}

.pub-title {
  font-weight: 600;
  color: #0e3045;
  margin-bottom: 6px;
}

a.pub-title.pub-title-link {
  display: block;
  text-decoration: none;
  color: #0e3045;
  cursor: pointer;
}

a.pub-title.pub-title-link:hover {
  color: #036fc0;
  text-decoration: underline;
}

.pub-journal {
  color: #6b7380;
  font-size: 14px;
}

.pub-authors {
  color: #5a6773;
  font-size: 14px;
  margin-bottom: 6px;
}

.pagination {
  display: flex;
  margin-bottom: 16px;
}

.empty-state {
  color: #6b7380;
  font-size: 14px;
  margin-bottom: 16px;
}

.back-link {
  color: #036fc0;
  text-decoration: none;
  font-weight: bold;
}

/* 高亮样式 */
.pub-title,
.pub-authors,
.pub-journal {
  mark {
    background-color: #fff3b8;
    color: #000;
    font-weight: bold;
    padding: 0 2px;
    border-radius: 2px;
  }
}

/* ============================================================
   RESPONSIVE BREAKPOINTS
   ============================================================ */

/* Tablet: 768px ~ 1199px */
@media (max-width: 1199px) {
  .publications-content {
    padding: 20px 24px 0;
  }
}

/* Tablet & below: < 900px */
@media (max-width: 900px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .section-heading {
    min-width: 0;
  }
  .filters {
    justify-content: flex-start;
    gap: 12px;
  }
  .filter-item {
    flex: 1 1 160px;
    min-width: 0;
  }
  .filter-item.search {
    flex: 1 1 100%;
    min-width: 0;
  }
}

/* Mobile: < 768px */
@media (max-width: 767px) {
  .publications-content {
    padding: 16px 12px 0;
    gap: 16px;
  }
  .section {
    padding: 16px 14px;
    border-radius: 10px;
  }
  .filter-item {
    flex: 1 1 100%;
    min-width: 0;
  }
  .filter-label {
    font-size: 14px;
  }
  .filter-select {
    font-size: 15px;
    height: 44px;
  }
  .search-box {
    height: 44px;
  }
  .search-box input {
    font-size: 15px;
  }
  .pagination {
    justify-content: center;
  }
  .pub-item {
    padding: 10px 12px;
  }
  .pub-title {
    font-size: 15px;
  }
  .pub-authors,
  .pub-journal {
    font-size: 13px;
  }
}

/* Small mobile: < 480px */
@media (max-width: 479px) {
  .publications-content {
    padding: 12px 10px 0;
  }
  .section {
    padding: 14px 12px;
  }
  .search-clear {
    padding: 5px 10px;
    font-size: 13px;
  }
  .pub-title {
    font-size: 14px;
  }
}
</style>