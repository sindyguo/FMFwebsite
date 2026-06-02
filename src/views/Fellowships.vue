<template>
  <div class="vcontainer fellowships">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container fellowships-content">
      <div class="section">
        <div class="section-title">FMF Clinical Fellowships</div>
        <ul class="section-list">
          <li>
            Each year, the Fetal Medicine Foundation (FMF) awards a limited number of highly competitive two-year clinical
            fellowships in fetal medicine, designed to nurture excellence in clinical care and compassionate
            patient-centred practice.
          </li>
          <li>
            FMF clinical fellowships are both rigorous and rewarding, offering extensive training and a supportive
            environment where future clinicians develop the skills to make meaningful contributions to fetal medicine
            worldwide. Fellows work closely with Professor Kypros Nicolaides and senior consultants in fetal medicine,
            gaining hands-on experience across the full spectrum of modern fetal-maternal care.
          </li>
          <li>
            During the fellowship, fellows participate in a structured and intensive educational programme designed to
            support advanced clinical and academic development in fetal medicine. This includes:
            <details class="sub-details">
              <summary class="sub-summary">View details</summary>
              <ul class="criteria-list">
                <li>Regular formal teaching, with in-depth lectures delivered monthly covering core and advanced topics in fetal medicine.</li>
                <li>Active participation in multidisciplinary team (MDT) meetings, working closely with specialists in genetics, neonatology, maternal medicine, and neurology.</li>
                <li>Mandatory attendance at the FMF World Congress in Fetal Medicine.</li>
                <li>Mandatory attendance at the FMF Advances Course in Fetal Medicine.</li>
              </ul>
            </details>
          </li>
          <li>
            By the end of the programme, fellows are expected to have completed all the online theoretical courses of the
            FMF and achieved competence in key areas of fetal-medicine practice, formally recognised by FMF Certificates of
            Competence in:
            <details class="sub-details">
              <summary class="sub-summary">View details</summary>
              <ul class="criteria-list">
                <li>The 11-13 weeks scan for assessment of risks for trisomies, preeclampsia and diagnosis of major fetal anomalies.</li>
                <li>The mid-trimester scan for diagnosis of fetal anomalies, and assessment of fetal growth and uterine artery Doppler.</li>
                <li>The third-trimester scan for diagnosis of fetal anomalies, and assessment of fetal growth and fetal oxygenation.</li>
                <li>Fetal echocardiography.</li>
                <li>Fetal neurosonography.</li>
                <li>Cervical assessment.</li>
                <li>Invasive prenatal procedures. This applies for medically qualified fellows registered with the UK General Medical Council.</li>
              </ul>
            </details>
          </li>
          <li>
            Fellows are encouraged and supported to pursue research activity and contribute to ongoing scientific studies,
            enriching the evidence base of fetal-maternal medicine.
          </li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">Certificate of completion of the fellowship</div>
        <div class="section-desc">
          At the end of a successful fellowship candidates receive a Certificate of completion of the fellowship.
        </div>
        <div class="section-desc">
          <img class="map-icon" src="@/assets/img/icons/map-world-icon.jpg.avif" alt="" aria-hidden="true" />
          To view the list of healthcare professionals who have completed or are still engaged in training fellowships in
          fetal medicine please
          <button class="inline-link inline-button" type="button" @click="openMap('FMF training fellowships', 'fellowship')">click here</button>.
        </div>
      </div>

      <div class="section">
        <div class="section-title">Diploma in Fetal Medicine</div>
        <div class="section-desc">
          FMF fellows who have successfully completed their two-year training and have obtained a certificate of
          competence in invasive procedures will receive the FMF Diploma in Fetal Medicine.
        </div>
        <div class="section-desc">
          <img class="map-icon" src="@/assets/img/icons/map-world-icon.jpg.avif" alt="" aria-hidden="true" />
          To view the list of healthcare professionals who have obtained the Diploma in Fetal Medicine please
          <button class="inline-link inline-button" type="button" @click="openMap('Diploma in fetal medicine',  'diploma')">click here</button>.
        </div>
      </div>

      <div class="section">
        <div class="section-title">Applications for FMF clinical fellowships</div>
        <ul class="section-list">
          <li>
            Applications are open throughout the year. Shortlisted applicants will be invited to an online interview.
            Applicants should complete the FMF Fellowship form and send this together with a reference from the head of
            the department in their hospital to <a class="inline-link" href="mailto:education@fetalmedicine.org">education@fetalmedicine.org</a>.
          </li>
          <li>
            Applicants are expected to have completed the FMF theoretical internet-based courses on:
            <ul class="criteria-list">
              <li>The 11-13 weeks scan</li>
              <li>Preeclampsia screening</li>
              <li>Cervical assessment</li>
              <li>Twin pregnancies</li>
            </ul>
          </li>
          <li>
            Attendance at FMF educational events, such as the FMF World Congress in Fetal Medicine or the FMF Advances
            Course in Fetal Medicine, is welcomed and viewed positively. However, attendance is not mandatory, and
            applications are assessed with full recognition of differences in access to international educational
            opportunities across countries.
          </li>
        </ul>
        <div class="inline-actions">
          <a class="inline-link" href="https://fetalmedicine.org/var/uploads/UActiveRecord/0/0/F/M/F/FMFfellowform.docx" target="_blank" rel="noopener">
            <img class="download-icon" src="@/assets/img/icons/download-1915753_1280.webp" alt="" aria-hidden="true" />
            Download application form
          </a>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Applications for project grants</div>
        <div class="section-desc">
          Clinical research fellows or subspecialty trainees in Maternal-Fetal Medicine can apply for research grants
          with an allocated total of up to £1 million per year. The applications are examined by the scientific committee
          of the FMF, and the successful applications are funded on the basis of their merit and provided they fulfil the
          following criteria:
        </div>
        <ul class="criteria-list">
          <li>They work in a NHS hospital in England.</li>
          <li>Approval from the National Research Ethics Service (NRES).</li>
          <li>Approval from research and development department of the hospital.</li>
          <li>Approval from Health Research Authority (HRA) for multicentre studies.</li>
          <li>Peer review from outside the institution where the study is to be carried out.</li>
          <li>Study registered with ClinicalTrials.gov or ISRCTN.</li>
          <li>The applicant has a Certificate of Good Clinical Practice.</li>
        </ul>
      </div>

    </div>

    <div v-if="isMapModalOpen" class="map-modal" @click.self="closeMap">
      <div class="map-modal-card">
        <div class="map-modal-header">
          <div class="map-modal-title">{{ selectedMapTitle }}</div>
          <button class="map-modal-close" type="button" @click="closeMap">Close</button>
        </div>
        <div class="map-modal-body">
          <div class="completion-map-layout">
            <div class="completion-map-panel">
              <div ref="fellowshipMap" class="completion-map"></div>
            </div>
            <div class="completion-list-panel">
              <div class="completion-list-title">
                <span>{{ mapCountryLabel }}</span>
                <span v-if="mapCountryCount !== null" class="completion-list-count">{{ mapCountryCount }}</span>
              </div>
              <div class="completion-list-subtitle">Click a country to view the list.</div>
              <div class="completion-list-content">
                <div v-if="mapCountryListLoading" class="completion-empty-state">Loading...</div>
                <div v-else-if="!mapCountryPeople.length" class="completion-empty-state">
                  Select a country to see the list.
                </div>
                <div v-else class="people-list">
                  <div
                    v-for="(person, idx) in mapCountryPeople"
                    :key="idx"
                    class="person-item"
                    @mouseenter="showTooltip($event, person)"
                    @mouseleave="hideTooltip"
                  >
                    <!-- 姓名区：first_name 正常，last_name 加粗 -->
                    <span class="person-name">
                      {{ capitalize(person.first_name) }}&nbsp;<strong>{{ capitalize(person.last_name) }}</strong>
                    </span>
                    <!-- Fellowship：右侧显示起止年份 -->
                    <span v-if="mapIdentity === 'fellowship'" class="person-years">
                      {{ extractYear(person.fellowship_started) }} – {{ extractYear(person.fellowship_completed, 'ongoing') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- fixed tooltip：脱离滚动容器，不被 overflow 裁剪 -->
    <div v-if="tooltipPerson" class="person-tooltip-fixed" :style="tooltipFixedStyle">
      <div class="person-tooltip-name">{{ capitalizeName(tooltipPerson.first_name, tooltipPerson.last_name) }}</div>
      <div class="person-tooltip-id">FMF ID: {{ tooltipPerson.fmf_id }}</div>
    </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'
  import * as echarts from 'echarts' // 修改为命名空间导入

  export default {
    name: 'FellowshipsPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/fmf_fellowships_header.jpeg'),
          title: '',
          desc: ''
        }],
        isMapModalOpen: false,
        selectedMapTitle: '',
        mapIdentity: '',
        mapCountryLabel: 'No country selected',
        mapCountryCount: null,
        mapCountryPeople: [],
        mapCountryListLoading: false,
        tooltipPerson: null,
        tooltipFixedStyle: {},
        mapChartInstance: null,
        mapCounts: {},
        mapWorld: null,
        mapNameToCode: {}
      }
    },
    methods: {
      async openMap(title, identity) {
        this.selectedMapTitle = title
        this.mapIdentity = identity
        this.mapCountryLabel = 'No country selected'
        this.mapCountryCount = null
        this.mapCountryPeople = []
        this.mapCounts = {}
        // 先拉各国人数，拿到数据后再打开弹窗渲染地图
        try {
          const res = await this.$api.getUsersMapCountry({ identity })
          if ((res.code === 0 || res.code === 200) && res.data && res.data.counts) {
            this.mapCounts = res.data.counts
          }
        } catch (e) {
          console.error('[Map] Failed to load country counts:', e)
        }
        this.isMapModalOpen = true
      },
      closeMap() {
        this.isMapModalOpen = false
        if (this.mapChartInstance) {
          this.mapChartInstance.dispose()
          this.mapChartInstance = null
        }
        window.removeEventListener('resize', this.resizeMap)
      },
      initMap() {
        if (!this.$refs.fellowshipMap) return
        if (this.mapChartInstance) {
          this.mapChartInstance.dispose()
          this.mapChartInstance = null
        }
        this.$nextTick(async () => {
          const worldJson = await this.loadWorldMap()
          echarts.registerMap('world', worldJson)

          const formatter = new Intl.DisplayNames(['en'], { type: 'region' })
          const values = this.mapCounts
          const nameToCode = {}
          const mapData = Object.keys(values).map((code) => {
            let name = code
            if (code && code.length === 2 && formatter) {
              name = formatter.of(code) || code
            }
            nameToCode[name] = code
            return { name, value: values[code] }
          })
          this.mapNameToCode = nameToCode

          this.mapChartInstance = echarts.init(this.$refs.fellowshipMap)
          this.mapChartInstance.setOption({
            backgroundColor: 'transparent',
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderColor: '#2E73BE',
              padding: [10, 15],
              textStyle: { color: '#455a64' },
              extraCssText: 'box-shadow: 0 4px 20px rgba(46, 115, 190, 0.15); border-radius: 8px; backdrop-filter: blur(4px);',
              formatter: (p) => (p.value ? `<b>${p.name}</b><br/><span style="color:#2E73BE; font-size:18px; font-weight:bold;">${p.value}</span>` : p.name)
            },
            visualMap: {
              left: 40,
              bottom: 40,
              min: 0,
              max: Math.max(5, ...Object.values(values)),
              inRange: {
                color: ['#EBF5F7', '#C0D8E6', '#93B8D4', '#5F93C2', '#2E73BE']
              },
              text: ['High', 'Low'],
              textStyle: { color: '#5F93C2' },
              outOfRange: { color: '#ffffff' }
            },
            series: [{
              type: 'map',
              map: 'world',
              roam: true,
              zoom: 1.2,
              itemStyle: {
                areaColor: '#f3f9ff',
                borderColor: '#C0D8E6',
                borderWidth: 1,
                shadowColor: 'rgba(95, 147, 194, 0.15)',
                shadowBlur: 10,
                shadowOffsetY: 4
              },
              emphasis: {
                label: { show: false },
                itemStyle: {
                  areaColor: '#C8ACD6',
                  shadowBlur: 25,
                  shadowColor: 'rgba(200, 172, 214, 0.6)',
                  shadowOffsetX: 6,
                  shadowOffsetY: 8
                }
              },
              select: {
                itemStyle: {
                  areaColor: '#C8ACD6',
                  shadowBlur: 0,
                  shadowColor: 'transparent'
                }
              },
              data: mapData
            }]
          })

          this.mapChartInstance.on('click', (params) => {
            if (params.componentType !== 'series') return
            const code = this.mapNameToCode[params.name] || params.name
            this.mapCountryLabel = params.name || 'No country selected'
            this.mapCountryCount = values[code] ?? values[params.name] ?? 0
            this.mapCountryPeople = []
            this.fetchCountryUserList(code)
          })
          this.mapChartInstance.getZr().on('click', (event) => {
            if (!event.target) {
              this.mapCountryLabel = 'No country selected'
              this.mapCountryCount = null
              this.mapCountryPeople = []
            }
          })
          window.addEventListener('resize', this.resizeMap)
        })
      },
      resizeMap() {
        if (this.mapChartInstance) {
          this.mapChartInstance.resize()
        }
      },
      showTooltip(event, person) {
        const rect = event.currentTarget.getBoundingClientRect()
        this.tooltipPerson = person
        this.$nextTick(() => {
          const tip = document.querySelector('.person-tooltip-fixed')
          const tipW = tip ? tip.offsetWidth : 160
          // 优先显示在元素上方，水平与元素左对齐，防止超出视口右边
          let left = rect.left
          if (left + tipW > window.innerWidth - 8) {
            left = window.innerWidth - tipW - 8
          }
          this.tooltipFixedStyle = {
            top: (rect.top - 8) + 'px',
            left: left + 'px',
            transform: 'translateY(-100%)'
          }
        })
      },
      hideTooltip() {
        this.tooltipPerson = null
        this.tooltipFixedStyle = {}
      },
      capitalize(word) {
        if (!word) return ''
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      },
      capitalizeName(first, last) {
        return [first, last].map(w => this.capitalize(w)).filter(Boolean).join(' ')
      },
      extractYear(dateStr, fallback = '?') {
        if (!dateStr) return fallback
        // 支持 "1998-01-01 00:00:00" 或 "1998-01-01" 或纯年份 "1998"
        return String(dateStr).split('-')[0].split('T')[0].trim()
      },
      async fetchCountryUserList(country) {
        this.mapCountryListLoading = true
        this.mapCountryPeople = []
        try {
          const res = await this.$api.getUsersMapCountryUserList({
            identity: this.mapIdentity,
            country
          })
          if ((res.code === 0 || res.code === 200) && res.data && res.data.people) {
            this.mapCountryPeople = res.data.people
          }
        } catch (e) {
          console.error('[Map] Failed to load country user list:', e)
        } finally {
          this.mapCountryListLoading = false
        }
      },
      async loadWorldMap() {
        if (this.mapWorld) {
          return this.mapWorld
        }
        const resp = await fetch('/website/data/world.json')
        const data = await resp.json()
        this.mapWorld = data
        return data
      }
    },
    watch: {
      isMapModalOpen(value) {
        if (value) {
          this.$nextTick(() => this.initMap())
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fellowships {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }

  ::v-deep .top-banner .top-banner-content {
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  ::v-deep .top-banner .top-banner-content .title {
    margin: 0;
    text-shadow: 0 2px 6px rgba(6, 32, 68, 0.7), 0 0 2px rgba(6, 32, 68, 0.9);
  }

  .fellowships-content {
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
    color: #036fc0;
    margin-bottom: 12px;
  }

  .subsection-title {
    margin-top: 18px;
    font-size: 16px;
    font-weight: 600;
    color: #0e3045;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
  }

  .section-list {
    margin: 10px 0 0 18px;
    padding: 0;
    color: #4a5b67;
    font-size: 16px;
    line-height: 26px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section-list li::marker {
    color: #036fc0;
  }

  .criteria-list {
    margin: 10px 0 0 18px;
    padding: 0;
    color: #4a5b67;
    font-size: 16px;
    line-height: 26px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sub-details {
    margin-top: 6px;
  }

  .sub-summary {
    cursor: pointer;
    color: #036fc0;
    font-weight: 600;
    list-style: none;
    outline: none;
  }

  .sub-summary::-webkit-details-marker {
    display: none;
  }

  .sub-summary::before {
    content: '▸';
    display: inline-block;
    margin-right: 6px;
    transition: transform 0.2s ease;
  }

  details[open] > .sub-summary::before {
    transform: rotate(90deg);
  }

  .criteria-list li::marker {
    color: #036fc0;
  }

  .inline-actions {
    margin-top: 12px;
  }

  .inline-link {
    color: #036fc0;
    font-weight: 600;
    text-decoration: underline;
  }

  .map-icon {
    width: 36px;
    height: 36px;
    margin-right: 8px;
    vertical-align: middle;
  }

  .download-icon {
    width: 28px;
    height: 28px;
    margin-right: 6px;
    vertical-align: middle;
  }

  .inline-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
  }

  .map-modal {
    position: fixed;
    inset: 0;
    background: rgba(8, 24, 38, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 24px;
    box-sizing: border-box;
  }

  .map-modal-card {
    width: min(1600px, 98%);
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(10, 40, 70, 0.25);
    overflow: hidden;
  }

  .map-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #eef2f7;
  }

  .map-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #0e3045;
  }

  .map-modal-close {
    border: none;
    background: #0f5aa4;
    color: #ffffff;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .map-modal-body {
    padding: 16px 20px 20px;
  }

  .completion-map-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 20px;
  }

  .completion-map-panel,
  .completion-list-panel {
    background: #ffffff;
    border: 1px solid #e6eef5;
    border-radius: 14px;
    padding: 20px;
    min-height: 560px;
  }

  .completion-map {
    width: 100%;
    height: 560px;
    border-radius: 12px;
  }

  .completion-list-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 6px;
  }

  .completion-list-count {
    background: #e6f1ff;
    color: #036fc0;
    font-size: 12px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
  }

  .completion-list-subtitle {
    font-size: 13px;
    color: #6b7380;
    margin-bottom: 12px;
  }

  .completion-list-content {
    flex: 1;
  }

  .completion-empty-state {
    color: #9aa6b2;
    font-size: 13px;
  }

  .people-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 480px;
    overflow-y: auto;
  }

  .person-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f5f9ff;
    border-radius: 8px;
    border: 1px solid #e3eef8;
    cursor: default;
  }

  .person-name {
    font-size: 13px;
    color: #3a4a5c;
  }

  .person-years {
    font-size: 12px;
    color: #7a9ab5;
    white-space: nowrap;
    margin-left: 12px;
  }

  /* fixed tooltip：脱离滚动容器，不被 overflow 裁剪 */
  .person-tooltip-fixed {
    position: fixed;
    background: rgba(14, 48, 69, 0.9);
    color: #ffffff;
    padding: 8px 14px;
    border-radius: 8px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  .person-tooltip-fixed::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 20px;
    border: 5px solid transparent;
    border-top-color: rgba(14, 48, 69, 0.9);
  }

  .person-tooltip-name {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .person-tooltip-id {
    font-size: 12px;
    color: #b8d4ec;
  }

  /* ============================================================
     RESPONSIVE BREAKPOINTS
     ============================================================ */

  /* Tablet: 768px ~ 1279px */
  @media (min-width: 768px) and (max-width: 1279px) {
    .main-container {
      width: 100% !important;
      padding-left: 32px !important;
      padding-right: 32px !important;
    }
    .completion-map-layout {
      grid-template-columns: 1fr;
    }
    .completion-map-panel,
    .completion-list-panel {
      min-height: 420px;
    }
    .completion-map { height: 420px; }
  }

  /* Large phone: 480px ~ 767px */
  @media (min-width: 480px) and (max-width: 767px) {
    .main-container {
      width: 100% !important;
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    .fellowships-content { gap: 20px; padding: 16px 0 0; }
    .section { padding: 18px 16px; }
    .section-title    { font-size: 17px; }
    .section-desc,
    .section-list,
    .criteria-list    { font-size: 14px; line-height: 22px; }

    .map-modal        { padding: 12px; }
    .map-modal-card   { border-radius: 12px; }
    .completion-map-layout { grid-template-columns: 1fr; gap: 12px; }
    .completion-map-panel,
    .completion-list-panel { min-height: 300px; padding: 14px; }
    .completion-map   { height: 300px; }
  }

  /* Small phone: 360px ~ 479px */
  @media (min-width: 360px) and (max-width: 479px) {
    .main-container {
      width: 100% !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
    }
    .fellowships-content { gap: 16px; padding: 12px 0 0; }
    .section { padding: 14px 12px; }
    .section-title    { font-size: 16px; }
    .section-desc,
    .section-list,
    .criteria-list    { font-size: 13px; line-height: 20px; }

    .map-modal        { padding: 8px; }
    .map-modal-card   { border-radius: 10px; }
    .map-modal-header { padding: 12px 14px; }
    .map-modal-title  { font-size: 14px; }
    .map-modal-body   { padding: 10px 12px 14px; }
    .completion-map-layout { grid-template-columns: 1fr; gap: 10px; }
    .completion-map-panel,
    .completion-list-panel { min-height: 260px; padding: 12px; }
    .completion-map   { height: 260px; }
    .people-list      { max-height: 320px; }
  }

  /* Very small: < 360px */
  @media (max-width: 359px) {
    .main-container {
      width: 100% !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    .fellowships-content { gap: 12px; padding: 10px 0 0; }
    .section { padding: 12px 10px; }
    .section-title    { font-size: 15px; }
    .section-desc,
    .section-list,
    .criteria-list    { font-size: 12px; line-height: 18px; }
    .map-icon         { width: 28px; height: 28px; }
    .download-icon    { width: 22px; height: 22px; }

    .map-modal        { padding: 6px; }
    .map-modal-card   { border-radius: 8px; }
    .map-modal-header { padding: 10px 12px; }
    .map-modal-title  { font-size: 13px; }
    .map-modal-body   { padding: 8px 10px 12px; }
    .completion-map-layout { grid-template-columns: 1fr; gap: 8px; }
    .completion-map-panel,
    .completion-list-panel { min-height: 220px; padding: 10px; }
    .completion-map   { height: 220px; }
    .people-list      { max-height: 260px; }
    .person-item      { padding: 6px 8px; }
    .person-name      { font-size: 12px; }
    .person-years     { font-size: 11px; }
  }
</style>
