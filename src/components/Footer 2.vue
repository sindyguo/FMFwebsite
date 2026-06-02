<template>
  <div class="vcontainer vcenter footer">
    <div class="fill hcontainer hcenter flex-between main-container">
      <div class="vcontainer logo-container">
        <span class="logo-title">The Fetal Medicine Foundation</span>
      </div>
      <div
        v-for="(column, columnIndex) in navColumns"
        :key="columnIndex"
        class="vcontainer nav-item">
        <span
          v-for="(link, linkIndex) in column.links"
          :key="linkIndex"
          class="av-title nav-link">
          {{ link.text }}
        </span>
      </div>
    </div>
    <div class="copyright">
      <div class="copyright-inner">
        <span>© 2026 The Fetal Medicine Foundation. All rights reserved.</span>
        <router-link class="privacy-link" to="/privacy-notice">Privacy Notice</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FooterPage',
    data() {
      return {
        navColumns: [
          {
            links: [
              { text: '137 Harley Street' },
              { text: 'London, W1G 6BG' },
              { text: 'United Kingdom' }
            ]
          },
          {
            links: [
              { text: 'Telephone: 00 44 (0)207 034 3070' },
              { text: 'Email: education@fetalmedicine.org' },
              { text: 'Email: certification@fetalmedicine.org' }
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
    height: 200px;
    color: #ffffff;
    font-size: 18px;
    background-color: #0e3045;
  }

  .footer .main-container {
    width: 1200px;
    margin: 45px auto 30px;
  }

  .footer .main-container .logo-container {
    height: 100%;
    max-width: 380px;
    text-align: left;
  }

  .footer .main-container .logo-container .logo-title {
    margin-bottom: 12px;
    font-size: 20px;
    font-weight: 700;
  }

  .footer .main-container .nav-item {
    height: 100%;
  }

  .footer .main-container .nav-item .nav-link {
    color: #ffffff;
    margin-bottom: 8px;
    text-decoration: none;
    font-size: 16px;
    cursor: default;
  }

  .footer .copyright {
    width: 100%;
    height: 56px;
    background-color: #042132;
    display: flex;
    align-items: center;
  }

  .footer .copyright .copyright-inner {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: #ffffff;
  }

  .footer .copyright .privacy-link {
    color: #ffffff;
    text-decoration: none;
    font-size: 16px;
    white-space: nowrap;
  }

  .footer .copyright .privacy-link:hover {
    color: #a7d5f5;
    text-decoration: underline;
  }

  @media (min-width: 768px) and (max-width: 1279px) {
    .footer {
      height: auto;
    }

    .footer .main-container {
      width: 100%;
      padding: 32px 24px 24px;
      margin: 0 auto;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer .main-container .logo-container {
      max-width: 280px;
    }

    .footer .main-container .logo-container .logo-title {
      font-size: 17px;
    }

    .footer .main-container .nav-item .nav-link {
      font-size: 14px;
    }

    .footer .copyright {
      height: 48px;
    }

    .footer .copyright .copyright-inner {
      width: 100%;
      padding: 0 24px;
      font-size: 14px;
    }
  }

  @media (max-width: 767px) {
    .footer {
      height: auto;
    }

    .footer .main-container {
      width: 100%;
      padding: 28px 20px 20px;
      margin: 0 auto;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .footer .main-container .logo-container {
      max-width: 100%;
    }

    .footer .main-container .logo-container .logo-title {
      font-size: 16px;
    }

    .footer .main-container .nav-item {
      height: auto;
    }

    .footer .main-container .nav-item .nav-link {
      font-size: 14px;
      margin-bottom: 6px;
    }

    .footer .copyright {
      height: auto;
      min-height: 44px;
      padding: 10px 0;
    }

    .footer .copyright .copyright-inner {
      width: 100%;
      padding: 0 20px;
      font-size: 13px;
      gap: 10px;
      flex-wrap: wrap;
    }
  }
</style>
