<template>
  <div class="vcontainer worldcongress">
    <div class="">
      <TopBanner height="520px" :listData="topData" />
    </div>
    <section class="congress-main">
      <div class="main-container">
        <div class="congress-main-title">Join colleagues from around the world in Vienna</div>
        <div class="congress-summary">
          <div class="congress-summary-media">
            <el-image
              v-if="firstCarouseData.congressImageList && firstCarouseData.congressImageList[0]"
              :src="firstCarouseData.congressImageList[0].url"
              class="summary-image"
              fit="cover"
              alt=""
            />
            <div v-else class="summary-placeholder"></div>
          </div>
          <div class="congress-summary-details">
            <div class="summary-item">
              <div class="summary-icon">
                <img src="@/assets/img/icon/icon_data.png" alt="" />
              </div>
              <div class="summary-text">
                <div class="summary-label">Date</div>
                <div class="summary-value">
                  {{ formatFullDateRange(firstCarouseData.startTime, firstCarouseData.endTime) }}
                </div>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">
                <img src="@/assets/img/icon/icon_location.png" alt="" />
              </div>
              <div class="summary-text">
                <div class="summary-label">Location</div>
                <div class="summary-value">{{ firstCarouseData.location || "" }}</div>
                <div class="summary-value">{{ firstCarouseData.address || "" }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="congress-about-card">
          <div class="about-title">About the Congress</div>
          <div class="about-desc">{{ firstCarouseData.congressIntroduction }}</div>
        </div>
      </div>
    </section>

    <section class="congress-registration">
      <div class="main-container">
        <div class="registration-title">Registration</div>
        <div class="registration-subtitle">
          Secure your place at the {{ firstCarouseData.title }}
        </div>
        <div class="registration-info">{{ firstCarouseData.registrationIntroduction }}</div>
        <div class="registration-cards">
          <div class="registration-card">
            <div class="card-icon attendee">
              <img src="@/assets/img/icon/icon_attendee_registration.png" alt="" />
            </div>
            <div class="card-title">Attendee Registration</div>
            <div class="card-subtitle">Join us as a congress participant</div>
            <div class="card-features">
              <div class="card-feature">
                <img src="@/assets/img/check-primary.png" alt="" />
                <span>Full access to all sessions</span>
              </div>
              <div class="card-feature">
                <img src="@/assets/img/check-primary.png" alt="" />
                <span>Coffee breaks and lunches included</span>
              </div>
              <div class="card-feature">
                <img src="@/assets/img/check-primary.png" alt="" />
                <span>Certificate of Attendance and CME Accreditation</span>
              </div>
              <div class="card-feature">
                <img src="@/assets/img/check-primary.png" alt="" />
                <span>Networking opportunities</span>
              </div>
            </div>
            <div class="card-callout">
              <div class="callout-main">
                {{ firstCarouseData.currency == "GBP" ? "£" : "€" || "" }}{{ firstCarouseData.cost || "" }}
              </div>
              <div class="callout-sub">Registration fee per person</div>
            </div>
            <el-button
              class="card-button attendee"
              :disabled="isAttendeeDisable"
              @click="goto('/congressSignUp?id=' + firstCarouseData.id, '/congressSignUp')"
            >
              Attendee Registration
            </el-button>
          </div>

          <div class="registration-card">
            <div class="card-icon abstract">
              <img src="@/assets/img/icon/icon_abstract_submission.png" alt="" />
            </div>
            <div class="card-title">Abstract Submission</div>
            <div class="card-subtitle">Share your research with experts</div>
            <div class="card-features">
              <div class="card-feature">
                <img src="@/assets/img/check-success.png" alt="" />
                <span>Submit your research abstract</span>
              </div>
              <div class="card-feature">
                <img src="@/assets/img/check-success.png" alt="" />
                <span>Opportunity for oral presentation</span>
              </div>
              <div class="card-feature">
                <img src="@/assets/img/check-success.png" alt="" />
                <span>E-poster published on FMF website</span>
              </div>
              <div class="card-feature">
                <img src="@/assets/img/check-success.png" alt="" />
                <span>Certificate of presentation</span>
              </div>
            </div>
            <div class="card-callout">
              <div class="callout-main">Submit your work</div>
              <div class="callout-sub">
                Deadline {{ formatDeadline(firstCarouseData.abstractSubmissionEndTime) }}
              </div>
            </div>
            <el-button
              class="card-button abstract"
              :disabled="isAbstractDisable"
              @click="goto('/speech?id=' + firstCarouseData.id, '/speech')"
            >
              Abstract Submission
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <section class="previous-world-congresses">
      <div class="main-container">
        <div class="previous-title">Previous World Congresses</div>
        <div class="previous-subtitle">
          Explore our rich history of international fetal medicine conferences
        </div>
        <div class="previous-grid">
          <div
            v-for="(congress, index) in (previousCongresses || [])"
            :key="index"
            class="previous-card"
          >
            <div class="previous-year">{{ congress.year }}</div>
            <div class="previous-city">{{ congress.city }}</div>
            <div class="previous-country">{{ congress.country }}</div>
            <div class="previous-link">View Abstracts <span class="el-icon-caret-right"></span></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TopBanner from "@/components/TopBanner.vue";
import { mapActions } from "vuex";
export default {
  name: "CongressPage",
  components: {
    TopBanner,
  },
  data() {
    return {
      topBannerList: [
        {
          img: require("@/assets/img/world_congress_top.png"),
          title: "23rd World Congress in Fetal Medicine",
          subTitle: "Austria Center Vienna • June 28th - July 2nd, 2026",
          desc: "Bruno-Kreisky-Platz 1, 1220 Wien, Austria",
        },
      ],
      carouselListData: [
        {
          title: "23rd World Congress in Fetal Medicine",
          img: require("@/assets/img/congress.png"),
          date: "28th June - 2nd July 2026",
          location: "Austria Center Vienna",
          registrationFee: "€400",
          companyList: [],
        },
      ],
      firstCarouseData: {},
      topData: [],
      previousCongresses: [
        { year: "2025", city: "Prague", country: "Czechia" },
        { year: "2024", city: "Lisbon", country: "Portugal" },
        { year: "2023", city: "Valencia", country: "Spain" },
        { year: "2022", city: "Crete", country: "Greece" },
        { year: "2019", city: "Alicante", country: "Spain" },
        { year: "2018", city: "Athens", country: "Greece" },
        { year: "2017", city: "Ljubljana", country: "Slovenia" },
        { year: "2016", city: "Mallorca", country: "Spain" },
        { year: "2015", city: "Crete", country: "Greece" },
        { year: "2014", city: "Nice", country: "France" },
        { year: "2013", city: "Marbella", country: "Spain" },
        { year: "2012", city: "Kos", country: "Greece" },
        { year: "2011", city: "St Julians", country: "Malta" },
        { year: "2010", city: "Rhodes", country: "Greece" },
        { year: "2009", city: "Portorose", country: "Slovenia" },
        { year: "2008", city: "Sorrento", country: "Italy" },
        { year: "2007", city: "Cavtat", country: "Croatia" },
        { year: "2006", city: "Barcelona", country: "Spain" },
        { year: "2005", city: "Istanbul", country: "Turkey" },
        { year: "2004", city: "Limassol", country: "France" },
      ],
    };
  },
  computed: {
    categoryName() {
      return this.$route.query.categoryName;
    },
    isAttendeeDisable() {
      if (!this.firstCarouseData.registrationStartTime ||
        !this.firstCarouseData.endTime ||
        this.$moment(this.firstCarouseData.registrationStartTime).isValid() === false ||
        this.$moment(this.firstCarouseData.endTime).isValid() === false
      ) {
        return true
      }
      return !this.$moment().isBetween(this.$moment(this.firstCarouseData.registrationStartTime), this.$moment(this.firstCarouseData.endTime))
    },
    isAbstractDisable() {
      if (!this.firstCarouseData.abstractSubmissionStartTime ||
        !this.firstCarouseData.abstractSubmissionEndTime ||
        this.$moment(this.firstCarouseData.abstractSubmissionStartTime).isValid() === false ||
        this.$moment(this.firstCarouseData.abstractSubmissionEndTime).isValid() === false
      ) {
        return true
      }
      return !this.$moment().isBetween(this.$moment(this.firstCarouseData.abstractSubmissionStartTime), this.$moment(this.firstCarouseData.abstractSubmissionEndTime))
    }
  },
  methods: {
    ...mapActions('user', ['changeActiveId']),
    // ... existing methods
    formatDate(dateString) {
      if (!dateString) return "";

      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      // const year = date.getFullYear();

      // Get the day with ordinal suffix (st, nd, rd, th)
      const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      return `${day}${getOrdinalSuffix(day)} ${month}`;
    },

    formatFullDateRange(startString, endString) {
      if (!startString || !endString) return "";

      const startDate = new Date(startString);
      const endDate = new Date(endString);

      // Define English month names explicitly
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const startDay = startDate.getDate();
      const startMonth = months[startDate.getMonth()];
      const endDay = endDate.getDate();
      const endMonth = months[endDate.getMonth()];
      const year = endDate.getFullYear();

      const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      const startFormatted = `${startDay}${getOrdinalSuffix(
        startDay
      )} ${startMonth}`;
      const endFormatted = `${endDay}${getOrdinalSuffix(
        endDay
      )} ${endMonth} ${year}`;

      return `${startFormatted} - ${endFormatted}`;
    },
    formatDeadline(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "";
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    getCompanyList(id) {
      this.$api
        .companyGet({
          id: id,
        })
        .then((res) => {
          console.log(res);
          this.companyList =
            res.data?.list || []; /**兼容异常格式返回引起渲染问题 */
        });
    },
    getCongressInfo() {
      this.$api
        .websiteCongressList({
          page: 1,
          pageSize: 1,
          publishStatus: 1,
          title: this.categoryName,
        })
        .then((res) => {
          if (!res || (res.code !== 200 && res.code !== 0) || !res.data || !Array.isArray(res.data.list)) {
            this.firstCarouseData = {}
            this.carouselListData = []
            this.topData = []
            return
          }
          this.carouselListData = res.data.list || []; /**兼容异常格式返回引起渲染问题 */
          this.firstCarouseData = this.carouselListData[0] || {};
          (this.firstCarouseData.bannerImageList || []).forEach((item) => {
            this.topData.push({
              img: item.url,
              title: res.data.list[0].title,
              subTitle:
                res.data.list[0].location +
                "    " +
                this.formatFullDateRange(
                  res.data.list[0].startTime,
                  res.data.list[0].endTime
                ),
              desc: item.desc,
            });
          });

          // this.getCompanyList(res.data.list[0].id)
          // this.getCongressInfoById(1)
        });
    },
    getCongressInfoById(id) {
      this.$api
        .websiteCongressGet({ id: id })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    goto(url, type) {
      this.changeActiveId(type);
      this.$router.push(url);
    },
    handlePreview(programmeList) {
      if (Array.isArray(programmeList) && programmeList[0] && programmeList[0].url) {
        window.open(programmeList[0].url, '_blank')
      } 
      // else {
      //   this.$message.info('Not get the programme from server!')
      // }
    }
  },
  created() {
    this.getCongressInfo();
  },
};
</script>

<style lang="scss" scoped>
.worldcongress {
  background-color: #f5f7f9;
  .main-container {
    width: 100%;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
    padding-top: 48px;
    padding-bottom: 64px;
  }
  .congress-main {
    background: #f5f7f9;
  }
  .congress-main-title {
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 28px;
  }
  .congress-summary {
    display: grid;
    grid-template-columns: minmax(0, 60%) minmax(0, 320px);
    gap: 28px;
    align-items: start;
    margin-bottom: 28px;
  }
  .congress-summary-media {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 28px rgba(15, 42, 67, 0.08);
  }
  .summary-image {
    width: 100%;
    height: 260px;
    display: block;
  }
  .summary-placeholder {
    width: 100%;
    height: 260px;
    background: #e9f1f8;
  }
  .congress-summary-details {
    display: grid;
    gap: 18px;
  }
  .summary-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .summary-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #e9f4ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    img {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }
  }
  .summary-label {
    font-size: 14px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 6px;
  }
  .summary-value {
    font-size: 14px;
    color: #5d6570;
    line-height: 20px;
  }
  .congress-about-card {
    background: #eef5fb;
    border-radius: 12px;
    padding: 24px 28px;
    text-align: center;
    box-shadow: 0 10px 22px rgba(15, 42, 67, 0.06);
  }
  .about-title {
    font-size: 16px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 12px;
  }
  .about-desc {
    font-size: 14px;
    color: #4b5662;
    line-height: 22px;
  }

  .congress-registration {
    background: linear-gradient(180deg, #f7fbff 0%, #f5f7f9 100%);
  }
  .registration-title {
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 8px;
  }
  .registration-subtitle {
    text-align: center;
    font-size: 14px;
    color: #6b7380;
    margin-bottom: 16px;
  }
  .registration-info {
    max-width: 860px;
    margin: 0 auto 28px;
    font-size: 13px;
    color: #4b5662;
    line-height: 22px;
  }
  .registration-cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
  }
  .registration-card {
    background: #ffffff;
    border-radius: 10px;
    padding: 28px 26px 24px;
    box-shadow: 0 14px 28px rgba(15, 42, 67, 0.08);
    border: 1px solid #e6eef6;
    text-align: center;
  }
  .card-icon {
    width: 54px;
    height: 54px;
    margin: 0 auto 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e9f4ff;
    img {
      width: 26px;
      height: 26px;
      object-fit: contain;
    }
    &.abstract {
      background: #e9f8f1;
    }
  }
  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 4px;
  }
  .card-subtitle {
    font-size: 12px;
    color: #7a848f;
    margin-bottom: 16px;
  }
  .card-features {
    display: grid;
    gap: 10px;
    margin-bottom: 18px;
    text-align: left;
  }
  .card-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #4b5662;
    img {
      width: 16px;
      height: 16px;
    }
  }
  .card-callout {
    background: #eef7ff;
    border-radius: 8px;
    padding: 14px 12px;
    margin-bottom: 18px;
  }
  .callout-main {
    font-size: 22px;
    font-weight: 700;
    color: #0f5aa4;
    margin-bottom: 6px;
  }
  .callout-sub {
    font-size: 12px;
    color: #5d6570;
  }
  .card-button {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    font-weight: 600;
    color: #ffffff;
    &.attendee {
      background: #0f5aa4;
      border-color: #0f5aa4;
    }
    &.abstract {
      background: #0b8f6a;
      border-color: #0b8f6a;
    }
  }

  .previous-world-congresses {
    background: #f5f7f9;
  }
  .previous-title {
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 6px;
  }
  .previous-subtitle {
    text-align: center;
    font-size: 13px;
    color: #7a848f;
    margin-bottom: 22px;
  }
  .previous-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  .previous-card {
    background: #ffffff;
    border: 1px solid #e4edf6;
    border-radius: 6px;
    padding: 12px 14px;
    box-shadow: 0 6px 16px rgba(15, 42, 67, 0.06);
  }
  .previous-year {
    font-size: 12px;
    color: #0f5aa4;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .previous-city {
    font-size: 13px;
    font-weight: 700;
    color: #0e3045;
    margin-bottom: 2px;
  }
  .previous-country {
    font-size: 12px;
    color: #7a848f;
    margin-bottom: 8px;
  }
  .previous-link {
    font-size: 12px;
    color: #0f5aa4;
    font-weight: 600;
  }

  @media (max-width: 1024px) {
    .main-container {
      padding-left: 20px;
      padding-right: 20px;
    }
    .registration-cards {
      grid-template-columns: 1fr;
    }
    .previous-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    .congress-main-title {
      font-size: 22px;
    }
    .congress-summary {
      grid-template-columns: 1fr;
    }
    .summary-image,
    .summary-placeholder {
      height: 220px;
    }
    .previous-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  
}
</style>
