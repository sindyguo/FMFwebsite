<template>
  <div class="vcontainer sponsor">
    <TopBanner height="260px" :listData="topBannerList" /> 
    <div class="vcontainer hcenter main-container sponsor-container">
      <div class="sponsor-title sponsor-diamond">Diamond Sponsors</div>
      <div class="vcontainer">
        <div v-for="(sponsor, index) in sponsorInfo.diamonSponsorsList" :key="index" class="hcontainer sponsor-item">
          <div class="companyBox" v-if="index % 2 === 0">
            <el-image :src="sponsor.companyLogo || logoSrc" class="sponsor-img" alt="" />
            <div class="linkInfo">
              <div class="companyName">{{sponsor.companyName}}</div>
              <div class="officialWebsite" @click="goto(sponsor.officialWebsite)">{{sponsor.officialWebsite}}</div>
            </div>
          </div>
          <span class="fill">{{ sponsor.companyProfile }}</span>
          <div class="companyBox" v-if="index % 2 !== 0">
            <el-image :src="sponsor.companyLogo || logoSrc" class="sponsor-img" alt="" />
            <div class="linkInfo">
              <div class="companyName">{{sponsor.companyName}}</div>
              <div class="officialWebsite" @click="goto(sponsor.officialWebsite)">{{sponsor.officialWebsite}}</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <div class="sponsor-middle">
      <div class="vcontainer hcenter main-container sponsor-container">
        <div class="sponsor-title sponsor-gold">Gold Sponsors</div>
        <div class="vcontainer">
          <div v-for="(sponsor, index) in sponsorInfo.goldSponsorsList" :key="index" class="hcontainer sponsor-item">
            <div class="companyBox" v-if="index % 2 === 0">
            <el-image :src="sponsor.companyLogo || logoSrc" class="sponsor-img" alt="" />
            <div class="linkInfo">
              <div class="companyName">{{sponsor.companyName}}</div>
              <div class="officialWebsite" @click="goto(sponsor.officialWebsite)">{{sponsor.officialWebsite}}</div>
            </div>
          </div>
          <span class="fill">{{ sponsor.companyProfile }}</span>
          <div class="companyBox" v-if="index % 2 !== 0">
            <el-image :src="sponsor.companyLogo || logoSrc" class="sponsor-img" alt="" />
            <div class="linkInfo">
              <div class="companyName">{{sponsor.companyName}}</div>
              <div class="officialWebsite" @click="goto(sponsor.officialWebsite)">{{sponsor.officialWebsite}}</div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vcontainer hcenter main-container sponsor-container">
      <div class="sponsor-title sponsor-silver">Silver Sponsors</div>
      <div class="vcontainer">
        <div v-for="(sponsor, index) in sponsorInfo.silverSponsorsList" :key="index" class="hcontainer sponsor-item">
          <div class="companyBox" v-if="index % 2 === 0">
            <el-image :src="sponsor.companyLogo || logoSrc" class="sponsor-img" alt="" />
            <div class="linkInfo">
              <div class="companyName">{{sponsor.companyName}}</div>
              <div class="officialWebsite" @click="goto(sponsor.officialWebsite)">{{sponsor.officialWebsite}}</div>
            </div>
          </div>
          <span class="fill">{{ sponsor.companyProfile }}</span>
          <div class="companyBox" v-if="index % 2 !== 0">
            <el-image :src="sponsor.companyLogo || logoSrc" class="sponsor-img" alt="" />
            <div class="linkInfo">
              <div class="companyName">{{sponsor.companyName}}</div>
              <div class="officialWebsite" @click="goto(sponsor.officialWebsite)">{{sponsor.officialWebsite}}</div>
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
    name: 'SponsorPage',
    components:  {
      TopBanner
    },
    data() {
      return {
        logoSrc: require('@/assets/img/logo.png'),
        topBannerList: [{
          img: require('@/assets/img/world_congress_top.png'),
          title: 'Sponsors and Exhibitors',
          desc: '23rd World Congress in Fetal Medicine'
        }],
        diamondSponsors: [
          {
            // logo: require('@/assets/img/ge-healthcare-logo.png'),
            name: 'GE Healthcare',
            website: 'gehealthcare.com',
            description: 'GE HealthCare is a leading global medical technology, pharmaceutical diagnostics, and digital solutions innovator, dedicated to providing integrated solutions, services, and data analytics to make hospitals more efficient, clinicians more effective, therapies more precise, and patients healthier and happier. Serving patients and providers for more than 100 years, GE HealthCare is advancing personalized, connected, and compassionate care, while simplifying the patient’s journey across the care pathway. Together our Imaging, Ultrasound, Patient Care Solutions, and Pharmaceutical Diagnostics businesses help improve patient care from prevention and screening, to diagnosis, treatment, therapy, and monitoring. We are an $18 billion business with 51,000 employees working to create a world where healthcare has no limits.'
          },
          {
            // logo: require('@/assets/img/samsung-logo.png'),
            name: 'Samsung',
            website: 'samsungmedison.com',
            description: 'Samsung is committed to create a new future for medical professionals and patients with a mission to bring health and well-being to people’s lives. With this in mind, Samsung Medison, an ultrasound company based in South Korea, is part of this commitment by providing innovative products and solutions for three medical professionals and patients, as well as by supporting life-long healthcare for women by pursuing innovative healthcare solutions in Ob/Gyn ultrasound. With integration of Samsung’s state-of-the-art technologies in the field of IT, image signal processing, semiconductors and communications, Samsung Medison develops ultrasound AI diagnostic technologies in radiology, OB/GYN, orthopedics and etc, as well as ultrasound machines for fast and accurate diagnosis. In addition, Samsung Medison focuses on guaranteeing efficient workflows and differentiated diagnostic solutions for user conveniences by collaborating with various global enterprises.'
          }
        ],
        goldSponsors: [
          {
            // logo: require('@/assets/img/canon-medical-logo.png'),
            name: 'Canon Medical',
            website: 'gehealthcare.com',
            description: 'At Revity, “impossible” is inspiration, and “can’t be done” is a call to action. Revity provides health science solutions, technologies, expertise and services that deliver complete workflows from discovery to development, and diagnosis to cure. Revity is revolutionizing what’s possible in healthcare, with specialization in translational multi-omics technologies, biomarker identification, imaging, prediction, screening, detection and diagnosis, informatics and more. With more than $3 billion in revenue and over 11,000 employees, Revity serves customers across pharma and biotech, diagnostic labs, academia and governments. Revity is part of the S&P 500 Index and has customers in more than 190 countries. Revity products were chosen as the principal screening tool for the ASPRE study. Throughout the study, the Revity’s DELFIA® Xpress PGF 1-2-3TM assay was used as an aid in screening for pre-eclampsia in conjunction with maternal history, mean arterial blood pressure (MAP) measurement, and uAD (Uterine Artery Doppler). In 2022, Revity’s DELFIA® Xpress PGF 1-2-3TM and DELFIA® Xpress sFlt-1/PGF Ratio were approved for inclusion in NICE DG-49 diagnostic guidance “PIGF based testing to help diagnose suspected preterm preeclampsia.” To help facilitate wider access to non-invasive prenatal testing for pregnant women, Revity offers an easy to use, cost-effective, high-throughput screening system. The Vanadis® cfDNA system is an automated non-sequencing, non-PCR based solution for cfDNA analysis.'
          },
          {
            // logo: require('@/assets/img/thermo-fisher-logo.png'),
            name: 'Thermo Fisher',
            website: 'samsungmedison.com',
            description: 'At Revity, “impossible” is inspiration, and “can’t be done” is a call to action. Revity provides health science solutions, technologies, expertise and services that deliver complete workflows from discovery to development, and diagnosis to cure. Revity is revolutionizing what’s possible in healthcare, with specialization in translational multi-omics technologies, biomarker identification, imaging, prediction, screening, detection and diagnosis, informatics and more. With more than $3 billion in revenue and over 11,000 employees, Revity serves customers across pharma and biotech, diagnostic labs, academia and governments. Revity is part of the S&P 500 Index and has customers in more than 190 countries. Revity products were chosen as the principal screening tool for the ASPRE study. Throughout the study, the Revity’s DELFIA® Xpress PGF 1-2-3TM assay was used as an aid in screening for pre-eclampsia in conjunction with maternal history, mean arterial blood pressure (MAP) measurement, and uAD (Uterine Artery Doppler). In 2022, Revity’s DELFIA® Xpress PGF 1-2-3TM and DELFIA® Xpress sFlt-1/PGF Ratio were approved for inclusion in NICE DG-49 diagnostic guidance “PIGF based testing to help diagnose suspected preterm preeclampsia.” To help facilitate wider access to non-invasive prenatal testing for pregnant women, Revity offers an easy to use, cost-effective, high-throughput screening system. The Vanadis® cfDNA system is an automated non-sequencing, non-PCR based solution for cfDNA analysis.'
          }
        ],
        silverSponsors: [
          {
            // logo: require('@/assets/img/revity-logo.png'),
            name: 'Revity',
            website: 'revity.com',
            description: 'At Revity, “impossible” is inspiration, and “can’t be done” is a call to action. Revity provides health science solutions, technologies, expertise and services that deliver complete workflows from discovery to development, and diagnosis to cure. Revity is revolutionizing what’s possible in healthcare, with specialization in translational multi-omics technologies, biomarker identification, imaging, prediction, screening, detection and diagnosis, informatics and more. With more than $3 billion in revenue and over 11,000 employees, Revity serves customers across pharma and biotech, diagnostic labs, academia and governments. Revity is part of the S&P 500 Index and has customers in more than 190 countries. Revity products were chosen as the principal screening tool for the ASPRE study. Throughout the study, the Revity’s DELFIA® Xpress PGF 1-2-3TM assay was used as an aid in screening for pre-eclampsia in conjunction with maternal history, mean arterial blood pressure (MAP) measurement, and uAD (Uterine Artery Doppler). In 2022, Revity’s DELFIA® Xpress PGF 1-2-3TM and DELFIA® Xpress sFlt-1/PGF Ratio were approved for inclusion in NICE DG-49 diagnostic guidance “PIGF based testing to help diagnose suspected preterm preeclampsia.” To help facilitate wider access to non-invasive prenatal testing for pregnant women, Revity offers an easy to use, cost-effective, high-throughput screening system. The Vanadis® cfDNA system is an automated non-sequencing, non-PCR based solution for cfDNA analysis.'
          },
          {
            // logo: require('@/assets/img/pregnolia-logo.png'),
            name: 'Pregnolia',
            website: 'samsungmedison.com',
            description: 'At Revity, “impossible” is inspiration, and “can’t be done” is a call to action. Revity provides health science solutions, technologies, expertise and services that deliver complete workflows from discovery to development, and diagnosis to cure. Revity is revolutionizing what’s possible in healthcare, with specialization in translational multi-omics technologies, biomarker identification, imaging, prediction, screening, detection and diagnosis, informatics and more. With more than $3 billion in revenue and over 11,000 employees, Revity serves customers across pharma and biotech, diagnostic labs, academia and governments. Revity is part of the S&P 500 Index and has customers in more than 190 countries. Revity products were chosen as the principal screening tool for the ASPRE study. Throughout the study, the Revity’s DELFIA® Xpress PGF 1-2-3TM assay was used as an aid in screening for pre-eclampsia in conjunction with maternal history, mean arterial blood pressure (MAP) measurement, and uAD (Uterine Artery Doppler). In 2022, Revity’s DELFIA® Xpress PGF 1-2-3TM and DELFIA® Xpress sFlt-1/PGF Ratio were approved for inclusion in NICE DG-49 diagnostic guidance “PIGF based testing to help diagnose suspected preterm preeclampsia.” To help facilitate wider access to non-invasive prenatal testing for pregnant women, Revity offers an easy to use, cost-effective, high-throughput screening system. The Vanadis® cfDNA system is an automated non-sequencing, non-PCR based solution for cfDNA analysis.'
          }
        ],
        sponsorInfo: {},
      }
    },
    methods: {
      getCongressInfoById(id) {
      this.$api
        .websiteCongressGet({ id: id })
        .then((res) => {
          console.log(res);
          this.sponsorInfo = res.data
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    goto(url){
      window.open(url)
    }
    },
    mounted() {
      this.getCongressInfoById(this.$route.query.id)
    }
  }
</script>

<style lang="scss" scoped>
  .sponsor {
    background-color: #ffffff;
    .sponsor-middle {
      background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
    }
    .sponsor-container {
      margin-top: 30px;
      .sponsor-title {
        font-size: 40px;
        font-weight: bold;
        text-align: center;
        margin: 20px;
      }
      .sponsor-diamond {
        color: #0E98FF;
      }
      .sponsor-gold {
        color: #CC8805;
      }
      .sponsor-silver {
        color: #818181;
      }
      .sponsor-item {
        width: 100%;
        font-size: 14px;
        color: #656B6F;
        margin-bottom: 57px;
        gap: 30px;
        text-align: justify;
        text-justify: inter-word;
        .sponsor-img {
          min-width: 389px;
          width: 389px;
          height: 128px;
          padding: 20px;
          background: #fff;
          border: 2px solid #EFF5F8;
          display: block;
        }
      }
    }
    .fill{
      font-size: 16px;
      line-height: 28px;
      color: #656B6F;
    }
    .companyBox{
      .linkInfo{
        padding: 20px 0;
        background: #EFF5F8;
        .companyName{
          font-size: 24px;
          text-align: center;
          font-weight: bold;
          color: #0E3045;
        }
        .officialWebsite{
          font-size: 16px;
          text-decoration-line: underline;
          font-weight: bold;
          text-align: center;
          color: #036FC0;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
</style>