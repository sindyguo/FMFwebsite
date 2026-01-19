<template>
  <div class="main mainPage">
    <HeaderPage
      v-if="$route.name != 'exam'"
      ref="headerPage"
      :isTransparent="($route.path == '/' || $route.path == '/congress' ) && isHeaderTransparent">
    </HeaderPage>
    <router-view class="centerBox"></router-view>
    <FooterPage v-if="$route.name != 'exam'"></FooterPage>
  </div>
</template>

<script>
  import HeaderPage from '@/components/Header.vue'
  import FooterPage from '@/components/Footer.vue'
  export default {
    name: 'MainPage',
    components: {
      HeaderPage,
      FooterPage
    },
    data() {
      return {
        isHeaderTransparent: true,
        headerHeight: 104
      }
    },
    mounted() {
      this.mainPageDom = document.querySelector('.mainPage')
      this.mainPageDom.addEventListener('scroll', this.handleScroll)
      this.$nextTick(() => {
        if (this.$refs.headerPage?.$el) {
          this.headerHeight = this.$refs.headerPage.$el.offsetHeight
        }
      })
    },
    watch: {
      '$route.path'() {
        this.mainPageDom.scrollTop = 0;
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll() {
        this.isHeaderTransparent = this.mainPageDom.scrollTop <= 30;
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
  }
</style>
