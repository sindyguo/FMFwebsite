<template>
  <div class="main mainPage" 
  ref="mainPage">
    <HeaderPage
      v-if="$route.name != 'exam'"
      ref="headerPage"
      :isTransparent="($route.path == '/' || $route.path == '/congress' ) && isHeaderTransparent">
    </HeaderPage>
    <router-view class="centerBox"></router-view>
    <FooterPage v-if="$route.name != 'exam' && $route.name != 'courseDetail'"></FooterPage>
    <ProfileIncompleteDialog :visible.sync="profileDialogVisible" />
  </div>
</template>

<script>
  import HeaderPage from '@/components/Header.vue'
  import FooterPage from '@/components/Footer.vue'
  import ProfileIncompleteDialog from '@/components/ProfileIncompleteDialog.vue'

  const PROFILE_CHECK_ROUTES = [
    { path: '/mine' },
    { path: '/course', query: 'categoryName', queryValue: 'Online Courses' },
    { path: '/courseDetail' }
  ]

  export default {
    name: 'MainPage',
    components: {
      HeaderPage,
      FooterPage,
      ProfileIncompleteDialog
    },
    data() {
      return {
        isHeaderTransparent: true,
        headerHeight: 104,
        profileDialogVisible: false
      }
    },
    computed: {
      isLogin() {
        return this.$store.getters['user/isLogin']
      }
    },
    mounted() {
      this.mainPageDom = document.querySelector('.mainPage')
      this.mainPageDom.addEventListener('scroll', this.handleScroll)
      this.$nextTick(() => {
        if (this.$refs.headerPage?.$el) {
          this.headerHeight = this.$refs.headerPage.$el.offsetHeight
        }
        // Check if coming from a fresh login
        if (localStorage.getItem('pendingProfileCheck') === '1') {
          localStorage.removeItem('pendingProfileCheck')
          this.checkProfileAndShow()
        }
      })
    },
    watch: {
      '$route'(to) {
        this.mainPageDom.scrollTop = 0;
        this.checkRouteForProfileDialog(to)
      },
      isLogin(val) {
        if (!val) {
          this.profileDialogVisible = false
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll() {
        this.isHeaderTransparent = this.mainPageDom.scrollTop <= 30;
      },
      isProfileIncomplete() {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
          return !!localStorage.getItem('token') && (!userInfo.firstName || !userInfo.lastName)
        } catch {
          return false
        }
      },
      checkProfileAndShow() {
        if (this.isProfileIncomplete()) {
          this.profileDialogVisible = true
        }
      },
      checkRouteForProfileDialog(route) {
        const matched = PROFILE_CHECK_ROUTES.some(r => {
          if (route.path !== r.path) return false
          if (r.query) return route.query[r.query] === r.queryValue
          return true
        })
        if (matched) {
          this.$nextTick(() => this.checkProfileAndShow())
        } else {
          this.profileDialogVisible = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    width: 100%;
    height: 100%;
  }
  .mainPage {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .centerBox{
    min-height: calc(100% - 200px);
    margin-top: 72px;
  }
</style>
