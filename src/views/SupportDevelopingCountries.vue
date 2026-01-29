<template>
  <div class="vcontainer look-for-life">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container look-for-life-content">
      <div class="hero-card">
        <div class="hero-text">
          <div class="hero-title">Support in developing countries</div>
          <div class="hero-desc">
            Ultrasound can significantly improve outcomes for mothers and babies, but access is still largely limited
            to developed countries or wealthier populations in developing countries. Look for Life focuses on training
            local healthcare professionals in ultrasound and establishing specialist fetal medicine centers to reduce
            maternal and perinatal mortality.
          </div>
        </div>
        <div class="hero-image">
          <el-image :src="images.hero" fit="cover" alt="Look for Life" />
        </div>
      </div>

      <div class="section">
        <div class="section-title">Background</div>
        <div class="section-desc">
          The World Health Organization reports that more than 500,000 women die each year from complications of pregnancy
          and childbirth, with over 99% occurring in less developed or developing countries. Look for Life improves
          care for high-risk pregnancies through structured training and center development.
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-num">500k+</div>
            <div class="stat-label">Women dying each year from pregnancy/childbirth complications</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">99%+</div>
            <div class="stat-label">Occur in less developed or developing countries</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">2 years</div>
            <div class="stat-label">Fetal medicine fellowship training in London</div>
          </div>
        </div>
      </div>

      <div class="section action-section">
        <div class="section-title">Program actions</div>
        <div class="action-grid">
          <div class="action-item">Train local healthcare professionals in obstetric ultrasound</div>
          <div class="action-item">Establish specialist fetal medicine centers for high-risk care</div>
          <div class="action-item">Provide high-quality ultrasound equipment and center support</div>
          <div class="action-item">Send expert teams for teaching and hands-on guidance</div>
          <div class="action-item">Offer two-year fetal medicine fellowship training in London</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Supported countries and regions</div>
        <div class="country-tags">
          <span v-for="country in countries" :key="country" class="country-tag">
            {{ country }}
          </span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Field photos</div>
        <div class="gallery-grid">
          <div v-for="item in gallery" :key="item.src" class="gallery-item">
            <el-image :src="item.src" fit="cover" :alt="item.alt" class="gallery-image" />
            <div class="gallery-caption">{{ item.caption }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'SupportDevelopingCountriesPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/look_for_life_header.png'),
          title: 'Look for Life',
          desc: 'Support in developing countries'
        }],
        images: {
          hero: require('@/assets/img/look_for_life_hero.png')
        },
        countries: [
          'Rwanda',
          'Zimbabwe',
          'Ethiopia',
          'Armenia',
          'North Macedonia',
          'Moldavia',
          'Albania',
          'Kosovo'
        ],
        gallery: [
          {
            src: 'https://fetalmedicine.org/var/uploads/File/0/0/a/r/m/armenia.jpg',
            alt: 'Armenia',
            caption: 'Armenia'
          },
          {
            src: 'https://fetalmedicine.org/var/uploads/File/0/0/e/t/h/ethiopia3.jpg',
            alt: 'Ethiopia',
            caption: 'Ethiopia'
          },
          {
            src: 'https://fetalmedicine.org/var/uploads/File/0/0/a/l/b/albania5_crop.jpg',
            alt: 'Albania',
            caption: 'Albania'
          },
          {
            src: 'https://fetalmedicine.org/var/uploads/File/0/0/a/l/b/albania2_crop.jpg',
            alt: 'Albania',
            caption: 'Albania'
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .look-for-life {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
    padding-top: 72px;
  }

  .look-for-life-content {
    gap: 28px;
    padding: 24px 16px 0;
    box-sizing: border-box;
  }

  .hero-card {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    padding: 28px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(14, 48, 69, 0.08);
  }

  .hero-text {
    flex: 1 1 320px;
    min-width: 260px;
  }

  .hero-eyebrow {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #5c7a8d;
    margin-bottom: 8px;
  }

  .hero-title {
    font-size: 28px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .hero-desc {
    font-size: 20px;
    line-height: 30px;
    color: #465a67;
  }

  .hero-image {
    flex: 1 1 320px;
    min-width: 260px;
    border-radius: 12px;
    overflow: hidden;
  }

  .section {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 6px 20px rgba(14, 48, 69, 0.06);
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
  }

  .stat-grid {
    display: grid;
    gap: 16px;
    margin-top: 18px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .stat-card {
    padding: 16px;
    border-radius: 12px;
    background: linear-gradient(135deg, #f0f6ff 0%, #ffffff 100%);
    border: 1px solid #e6eef5;
  }

  .stat-num {
    font-size: 22px;
    font-weight: bold;
    color: #036fc0;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 14px;
    line-height: 20px;
    color: #5b6b77;
  }

  .action-section {
    background: linear-gradient(135deg, #f7fcff 0%, #ffffff 100%);
  }

  .action-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .action-item {
    padding: 12px 14px;
    border-radius: 10px;
    background: #f3f8fd;
    color: #0e3045;
    font-size: 14px;
  }

  .country-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .country-tag {
    padding: 6px 12px;
    border-radius: 999px;
    background: #eef6ff;
    color: #036fc0;
    font-size: 16px;
  }

  .gallery-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .gallery-item {
    border-radius: 12px;
    overflow: hidden;
    background: #f7fbff;
    display: flex;
    flex-direction: column;
  }

  .gallery-caption {
    padding: 10px 12px;
    font-size: 16px;
    line-height: 22px;
    color: #4a5b67;
    text-align: center;
    min-height: 20px;
  }

  .source-note {
    font-size: 16px;
    color: #8a9aa6;
    text-align: center;
    padding-bottom: 12px;
  }

  .gallery-image {
    width: 100%;
    height: 220px;
  }

  ::v-deep .gallery-image .el-image__inner {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ::v-deep .top-banner .top-banner-content {
    align-items: center;
    text-align: center;
    font-family: 'Helvetica', Arial, sans-serif;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
  }

  ::v-deep .top-banner .top-banner-content .title {
    letter-spacing: 0.3px;
    font-family: 'Helvetica', Arial, sans-serif;
  }

  ::v-deep .top-banner .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 900px;
    font-family: 'Helvetica', Arial, sans-serif;
  }
</style>
