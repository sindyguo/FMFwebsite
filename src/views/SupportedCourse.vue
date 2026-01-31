<template>
  <div class="vcontainer supported-course">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container supported-course-content">
      <div class="section">
        <div class="hero-split">
          <div class="hero-copy">
            <div class="section-title section-title-accent">Baltic Symposium on Fetal and Maternal Medicine (BSFMM2026)</div>
            <div class="section-desc">
              The Fetal Medicine Foundation, in collaboration with Vilnius University, the Lithuanian Society of
              Obstetricians and Gynecologists, and King’s College London, brings together leading experts in fetal and
              maternal medicine. The Symposium is intended for obstetrician‑gynecologists, neonatologists, family and
              internal medicine physicians, pediatric cardiologists, pediatric neurologists, medical doctors, midwives,
              nurses, residents, and students. The official language of the Symposium is English. Simultaneous translation
              will not be provided.
            </div>
          </div>
          <div class="hero-image-card">
            <img src="@/assets/img/bsfm2026_slide1.png" alt="BSFM 2026" />
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-title">Date</div>
            <div class="info-value">Saturday, 16 May 2026</div>
          </div>
          <div class="info-card">
            <div class="info-title">Venue</div>
            <div class="info-value">AC Hotel by Marriott Vilnius conference center</div>
            <div class="info-sub">Vasario 16-osios st. 5, Vilnius, Lithuania</div>
          </div>
          <div class="info-card">
            <div class="info-title">Programme</div>
            <div class="info-value">Plenary Lectures · Masterclass and Live Scans</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Registration fee</div>
        <div class="fee-grid">
          <div class="fee-card">
            <div class="fee-title">Pre‑registration</div>
            <ul>
              <li>Delegate – 80 Eur</li>
              <li>Resident, midwife, nurse – 30 Eur</li>
              <li>Student – 10 Eur</li>
            </ul>
          </div>
          <div class="fee-card">
            <div class="fee-title">On‑site fee</div>
            <ul>
              <li>Delegate – 160 Eur</li>
              <li>Resident, midwife, nurse – 60 Eur</li>
              <li>Student – 20 Eur</li>
            </ul>
          </div>
        </div>
        <div class="section-desc">
          Registration fee covers admission to symposium scientific programme, electronic certificate of attendance,
          meals and refreshments during the conference.
        </div>
        <div class="inline-actions">
          <span class="action-text">Registration opens soon.</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Gala dinner</div>
        <div class="section-desc">
          Gala dinner ticket – 40 Eur. The Symposium gala dinner will be at the restaurant “Saint Jacob's”
          (Symposium Venue). The restaurant offers modern Lithuanian cuisine with locally sourced ingredients in a
          contemporary setting.
        </div>
        <div class="section-desc">
          Website: <a class="inline-link" href="http://www.instagram.com/saintjacobsrestaurant" target="_blank" rel="noopener">www.instagram.com/saintjacobsrestaurant</a>
        </div>
        <div class="section-desc">Doors open at 19:00. Book your ticket during the online registration for the Symposium.</div>
        <div class="section-desc">Clothing – smart casual.</div>
      </div>

      <div class="section">
        <div class="section-title">Accommodation</div>
        <div class="section-desc">
          AC Hotel by Marriott Vilnius (4*) — Address: Vasario 16-osios st. 5, Vilnius
        </div>
        <div class="section-desc">
          Website:
          <a class="inline-link" href="http://www.marriott.com/en-us/hotels/vnoac-ac-hotel-vilnius/overview" target="_blank" rel="noopener">
            www.marriott.com/en-us/hotels/vnoac-ac-hotel-vilnius/overview
          </a>
        </div>
        <div class="section-desc">
          AC Hotel by Marriott Vilnius is a new, modern hotel located in the city center of Vilnius, close to the Old
          Town, providing comfortable accommodation for conference delegates throughout the duration of the conference.
        </div>
        <div class="section-desc">
          Hotel location from Vilnius International Airport: 7 km (about 15 minutes by car).
        </div>
        <div class="section-desc">
          To request the 15% discount (from "Stay for Breakfast Rate") for accommodation in Attic Queen, Standard King
          or Standard Twin room with breakfast, please contact the hotel by email
          <a class="inline-link" href="mailto:reservations@acvilnius.com">reservations@acvilnius.com</a>
          and include the discount code <strong>BSFM2026</strong> in your message.
        </div>
      </div>

      <div class="section">
        <div class="section-title">Welcome to Vilnius</div>
        <div class="section-desc">
          Vilnius is the capital of Lithuania, known for its rich history, vibrant culture, and stunning architecture.
          Its Old Town—a mix of Gothic, Renaissance and Baroque buildings—is a UNESCO World Heritage Site and offers
          charming cobblestone streets, historic landmarks, and a lively cultural scene.
        </div>
        <div class="link-list">
          <a class="inline-link" href="https://www.govilnius.lt/homepage" target="_blank" rel="noopener">
            Vilnius Tourist Information Centres – Visitor Info, Maps &amp; Tours
          </a>
          <a class="inline-link" href="https://whc.unesco.org/en/list/541/" target="_blank" rel="noopener">
            Vilnius Historic Centre (UNESCO)
          </a>
          <a class="inline-link" href="https://discovervilnius.com" target="_blank" rel="noopener">
            Discover Vilnius – Travel Guide
          </a>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Keynote speakers</div>
        <div class="speaker-grid">
          <div v-for="speaker in speakers" :key="speaker.name" class="speaker-card">
            <img v-if="speaker.photo" class="speaker-avatar" :src="speaker.photo" :alt="speaker.name" />
            <div class="speaker-name">{{ speaker.name }}</div>
            <div class="speaker-title">{{ speaker.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBanner from '@/components/TopBanner.vue'

  export default {
    name: 'SupportedCoursePage',
    components: {
      TopBanner
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/bsfm2026_header.jpg'),
          title: 'FMF Supported Course',
          desc: ''
        }],
        speakers: [
          {
            name: 'Prof. Kypros Nicolaides',
            title: 'Founder and Chairman of The Fetal Medicine Foundation, Professor of Fetal Medicine, Kings College Hospital, King’s College of London, London, UK'
          },
          {
            name: 'Assoc. Prof. Anastasija Arechvo',
            title: 'Senior Lecturer, King’s College of London, Consultant in Fetal Medicine, Kings College Hospital, London, UK'
          },
          {
            name: 'Prof. Diana Ramasauskaite',
            title: 'Head of the Center in Obstetrics and Gynaecology, Vilnius University Hospital Santaros, Vilnius, Lithuania'
          },
          {
            name: 'Prof. Magdalena Litwinska',
            title: 'First Department of Obstetrics and Gynaecology, Medical University of Warsaw, Poland'
          },
          {
            name: 'Prof. Ewelina Litwinska',
            title: 'First Department of Obstetrics and Gynaecology, Medical University of Warsaw, Poland'
          },
          {
            name: 'Assoc. Prof. Raffaele Napolitano',
            title: 'Consultant in Maternal Fetal Medicine and Obstetrics, University College London Hospitals, London, UK'
          },
          {
            name: 'Assoc. Prof. Marietta Charakida',
            title: 'Senior Clinical Lecturer, King’s College of London, Consultant in Fetal and Pediatric Cardiology at Kings College Hospital, London, UK'
          },
          {
            name: 'Prof. Egle Machtejeviene',
            title: 'Head of Fetal Medicine Centre at Hospital of Lithuanian University of Health Sciences, Kaunas, Lithuania'
          },
          {
            name: 'Dr. Tessa Homfray',
            title: 'Consultant in Medical Genetics at St. George’s University Hospital, and at Kings College Hospital, London, UK'
          },
          {
            name: 'Dr. Michael Brusilov',
            title: 'Consultant in Fetal Medicine, Lis Maternity Hospital, Tel Aviv, Israel'
          },
          {
            name: 'Dr. Karam Hamed',
            title: 'Associate specialist in Fetal Medicine, Kings College Hospital, London, UK'
          },
          {
            name: 'Dr. Ruta Breiviene',
            title: 'Research Fellow in Fetal Medicine, King’s College Hospital, London, UK'
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supported-course {
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding-bottom: 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }

  .supported-course-content {
    gap: 28px;
    padding: 24px 16px 0;
    box-sizing: border-box;
  }

  ::v-deep .top-banner .top-banner-content .desc {
    text-align: center;
    text-align-last: center;
  }

  .section {
    background: #ffffff;
    border-radius: 12px;
    padding: 12px 24px 24px;
    box-shadow: 0 6px 20px rgba(14, 48, 69, 0.06);
  }

  .section-title {
    font-size: 20px;
    font-weight: bold;
    color: #0e3045;
    margin-bottom: 12px;
  }

  .section-title-accent {
    color: #036fc0;
  }

  .section-desc {
    font-size: 16px;
    line-height: 26px;
    color: #4a5b67;
  }

  .hero-split {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .info-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .hero-image-card {
    border-radius: 32px;
    overflow: hidden;
    background: #f7fbff;
    box-shadow: 0 10px 20px rgba(15, 42, 67, 0.08);
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-image-card img {
    width: 90%;
    height: 90%;
    object-fit: contain;
    display: block;
    border-radius: inherit;
  }

  @media (max-width: 768px) {
    .hero-split {
      grid-template-columns: 1fr;
    }
    .hero-image-card {
      height: 260px;
    }
    .hero-image-card img {
      height: 90%;
    }
  }

  .info-card {
    padding: 8px 16px 16px;
    border-radius: 12px;
    background: #f3f8fd;
  }

  .info-title {
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #6c7a86;
  }

  .info-value {
    font-size: 16px;
    font-weight: 600;
    color: #0e3045;
    margin-top: 6px;
  }

  .info-sub {
    font-size: 14px;
    color: #6c7a86;
    margin-top: 4px;
  }

  .fee-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    margin-bottom: 12px;
  }

  .fee-card {
    padding: 8px 16px 16px;
    border-radius: 12px;
    border: 1px solid #e6eef5;
    background: #ffffff;
  }

  .fee-title {
    font-weight: 600;
    color: #0e3045;
    margin-bottom: 8px;
  }

  .fee-card ul {
    margin: 0;
    padding-left: 18px;
    color: #4a5b67;
    line-height: 24px;
  }

  .inline-actions {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .inline-link {
    color: #036fc0;
    font-weight: 600;
    text-decoration: underline;
  }

  .action-text {
    color: #036fc0;
    font-weight: 600;
  }

  .link-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
  }

  .speaker-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .speaker-card {
    border: 1px solid #e6eef5;
    border-radius: 12px;
    padding: 8px 14px 14px;
    background: #ffffff;
  }

  .speaker-name {
    font-weight: 600;
    color: #0e3045;
    margin-bottom: 6px;
  }

  .speaker-title {
    font-size: 14px;
    color: #5c6b78;
    line-height: 22px;
  }

  .speaker-note {
    margin-top: 12px;
  }
</style>
