<template>
  <div class="vcontainer vcenter footer">
    <div class="fill hcontainer hcenter flex-between main-container">
      <div class="vcontainer logo-container">
        <span class="logo-title">Fetal Medicine Foundation</span>
        <span class="logo-desc">Advanced medical education platform by The Fetal Medicine Foundation.</span>
      </div>
      <div v-for="(column, index) in navColumns" :key="index" class="vcontainer nav-item">
        <span class="nav-title">{{ column.title }}</span>
        <a v-for="(link, linkIndex) in column.links" :key="linkIndex" class="nav-link" :href="link.href" target="_blank">{{ link.text }}</a>
      </div>
    </div>
    <span class="copyright">© 2025 The Fetal Medicine Foundation. All rights reserved.</span>
  </div>
</template>

<script>
  export default {
    name: 'FooterPage',
    data() {
      return {
        navColumns: [
          {
            title: 'Courses',
            links: [
              { text: 'Education', href: '/#/course?categoryName=Education' },
              { text: 'Certificates', href: '/#/' }
            ]
          },
          {
            title: 'Congress',
            links: [
              { text: 'FMF World Congress', href: '/#/congress' },
              { text: 'FMF Advances Course', href: 'https://www.fetalmedicine.org/courses-n-congress/fmf-advances-course' }
            ]
          },
          {
            title: 'Support',
            links: [
              { text: 'Calculators', href: 'https://www.fetalmedicine.org/' },
              { text: 'Research', href: 'https://www.fetalmedicine.org/research/research-publications' }
            ]
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: auto;
  color: #ffffff;
  font-size: 18px;
  background-color: #0E3045;
  .main-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px 24px;
    box-sizing: border-box;
    flex-wrap: wrap;
    gap: 20px;
    .logo-container {
      height: 100%;
      max-width: 280px;
      text-align: left;
      .logo-title {
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: bold;
      }
      .logo-desc {
        font-size: 16px;
        opacity: 0.8;
      }
    }
    .nav-item {
      height: 100%;
      .nav-title {
        margin-bottom: 12px;
        font-size: 18px;
        font-weight: bold;
      }
      .nav-link {
        color: #ffffff;
        margin-bottom: 8px;
        text-decoration: none;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #a7d5f5;
        }
      }
    }
  }
  .copyright {
    width: 100%;
    padding: 12px 16px;
    line-height: 22px;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    background-color: #042132;
  }

  @media (max-width: 768px) {
    .main-container {
      padding: 24px 16px 20px;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .logo-container {
      max-width: 100%;
      text-align: center;
    }
    .nav-item {
      align-items: center;
    }
  }
}
</style>
