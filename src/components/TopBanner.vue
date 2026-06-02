<template>
  <div class="top-banner-wrapper">
    <!-- Banner image + overlaid title/subtitle -->
    <div class="top-banner-container" :style="{ height: bannerHeight }">
      <el-carousel
        v-if="height"
        :height="bannerHeight"
        arrow="never"
        indicator-position="none"
        type="fade"
        :autoplay="true"
        :interval="8200"
        :loop="true"
        :initialIndex="0"
        ref="carouselRef"
        @change="handleCarouselChange"
        >
        <template v-if="listData.length > 0">
          <el-carousel-item v-for="(item, index) in listData" :key="index">
            <div class="top-banner-bg" :class="{needAnimate}" :style="{'background-image': `url('${item.img}')`}"></div>
          </el-carousel-item>
        </template>
      </el-carousel>

      <!-- Title & subtitle overlaid on the image, centered -->
      <div class="top-banner-content-fixed">
        <div class="vcontainer vcenter top-banner-content">
          <span class="title" v-html="listData[0]?.title"></span>
          <div class="vcontainer">
            <span class="subtitle" v-html="listData[0]?.subTitle"></span>
            <!-- desc shown here on desktop/tablet only -->
            <span class="desc desktop-desc" v-html="listData[0]?.desc"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Description shown below the image on mobile only -->
    <div class="mobile-desc-below" v-if="listData[0] && listData[0].desc" v-html="listData[0].desc"></div>
  </div>
</template>

<script>
  export default {
    name: 'TopBanner',
    props: {
      height: {
        type: String,
        default: '472px'
      },
      listData: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        isActiveIndex: 0,
        animationKey: 0,
        windowWidth: window.innerWidth,
      }
    },
    computed: {
      needAnimate() {
        let routers = ['/', '/congress', '/fmf-advances-courses']
        return routers.includes(this.$route.path)
      },
      /* Responsive banner height — replaces the broken Vue-2 v-bind(height) in CSS.
         On mobile the value controls both the carousel image and the overlaid title area. */
      bannerHeight() {
        const w = this.windowWidth
        if (w < 360)  return '180px'
        if (w < 480)  return '200px'
        if (w < 768)  return '220px'
        if (w < 1280) return '360px'
        return this.height   // ≥1280px: use the prop value unchanged
      }
    },
    mounted() {
      this.isActiveIndex = 0
      window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
    },
    methods: {
      onResize() {
        this.windowWidth = window.innerWidth
      },
      handleCarouselChange(index) {
        this.isActiveIndex = index
        this.animationKey += 1
      },
    }
  }
</script>

<style lang="scss" scoped>
  .top-banner-wrapper {
    width: 100%;
  }

  .top-banner-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    /* height is set via :style binding (Vue 2 compatible) */
  }
  
  .el-carousel {
    background-color: #eee !important;
  }
  
  .el-carousel ::v-deep .el-carousel__container {
    overflow: hidden;
  }
  
  .el-carousel ::v-deep .el-carousel__item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity 2s ease-in-out;
    
    &.is-active {
      opacity: 1;
    }
  }
  
  .top-banner-bg {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: scale(1);
    will-change: transform;
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
  }

  .el-carousel ::v-deep .el-carousel__item.is-active .needAnimate {
    animation: bannerScale 8s ease-out forwards;
  }

  @keyframes bannerScale {
    from { transform: scale(1); }
    to   { transform: scale(1.08); }
  }
  
  .top-banner-content-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2000;
    
    .top-banner-content {
      width: 1200px;
      height: 100%;
      margin: 0 auto;
      pointer-events: auto;
      justify-content: center;
      
      .title {
        font-size: 52px;
        font-weight: bold;
        text-align: center;
        font-family: Helvetica;
        margin-bottom: 32px;
        color: #ffffff;
      }
      .subtitle {
        font-size: 24px;
        color: #ffffff;
      }
      .desc {
        font-family: Helvetica;
        font-weight: 400;
        font-size: 18px;
        color: #FFFFFF;
        line-height: 26px;
        text-align: justify;
        font-style: normal;
        text-transform: none;
      }
      .homeMark {
        margin-top: 15px;
        a { pointer-events: auto; }
      }
    }
  }

  /* Description below the banner — mobile only */
  .mobile-desc-below {
    display: none;
  }

  /* ============================================================
     RESPONSIVE BREAKPOINTS
     ============================================================ */

  /* Tablet: 768px ~ 1279px */
  @media (min-width: 768px) and (max-width: 1279px) {
    .top-banner-content-fixed {
      .top-banner-content {
        width: 100%;
        padding: 0 32px;

        .title {
          font-size: 38px;
          margin-bottom: 20px;
        }
        .subtitle { font-size: 20px; }
        .desc { font-size: 16px; line-height: 24px; }
      }
    }
  }

  /* Mobile common: < 768px
     - Banner image keeps its fixed height (from bannerHeight)
     - Title/subtitle stay overlaid and centered on the image
     - .desktop-desc is hidden inside the overlay
     - .mobile-desc-below flows below the image */
  @media (max-width: 767px) {
    .top-banner-content-fixed {
      .top-banner-content {
        width: 100%;
        padding: 0 20px;
        justify-content: center;

        .title {
          font-size: 20px;
          margin-bottom: 6px;
          text-align: center;
        }
        .subtitle {
          font-size: 14px;
          text-align: center;
        }
        /* Hide desc from the overlay on mobile */
        .desktop-desc {
          display: none;
        }
      }
    }

    /* Show full description below the banner */
    .mobile-desc-below {
      display: block;
      background: rgb(235, 242, 254);
      color: #333;
      font-size: 13px;
      line-height: 1.7;
      padding: 16px 20px;
      text-align: left;
      word-break: break-word;

      ::v-deep a {
        color: #036fc0;
        pointer-events: auto;
      }
      ::v-deep p {
        margin: 0 0 8px;
      }
    }
  }

  /* Large phone: 480px ~ 767px */
  @media (min-width: 480px) and (max-width: 767px) {
    .top-banner-content-fixed .top-banner-content {
      .title    { font-size: 20px; }
      .subtitle { font-size: 14px; }
    }
    .mobile-desc-below { font-size: 13px; padding: 16px 20px; }
  }

  /* Small phone: 360px ~ 479px */
  @media (min-width: 360px) and (max-width: 479px) {
    .top-banner-content-fixed .top-banner-content {
      padding: 0 16px;
      .title    { font-size: 18px; }
      .subtitle { font-size: 13px; }
    }
    .mobile-desc-below { font-size: 12px; padding: 14px 16px; }
  }

  /* Very small: < 360px */
  @media (max-width: 359px) {
    .top-banner-content-fixed .top-banner-content {
      padding: 0 12px;
      .title    { font-size: 16px; }
      .subtitle { font-size: 12px; }
    }
    .mobile-desc-below { font-size: 11px; padding: 12px 12px; }
  }
</style>