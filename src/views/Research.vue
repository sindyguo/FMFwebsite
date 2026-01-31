<template>
  <div class="vcontainer research-page">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container research-content">
      <div class="section">
        <div class="section-title">Ongoing randomized trials</div>
        <div class="trial-grid">
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

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
  }

  .trial-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
