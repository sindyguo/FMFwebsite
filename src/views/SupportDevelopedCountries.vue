<template>
  <div class="vcontainer support-developed">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container support-developed-content">
      <div class="section split-section">
        <div class="split-text">
          <div class="section-title">Southend University Hospital, UK</div>
          <div class="section-desc">
            The Fetal Medicine Foundation has made a major donation for the development and equipment of a specialist
            fetal medicine centre at
            <a class="section-link" href="https://www.mse.nhs.uk" target="_blank" rel="noopener">Southend University Hospital</a>.
          </div>
          <div class="section-desc">
            The new centre, which opened in 2015, aims to provide a high level of care for pregnant women and their
            unborn babies. The new centre is actively involved in research into pregnancy complications and in the
            training of doctors in fetal medicine. The doctors working in the unit are rotating into the fetal medicine
            unit at King's College Hospital, London.
          </div>
          <router-link class="hero-link" to="/look-for-life">
            <span class="hero-link-text">Click here to view FMF Look for Life program in developing countries</span>
            <i class="el-icon-right" aria-hidden="true"></i>
          </router-link>
        </div>
        <div class="split-carousel">
          <el-carousel height="320px" indicator-position="outside" arrow="hover" class="support-carousel">
            <el-carousel-item v-for="(img, idx) in carouselImages" :key="idx">
              <el-image :src="img" fit="cover" class="carousel-image" alt="Support in developed countries" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div class="section note-section">
        <div class="section-desc">
          The FMF has also donated high quality ultrasound machines to
          <a class="section-link" href="https://attikonhospital.gov.gr" target="_blank" rel="noopener">Atticon University Hospital</a>, Athens, Greece, and
          <a class="section-link" href="https://www.shso.org.cy/en/greeting/nosokomeio-archiepiskopou-makareiou-iii/" target="_blank" rel="noopener">Makarios Hospital for Women and Children</a>, Nicosia, Cyprus.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'SupportDevelopedCountriesPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/headers/look-for-life-header.jpeg'),
          title: 'Look for Life'
        }],
        carouselImages: [
          require('@/assets/img/support-developed/southend_400_001.jpg'),
          require('@/assets/img/support-developed/southend_400_003-2.png'),
          require('@/assets/img/support-developed/7d5f8dda-6b18-4076-a1d1-bc70156fedfe.png'),
          require('@/assets/img/support-developed/aa4d419a-e1b1-4e36-84e2-3b080108de1c.jpg')
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .support-developed {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    padding-top: 72px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }

  .support-developed-content {
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

  .section-title {
    font-size: 20px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
    text-align: justify;
    text-align-last: left;
  }

  .split-text {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .hero-link {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #0a6ecb;
    text-decoration: none;
  }

  .hero-link-text {
    text-decoration: underline;
  }

  .hero-link:hover {
    color: #085aa6;
  }

  .section-link {
    color: #036fc0;
    font-weight: 600;
  }

  .split-section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
    align-items: stretch;
  }

  .support-carousel {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(14, 48, 69, 0.12);
    background: #f6f9fc;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
  }

  .note-section {
    padding: 20px 24px;
  }

  @media (max-width: 900px) {
    .split-section {
      grid-template-columns: 1fr;
    }
  }

  ::v-deep .top-banner .top-banner-content {
    align-items: center;
    text-align: center;
    font-family: 'Helvetica', Arial, sans-serif;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
  }

  ::v-deep .top-banner .top-banner-bg {
    background-size: cover;
    background-color: transparent;
  }

  ::v-deep .top-banner .top-banner-content .title {
    letter-spacing: 0.3px;
    font-family: 'Helvetica', Arial, sans-serif;
    text-shadow: 0 2px 6px rgba(6, 32, 68, 0.7), 0 0 2px rgba(6, 32, 68, 0.9);
  }

  ::v-deep .top-banner .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 900px;
    font-family: 'Helvetica', Arial, sans-serif;
  }
</style>
