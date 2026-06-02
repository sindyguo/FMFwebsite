<template>
  <div class="ch-container" ref="container">
    <!-- Mobile top bar -->
    <div class="ch-mobile-bar">
      <button class="ch-menu-toggle" @click="drawerOpen = !drawerOpen">
        <i :class="drawerOpen ? 'el-icon-close' : 'el-icon-s-unfold'"></i>
        <span>{{ drawerOpen ? 'Close' : 'Topics' }}</span>
      </button>
      <span class="ch-mobile-title">{{ articles.abstracts }}</span>
    </div>

    <!-- Overlay backdrop (mobile) -->
    <transition name="ch-fade">
      <div class="ch-overlay" v-if="drawerOpen" @click="drawerOpen = false"></div>
    </transition>

    <!-- Sidebar Navigation -->
    <div class="ch-sidebar" :class="{ 'ch-sidebar--open': drawerOpen }">
      <el-menu
        :default-active="activeIndex"
        class="ch-menu"
        @select="handleMenuSelect"
        router>
        <template v-for="(item, index) in articles.dataList">
          <el-submenu
            v-if="item.subDataList && item.subDataList.length > 0"
            :index="'congressHistory?year='+year+'&name='+item.Menu"
            :key="'sub-' + index">
            <template #title>{{ item.Menu }}</template>
            <el-menu-item
              v-for="(childItem, childIndex) in item.subDataList"
              :index="'congressHistory?year='+year+'&name='+childItem.Menu"
              :key="'child-' + childIndex">
              {{ childItem.Menu }}
            </el-menu-item>
          </el-submenu>

          <el-menu-item
            v-else
            :index="'congressHistory?year='+year+'&name='+item.Menu"
            :key="'item-' + index">
            {{ item.Menu }}
          </el-menu-item>
        </template>
      </el-menu>
    </div>

    <!-- Main Content -->
    <div class="ch-main" ref="mainContent">
      <div class="ch-header">
        <h1>{{ articles.abstracts }}, {{ articles.city }}, {{ articles.country }}</h1>
      </div>

      <div class="ch-article-list">
        <div
          v-for="(article, index) in currentArticles"
          :key="index"
          class="ch-article-item">
          <el-link :href="getArticleUrl(article)" type="primary" target="_blank">
            <div class="ch-link-box">
              <i class="el-icon-document"></i>
              <span class="ch-pdf-title">{{ article.contents }}</span>
            </div>
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CongressContent',
  data() {
    return {
      activeIndex: '',
      articles: [],
      currentArticles: [],
      selectedMenuItem: null,
      drawerOpen: false,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200
    }
  },
  computed: {
    year() {
      return this.$route.query.year
    },
    baseUrl() {
      return window.location.origin + process.env.VUE_APP_BASE_API
    },
    isMobile() {
      return this.windowWidth < 768
    }
  },
  methods: {
    getArticleUrl(article) {
      if (article.fileSource === 'abstracts') {
        return this.baseUrl + '/app-api/fmf/user/congress' + article.pdfUrl
      }
      if (article.fileSource === 'presentation_file') {
        return article.pdfUrl
      }
      return this.baseUrl + '/' + article.pdfUrl
    },
    handleMenuSelect(key) {
      const selectedItem = this.findSelectedItem(key)
      if (!selectedItem) return
      this.currentArticles = selectedItem.contentList || []
      this.selectedMenuItem = selectedItem
      this.drawerOpen = false
      this.$nextTick(() => {
        if (this.$refs.container) this.$refs.container.scrollTop = 0
        if (this.$refs.mainContent) this.$refs.mainContent.scrollTop = 0
        const mainPageDom = document.querySelector('.mainPage')
        if (mainPageDom) mainPageDom.scrollTo(0, 0)
      })
    },
    findSelectedItem(key) {
      const year = this.$route.query.year
      for (const item of this.articles.dataList) {
        if (`congressHistory?year=${year}&name=${item.Menu}` === key) {
          return item
        }
        if (item.subDataList) {
          for (const subItem of item.subDataList) {
            if (`congressHistory?year=${year}&name=${subItem.Menu}` === key) {
              return { ...subItem, parent: item }
            }
          }
        }
      }
      return null
    },
    handleResize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth >= 768) {
        this.drawerOpen = false
      }
    }
  },
  created() {
    const year = this.$route.query.year
    const vuexData = this.$store.getters['congress/getCongressDataByYear'](year)
    const yearData = vuexData || (this.$dataCom.data && this.$dataCom.data[year])
    if (yearData && yearData.dataList && yearData.dataList.length) {
      this.articles = yearData
      this.activeIndex = `congressHistory?year=${year}&name=` + yearData.dataList[0].Menu
      this.currentArticles = yearData.dataList[0].contentList || []
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
/* ── Base layout ─────────────────────────────────────────── */
.ch-container {
  display: flex;
  height: calc(100% - 108px) !important;
  min-height: auto !important;
  margin: 92px 100px 20px 100px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

/* ── Mobile top bar (hidden on desktop) ──────────────────── */
.ch-mobile-bar {
  display: none;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.ch-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}

.ch-menu {
  height: 100%;
  border-right: none;
}

/* ── Main content ────────────────────────────────────────── */
.ch-main {
  flex: 1;
  padding: 20px 28px;
  background: #ffffff;
  overflow-y: auto;
  min-width: 0;
}

/* ── Header ──────────────────────────────────────────────── */
.ch-header {
  margin-bottom: 20px;
}

.ch-header h1 {
  color: #036fc0;
  font-size: 24px;
  margin: 0;
  line-height: 1.4;
}

/* ── Article list ────────────────────────────────────────── */
.ch-article-list {
  margin-top: 20px;
}

.ch-article-item {
  border-bottom: 1px solid #e4e7ed;
}

.ch-article-item:last-child {
  border-bottom: none;
}

.ch-link-box {
  display: flex;
  align-items: flex-start;
}

.el-link {
  display: block;
  padding: 18px 0;
  color: #303133;
  text-decoration: none;
  font-size: 16px;
  width: 100%;
}

.el-link:hover {
  color: #036fc0;
}

.el-icon-document {
  margin-right: 8px;
  margin-top: 4px;
  flex-shrink: 0;
  color: #f56c6c;
  font-size: 14px;
}

.ch-pdf-title {
  flex: 1;
  cursor: pointer;
  line-height: 1.6;
  word-break: break-word;
}

/* ── Overlay ─────────────────────────────────────────────── */
.ch-overlay {
  display: none;
}

/* ── Font size override for el-menu ─────────────────────── */
:deep(.el-submenu__title),
:deep(.el-menu-item) {
  font-size: 16px !important;
}

/* ── Fade transition ─────────────────────────────────────── */
.ch-fade-enter-active,
.ch-fade-leave-active {
  transition: opacity 0.25s;
}
.ch-fade-enter,
.ch-fade-leave-to {
  opacity: 0;
}

/* ── Tablet (768px – 1199px) ─────────────────────────────── */
@media (max-width: 1199px) {
  .ch-container {
    margin: 92px 24px 20px 24px;
  }

  .ch-sidebar {
    width: 220px;
  }

  .ch-main {
    padding: 20px;
  }

  .ch-header h1 {
    font-size: 20px;
  }
}

/* ── Mobile (< 768px) ────────────────────────────────────── */
@media (max-width: 767px) {
  /* Container becomes a single column, full-height natural flow */
  .ch-container {
    flex-direction: column;
    height: auto !important;
    min-height: calc(100vh - 70px) !important;
    margin: 70px 0 0 0;
    border-radius: 0;
    overflow: visible;
  }

  /* Show top bar on mobile */
  .ch-mobile-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #ffffff;
    border-bottom: 1px solid #e4e7ed;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .ch-menu-toggle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border: 1px solid #036fc0;
    border-radius: 4px;
    background: transparent;
    color: #036fc0;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }

  .ch-menu-toggle:hover {
    background: #036fc0;
    color: #fff;
  }

  .ch-mobile-title {
    flex: 1;
    font-size: 13px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Sidebar as slide-in drawer */
  .ch-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    z-index: 1001;
    transform: translateX(-100%);
    transition: transform 0.28s ease;
    overflow-y: auto;
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.18);
  }

  .ch-sidebar--open {
    transform: translateX(0);
  }

  /* Backdrop overlay */
  .ch-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1000;
  }

  /* Main content fills the column */
  .ch-main {
    overflow: visible;
    padding: 16px;
  }

  .ch-header h1 {
    font-size: 18px;
  }

  .el-link {
    font-size: 15px;
    padding: 14px 0;
  }

  :deep(.el-submenu__title),
  :deep(.el-menu-item) {
    font-size: 15px !important;
  }
}
</style>
