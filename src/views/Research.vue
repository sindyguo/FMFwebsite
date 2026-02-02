<template>
  <div class="vcontainer research-page">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container research-content">
      <div class="section">
        <div class="hero-title">Research</div>
        <div class="section-desc">
          The Fetal Medicine Foundation (FMF) funds research focused on the early prediction and prevention of pregnancy
          complications, with the aim of improving health outcomes for mothers and babies. To date, the FMF has allocated
          over €70 million to research addressing major causes of maternal and perinatal morbidity and mortality,
          including preeclampsia, preterm birth, fetal growth restriction and stillbirth.
        </div>
      </div>

      <div class="section">
        <div class="section-title blue-title">Research publications</div>
        <div class="section-desc">
          FMF-funded research has generated a substantial body of scientific evidence, resulting in over 1,700
          peer-reviewed publications to date.
        </div>
        <div class="section-desc">
          <img class="pub-icon" src="@/assets/img/icons/research-publications-icon.png" alt="" aria-hidden="true" />
          To view the full list of FMF-supported publications,
          <router-link class="inline-link" to="/research-publications">click here</router-link>.
        </div>
      </div>

      <div class="section">
        <div class="section-title blue-title">Randomized trials</div>
        <div class="section-desc">
          A key part of the FMF work is the support of large randomized controlled trials, conducted across multiple
          countries and healthcare systems. These studies have provided robust evidence for preventive, risk-based
          approaches to maternal care and have been published in leading peer-reviewed journals, contributing to their
          adoption in clinical practice worldwide.
        </div>
      </div>

      <div class="section">
        <div class="section-title">Ongoing randomized trials</div>
        <div class="trial-grid trial-grid-two">
          <div class="trial-card">
            <div class="trial-title">
              Aspirin versus placebo in twin pregnancies for preeclampsia prevention (ASPRE-T)
            </div>
            <div class="trial-desc">
              Double-blind, randomized, placebo-controlled multicentre trial in dichorionic and monochorionic-diamniotic
              twin pregnancies at 11-13 weeks' gestation.
            </div>
            <ul class="trial-list">
              <li>Aspirin 150 mg/day vs placebo from 11-14 to 36 weeks' gestation.</li>
              <li>Aim: reduce preeclampsia with delivery &lt;37 weeks.</li>
              <li>Powered for 50% reduction; 2,400 pregnancies (90% power).</li>
            </ul>
          </div>
          <div class="trial-card">
            <div class="trial-title">
              Effects of dietary nitrate supplementation on pregnancies with chronic or new onset hypertension (BEET-BP)
            </div>
            <div class="trial-desc">
              Double-blind, placebo-controlled multicentre trial in participants with hypertension at 24-36 weeks'
              gestation.
            </div>
            <ul class="trial-list">
              <li>70 mL beetroot juice concentrate vs nitrate-deplete placebo daily until delivery.</li>
              <li>Primary outcome: gestational age at delivery due to preeclampsia.</li>
              <li>Target sample size: 320 women (400 screened).</li>
            </ul>
          </div>
          <div class="trial-card">
            <div class="trial-title">
              Optim-PRE trial: Optimizing the use of aspirin for the prevention of preeclampsia
            </div>
            <div class="trial-desc">
              Open label, multicentre trial in Spain and UK.
            </div>
            <ul class="trial-list">
              <li>Screening for preterm PE in singleton pregnancies at 11-13 weeks’ gestation and prophylactic aspirin in the 30% with the highest risk.</li>
              <li>At 20 weeks randomization to either stop aspirin at 24 weeks or continue until 36 weeks.</li>
              <li>Objective: to assess whether discontinuation at 24 weeks is non-inferior to treatment until 36 weeks.</li>
              <li>Sample size: screening in about 40,000 and randomization in 12,000.</li>
            </ul>
          </div>
          <div class="trial-card">
            <div class="trial-title">
              Prevent-PE 2: timed birth at term
            </div>
            <div class="trial-desc">
              Open label trial in the UK.
            </div>
            <ul class="trial-list">
              <li>Screening for PE at 35-36 weeks and timed birth based on risk vs. usual care.</li>
              <li>Those with risk of more than 1 in 100 will have elective delivery at 39 weeks.</li>
              <li>Objective: to reduce preeclampsia.</li>
              <li>Sample size: 8,000 women with singleton pregnancies.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Completed randomized trials</div>
        <div class="section-desc">
          The Fetal Medicine Foundation has funded and coordinated several major multicentre randomized trials to
          investigate interventions for prevention of preeclampsia, preterm birth, and macrosomia.
        </div>
        <div class="subsection">
          <div class="subsection-title">Prevention of preeclampsia</div>
          <div class="trial-grid">
            <div class="trial-card">
              <div class="trial-title">PREVENT-PE: timed birth at term</div>
              <div class="trial-desc">
                Timed birth at term stratified by the FMF competing-risks pre-eclampsia model at 35-36 weeks reduced
                preeclampsia by 30%.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">ASPRE: aspirin from 12 weeks</div>
              <div class="trial-desc">
                Aspirin 150 mg/day started at 11-14 weeks reduced the risk of preterm preeclampsia.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">Aspirin from 23 weeks in impaired placentation</div>
              <div class="trial-desc">
                Aspirin 150 mg/day from 23 weeks did not reduce preeclampsia in women with abnormal uterine artery
                Doppler.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">Pravastatin from 35-37 weeks</div>
              <div class="trial-desc">
                Pravastatin 20 mg/day did not reduce the risk of term preeclampsia.
              </div>
            </div>
          </div>
        </div>
        <div class="subsection">
          <div class="subsection-title">Prevention of preterm birth</div>
          <div class="trial-grid">
            <div class="trial-card">
              <div class="trial-title">Progesterone 200 mg/day (short cervix)</div>
              <div class="trial-desc">
                Vaginal progesterone reduced the risk of spontaneous preterm birth in women with a short cervix.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">Progesterone 600 mg/day (twin pregnancies)</div>
              <div class="trial-desc">
                Universal progesterone in twin pregnancies did not reduce spontaneous preterm birth.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">Cervical cerclage (short cervix)</div>
              <div class="trial-desc">
                Cerclage did not substantially reduce early preterm delivery.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">Cervical pessary (short cervix)</div>
              <div class="trial-desc">
                Cervical pessary did not reduce spontaneous birth &lt;34 weeks in singleton pregnancies.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">Cervical pessary (twin pregnancies)</div>
              <div class="trial-desc">
                Cervical pessary in unselected twin pregnancies did not reduce early preterm birth.
              </div>
            </div>
            <div class="trial-card">
              <div class="trial-title">Cervical assessment in threatened preterm labor</div>
              <div class="trial-desc">
                Cervical length-guided management improves care in threatened preterm labor.
              </div>
            </div>
          </div>
        </div>
        <div class="subsection">
          <div class="subsection-title">Prevention of macrosomia</div>
          <div class="trial-grid">
            <div class="trial-card">
              <div class="trial-title">Metformin in obese women without diabetes (MOP)</div>
              <div class="trial-desc">
                Metformin did not reduce macrosomia but reduced maternal weight gain and preeclampsia.
              </div>
            </div>
          </div>
        </div>
        <div class="subsection">
          <div class="subsection-title">Maternal glycemia and adverse outcomes in gestational diabetes</div>
          <div class="trial-grid">
            <div class="trial-card">
              <div class="trial-title">UDCA in gestational diabetes (GUARDS)</div>
              <div class="trial-desc">
                Ursodeoxycholic acid did not improve maternal glycemia or reduce adverse perinatal outcomes.
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

  export default {
    name: 'ResearchPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/headers/research-header.jpeg'),
          title: '',
          desc: ''
        }]
      }
    },
    methods: {
      gotoPublications() {
        this.$router.push('/research-publications')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .research-page {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 18px;
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

  .research-content {
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
    font-size: 22px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .hero-title {
    font-size: 26px;
    font-weight: 700;
    color: #036FC0;
    margin-bottom: 12px;
  }

  .blue-title {
    color: #036FC0;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
  }

  .inline-link {
    color: #036FC0;
    font-weight: 600;
    text-decoration: underline;
  }

  .pub-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }

  .trial-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  .trial-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    .trial-grid-two {
      grid-template-columns: 1fr;
    }
  }

  .subsection {
    margin-top: 22px;
  }

  .subsection-title {
    font-size: 20px;
    font-weight: 600;
    color: #036FC0;
    margin-bottom: 12px;
  }

  .trial-card {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #e6eef5;
    background: #f7fbff;
  }

  .trial-title {
    font-weight: 600;
    color: #0e3045;
    margin-bottom: 8px;
  }

  .trial-desc {
    color: #4a5b67;
    font-size: 16px;
    line-height: 24px;
  }

  .trial-list {
    margin: 10px 0 0 18px;
    padding: 0;
    color: #4a5b67;
    font-size: 16px;
    line-height: 24px;
  }

  .primary-link {
    margin-top: 14px;
    background: #036FC0;
    color: #ffffff;
    border: none;
    padding: 10px 18px;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
  }

  .research-page ::v-deep .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 520px;
    margin: 0 auto;
  }
</style>
