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
          <div class="map-layout">
            <div class="map-panel">
              <div v-if="isMapLoading" class="map-loading">Loading map data...</div>
              <div v-else ref="certMap" class="cert-map"></div>
            </div>
            <div class="list-panel">
              <div class="list-title">
                <span>{{ selectedCountryLabel }}</span>
                <span v-if="selectedCountryCount !== null" class="list-count">{{ selectedCountryCount }}</span>
              </div>
              <div class="list-subtitle">
                Click a country to view the list of certified practitioners.
              </div>
              <div v-if="isCountryLoading" class="list-loading">Loading practitioners...</div>
              <div v-else class="list-content">
                <div
                  v-for="person in selectedCountryPeople"
                  :key="person.id + person.name"
                  class="person-row">
                  <span class="person-name">{{ person.name }}</span>
                  <span class="person-id">{{ person.id }}</span>
                </div>
                <div v-if="!selectedCountryPeople.length" class="empty-state">
                  Select a country to see its certified practitioners.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'
  import jsVectorMap from 'jsvectormap'
  import 'jsvectormap/dist/maps/world.js'

  export default {
    name: 'FMFCertificationPage',
    components: {
      TopBanner
    },
    data() {
      const certifications = [
        {
          name: 'Nuchal translucency scan',
          slug: 'NT'
        },
        {
          name: 'Preeclampsia screening',
          slug: 'Ut'
        },
        {
          name: 'Cervical assessment',
          slug: 'cervical-assessment'
        },
        {
          name: 'Fetal abnormalities',
          slug: 'fetal-abnormalities'
        },
        {
          name: 'Fetal echocardiography',
          slug: 'fetal-echocardiography'
        },
        {
          name: 'Doppler ultrasound',
          slug: 'fetal-doppler-ultrasound'
        }
      ]

      return {
        topBannerList: [{
          img: require('@/assets/img/fmf_certification_header.jpeg'),
          title: 'FMF Certification',
          desc: 'International certification and accredited practitioners'
        }],
        certifications,
        selectedCertification: certifications[0],
        isModalOpen: false,
        isMapLoading: false,
        mapInstance: null,
        mapCounts: {},
        selectedCountryLabel: 'No country selected',
        selectedCountryCount: null,
        selectedCountryPeople: [],
        isCountryLoading: false
      }
    },
    methods: {
      async openMap(item) {
        this.selectedCertification = item
        this.isModalOpen = true
        this.selectedCountryLabel = 'No country selected'
        this.selectedCountryCount = null
        this.selectedCountryPeople = []
        this.isCountryLoading = false
        await this.$nextTick()
        await this.loadMapData()
      },
      closeModal() {
        this.isModalOpen = false
        if (this.mapInstance) {
          this.mapInstance.destroy()
          this.mapInstance = null
        }
      },
      async loadMapData() {
        this.isMapLoading = true
        const slug = this.selectedCertification.slug
        try {
          const resp = await fetch(`/data/fmf-certifications/${slug}_counts.json`, { cache: 'force-cache' })
          const data = await resp.json()
          this.mapCounts = data.counts || {}
          this.$nextTick(() => {
            this.initMap()
          })
        } catch (err) {
          this.mapCounts = {}
        } finally {
          this.isMapLoading = false
        }
      },
      initMap() {
        if (this.mapInstance) {
          this.mapInstance.destroy()
          this.mapInstance = null
        }
        if (!this.$refs.certMap) {
          return
        }
        const values = this.mapCounts
        this.mapInstance = new jsVectorMap({
          selector: this.$refs.certMap,
          map: 'world',
          backgroundColor: '#f4f7fb',
          zoomOnScroll: true,
          zoomMax: 6,
          zoomMin: 1,
          regionStyle: {
            initial: {
              fill: '#dfe7ef'
            },
            hover: {
              fill: '#7db7ee'
            }
          },
          series: {
            regions: [{
              values,
              scale: ['#dbeafe', '#036fc0'],
              normalizeFunction: 'polynomial'
            }]
          },
          onRegionTooltipShow: (event, tooltip, code) => {
            const count = values[code]
            if (count) {
              tooltip.text(`${tooltip.text()} (${count})`)
            }
          },
          onRegionClick: (event, code) => {
            this.loadCountryList(code)
          }
        })
      },
      async loadCountryList(code) {
        const count = this.mapCounts[code]
        if (!count) {
          this.selectedCountryLabel = 'No data for selected country'
          this.selectedCountryCount = null
          this.selectedCountryPeople = []
          return
        }
        this.isCountryLoading = true
        const slug = this.selectedCertification.slug
        try {
          const resp = await fetch(`/data/fmf-certifications/${slug}/${code}.json`, { cache: 'force-cache' })
          const data = await resp.json()
          this.selectedCountryLabel = data.country || code
          this.selectedCountryCount = data.count || null
          this.selectedCountryPeople = data.people || []
        } catch (err) {
          this.selectedCountryLabel = 'Unable to load country data'
          this.selectedCountryCount = null
          this.selectedCountryPeople = []
        } finally {
          this.isCountryLoading = false
        }
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
    padding: 16px 20px 20px;
    background: #f7fbff;
  }

  .map-layout {
    display: grid;
    grid-template-columns: minmax(0, 2.4fr) minmax(0, 1fr);
    gap: 18px;
    height: 100%;
  }

  .map-panel,
  .list-panel {
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #e6eef5;
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .cert-map {
    flex: 1;
    min-height: 420px;
  }

  .map-loading,
  .list-loading {
    font-size: 15px;
    color: #5b6672;
  }

  .list-title {
    font-size: 16px;
    font-weight: 700;
    color: #0e3045;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .list-count {
    font-size: 13px;
    color: #036fc0;
    font-weight: 700;
  }

  .list-subtitle {
    font-size: 13px;
    color: #6a7682;
    margin: 6px 0 12px;
  }

  .list-content {
    overflow-y: auto;
    padding-right: 6px;
  }

  .person-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #edf2f7;
    padding: 8px 0;
    font-size: 13px;
    color: #42505c;
  }

  .person-id {
    color: #7a8795;
    flex-shrink: 0;
  }

  .empty-state {
    font-size: 13px;
    color: #7a8795;
    padding: 10px 0;
  }

  .certification-page ::v-deep .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 520px;
    margin: 0 auto;
  }

  .certification-page ::v-deep .top-banner-content {
    align-items: center;
    text-align: center;
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
    .map-layout {
      grid-template-columns: 1fr;
    }
  }
</style>

<style lang="scss">
@import "jsvectormap/dist/jsvectormap.min.css";
</style>
