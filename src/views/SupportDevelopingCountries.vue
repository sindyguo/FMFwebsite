<template>
  <div class="vcontainer look-for-life">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container look-for-life-content">
      <div class="hero-card">
        <div class="hero-text">
          <div class="hero-title">FMF Look for Life programme</div>
          <div class="hero-desc">
            <p>
              Ultrasound has the potential to substantially improve outcomes for mothers and babies. However, access to
              high quality ultrasound services remains largely limited to high-income countries or to more affluent
              populations within low- and middle-income countries.
            </p>
            <p>
              The FMF Look for Life Programme addresses this inequality by strengthening local capacity in maternal and
              fetal healthcare. The programme focuses on training healthcare professionals in ultrasound and supporting
              the development of specialist fetal medicine centres, enabling the delivery of high-level care for
              pregnant women and their unborn babies. The ultimate goal is to reduce maternal and perinatal morbidity
              and mortality through early detection, accurate diagnosis, and appropriate clinical management.
            </p>
          </div>
        </div>
        <div class="hero-image">
          <el-image :src="images.hero" fit="cover" alt="Look for Life" />
        </div>
      </div>

      <div class="section">
        <div class="section-title blue-title">Centre development</div>
        <ul class="section-list">
          <li>
            The FMF has supported the establishment of specialist fetal medicine centres within university hospitals in the
            capital cities of <span class="highlight-blue">Albania, Armenia, Ethiopia, Kosovo, Moldova, North Macedonia, Rwanda, and Zimbabwe</span>.
            These centres are equipped with high-quality ultrasound machines and IT infrastructure, and are supported by
            FMF expert teams who provide structured training, on-site teaching, and hands-on clinical guidance. This approach
            ensures sustainable skills transfer and the long-term development of local expertise.
          </li>
          <li>
            In addition, the FMF has made a major investment in the development and equipping of a specialist fetal
            medicine centre at <span class="highlight-blue">Southend University Hospital</span>, Southend-on-Sea, UK. The
            centre is actively engaged in research into pregnancy complications and in the training of doctors in fetal
            medicine. Clinicians based at Southend undertake specialist training rotations at the fetal medicine unit at
            King’s College Hospital, London, supporting knowledge exchange and the development of advanced clinical
            skills.
          </li>
        </ul>
        <div class="section-subtitle">Centres' photo gallery</div>
        <div class="gallery-marquee" ref="galleryMarquee">
          <div class="gallery-track">
            <div v-for="(item, idx) in galleryLoop" :key="`${item.src}-${idx}`" class="gallery-item">
              <el-image :src="item.src" fit="cover" :alt="item.alt" class="gallery-image" />
              <div class="gallery-caption">{{ item.caption }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title blue-title">Donation of ultrasound machines</div>
        <div class="section-desc">
          The FMF has donated high quality ultrasound machines to
          <span class="highlight-blue">Atticon University Hospital</span>,
          Athens, Greece, and
          <span class="highlight-blue">Makarios III Hospital for Women and Children</span>,
          Nicosia, Cyprus.
        </div>
      </div>

      <div class="section">
        <div class="section-title blue-title">Training fellowships</div>
        <ul class="section-list">
          <li>
            Through its international fellowship and training programmes, the FMF has supported the advanced training of
            over 1,000 healthcare professionals from around the world through FMF-funded fellowships and educational grants,
            helping to strengthen maternal and perinatal care globally.
          </li>
          <li>
            Each year, the FMF also hosts more than 500 clinical observers from multiple countries, reinforcing its role as
            a global centre for education, skills transfer, and international collaboration in fetal medicine.
          </li>
        </ul>
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
          img: require('@/assets/img/look_for_life_header.jpeg'),
          title: ''
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
            src: require('@/assets/img/look_for_life/southend_400_001.jpg'),
            alt: 'Southend University Hospital',
            caption: 'Southend University Hospital'
          },
          {
            src: require('@/assets/img/look_for_life/southend_400_003-2.jpg'),
            alt: 'Southend University Hospital',
            caption: 'Southend University Hospital'
          },
          {
            src: require('@/assets/img/look_for_life/aa4d419a-e1b1-4e36-84e2-3b080108de1c.jpg'),
            alt: 'Southend University Hospital',
            caption: 'Southend University Hospital'
          },
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
    },
    computed: {
      galleryLoop() {
        return [...this.gallery, ...this.gallery]
      }
    },
    mounted() {
      this.$nextTick(() => {
        const container = this.$refs.galleryMarquee
        if (!container) return

        const updateItemWidth = () => {
          const gap = 16
          const width = container.clientWidth
          const perRow = width < 600 ? 1 : (width < 900 ? 2 : 4)
          const itemWidth = Math.max(160, (width - gap * (perRow - 1)) / perRow)
          container.style.setProperty('--gallery-item-width', `${itemWidth}px`)
          this.galleryStep = itemWidth + gap
        }

        updateItemWidth()
        this.onGalleryResize = updateItemWidth
        window.addEventListener('resize', this.onGalleryResize)

        const firstItem = container.querySelector('.gallery-item')
        if (!firstItem) return
        if (!this.galleryStep) {
          this.galleryStep = firstItem.offsetWidth + 16
        }
        this.galleryTimer = setInterval(() => {
          const halfWidth = container.scrollWidth / 2
          if (container.scrollLeft >= halfWidth) {
            container.scrollLeft = 0
          }
          container.scrollTo({
            left: container.scrollLeft + this.galleryStep,
            behavior: 'smooth'
          })
        }, 2500)
      })
    },
    beforeDestroy() {
      if (this.galleryTimer) {
        clearInterval(this.galleryTimer)
        this.galleryTimer = null
      }
      if (this.onGalleryResize) {
        window.removeEventListener('resize', this.onGalleryResize)
        this.onGalleryResize = null
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
    // padding-top: 72px;
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
    padding: 14px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(14, 48, 69, 0.08);
  }

  .hero-text {
    flex: 1 1 320px;
    min-width: 260px;
    display: flex;
    flex-direction: column;
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
    font-size: 16px;
    line-height: 26px;
    color: #465a67;
    text-align: justify;
    text-align-last: left;
  }

  .hero-desc p {
    margin: 0 0 12px;
  }

  .hero-desc p:last-child {
    margin-bottom: 0;
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
    padding: 12px;
    box-shadow: 0 6px 20px rgba(14, 48, 69, 0.06);
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .blue-title {
    color: #036FC0;
  }

  .section-subtitle {
    margin: 32px 0 10px;
    font-size: 16px;
    font-weight: 600;
    color: #0e3045;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
    text-align: justify;
  }

  .section-list {
    margin: 0 0 0 18px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #4a5b67;
    font-size: 16px;
    line-height: 26px;
  }
  .section-list li {
    text-align: justify;
  }
  .section-list li::marker {
    color: #036fc0;
  }

  .inline-link {
    color: #036fc0;
    font-weight: 600;
    text-decoration: none;
  }

  .highlight-blue {
    color: #036fc0;
    font-weight: 600;
  }

  .gallery-image {
    width: 100%;
    height: 220px;
    border-radius: 12px;
    overflow: hidden;
  }

  ::v-deep .gallery-image .el-image__inner {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gallery-marquee {
    overflow: hidden;
    width: 100%;
  }

  .gallery-track {
    display: flex;
    gap: 16px;
    width: max-content;
  }

  .gallery-item {
    flex: 0 0 var(--gallery-item-width, 220px);
    max-width: var(--gallery-item-width, 220px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gallery-caption {
    margin-top: 8px;
    font-size: 14px;
    color: #036fc0;
    text-align: center;
  }

  /* ============================================================
     RESPONSIVE BREAKPOINTS
     ============================================================ */

  /* Mobile common: remove justify alignment */
  @media (max-width: 767px) {
    .hero-desc,
    .hero-desc p,
    .section-desc,
    .section-list li  { text-align: left !important; }
  }

  /* Tablet: 768px ~ 1279px */
  @media (min-width: 768px) and (max-width: 1279px) {
    .main-container {
      width: 100% !important;
      padding-left: 32px !important;
      padding-right: 32px !important;
    }
    .hero-title { font-size: 24px; }
  }

  /* Large phone: 480px ~ 767px */
  @media (min-width: 480px) and (max-width: 767px) {
    .main-container {
      width: 100% !important;
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    .look-for-life-content { gap: 20px; padding: 16px 0 0; }
    .hero-card  { gap: 16px; padding: 12px; }
    .hero-text,
    .hero-image { flex: 1 1 100%; min-width: 0; }
    .hero-image { max-height: 220px; }
    .hero-title { font-size: 20px; margin-bottom: 10px; }
    .hero-desc  { font-size: 14px; line-height: 22px; }
    .section    { padding: 14px 12px; }
    .section-title    { font-size: 16px; }
    .section-subtitle { font-size: 14px; margin: 20px 0 8px; }
    .section-desc,
    .section-list     { font-size: 14px; line-height: 22px; }
    .gallery-image    { height: 160px; }
    .gallery-caption  { font-size: 12px; }
  }

  /* Small phone: 360px ~ 479px */
  @media (min-width: 360px) and (max-width: 479px) {
    .main-container {
      width: 100% !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
    }
    .look-for-life-content { gap: 16px; padding: 12px 0 0; }
    .hero-card  { gap: 12px; padding: 10px; }
    .hero-text,
    .hero-image { flex: 1 1 100%; min-width: 0; }
    .hero-image { max-height: 200px; }
    .hero-title { font-size: 18px; margin-bottom: 8px; }
    .hero-desc  { font-size: 13px; line-height: 20px; }
    .section    { padding: 12px 10px; }
    .section-title    { font-size: 15px; }
    .section-subtitle { font-size: 13px; margin: 16px 0 6px; }
    .section-desc,
    .section-list     { font-size: 13px; line-height: 20px; }
    .gallery-image    { height: 140px; }
    .gallery-caption  { font-size: 11px; }
  }

  /* Very small: < 360px */
  @media (max-width: 359px) {
    .main-container {
      width: 100% !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    .look-for-life-content { gap: 12px; padding: 10px 0 0; }
    .hero-card  { gap: 10px; padding: 8px; }
    .hero-text,
    .hero-image { flex: 1 1 100%; min-width: 0; }
    .hero-image { max-height: 180px; }
    .hero-title { font-size: 16px; margin-bottom: 8px; }
    .hero-desc  { font-size: 12px; line-height: 18px; }
    .section    { padding: 10px 8px; }
    .section-title    { font-size: 14px; }
    .section-subtitle { font-size: 12px; margin: 14px 0 6px; }
    .section-desc,
    .section-list     { font-size: 12px; line-height: 18px; }
    .gallery-image    { height: 120px; }
    .gallery-caption  { font-size: 11px; }
  }

  .carousel-image {
    width: 100%;
    height: 100%;
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
    text-shadow: 0 2px 6px rgba(6, 32, 68, 0.7), 0 0 2px rgba(6, 32, 68, 0.9);
  }

  ::v-deep .top-banner .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 900px;
    font-family: 'Helvetica', Arial, sans-serif;
  }
</style>
