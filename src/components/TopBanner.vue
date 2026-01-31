<template>
  <el-carousel
    v-if="height"
    :height="height"
    arrow="never"
    indicator-position="none"
    type="fade"
    :autoplay="true"
    :interval="5000"
    :loop="true">
    <template v-if="listData.length > 0">
      <el-carousel-item v-for="(item, index) in listData" :key="index">
        <div class="top-banner">
          <div class="top-banner-bg" :style="{backgroundImage: `url(${item.img})`}"></div>
          <div class="top-banner-content"> 
            <div class="title single-line">{{ listData[0].title || '' }}</div>
            <div class="subtitle" v-if="item.subTitle">{{ listData[0].subTitle }}</div>
            <div class="desc" v-if="item.desc">{{ listData[0].desc }}</div>
            <div class="desc homeMark" v-if="listData[0].homeMark">The main sources of income for The Fetal Medicine Foundation are <a style="color: #036fc0;" target="_blank" href="http://fetalmedicine.com/">The Fetal Medicine Centre</a> and <a target="_blank" style="color: #036fc0;" href="https://www.kingsfertility.co.uk/">King's Fertility</a> .</div>
          </div>
        </div>
      </el-carousel-item>
    </template>
    
  </el-carousel>
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
          return [{
            img: require('@/assets/img/home_top1.jpg'),
            title: 'Welcome to The Fetal Medicine Foundation',
            desc: 'The Fetal Medicine Foundation (FMF) is a Registered Charity that aims to improve the health of pregnant women and their babies through research and training in fetal medicine. The FMF with the support of an international group of experts, has introduced an educational programme both for healthcare professionals and doctors and in the last 30 years the FMF has donated more than £75 million for scholarships, research grants and setting up fetal medicine units in developing countries.',
            homeMark: true
          },
          {
            img: require('@/assets/img/home_top2.jpg'),
            title: 'Welcome to The Fetal Medicine Foundation',
            desc: 'The Fetal Medicine Foundation (FMF) is a Registered Charity that aims to improve the health of pregnant women and their babies through research and training in fetal medicine. The FMF with the support of an international group of experts, has introduced an educational programme both for healthcare professionals and doctors and in the last 30 years the FMF has donated more than £75 million for scholarships, research grants and setting up fetal medicine units in developing countries.',
            homeMark: true
          },
          {
            img: require('@/assets/img/home_top3.jpg'),
            title: 'Welcome to The Fetal Medicine Foundation',
            desc: 'The Fetal Medicine Foundation (FMF) is a Registered Charity that aims to improve the health of pregnant women and their babies through research and training in fetal medicine. The FMF with the support of an international group of experts, has introduced an educational programme both for healthcare professionals and doctors and in the last 30 years the FMF has donated more than £75 million for scholarships, research grants and setting up fetal medicine units in developing countries.',
            homeMark: true
          }]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
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
    opacity: 0;
    transition: opacity 1s ease-in-out;
    
    &.is-active {
      opacity: 1;
    }
  }
  
  .top-banner {
    position: relative;
    width: 100%;
    height: 100%;
    color: #ffffff;
    overflow: hidden;
    
    .top-banner-bg {
      position: absolute;
      inset: 0;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      transform: scale(1);
      transition: transform 10s ease;
    }

    .el-carousel__item.is-active & .top-banner-bg {
      transform: scale(1.05);
    }

    .top-banner-content {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1120px;
      height: 100%;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      align-items: stretch;
      text-align: left;
      justify-content: center;
      .title {
        font-size: 46px;
        font-weight: 700;
        font-family: Helvetica;
        letter-spacing: 0.3px;
        text-align: center;
        text-align-last: center;
      }
      .title.single-line {
        white-space: nowrap;
      }
      .subtitle {
        font-size: 20px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }
      .desc {
        width: 100%;
        font-family: Helvetica;
        font-weight: 400;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        line-height: 24px;
        text-align: left;
        text-align-last: left;
        font-style: normal;
        text-transform: none;
      }
      .homeMark{
        width: 100%;
        margin-top: 15px;
        text-align: left;
        text-align-last: left;
        a{
          font-weight: 400;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    .top-banner .top-banner-content {
      padding: 0 20px;
    }
    .top-banner .top-banner-content .title {
      font-size: 36px;
    }
    .top-banner .top-banner-content .title.single-line {
      white-space: normal;
    }
    .top-banner .top-banner-content .subtitle {
      font-size: 17px;
    }
    .top-banner .top-banner-content .desc,
    .top-banner .top-banner-content .homeMark {
      font-size: 14px;
      line-height: 22px;
    }
  }

  @media (max-width: 768px) {
    .top-banner .top-banner-content {
      padding: 0 16px;
      align-items: center;
      text-align: center;
    }
    .top-banner .top-banner-content .title {
      font-size: 28px;
    }
    .top-banner .top-banner-content .subtitle {
      font-size: 15px;
    }
    .top-banner .top-banner-content .desc,
    .top-banner .top-banner-content .homeMark {
      font-size: 13px;
      line-height: 20px;
      text-align: center;
      text-align-last: auto;
    }
  }

  @media (max-width: 480px) {
    .top-banner .top-banner-content .title {
      font-size: 24px;
    }
    .top-banner .top-banner-content .desc,
    .top-banner .top-banner-content .homeMark {
      font-size: 12px;
      line-height: 18px;
    }
  }
</style>
