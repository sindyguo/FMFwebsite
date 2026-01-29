<template>
  <div class="vcontainer certification-page">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container certification-content">
      <div class="section">
        <div class="section-title">FMF Certification</div>
        <div class="section-desc">
          Complete the corresponding online course and pass the exam to obtain the certificate.
          Certificate holders are listed in the FMF global registry.
        </div>
        <div class="card-grid">
          <div
            v-for="item in certifications"
            :key="item.name"
            class="cert-card"
            @click="openMap(item)">
            <div class="cert-title">{{ item.name }}</div>
            <div class="cert-desc">Online course + exam required</div>
            <div class="cert-action">View certified practitioners map</div>
          </div>
        </div>
      </div>

      <div class="section map-note">
        Hover over a country to view the number of certified practitioners. Click a country to see the full list.
      </div>
    </div>

    <div v-if="isModalOpen" class="cert-modal" @click.self="closeModal">
      <div class="cert-modal-card">
        <div class="cert-modal-header">
          <div class="cert-modal-title">{{ selectedCertification.name }}</div>
          <button class="cert-modal-close" type="button" @click="closeModal">Close</button>
        </div>
        <div class="cert-modal-body">
          <iframe
            class="cert-modal-frame"
            :src="selectedCertification.mapUrl"
            title="FMF Certification Map"
            loading="lazy">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'FMFCertificationPage',
    components: {
      TopBanner
    },
    data() {
      const certifications = [
        {
          name: 'Nuchal translucency scan',
          mapUrl: 'https://fetalmedicine.org/lists/map/certified/NT'
        },
        {
          name: 'Preeclampsia screening',
          mapUrl: 'https://fetalmedicine.org/lists/map/certified/Ut'
        },
        {
          name: 'Cervical assessment',
          mapUrl: 'https://fetalmedicine.org/lists/map/certified/cervical-assessment'
        },
        {
          name: 'Fetal abnormalities',
          mapUrl: 'https://fetalmedicine.org/lists/map/certified/fetal-abnormalities'
        },
        {
          name: 'Fetal echocardiography',
          mapUrl: 'https://fetalmedicine.org/lists/map/certified/fetal-echocardiography'
        },
        {
          name: 'Doppler ultrasound',
          mapUrl: 'https://fetalmedicine.org/lists/map/certified/fetal-doppler-ultrasound'
        }
      ]

      return {
        topBannerList: [{
          img: require('@/assets/img/world_congress_top.png'),
          title: 'FMF Certification',
          desc: 'International certification and accredited practitioners'
        }],
        certifications,
        selectedCertification: certifications[0],
        isModalOpen: false
      }
    },
    methods: {
      openMap(item) {
        this.selectedCertification = item
        this.isModalOpen = true
      },
      closeModal() {
        this.isModalOpen = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .certification-page {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 18px;
  }

  .certification-content {
    gap: 24px;
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
    font-size: 22px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 10px;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
    margin-bottom: 20px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 16px;
  }

  .cert-card {
    border-radius: 14px;
    border: 1px solid #e6eef5;
    background: #f7fbff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .cert-card:hover {
    border-color: #b9d4ef;
    box-shadow: 0 12px 24px rgba(14, 48, 69, 0.12);
    transform: translateY(-2px);
  }

  .cert-title {
    font-size: 18px;
    font-weight: 700;
    color: #0e3045;
  }

  .cert-desc {
    font-size: 14px;
    color: #5b6672;
  }

  .cert-action {
    font-size: 14px;
    font-weight: 600;
    color: #036fc0;
  }

  .map-note {
    font-size: 14px;
    color: #5b6672;
  }

  .cert-modal {
    position: fixed;
    inset: 0;
    background: rgba(8, 24, 38, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 3000;
  }

  .cert-modal-card {
    width: min(1200px, 96vw);
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 18px 40px rgba(10, 36, 60, 0.35);
    display: flex;
    flex-direction: column;
  }

  .cert-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e6eef5;
  }

  .cert-modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #0e3045;
  }

  .cert-modal-close {
    border: none;
    background: #f1f6fb;
    color: #036fc0;
    font-weight: 600;
    border-radius: 999px;
    padding: 8px 16px;
    cursor: pointer;
  }

  .cert-modal-body {
    height: min(84vh, 820px);
  }

  .cert-modal-frame {
    width: 100%;
    height: 100%;
    border: none;
  }

  .certification-page ::v-deep .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 520px;
    margin: 0 auto;
  }

  @media (max-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(2, minmax(220px, 1fr));
    }
  }

  @media (max-width: 720px) {
    .card-grid {
      grid-template-columns: 1fr;
    }
    .cert-modal-body {
      height: min(76vh, 680px);
    }
  }
</style>
