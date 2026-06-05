<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-main">
        <div class="footer-brand">
          <div class="footer-brand-name">The Fetal Medicine Foundation</div>
        </div>

        <div class="footer-address">
          <div>137 Harley Street</div>
          <div>London, W1G 6BG</div>
          <div>United Kingdom</div>
        </div>

        <div class="footer-contact">
          <a href="tel:+442070343070">00 44 (0)207 034 3070</a>
          <div>
            <div>Education &amp; Events</div>
            <a href="mailto:education@fetalmedicine.org">education@fetalmedicine.org</a>
          </div>
          <div>
            <div>Certification &amp; Platform Support</div>
            <a href="mailto:certification@fetalmedicine.org">certification@fetalmedicine.org</a>
          </div>
        </div>

        <div class="footer-social">
          <a
            href="https://www.instagram.com/fetalmedicinefoundation"
            target="_blank"
            rel="noopener"
            aria-label="FMF Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17.5" cy="6.5" r="1"></circle>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/the-fetal-medicine-foundation"
            target="_blank"
            rel="noopener"
            aria-label="FMF LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M8 10v7"></path>
              <path d="M8 7v.01"></path>
              <path d="M12 17v-7"></path>
              <path d="M12 13.5c0-2 1.2-3.5 3-3.5 1.7 0 3 1.2 3 3.5V17"></path>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-copyright">
        <span>© 2026 The Fetal Medicine Foundation. All rights reserved.</span>
        <router-link class="privacy-link" to="/privacy-notice">Privacy Notice</router-link>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'FooterPage'
  }
</script>

<style lang="scss" scoped>
  .footer {
    width: 100%;
    background: linear-gradient(180deg, #f7fcff 0%, #eef8ff 100%);
    color: #036FC0;
    font-family: 'Helvetica', Arial, sans-serif;
    border-top: 1px solid #b9c7d6;
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 52px 24px 46px;
  }

  .footer-main {
    display: grid;
    grid-template-columns: minmax(300px, 1.15fr) minmax(190px, 0.8fr) minmax(280px, 1.15fr) auto;
    align-items: center;
    gap: 46px;
    padding-bottom: 48px;
    border-bottom: 1px solid #b9c7d6;
  }

  .footer-brand-name {
    color: #036FC0;
    font-size: 24px;
    line-height: 1.25;
    font-weight: 500;
    letter-spacing: 0;
    max-width: none;
    white-space: nowrap;
  }

  .footer-address,
  .footer-contact {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-size: 18px;
    line-height: 1.25;
    font-weight: 500;
  }

  .footer-contact {
    gap: 13px;
  }

  .footer-contact a {
    color: #036FC0;
    text-decoration: none;
  }

  .footer-contact a:hover {
    text-decoration: underline;
  }

  .footer-social {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .footer-social a {
    width: 32px;
    height: 32px;
    color: #036FC0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .footer-social svg {
    width: 32px;
    height: 32px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .footer-social a:hover {
    color: #003f9f;
  }

  .footer-copyright {
    padding-top: 40px;
    text-align: center;
    color: #036FC0;
    font-size: 17px;
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
  }

  .privacy-link {
    color: #036FC0;
    text-decoration: none;
    white-space: nowrap;
  }

  .privacy-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 1024px) {
    .footer-main {
      grid-template-columns: 1fr;
      gap: 24px;
      align-items: flex-start;
    }

    .footer-social {
      align-self: center;
    }
  }

  @media (max-width: 768px) {
    .footer-inner {
      padding: 36px 20px 32px;
    }

    .footer-main {
      padding-bottom: 32px;
    }

    .footer-brand-name {
      font-size: 22px;
      max-width: none;
    }

    .footer-address,
    .footer-contact {
      font-size: 16px;
    }

    .footer-copyright {
      padding-top: 28px;
      font-size: 14px;
    }
  }
</style>
