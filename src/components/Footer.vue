<template>
  <div class="vcontainer vcenter footer">
    <div class="fill hcontainer hcenter main-container footer-content">
      <div class="footer-col footer-brand">Fetal Medicine Foundation</div>
      <div class="footer-col">
        <div>137 Harley Street</div>
        <div>London, W1G 6BG</div>
        <div>United Kingdom</div>
      </div>
      <div class="footer-col">
        <div>Telephone: 00 44 (0)207 034 3070</div>
        <div>Email: education@fetalmedicine.org</div>
      </div>
    </div>
    <span class="copyright">© 2026 The Fetal Medicine Foundation. All rights reserved.</span>
  </div>
</template>

<script>
  export default {
    name: 'FooterPage'
  }
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: auto;
  color: #ffffff;
  font-size: 14px;
  background-color: #0f3247;
  font-family: 'Helvetica', Arial, sans-serif;
  .main-container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 24px;
    box-sizing: border-box;
    gap: 120px;
    align-items: center;
  }

  .footer-content {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .footer-col {
    font-size: 14px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.92);
    text-align: center;
    min-width: 220px;
  }

  .footer-brand {
    font-weight: 600;
    white-space: nowrap;
  }

  .copyright {
    width: 100%;
    padding: 16px 24px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    text-align: center;
    background-color: #0b283a;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    .main-container {
      padding: 28px 20px;
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>
