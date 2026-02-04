<template>
  <div class="vcontainer research-publications">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container publications-content">
      <div class="section">
        <div class="section-header">
          <div class="section-heading">
            <router-link class="back-link" to="/research">
              <span class="back-arrow" aria-hidden="true"></span>
              Go back to Research
            </router-link>
          </div>
          <div class="filters">
            <div class="filter-item">
              <label class="filter-label" for="publication-year">Year</label>
              <select id="publication-year" v-model="yearFilter" class="filter-select">
                <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="filter-item search">
              <label class="filter-label" for="publication-search">Search</label>
              <div class="search-box">
                <input
                  id="publication-search"
                  v-model="keyword"
                  type="text"
                  placeholder="Search by title, author, or journal">
                <button type="button" class="search-clear" @click="keyword = ''">Clear</button>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <span class="page-chip">&lt;&lt;</span>
          <span class="page-chip">&lt;</span>
          <span class="page-chip active">1</span>
          <span class="page-chip">2</span>
          <span class="page-chip">3</span>
          <span class="page-chip">4</span>
          <span class="page-chip">5</span>
          <span class="page-chip">6</span>
          <span class="page-chip">7</span>
          <span class="page-chip">&gt;</span>
          <span class="page-chip">&gt;&gt;</span>
        </div>
        <div class="pub-list">
          <div v-for="item in filteredPublications" :key="item.num" class="pub-item">
            <div class="pub-title">
              {{ item.num }}. {{ item.title }}
            </div>
            <div class="pub-authors">{{ item.authors }}</div>
            <div class="pub-journal">{{ item.journal }}</div>
          </div>
        </div>
        <div v-if="filteredPublications.length === 0" class="empty-state">
          No publications match the selected filters.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'ResearchPublicationsPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/headers/research-header.jpeg'),
          title: '',
          desc: ''
        }],
        yearFilter: 'All',
        keyword: '',
        publications: [
          {
            num: 1,
            title: 'Routine 36-week scan: prediction of small-for-gestational-age neonate.',
            authors: 'Adjahou S, Syngelaki A, Nanda M, Papavasileiou D, Akolekar R, Nicolaides KH.',
            journal: 'Ultrasound Obstet Gynecol 2025;65:20-29.'
          },
          {
            num: 2,
            title: 'At mid-gestation, markers of placental function rather than maternal cardiac function are stronger determinants of birthweight.',
            authors: 'Papastefanou I, Mesaric V, Gomes Castello R, Nicolaides KH, Charakida M.',
            journal: 'Am J Obstet Gynecol 2025;S0002-9378:00040-7.'
          },
          {
            num: 3,
            title: 'Predictors of Cardiometabolic Health a Few Months Postpartum in Women Who Had Developed Gestational Diabetes.',
            authors: 'Gomez Fernandez C, Golubic R, Mitsigiorgi R, Mansukhani T, Car J, Nicolaides KH.',
            journal: 'Nutrients 2025;17:390.'
          },
          {
            num: 4,
            title: 'Blood pressure cutoffs at 11-13 weeks of gestation and risk of preeclampsia.',
            authors: 'Slade LJ, Syngelaki A, Wilson M, Mistry HD, Akolekar R, von Dadelszen P, Nicolaides KH, Magee LA.',
            journal: 'Am J Obstet Gynecol 2025;232:214.e1-214.e10.'
          },
          {
            num: 5,
            title: 'Enhancing postpartum cardiometabolic health for women with previous gestational diabetes: Next steps and unanswered questions for pharmacological and lifestyle strategies.',
            authors: 'Golubic R, Car J, Nicolaides K.',
            journal: 'Diabetes Obes Metab 2025;27:447-449.'
          },
          {
            num: 6,
            title: 'Routine 36-week scan: diagnosis and outcome of abnormal fetal presentation.',
            authors: 'Fitiri M, Papavasileiou D, Mesaric V, Syngelaki A, Akolekar R, Nicolaides KH.',
            journal: 'Ultrasound Obstet Gynecol 2025;65:154-162.'
          },
          {
            num: 7,
            title: 'Association of maternal body mass index with hemodynamic and vascular alterations at 35-37 weeks\' gestation.',
            authors: 'Charakida M, Chatzakis C, Magee LA, Syngelaki A, Mansukhani T, von Dadelszen P, Nicolaides KH.',
            journal: 'Ultrasound Obstet Gynecol 2025;65:303-310.'
          },
          {
            num: 8,
            title: 'Maternal vascular dysfunction in gestational diabetes is associated with birth of small neonates.',
            authors: 'Chatzakis C, Lausegger S, Sembrera E, Vargas S, Nicolaides KH, Charakida M.',
            journal: 'Diabetes Res Clin Pract 2025;221:112032.'
          },
          {
            num: 9,
            title: 'Vaginal progesterone reduces the risk of preterm birth and adverse perinatal outcomes in singleton gestations with a midtrimester sonographic short cervix (<=25 mm): an updated individual patient data meta-analysis.',
            authors: 'Romero R, Conde-Agudelo A, da Fonseca E, O\'Brien JM, Creasy GW, Hassan SS, Nicolaides KH.',
            journal: 'Am J Obstet Gynecol 2025;S0002-9378:00158-9.'
          },
          {
            num: 10,
            title: 'Soluble fms-like tyrosine kinase-1/placental growth factor ratio at 36 weeks\' gestation: association with spontaneous onset of labor and intrapartum fetal compromise in low-risk pregnancies.',
            authors: 'Farina A, Cavoretto PI, Syngelaki A, Adjahou S, Nicolaides KH.',
            journal: 'Am J Obstet Gynecol 2025;232:392.e1-392.e14.'
          },
          {
            num: 11,
            title: 'Evidence that systemic vascular resistance is increased before the development of gestational diabetes mellitus.',
            authors: 'Gana N, Chatzakis C, Sarno M, Charakida M, Nicolaides KH.',
            journal: 'Am J Obstet Gynecol 2025;232:398.e1-398.e9.'
          },
          {
            num: 12,
            title: 'Evaluating the Cost-Effectiveness of Antenatal Screening for Major Structural Anomalies During the First Trimester of Pregnancy: A Decision Model.',
            authors: 'Campbell HE, Karim JN, Papageorghiou AT, Wilson ECF, Rivero-Arias O, ACCEPTS Study.',
            journal: 'BJOG 2025;132:638-647.'
          },
          {
            num: 13,
            title: 'Increased nuchal translucency thickness and normal chromosomal microarray: Danish nationwide cohort study.',
            authors: 'Gadsboll K, Brix N, Sandager P, Petersen OB, Souka AP, Nicolaides KH, Vogel I.',
            journal: 'Ultrasound Obstet Gynecol 2025;65:462-469.'
          },
          {
            num: 14,
            title: 'Routine 36-week scan: diagnosis of fetal abnormalities.',
            authors: 'Syngelaki A, Mitsigiorgi R, Goadsby J, Hamed K, Akolekar R, Nicolaides KH.',
            journal: 'Ultrasound Obstet Gynecol 2025;65:427-435.'
          },
          {
            num: 15,
            title: 'The risk for preeclampsia at 36 weeks and at 12 weeks predicts intrapartum fetal compromise and spontaneous onset of labor.',
            authors: 'Cavoretto PI, Farina A, Syngelaki A, Solonos F, Nicolaides KH.',
            journal: 'Am J Obstet Gynecol 2025;S0002-9378:00249-2.'
          },
          {
            num: 16,
            title: 'Aspirin delays preeclampsia in women with chronic hypertension.',
            authors: 'Bujold E, Rolnik DL, Poon L, Syngelaki A, Wright D, Nicolaides KH.',
            journal: 'Am J Obstet Gynecol 2025;S0002-9378:00261-3.'
          },
          {
            num: 17,
            title: 'Maternal vascular-placental axis in the third trimester in women with gestational diabetes mellitus, hypertensive disorders, and unaffected pregnancies.',
            authors: 'Chatzakis C, Papavasiliou D, Mansukhani T, Nicolaides KH, Charakida M.',
            journal: 'Am J Obstet Gynecol 2025;232:489.e1-489.e11.'
          },
          {
            num: 18,
            title: 'First-trimester maternal ophthalmic artery Doppler is associated with insulin-treated gestational diabetes mellitus.',
            authors: 'Chatzakis C, Charakida M, Nicolaides KH.',
            journal: 'Am J Obstet Gynecol 2025;232:e185.'
          },
          {
            num: 19,
            title: 'Aspirin discontinuation in high-risk preeclampsia: the role of vascular vs placental factors-authors\' reply.',
            authors: 'Rolnik DL, Wright D, Nicolaides KH.',
            journal: 'Am J Obstet Gynecol 2025;232:e187.'
          },
          {
            num: 20,
            title: 'Reduced GATA1 levels are associated with ineffective erythropoiesis in sickle cell anemia.',
            authors: 'El Hoss S, Shangaris P, Brewin J, Psychogyios ME, Ng C, Pedler L, Rooks H, Gotardo EMF, Gushiken LFS, Brito PL, Nicolaides KH, Conran N, Rees DC, Strouboulis J.',
            journal: 'Haematologica 2025;110:1150-1163.'
          }
        ],
        yearOptions: ['All', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
      }
    },
    computed: {
      filteredPublications() {
        const keyword = this.keyword.trim().toLowerCase()
        const yearFilter = this.yearFilter
        return this.publications.filter((item) => {
          if (yearFilter !== 'All') {
            const year = this.getYear(item)
            if (year !== yearFilter) {
              return false
            }
          }
          if (!keyword) {
            return true
          }
          const haystack = `${item.title} ${item.authors} ${item.journal}`.toLowerCase()
          return haystack.includes(keyword)
        })
      }
    },
    methods: {
      getYear(item) {
        const match = (item.journal || '').match(/20\\d{2}/)
        return match ? match[0] : ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .research-publications {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }

  .research-publications ::v-deep .top-banner .top-banner-content {
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  .research-publications ::v-deep .top-banner .top-banner-content .title {
    margin: 0;
    text-shadow: 0 2px 6px rgba(6, 32, 68, 0.7), 0 0 2px rgba(6, 32, 68, 0.9);
  }

  .publications-content {
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

  .section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .section-heading {
    flex: 1 1 auto;
    min-width: 240px;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 160px;
  }

  .filter-item.search {
    min-width: 260px;
  }

  .filter-label {
    font-size: 15px;
    font-weight: 600;
    color: #0e3045;
  }

  .filter-select {
    border: 1px solid #dbe7f1;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 16px;
    color: #0e3045;
    background: #ffffff;
    height: 48px;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #dbe7f1;
    border-radius: 10px;
    padding: 6px 14px;
    background: #ffffff;
    height: 48px;
  }

  .search-box input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 16px;
    color: #0e3045;
    background: transparent;
  }

  .search-clear {
    border: none;
    background: #f1f6fb;
    color: #036fc0;
    font-weight: 600;
    border-radius: 999px;
    padding: 6px 14px;
    cursor: pointer;
  }

  .section-title {
    font-size: 20px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #036fc0;
    font-weight: 600;
    text-decoration: none;
    font-size: 16px;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .back-arrow {
    position: relative;
    width: 10px;
    height: 2px;
    background: #036fc0;
    display: inline-block;
  }

  .back-arrow::before {
    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    width: 6px;
    height: 6px;
    border-left: 2px solid #036fc0;
    border-bottom: 2px solid #036fc0;
    transform: rotate(45deg);
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
    margin-bottom: 14px;
  }

  .pub-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .pub-item {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #e6eef5;
    background: #f7fbff;
  }

  .pub-title {
    font-weight: 600;
    color: #0e3045;
    margin-bottom: 6px;
  }

  .pub-journal {
    color: #6b7380;
    font-size: 14px;
  }

  .pub-authors {
    color: #5a6773;
    font-size: 14px;
    margin-bottom: 6px;
  }

  .pagination {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .page-chip {
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid #e6eef5;
    color: #4a5b67;
    font-size: 13px;
  }

  .page-chip.active {
    background: #0f5aa4;
    color: #ffffff;
    border-color: #0f5aa4;
  }

  .inline-link {
    color: #036fc0;
    font-weight: 600;
    text-decoration: underline;
  }

  .empty-state {
    color: #6b7380;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .research-publications ::v-deep .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 520px;
    margin: 0 auto;
  }

  @media (max-width: 900px) {
    .section-header {
      flex-direction: column;
      align-items: stretch;
    }
    .filters {
      justify-content: flex-start;
    }
    .filter-item.search {
      min-width: 100%;
    }
  }
</style>
