<template>
  <div class="vcontainer software-page">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container software-content">
      <div class="section intro-section">
        <div class="hero-title">Fetal Medicine Foundation Software</div>
        <ul class="section-list">
          <li>
            The FMF software is freely available to all healthcare professionals in all countries of the world.
          </li>
          <li>
            The software makes use of maternal information, ultrasound findings and maternal serum biomarkers as inputs
            to calculate risks for pregnancy complications. This risk determination supports the decision-making of the
            medical professional for further obstetric management of the pregnant patient.
          </li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title blue-title">Key Features</div>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-title">Calculation of risks</div>
            <ul class="section-list">
              <li>Trisomies 21, 18 and 13 in the first and second trimesters</li>
              <li>Preeclampsia in the first and second trimesters</li>
              <li>Small for gestational age neonates</li>
              <li>Spontaneous preterm birth based on medical history and cervical length</li>
              <li>Gestational diabetes mellitus</li>
              <li>Fetal anemia</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-title">Patient records</div>
            <ul class="section-list">
              <li>
                Allows recording of biometric and anatomical findings from serial visits and gives the option to create
                a report of your findings and recommendations.
              </li>
              <li>
                Presents reference charts for fetal biometry, amniotic fluid depth and uterine and fetal Dopplers.
              </li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-title">Audit and performance</div>
            <ul class="section-list">
              <li>
                Provides the ability to monitor your results and compare these to the desired standards.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title blue-title">Installation of software</div>
        <div class="subsection-title">Minimum System Requirements</div>
        <ul class="section-list">
          <li>Windows Version 11 and 8 core processor (or better)</li>
          <li>macOS Version 14 and Apple Silicon (M1 or better)</li>
          <li>Memory 16 GB</li>
          <li>Storage 512 GB NVMe</li>
        </ul>
        <div class="subsection-title">Recommended System Requirements</div>
        <ul class="section-list">
          <li>Windows Version 11 and 10 core processor (or better)</li>
          <li>macOS Version 14 and Apple Silicon (M3 or better)</li>
          <li>Memory 32 GB</li>
          <li>Storage 1 TB NVMe</li>
        </ul>
      </div>

      <div class="section download-section">
        <div class="section-title blue-title">Download</div>
        <div class="support-line">
          For support email:
          <a href="mailto:support@refractionx.com">support@refractionx.com</a>
        </div>
        <div class="download-grid">
          <a class="platform-link" :href="macDownloadUrl" target="_blank" rel="noopener" aria-label="Download for macOS">
            <svg class="platform-icon apple-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.18 12.01c.01-2.2 1.8-3.26 1.88-3.3-1.03-1.5-2.64-1.71-3.21-1.73-1.35-.14-2.65.8-3.34.8-.7 0-1.75-.78-2.88-.76-1.48.02-2.86.88-3.62 2.2-1.57 2.7-.4 6.69 1.1 8.87.75 1.07 1.62 2.26 2.76 2.22 1.1-.04 1.52-.7 2.86-.7 1.33 0 1.73.7 2.87.67 1.2-.02 1.95-1.08 2.67-2.16.86-1.23 1.2-2.45 1.21-2.51-.03-.01-2.29-.88-2.3-3.6zM13.97 5.55c.6-.74 1.01-1.74.9-2.76-.87.04-1.95.6-2.58 1.33-.56.65-1.06 1.7-.93 2.68.98.07 1.99-.5 2.61-1.25z" />
            </svg>
            <span class="platform-label">macOS</span>
          </a>
          <a class="platform-link" :href="windowsDownloadUrl" target="_blank" rel="noopener" aria-label="Download for Windows 11">
            <svg class="platform-icon windows-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2 4.6l9.2-1.3v8.1H2V4.6zm10.4-1.5L22 1.8v9.6h-9.6V3.1zM2 12.6h9.2v8.1L2 19.4v-6.8zm10.4 0H22v9.6l-9.6-1.4v-8.2z" />
            </svg>
            <span class="platform-label">Windows 11</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'FMFSoftwarePage',
    components: {
      TopBanner
    },
    data() {
      return {
        macDownloadUrl: 'https://fmf.refractionx.com/api/download/FMF-1.0.3-arm64.dmg',
        windowsDownloadUrl: 'https://fmf.refractionx.com/api/download/FMF-1.0.3-setup.exe',
        topBannerList: [{
          img: require('@/assets/img/software_header.jpeg'),
          title: '',
          desc: ''
        }]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .software-page {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }

  .software-content {
    gap: 28px;
    padding: 24px 16px 0;
    box-sizing: border-box;
  }

  .section {
    width: min(1200px, 100%);
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 6px 20px rgba(14, 48, 69, 0.06);
    color: #1f2d3d;
    box-sizing: border-box;
  }

  .hero-title {
    font-size: 32px;
    line-height: 1.2;
    font-weight: 700;
    color: #036fc0;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 24px;
    line-height: 1.25;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .blue-title {
    color: #036fc0;
  }

  .subsection-title {
    font-size: 20px;
    line-height: 1.25;
    color: #0e3045;
    font-weight: 600;
    margin: 8px 0 6px;
  }

  .section-list {
    margin: 0;
    padding-left: 22px;
    display: grid;
    gap: 8px;
    color: #4a5b67;
    font-size: 16px;
    line-height: 26px;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .feature-card {
    border: 1px solid #e5eef6;
    border-radius: 10px;
    padding: 16px;
    background: #fbfdff;
  }

  .feature-title {
    font-size: 19px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 10px;
  }

  .download-section {
    background: #ffffff;
    border: none;
    text-align: left;
  }

  .download-grid {
    margin-top: 16px;
    min-height: 150px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    align-items: center;
  }

  .platform-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    gap: 8px;
    min-height: 140px;
    border-radius: 8px;
    color: #1f5ea8;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .platform-link:hover {
    background-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-1px);
  }

  .platform-icon {
    width: 76px;
    height: 76px;
    fill: #3b6fb6;
  }

  .platform-label {
    font-size: 22px;
    line-height: 1.2;
    color: #1f5ea8;
    font-weight: 500;
  }

  .support-line {
    margin-top: 14px;
    color: #3b4e61;
    font-size: 16px;
  }

  .support-line a {
    color: #036fc0;
    text-decoration: none;
  }

  .support-line a:hover {
    text-decoration: underline;
  }

  @media (max-width: 1000px) {
    .feature-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .software-page {
      font-size: 16px;
    }

    .section {
      padding: 18px;
    }

    .hero-title {
      font-size: 26px;
    }

    .section-title {
      font-size: 22px;
    }

    .subsection-title {
      font-size: 18px;
    }

    .download-grid {
      grid-template-columns: 1fr;
      min-height: 0;
      gap: 6px;
    }

    .platform-link {
      min-height: 120px;
    }

    .platform-icon {
      width: 64px;
      height: 64px;
    }

    .platform-label {
      font-size: 20px;
    }

    .support-line {
      font-size: 16px;
      margin-top: 8px;
    }
  }
</style>
