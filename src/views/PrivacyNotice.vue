<template>
  <div class="privacy-notice-page">
    <div class="content-wrapper">
      <h1 class="page-title">Privacy Notice</h1>

      <section>
        <h2>UK GDPR Privacy Notice</h2>
        <p>The The Fetal Medicine Foundation will be what is known as the 'Controller' of the personal data you provide to us.</p>
        <p>We collect basic personal data about you that also includes special types of information (including medical information). This will also include name, address, email, phone number.</p>
      </section>

      <section>
        <h2>Why we need your data</h2>
        <p>We need to know your basic personal data in order to provide you with the service that you have commissioned from us linked to your direct care, payment for those services and any other statutory reporting requirements.</p>
        <p>We will not collect any personal data from you we do not need in order to provide and oversee this service to you.</p>
        <p>Where possible, all the personal data we process is processed by our staff in the UK but for the purposes of IT hosting and maintenance this information may located on servers within the European Union.</p>
        <p>No third parties have access to your personal data unless the law allows them to do so.</p>
        <p>We have a Data Protection regime in place to oversee the effective and secure processing of your personal data.</p>
        <p>We are required under UK tax law to keep your basic personal data (name, address, contact details) for a minimum of 6 years but we are also required to comply with the NHSx Record Management Code of Practice 2021.</p>
        <p>Your information we use for marketing purposes will be kept with us until you notify us that you no longer wish to receive this information. More information on our retention schedule can be found by contacting our Data Protection Officer.</p>
        <p>If at any point you believe the information we process about you is incorrect you can request to see this information and have it corrected or deleted.</p>
      </section>

      <section>
        <h2>Legal Basis</h2>
        <p>Our legal basis for processing your information is based on a variety of circumstances but will generally be:</p>
        <p>Explicit consent<br>Contract<br>Legitimate Interests</p>
      </section>

      <section>
        <h2>Research</h2>
        <p>All profits are from the Fetal Medicine Centre are donated to the Fetal Medicine Foundation.</p>
        <p>You can find out more here <router-link to="/" class="inline-link">The Fetal Medicine Foundation</router-link>.</p>
        <p>Some research activities are international, but all participants are aware of this.</p>
      </section>

      <section>
        <h2>National Data Opt-out</h2>
        <p>If you wish to find out more about how the NHS uses your data and how you can express your preferences about how that data is used go to https://www.nhs.uk/your-nhs-data-matters/.</p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>If you wish to raise a complaint on how we have managed your personal data, please follow our complaints procedure or ask to speak with our data protection officer Curtiss Green or you can contact him at <a href="mailto:curtiss@grgserv.co.uk" class="inline-link">curtiss@grgserv.co.uk</a>.</p>
        <p>If you are not satisfied with our response or believe we are processing your personal data not in accordance with the law you can complain to the Information Commissioner's Office <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" class="inline-link">https://ico.org.uk/</a></p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyNoticePage'
}
</script>

<style lang="scss" scoped>
.privacy-notice-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 60px 20px 80px;
  box-sizing: border-box;

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;

    .page-title {
      font-size: 32px;
      font-weight: bold;
      color: #0e3045;
      margin: 0 0 32px;
    }

    section {
      margin-bottom: 28px;

      h2 {
        font-size: 18px;
        font-weight: bold;
        color: #000000;
        margin: 0 0 8px;
      }

      p {
        font-size: 18px;
        color: #333333;
        line-height: 1.75;
        margin: 0 0 10px;
        text-align: justify;
      }
    }

    .inline-link {
      color: #036fc0;
      text-decoration: underline;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

@media (max-width: 1279px) {
  .privacy-notice-page {
    padding: 50px 24px 70px;
  }
}

@media (max-width: 768px) {
  .privacy-notice-page {
    padding: 40px 16px 60px;

    .content-wrapper {
      .page-title { font-size: 26px; }
      section h2 { font-size: 16px; }
      section p { font-size: 16px; }
    }
  }
}

@media (max-width: 480px) {
  .privacy-notice-page {
    padding: 32px 14px 50px;

    .content-wrapper {
      .page-title { font-size: 22px; }
      section h2 { font-size: 15px; }
      section p { font-size: 15px; }
    }
  }
}
</style>
