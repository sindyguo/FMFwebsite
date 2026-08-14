<template>
  <div class="vcontainer affiliations-page">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container affiliations-content">
      <div class="section intro-section">
        <div class="section-title">FMF Affiliates</div>
        <div class="section-desc">
          FMF affiliate organisations provide local accreditation pathways in accordance with FMF standards. Select a
          country to view the relevant certification or accreditation process, resources, and contact details.
        </div>
        <div class="country-grid">
          <button
            v-for="item in countries"
            :key="item.slug"
            :class="['country-card', { active: item.slug === selectedCountry.slug }]"
            type="button"
            @click="selectCountry(item.slug)">
            <span class="country-name">{{ item.name }}</span>
            <span class="country-summary">{{ item.summary }}</span>
          </button>
        </div>
      </div>

      <div class="section">
        <div class="country-heading">{{ selectedCountry.name }}</div>
        <div class="section-title">{{ selectedCountry.title }}</div>
        <div
          v-for="paragraph in selectedCountry.description"
          :key="paragraph"
          class="section-desc">
          {{ paragraph }}
        </div>
      </div>

      <div class="section">
        <div class="section-title">{{ pathwayTitle }}</div>
        <div v-if="selectedCountry.slug === 'usa'" class="usa-process-wrapper">
          <div class="usa-process-list">
            <div
              v-for="(step, index) in selectedCountry.pathway"
              :key="step.title"
              class="pathway-card usa-process-card">
              <div class="step-number">{{ index + 1 }}</div>
              <div>
                <div class="step-title">{{ step.title }}</div>
                <div class="step-desc">
                  {{ step.desc }}
                  <template v-if="step.links && step.links.length">
                    <a
                      v-for="link in step.links"
                      :key="link.label"
                      class="inline-link step-link"
                      :href="link.url"
                      target="_blank"
                      rel="noopener">
                      {{ link.label }}
                    </a>
                  </template>
                  <a
                    v-else-if="step.url"
                    class="inline-link"
                    :href="step.url"
                    target="_blank"
                    rel="noopener">
                    {{ step.linkLabel }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div id="usa-process-flowchart" class="usa-flowchart">
            <div class="usa-flow-row">
              <div class="usa-flow-label">
                <span>First Accreditation</span>
                <small>NT and/or PE</small>
              </div>
              <div class="usa-flow-track">
                <div class="usa-flow-box usa-flow-main-box">
                  Attend online courses on FMF website, complete payment and submit 3 NT/UT images.
                </div>
              </div>
              <div class="usa-flow-outcomes">
                <div class="usa-flow-lane pass-lane">
                  <div class="usa-flow-box pass">Pass</div>
                  <div class="usa-flow-box certificate">
                    <strong>Certificate of Completion</strong>
                    <span>Name listed on public accredited user list</span>
                  </div>
                  <div class="usa-flow-box renewal">Renewal due annually</div>
                </div>
                <div class="usa-flow-lane fail-lane">
                  <div class="usa-flow-box fail">Fail</div>
                  <div class="usa-flow-box retry">Read report and submit 3 new images</div>
                </div>
              </div>
            </div>

            <div class="usa-flow-row">
              <div class="usa-flow-label">
                <span>Existing User / Annual Accreditation</span>
                <small>NT and/or PE</small>
              </div>
              <div class="usa-flow-track">
                <div class="usa-flow-box usa-flow-main-box">
                  Attend online courses on FMF website, complete payment and submit 3 NT/UT images.
                </div>
              </div>
              <div class="usa-flow-outcomes">
                <div class="usa-flow-lane pass-lane">
                  <div class="usa-flow-box pass">Pass</div>
                  <div class="usa-flow-box certificate">
                    <strong>Certificate of Completion</strong>
                    <span>Name listed on public accredited user list</span>
                  </div>
                  <div class="usa-flow-box renewal">Renewal due annually</div>
                </div>
                <div class="usa-flow-lane fail-lane">
                  <div class="usa-flow-box fail">Fail</div>
                  <div class="usa-flow-box retry">Read report and submit 3 new images</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="pathway-grid">
          <div
            v-for="(step, index) in selectedCountry.pathway"
            :key="step.title"
            class="pathway-card">
            <div class="step-number">{{ index + 1 }}</div>
            <div>
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>
        <div v-if="selectedCountry.slug !== 'usa' && selectedCountry.certifications.length" class="certification-band">
          <div class="subsection-title">{{ areasTitle }}</div>
          <div class="tag-list">
            <span
              v-for="item in selectedCountry.certifications"
              :key="item"
              class="cert-tag">
              {{ item }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="selectedCountry.links.length" class="section resources-section">
        <div class="section-title">Resources and links</div>
        <div class="resource-list">
          <a
            v-for="link in selectedCountry.links"
            :key="link.label"
            class="resource-link"
            :href="link.url"
            target="_blank"
            rel="noopener">
            <span>{{ link.label }}</span>
            <span class="resource-url">{{ link.display }}</span>
          </a>
        </div>
      </div>

      <div class="section contact-section">
        <div class="section-title">Contact</div>
        <div class="contact-card">
          <div
            v-for="line in selectedCountry.contact"
            :key="line"
            class="contact-line">
            {{ line }}
          </div>
          <a
            v-for="email in selectedCountry.emails || []"
            :key="email"
            class="inline-link contact-email"
            :href="`mailto:${email}`">
            {{ email }}
          </a>
          <a v-if="selectedCountry.email" class="inline-link contact-email" :href="`mailto:${selectedCountry.email}`">
            {{ selectedCountry.email }}
          </a>
          <a
            v-for="link in selectedCountry.contactLinks || []"
            :key="link.url"
            class="inline-link contact-email"
            :href="link.url"
            target="_blank"
            rel="noopener">
            {{ link.label }}
          </a>
        </div>
      </div>

      <div v-if="selectedCountry.disclaimer" class="section disclaimer-section">
        {{ selectedCountry.disclaimer }}
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'FMFAffiliationsPage',
    components: {
      TopBanner
    },
    data() {
      const countries = [
        {
          slug: 'usa',
          name: 'United States',
          summary: 'FMF USA accreditation for NT and/or PE users',
          title: 'FMF USA Accreditation Process',
          description: [
            'FMF USA offers accreditation in Nuchal translucency and Preeclampsia.'
          ],
          pathway: [
            {
              title: 'Complete online FMF courses',
              desc: 'All new and existing users are required to complete the free of charge online FMF NT and PE course.',
              linkLabel: 'Open online courses',
              url: 'https://www.fetalmedicine.org/website/#/course?categoryName=Online%20Courses'
            },
            {
              title: 'Complete online FMFUSA training tutorials',
              desc: '',
              links: [
                {
                  label: 'NT tutorial',
                  url: 'https://www.fetalmedicineusa.com/1st_Trimester_Survival_Guide/launcher.html'
                },
                {
                  label: 'Uterine artery Doppler tutorial',
                  url: 'http://video.fetalmedicineusa.com/utad/story_html5.html'
                }
              ]
            },
            {
              title: 'Complete payment',
              desc: 'All payments are handled through the FMF USA accreditation portal.',
              linkLabel: 'Payment information',
              url: 'https://fetalmedicineusa.com/paypal.php'
            },
            {
              title: 'Submit 3 NT / UT images',
              desc: 'Submitting images through FMF affiliates tab on your personal page of FMF website.'
            }
          ],
          certifications: [],
          links: [
            {
              label: 'FMF USA website',
              display: 'fetalmedicineusa.com',
              url: 'http://fetalmedicineusa.com'
            },
            {
              label: 'Accreditation details and payment',
              display: 'fetalmedicineusa.com/paypal.php',
              url: 'https://fetalmedicineusa.com/paypal.php'
            },
            {
              label: 'Accredited user search',
              display: 'fetalmedicineusa.com/searchsonographer.php',
              url: 'http://fetalmedicineusa.com/searchsonographer.php'
            },
            {
              label: 'Uterine artery Doppler tutorial',
              display: 'video.fetalmedicineusa.com/utad',
              url: 'http://video.fetalmedicineusa.com/utad/story_html5.html'
            },
            {
              label: 'The First Trimester Training Module (Firefox browser)',
              display: 'fetalmedicineusa.com/1st_Trimester_Survival_Guide/launcher.html',
              url: 'https://fetalmedicineusa.com/1st_Trimester_Survival_Guide/launcher.html'
            }
          ],
          contact: [
            'Cathy Downing, RT, RDMS, RVT',
            '+1 937-416-4248'
          ],
          emails: ['Downingc@fetalmedicine.org', 'usaaudit@fetalmedicine.org'],
          email: '',
          disclaimer: 'The annual clinical quality assurance by FMF USA signifies that a provider has met specific educational benchmarks and participated in the standardised image audit process, but it does not replace formal board certification or institutional medical staff requirements or guarantee clinical performance.'
        },
        {
          slug: 'india',
          name: 'India',
          summary: 'FMFI Trust certification and audit pathways',
          title: 'The Fetal Medicine Foundation India Trust Certifications',
          description: [
            'As an affiliate of the Fetal Medicine Foundation, FMFI Trust provides accreditation pathways for users in India in accordance with FMF standards.',
            'The FMFI Trust supports FMF certification through workshops, image assessments, and practical assessments, advancing maternal-fetal healthcare by delivering internationally benchmarked education, training, and skills in fetal medicine and obstetric ultrasound. The FMFI Trust works to expand access to fetal medicine education and standardised protocols, while promoting improved pregnancy care and outcomes across India. Our mission is to increase the number of trained and certified fetal medicine professionals, ensuring that high-quality antenatal screening and diagnostic services are accessible to women nationwide.'
          ],
          pathway: [
            {
              title: 'Create active accounts',
              desc: 'Certification applications, audit submissions, and renewal processes require both active FMF UK and FMF India accounts.'
            },
            {
              title: 'Select certification',
              desc: 'Choose the relevant certification area in the FMFI Trust portal and complete required online theory courses on the FMF UK main website.'
            },
            {
              title: 'Next steps',
              desc: 'Submission of a set of images through the FMFI portal and The FMFI Comprehensive Onsite Workshop: A workshop designed to bridge knowledge with real-world practice.'
            },
            {
              title: 'Complete practical assessment',
              desc: 'Arrange practical assessment of scanning technique and procedure overseen by The FMFI approved examiners.'
            },
            {
              title: 'Certification and renewal',
              desc: 'Successful users complete the structured pathway, manage renewals and make payments through the FMFI Trust portal.'
            }
          ],
          certifications: [
            'Nuchal Translucency',
            'Nasal Bone',
            'Ductus Venosus Flow',
            'Tricuspid Flow',
            'Uterine Artery Doppler',
            'Anomaly Scan',
            'Doppler Ultrasound',
            'Cervical Scan',
            'Invasive Procedures (Upcoming)',
            'Fetal Cardiac Scan (Upcoming)'
          ],
          links: [
            {
              label: 'FMF India account login',
              display: 'audit.fmfindia.in/sign-in',
              url: 'https://audit.fmfindia.in/sign-in'
            },
            {
              label: 'Certification details',
              display: 'fmfindia.in/certifications',
              url: 'https://www.fmfindia.in/certifications'
            },
            {
              label: 'FMFI Trust website',
              display: 'fmfindia.in',
              url: 'https://www.fmfindia.in/'
            }
          ],
          contact: [
            'The Fetal Medicine Foundation India Trust',
            'C-584, Defence Colony, New Delhi - 110024',
            'Phone: +(91) 93112 27181'
          ],
          email: 'contact@fmfindia.in',
          disclaimer: 'The FMFI certification and audit programme is a skill enhancement initiative and does not constitute an assessment of a practitioner\'s overall clinical performance or day-to-day practice and should not be referenced for any medico-legal purposes. All information, images, and documents submitted on this platform are used solely for certification and audit evaluation and will not be shared with any third party or used for commercial purposes.'
        },
        {
          slug: 'italy',
          name: 'Italy',
          summary: 'SIEOG NT certification and annual audit pathway',
          title: 'Certification Process',
          description: [
            'As an affiliate of the Fetal Medicine Foundation, SIEOG provides certification pathways for users in Italy in accordance with FMF standards.',
            'According to the Italian National Guidelines, nuchal translucency measurement should be offered to all pregnant women, and operators performing first trimester ultrasound screening must be certified in this examination and undergo annual audits to ensure ongoing competence.'
          ],
          pathway: [
            {
              title: 'Register with FMF',
              desc: 'Register on the FMF website to obtain your FMF ID number, or log in using your existing FMF ID number.'
            },
            {
              title: 'Complete online training',
              desc: 'Complete the online course and obtain the Certificate of Attendance. This requirement applies to both new applicants and existing users.'
            },
            {
              title: 'Practical examination',
              desc: 'For first-time applicants only: Contact SIEOG to arrange the required practical examination at a designated referral centre. Existing FMF users who have successfully completed the practical assessment in the past are not required to repeat it. Their assessment records will be transferred automatically from the previous system.'
            },
            {
              title: 'NT audit submission',
              desc: 'Log in to your FMF page, submit the audit data file, and receive the assessment report.'
            },
            {
              title: 'Listing and annual audit',
              desc: 'Certified users are listed and continue to follow the audit process by submitting data annually.'
            }
          ],
          certifications: ['Nuchal Translucency'],
          links: [
            {
              label: 'Certification details',
              display: 'sieog.it/la-traslucenza-nucale',
              url: 'https://www.sieog.it/la-traslucenza-nucale/'
            },
            {
              label: 'SIEOG website',
              display: 'sieog.it',
              url: 'https://www.sieog.it'
            },
            {
              label: 'Italian National Guidelines',
              display: 'sieog.it/linee-guida2021',
              url: 'https://www.sieog.it/linee-guida2021/'
            }
          ],
          contact: [
            'SIEOG',
            'Contact SIEOG to schedule all practical examinations at a designated referral centre'
          ],
          email: 'fmf.sieog@gmail.com',
          disclaimer: 'The annual clinical quality assurance by SIEOG signifies that a provider has met specific educational benchmarks and participated in the standardised data audit process, but it does not replace formal board certification or institutional medical staff requirements or guarantee clinical performance.'
        },
        {
          slug: 'czech-republic',
          name: 'Czech Republic',
          summary: '11-14 weeks certification and anomaly scan pathway',
          title: 'FMF Czech Republic Certification Process',
          description: [
            'According to the Czech Republic Health Ministry National Guidelines, nuchal translucency measurement should be offered to all pregnant women, and operators performing first trimester ultrasound screening must be certified in this examination and undergo annual audits to ensure ongoing competence.'
          ],
          pathway: [
            {
              title: 'First steps',
              desc: 'Register on the FMF website to receive your FMF ID number and complete relevant online theory courses to receive the Certificate of Attendance.'
            },
            {
              title: '11-14 weeks Certification',
              desc: 'Attend the FMF practical in-person course and submit the logbook for NT-NB-DV-TR to FMF Czech Republic.'
            },
            {
              title: '11-14 weeks Certification Renewal',
              desc: 'Submit data for audit to the Czech Government annually.'
            },
            {
              title: 'Anomaly scan',
              desc: 'Complete the online courses Fetal Abnormalities, Neurosonogram, and Cardiac Scanning. Attend the FMF theoretical and practical course and submit the anomaly scan logbook to FMF Czech Republic. No renewal is required.'
            },
            {
              title: 'Practical assessments',
              desc: 'Contact FMF Czech Republic to schedule the required practical examination.'
            }
          ],
          certifications: ['11-14 weeks Certification', 'Anomaly scan'],
          links: [],
          contact: [
            'FMF Czech Republic'
          ],
          email: 'sekretar@gynultrazvuk.cz',
          disclaimer: 'The annual clinical quality assurance by FMF Czech Republic signifies that a provider has met specific educational benchmarks and participated in the standardised data audit process, but it does not replace formal board certification or institutional medical staff requirements or guarantee clinical performance.'
        },
        {
          slug: 'asia-pacific',
          name: 'FMF Asia Pacific',
          summary: 'FMFAPAC certification pathways across Asia Pacific',
          title: 'FMFAPAC Certifications',
          description: [
            'As an affiliate of the Fetal Medicine Foundation, FMFI Trust provides accreditation pathways for users in India in accordance with FMF standards.',
            'The Fetal Medicine Foundation (FMF) Asia Pacific is dedicated to advancing fetal medicine through education, research, and clinical excellence. As the regional chapter of the internationally recognized FMF, we work to implement evidence-based practices, provide comprehensive training programs, and establish quality standards for fetal screening and diagnosis. This inaugural conference marks a significant milestone in our mission to create a robust network of fetal medicine specialists across the Asia Pacific region.'
          ],
          pathway: [
            {
              title: 'Register with FMF',
              desc: 'Create both FMF UK and FMFAPAC accounts.'
            },
            {
              title: 'Pre-exam requirements',
              desc: 'Obtain the FMF Certificate of Attendance for all theoretical courses relevant to your certification.'
            },
            {
              title: 'Complete practical assessment',
              desc: 'Arrange practical assessment of scanning technique and procedure overseen by The FMFAPAC approved examiners.'
            },
            {
              title: 'Certification',
              desc: 'Successful candidates complete the structured pathway with face-to-face accreditation to receive Certificate of Completion and license without the need for renewals.'
            }
          ],
          certifications: [
            'Nuchal Translucency',
            'Nasal Bone',
            'Ductus Venosus Flow',
            'Tricuspid Flow',
            'Uterine Artery Doppler',
            'Anomaly Scan',
            'Doppler Ultrasound',
            'Cervical Scan'
          ],
          links: [],
          contact: [
            'FMF Asia Pacific'
          ],
          contactLinks: [
            {
              label: 'https://www.fetalmedicine-apac.org/en/',
              url: 'https://www.fetalmedicine-apac.org/en/'
            }
          ],
          email: '',
          disclaimer: 'The FMFAPAC certification and audit programme is a skill enhancement initiative and does not constitute an assessment of a practitioner\'s overall clinical performance or day-to-day practice and should not be referenced for any medico-legal purposes.'
        }
      ]

      return {
        topBannerList: [{
          img: require('@/assets/img/fmf_affiliations_header_v3.jpeg'),
          title: '',
          desc: ''
        }],
        countries
      }
    },
    computed: {
      selectedCountry() {
        const slug = (this.$route.params.country || 'usa').toLowerCase()
        return this.countries.find((item) => item.slug === slug) || this.countries[0]
      },
      processNoun() {
        return this.selectedCountry.slug === 'usa' ? 'Accreditation' : 'Certification'
      },
      pathwayTitle() {
        return `${this.processNoun} pathway`
      },
      areasTitle() {
        return `${this.processNoun} areas`
      }
    },
    methods: {
      selectCountry(slug) {
        this.$router.push(`/fmf-affiliations/${slug}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .affiliations-page {
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

  ::v-deep .top-banner .top-banner-bg {
    background-color: #eaf4fc;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  ::v-deep .top-banner .top-banner-content .title {
    margin: 0;
    -webkit-text-stroke: 2.5px #036fc0;
    paint-order: stroke fill;
    text-shadow:
      -2px -2px 0 #036fc0,
      0 -2px 0 #036fc0,
      2px -2px 0 #036fc0,
      -2px 0 0 #036fc0,
      2px 0 0 #036fc0,
      -2px 2px 0 #036fc0,
      0 2px 0 #036fc0,
      2px 2px 0 #036fc0,
      0 3px 8px rgba(3, 111, 192, 0.28);
  }

  .affiliations-content {
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
    margin: 0 0 12px;
    font-size: 16px;
    font-weight: 600;
    color: #0e3045;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
    margin-bottom: 10px;
  }

  .section-desc:last-child {
    margin-bottom: 0;
  }

  .country-heading {
    margin-bottom: 8px;
    color: #0e3045;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.2;
  }

  .country-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(240px, 1fr));
    gap: 16px;
    margin-top: 18px;
  }

  .country-card {
    border: 1px solid #e3edf7;
    border-radius: 12px;
    background: #ffffff;
    padding: 18px;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  .country-card:hover,
  .country-card.active {
    border-color: #036fc0;
    box-shadow: 0 12px 28px rgba(3, 111, 192, 0.12);
    transform: translateY(-2px);
  }

  .country-name {
    display: block;
    color: #0e3045;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .country-summary {
    display: block;
    color: #4a5b67;
    font-size: 15px;
    line-height: 22px;
  }

  .pathway-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(260px, 1fr));
    gap: 16px;
  }

  .pathway-card {
    display: flex;
    gap: 14px;
    padding: 18px;
    border: 1px solid #e6eef5;
    border-radius: 12px;
    background: #f9fcff;
  }

  .step-number {
    flex: 0 0 auto;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #036fc0;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  .step-title {
    color: #0e3045;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .step-desc {
    color: #4a5b67;
    font-size: 15px;
    line-height: 24px;
  }

  .step-link {
    display: block;
    width: fit-content;
    margin-top: 4px;
  }

  .usa-process-wrapper {
    display: grid;
    gap: 22px;
  }

  .usa-process-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(260px, 1fr));
    gap: 16px;
  }

  .usa-process-card {
    background: #f7fbff;
  }

  .usa-flowchart {
    display: grid;
    gap: 28px;
    overflow-x: visible;
    padding: 4px 2px 8px;
  }

  .usa-flow-row {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(180px, 230px) minmax(0, 1fr);
    grid-template-areas:
      'label track'
      'label outcomes';
    gap: 14px 18px;
    align-items: stretch;
  }

  .usa-flow-label {
    grid-area: label;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 12px;
    background: linear-gradient(180deg, #08336f 0%, #031f55 100%);
    color: #ffffff;
    padding: 16px 18px;
    box-shadow: 0 8px 18px rgba(3, 31, 85, 0.18);
  }

  .usa-flow-label span {
    font-size: clamp(16px, 1.7vw, 20px);
    font-weight: 700;
    line-height: 1.2;
  }

  .usa-flow-label small {
    margin-top: 6px;
    font-size: clamp(13px, 1.4vw, 16px);
    font-style: italic;
    opacity: 0.92;
  }

  .usa-flow-track {
    grid-area: track;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    gap: 18px;
  }

  .usa-flow-lane {
    display: grid;
    align-items: center;
    gap: 18px;
  }

  .usa-flow-outcomes {
    grid-area: outcomes;
    display: grid;
    gap: 14px;
  }

  .pass-lane {
    grid-template-columns: minmax(72px, 0.45fr) minmax(150px, 1.1fr) minmax(108px, 0.7fr);
  }

  .fail-lane {
    grid-template-columns: minmax(72px, 0.45fr) minmax(150px, 1.8fr);
  }

  .usa-flow-box {
    position: relative;
    min-height: 88px;
    min-width: 0;
    border: 2px solid #082a68;
    border-radius: 12px;
    background: linear-gradient(180deg, #f9fdff 0%, #edf8ff 100%);
    color: #082a68;
    padding: 14px 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(8, 42, 104, 0.08);
  }

  .usa-flow-track .usa-flow-box:not(:last-child)::after,
  .usa-flow-lane .usa-flow-box:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -23px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 14px solid #082a68;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }

  .usa-flow-box strong {
    display: block;
    font-size: clamp(18px, 2vw, 24px);
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .usa-flow-box span {
    display: block;
    font-size: clamp(12px, 1.15vw, 14px);
    line-height: 1.45;
    font-weight: 600;
  }

  .usa-flow-main-box {
    min-height: 92px;
    align-items: center;
    font-size: clamp(15px, 1.6vw, 18px);
    font-weight: 700;
    line-height: 1.35;
    padding: 18px 28px;
  }

  .usa-flow-box.pass,
  .usa-flow-box.fail {
    min-width: 0;
    min-height: 60px;
    font-size: clamp(15px, 1.6vw, 18px);
    font-weight: 700;
  }

  .usa-flow-box.pass {
    background: linear-gradient(180deg, #e8ffd5 0%, #c8f2a9 100%);
    color: #142615;
  }

  .usa-flow-box.fail {
    background: linear-gradient(180deg, #ffe6e3 0%, #ffb8b1 100%);
    color: #241111;
  }

  .usa-flow-box.certificate {
    min-width: 0;
  }

  .usa-flow-box.certificate strong {
    font-size: clamp(12px, 1.2vw, 15px);
    margin-bottom: 8px;
  }

  .usa-flow-box.renewal,
  .usa-flow-box.retry {
    min-width: 0;
    font-size: clamp(12px, 1.2vw, 15px);
    font-weight: 700;
    line-height: 1.35;
  }

  .certification-band {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid #e6eef5;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .cert-tag {
    border-radius: 999px;
    background: #eaf4fc;
    color: #036fc0;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
  }

  .resource-list {
    display: grid;
    gap: 12px;
  }

  .resource-link {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border: 1px solid #e6eef5;
    border-radius: 10px;
    color: #036fc0;
    font-weight: 700;
    text-decoration: none;
    background: #ffffff;
  }

  .resource-link:hover {
    border-color: #036fc0;
    background: #f7fbff;
  }

  .resource-url {
    color: #6b8292;
    font-size: 14px;
    font-weight: 500;
    word-break: break-word;
    text-align: right;
  }

  .contact-card {
    color: #4a5b67;
    font-size: 16px;
    line-height: 26px;
  }

  .contact-line {
    margin-bottom: 4px;
  }

  .inline-link {
    color: #036fc0;
    font-weight: 600;
    text-decoration: underline;
  }

  .contact-email {
    display: block;
    margin-top: 8px;
  }

  .disclaimer-section {
    color: #60727e;
    font-size: 14px;
    line-height: 24px;
    background: #f9fcff;
  }

  @media (max-width: 768px) {
    .affiliations-content {
      padding: 18px 12px 0;
    }

    .section {
      padding: 18px;
    }

    .country-grid,
    .pathway-grid,
    .usa-process-list {
      grid-template-columns: 1fr;
    }

    .usa-flow-row {
      grid-template-columns: 1fr;
      grid-template-areas:
        'label'
        'track'
        'outcomes';
    }

    .usa-flow-label {
      min-height: 86px;
    }

    .usa-flow-track,
    .pass-lane,
    .fail-lane {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .usa-flow-track .usa-flow-box:not(:last-child)::after,
    .usa-flow-lane .usa-flow-box:not(:last-child)::after {
      display: none;
    }

    .usa-flow-box {
      min-height: auto;
    }

    .resource-link {
      flex-direction: column;
      gap: 6px;
    }

    .resource-url {
      text-align: left;
    }
  }
</style>
