<template>
  <div class="vcontainer calculators-page">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container calculators-content">
      <div class="section">
        <div class="section-title">Calculators</div>
        <div class="section-desc">
          Select a calculator to open the embedded tool.
        </div>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.title"
            class="category-card">
            <div class="category-title">{{ category.title }}</div>
            <div class="category-list">
              <button
                v-for="calc in category.items"
                :key="calc.name"
                :class="['calc-btn', { active: calc.url === selectedCalculator.url }]"
                type="button"
                @click="selectCalculator(calc)">
                {{ calc.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="calc-modal" @click.self="closeModal">
      <div class="calc-modal-card">
        <div class="calc-modal-header">
          <div class="calc-modal-title">{{ selectedCalculator.name }}</div>
          <button class="calc-modal-close" type="button" @click="closeModal">Close</button>
        </div>
        <div class="calc-modal-body">
          <iframe
            class="calc-modal-frame"
            :src="selectedCalculator.url"
            title="Calculator"
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
    name: 'CalculatorsPage',
    components: {
      TopBanner
    },
    data() {
      const categories = [
        {
          title: 'Prediction of risk',
          items: [
            { name: 'Preeclampsia', url: 'https://fmf.refractionx.com/calculators?embed=true&bigpicture=true&id=preeclampsia' },
            { name: 'Small for Gestational Age', url: 'https://fmf.refractionx.com/calculators?embed=true&bigpicture=true&id=sga' },
            { name: 'Trisomies', url: 'https://fmf.refractionx.com/calculators?embed=true&bigpicture=true&id=trisomies' },
            { name: 'Gestational diabetes mellitus', url: 'https://fmf.refractionx.com/calculators?embed=true&bigpicture=true&id=gdm' },
            { name: 'Miscarriage', url: 'https://fetalmedicine.org/research/assess/miscarriage' },
            { name: 'Stillbirth', url: 'https://fetalmedicine.org/research/assess/stillbirth' },
            { name: 'Macrosomia', url: 'https://fetalmedicine.org/research/assess/macrosomia' },
            { name: 'Preterm birth (History)', url: 'https://fmf.refractionx.com/calculators?embed=true&bigpicture=true&id=pretermHistory' },
            { name: 'Preterm birth (Cervix)', url: 'https://fmf.refractionx.com/calculators?embed=true&bigpicture=true&id=pretermCervix' }
          ]
        },
        {
          title: 'Assessment / management',
          items: [
            { name: 'Management: Fetal anemia', url: 'https://fmf.refractionx.com/calculators?embed=true&bigpicture=true&id=fetalanemia' },
            { name: 'Pregnancy dating', url: 'https://fetalmedicine.org/research/assess/pregnancy-dating' },
            { name: 'Fetal growth assessment', url: 'https://fetalmedicine.org/research/assess/fetal-growth-assessment' },
            { name: 'Birth weight', url: 'https://fetalmedicine.org/research/assess/birth-weight' },
            { name: 'Fetal Doppler', url: 'https://fetalmedicine.org/research/assess/fetal-doppler' },
            { name: 'Uterine PI', url: 'https://fetalmedicine.org/research/assess/uterine-pi' },
            { name: 'Nuchal translucency', url: 'https://fetalmedicine.org/research/assess/nuchal-translucency' }
          ]
        },
        {
          title: 'Performance audits',
          items: [
            { name: 'Mean arterial pressure', url: 'https://fetalmedicine.org/research/assess/map' },
            { name: 'Uterine artery PI', url: 'https://fetalmedicine.org/research/assess/uterine-artery-pi' },
            { name: 'Nuchal translucency', url: 'https://fetalmedicine.org/research/assess/nuchal-translucency' },
            { name: 'Ductus venosus PIV', url: 'https://fetalmedicine.org/research/assess/ductus-venosus-piv' },
            { name: 'sFlt-1', url: 'https://fetalmedicine.org/research/assess/sflt1' },
            { name: 'PlGF', url: 'https://fetalmedicine.org/research/assess/plgf' },
            { name: 'PAPP-A', url: 'https://fetalmedicine.org/research/assess/papp-a' },
            { name: 'Free beta hCG', url: 'https://fetalmedicine.org/research/assess/free-beta-hcg' }
          ]
        },
        {
          title: 'Research tools',
          items: [
            { name: 'MoM calculator', url: 'https://fetalmedicine.org/research/assess/moms-calculation' },
            { name: 'Batch preeclampsia risks', url: 'https://fetalmedicine.org/research/assess/batch-preeclampsia-risks' }
          ]
        }
      ]
      return {
        topBannerList: [{
          img: require('@/assets/img/calculators_header.jpeg'),
          title: 'Calculators',
          desc: 'Risk assessment tools and audit calculators'
        }],
        categories,
        selectedCalculator: categories[0].items[0],
        isModalOpen: false
      }
    },
    methods: {
      selectCalculator(calc) {
        this.selectedCalculator = calc
        this.isModalOpen = true
      },
      closeModal() {
        this.isModalOpen = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .calculators-page {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 18px;
  }

  .calculators-content {
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
    font-size: 18px;
    line-height: 28px;
    color: #4a5b67;
    margin-bottom: 20px;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    gap: 16px;
  }

  .category-card {
    border: 1px solid #e6eef5;
    border-radius: 14px;
    padding: 16px;
    background: #f7fbff;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .category-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f5aa4;
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .calc-btn {
    text-align: left;
    border: 1px solid transparent;
    background: #ffffff;
    color: #0e3045;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 15px;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  }

  .calc-btn:hover {
    border-color: #b9d4ef;
    color: #036fc0;
    box-shadow: 0 4px 12px rgba(3, 111, 192, 0.1);
  }

  .calc-btn.active {
    border-color: #036fc0;
    color: #036fc0;
    box-shadow: 0 6px 14px rgba(3, 111, 192, 0.16);
  }

  .calc-modal {
    position: fixed;
    inset: 0;
    background: rgba(8, 24, 38, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 3000;
  }

  .calc-modal-card {
    width: min(1650px, 98vw);
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 18px 40px rgba(10, 36, 60, 0.35);
    display: flex;
    flex-direction: column;
  }

  .calc-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e6eef5;
  }

  .calc-modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #0e3045;
  }

  .calc-modal-close {
    border: none;
    background: #f1f6fb;
    color: #036fc0;
    font-weight: 600;
    border-radius: 999px;
    padding: 8px 16px;
    cursor: pointer;
  }

  .calc-modal-body {
    height: min(88vh, 980px);
  }

  .calc-modal-frame {
    width: 100%;
    height: 100%;
    border: none;
  }

  .calculators-page ::v-deep .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 520px;
    margin: 0 auto;
  }

  @media (max-width: 1200px) {
    .category-grid {
      grid-template-columns: repeat(2, minmax(220px, 1fr));
    }
  }

  @media (max-width: 720px) {
    .category-grid {
      grid-template-columns: 1fr;
    }
    .embed-wrapper,
    .embed-frame {
      min-height: 560px;
    }
  }
</style>
