<template>
  <div class="vcontainer support-developed">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container support-developed-content">
      <div class="section">
        <div class="section-title">Support in developed countries</div>
        <div class="section-desc">
          Look for Life also supports specialist fetal medicine centers in developed countries. The projects below
          highlight targeted investment in facilities, equipment, and training.
        </div>
      </div>

      <div class="project-grid">
        <div v-for="project in projects" :key="project.title" class="project-card">
          <div class="project-image">
            <el-image :src="project.image" fit="cover" :alt="project.title" />
          </div>
          <div class="project-header">
            <div class="project-title">{{ project.title }}</div>
            <div class="project-location">{{ project.location }}</div>
          </div>
          <div class="project-body">
            <p v-for="(line, index) in project.details" :key="index" class="project-text">
              {{ line }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'SupportDevelopedCountriesPage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/look_for_life_developed_header.jpeg'),
          title: 'Look for Life',
          desc: 'Support in developed countries'
        }],
        projects: [
          {
            title: 'Southend University Hospital',
            location: 'Essex, United Kingdom',
            image: 'https://fetalmedicine.org/var/uploads/File/0/0/s/o/u/southend_400_001.JPG',
            details: [
              'The FMF made a major donation to develop and equip a specialist fetal medicine centre at Southend University Hospital.',
              'The centre opened in 2015 and provides specialist fetal medicine care for the region.',
              'Doctors are involved in research into pregnancy complications and contribute to training.',
              'Doctors also rotate for six months in the fetal medicine unit at King\'s College Hospital, London.'
            ]
          },
          {
            title: 'Attikon University Hospital',
            location: 'Athens, Greece',
            image: require('@/assets/img/attiko2_2.jpg'),
            details: [
              'The FMF donated a high-quality ultrasound machine to Attikon University Hospital.',
              'Attikon participated in a multicentre European study showing low-dose aspirin for high-risk women is highly effective in preventing preeclampsia.'
            ]
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .support-developed {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    padding-top: 72px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }

  .support-developed-content {
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
    color: #0e3045;
    margin-bottom: 12px;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
  }

  .project-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .project-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 22px;
    box-shadow: 0 6px 18px rgba(14, 48, 69, 0.06);
    border: 1px solid #e6eef5;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-sizing: border-box;
  }

  .project-image {
    width: 100%;
    height: 220px;
    border-radius: 10px;
    overflow: hidden;
    background: #ffffff;
  }

  .project-image ::v-deep .el-image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
  }

  .project-image ::v-deep .el-image__inner {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
    background-color: #ffffff;
  }

  .project-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0;
  }

  .project-title {
    font-size: 18px;
    font-weight: bold;
    color: #0e3045;
  }

  .project-location {
    font-size: 14px;
    color: #6c7a86;
  }

  .project-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
  }

  .project-text {
    margin: 0;
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
    text-align: justify;
    text-align-last: left;
  }

  ::v-deep .top-banner .top-banner-content {
    align-items: center;
    text-align: center;
    font-family: 'Helvetica', Arial, sans-serif;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
  }

  ::v-deep .top-banner .top-banner-bg {
    background-size: contain;
    background-color: #0f3247;
  }

  ::v-deep .top-banner .top-banner-content .title {
    letter-spacing: 0.3px;
    font-family: 'Helvetica', Arial, sans-serif;
  }

  ::v-deep .top-banner .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
    max-width: 900px;
    font-family: 'Helvetica', Arial, sans-serif;
  }
</style>
