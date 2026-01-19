<template>
  <div class="vcontainer worldcongress">
    <div class="">
      <TopBanner height="520px" :listData="topData" />
    </div>
    <!-- <section class="congress-hero">
      <div class="congress-hero-bg"></div>
      <div class="congress-hero-content main-container">
        <div class="congress-hero-label">FMF World Congress</div>
        <div class="congress-hero-title">{{ firstCarouseData.title || 'World Congress' }}</div>
        <div class="congress-hero-meta">
          <span>{{ formatFullDateRange(firstCarouseData.startTime, firstCarouseData.endTime) }}</span>
          <span class="hero-dot"></span>
          <span>{{ firstCarouseData.location || '' }}</span>
        </div>
      </div>
    </section> -->
    <div class="vcontainer">
      <div class="vcontainer hcenter main-container congress-info">
        <div class="vcontainer hcenter info-header">
          <span class="info-title">FMF World Congress</span>
          <span class="info-subTitle">{{ firstCarouseData.title }}</span>
        </div>
        <div class="worldcongress-fmf">
          <el-carousel
            v-if="firstCarouseData.congressImageList && firstCarouseData.congressImageList[0]"
            arrow="never"
            indicator-position="none"
            class="carousel-container"
            height="338px">
            <el-carousel-item
              v-for="(carouselItem, i) in (firstCarouseData.congressImageList || [])"
              :key="i">
              <el-image :src="carouselItem.url" class="carousel-img" alt="" />
            </el-carousel-item>
          </el-carousel>
          <div v-else class="carousel-empty"></div>
          <div class="fill vcontainer carousel-form" style="height: 100%">
            <div class="hcontainer vcenter">
              <el-image
                :src="require('@/assets/img/icon/icon_data.png')"
                class="carousel-icon"
                alt=""
              />
              <div class="vcontainer flex-between">
                <span class="carousel-label">Date</span>
                <span class="carousel-value">{{
                  formatFullDateRange(
                    firstCarouseData.startTime,
                    firstCarouseData.endTime
                  )
                }}</span>
              </div>
            </div>
            <div class="hcontainer vcenter">
              <el-image
                :src="require('@/assets/img/icon/icon_location.png')"
                class="carousel-icon"
                alt=""
              />
              <div class="vcontainer flex-between">
                <span class="carousel-label">Location</span>
                <span class="carousel-value">{{
                  firstCarouseData.location || ""
                }}</span>
                <span class="carousel-value">{{
                  firstCarouseData.address || ""
                }}</span>
                
              </div>
            </div>
            <div class="hcontainer vcenter">
              <el-image
                :src="require('@/assets/img/icon/icon_fee.png')"
                class="carousel-icon"
                alt=""
              />
              <div class="vcontainer flex-between">
                <span class="carousel-label">Registration Fee</span>
                <span class="carousel-value"
                  >{{ firstCarouseData.currency == "GBP" ? "£" : "€" || ""
                  }}{{ firstCarouseData.cost || "" }}</span
                >
              </div>
            </div>
            <span class="carousel-link" :class="[(firstCarouseData.programmeList && firstCarouseData.programmeList.length > 0) ? 'haveFile' : 'noFile']" @click="handlePreview(firstCarouseData.programmeList)">Click here to view the programme 
              <span class="el-icon-caret-right"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="main-container congress-about">
        <div class="about-title">About the Congress</div>
        <span class="about-desc">{{
          firstCarouseData.congressIntroduction
        }}</span>
      </div>
      <div class="vcontainer hcenter congress-registration">
        <div class="vcontainer main-container">
          <span class="section-title">Registration</span>
          <span class="section-subtitle">
            Secure your place at the {{ firstCarouseData.title }}
          </span>
          <span class="registration-info">{{
            firstCarouseData.registrationIntroduction
          }}</span>
          <div class="registration-options">
            <div class="option-card attendee">
              <div class="option-header">
                <el-image
                  :src="
                    require('@/assets/img/icon/icon_attendee_registration.png')
                  "
                  class="option-icon"
                  alt=""
                />
                <div class="option-title">Attendee Registration</div>
                <div class="option-subtitle">
                  Join us as a congress participant
                </div>
              </div>
              <div class="option-body">
                <div class="option-feature">
                  <img
                    src="@/assets/img/check-primary.png"
                    class="option-feature-icon"
                  />
                  <span>Full access to all sessions</span>
                </div>
                <div class="option-feature">
                  <img
                    src="@/assets/img/check-primary.png"
                    class="option-feature-icon"
                  />
                  <span>Coffee breaks and lunches included</span>
                </div>
                <div class="option-feature">
                  <img
                    src="@/assets/img/check-primary.png"
                    class="option-feature-icon"
                  />
                  <span>Certificate of Attendance and CME Accreditation</span>
                </div>
                <div class="option-feature">
                  <img
                    src="@/assets/img/check-primary.png"
                    class="option-feature-icon"
                  />
                  <span>Networking opportunities</span>
                </div>

                
              </div>
              <div class="vcontainer option-price">
                <span
                  >{{ firstCarouseData.currency == "GBP" ? "£" : "€" || ""
                  }}{{ firstCarouseData.cost || "" }}<span>.00</span></span
                >
                <span>Registration fee per person</span>
              </div>
              <el-button
                class="option-button attendee"
                :disabled="isAttendeeDisable"
                @click="goto('/congressSignUp?id=' + firstCarouseData.id, '/congressSignUp')">
                Attendee Registration
              </el-button>
            </div>
            <div class="option-card abstract">
              <div class="option-header">
                <el-image
                  :src="
                    require('@/assets/img/icon/icon_abstract_submission.png')
                  "
                  class="option-icon"
                  alt=""
                />
                <div class="option-title">Abstract Submission</div>
                <div class="option-subtitle">
                  Present your research at the congress
                </div>
              </div>
              <div class="option-body">
                <div class="option-feature">
                  <img
                    src="@/assets/img/check-success.png"
                    class="option-feature-icon"
                  />
                  <span>Submit your research abstract</span>
                </div>
                <div class="option-feature">
                  <img
                    src="@/assets/img/check-success.png"
                    class="option-feature-icon"
                  />
                  <span>Opportunity for oral presentation</span>
                </div>
                <div class="option-feature">
                  <img
                    src="@/assets/img/check-success.png"
                    class="option-feature-icon"
                  />
                  <span>E-poster published on FMF website</span>
                </div>

                <div class="option-feature">
                  <img
                    src="@/assets/img/check-success.png"
                    class="option-feature-icon"
                  />
                  <span>Certificate of presentation</span>
                </div>

              </div>
              <div class="vcontainer option-price">
                <span>Submit your work</span>
                <span>Share your research with experts</span>
              </div>
              <el-button
                class="option-button abstract"
                :disabled="isAbstractDisable"
                @click="goto('/speech?id=' + firstCarouseData.id, '/speech')">
                Abstract Submission
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="sponsors-section">
        <div class="section-title">Sponsors and Exhibitors</div>
        <div class="section-subtitle">We are grateful for the support of our sponsors who make this congress possible</div>
        <div class="sponsors-list">
          <div class="sponsor-category">
            <span>Diamond Sponsors</span>
            <div class="sponsor-row">
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=GE+HealthCare" alt="GE HealthCare" />
              </div>
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=SAMSUNG" alt="SAMSUNG" />
              </div>
            </div>
          </div>
          <div class="sponsor-category">
            <span>Gold Sponsors</span>
            <div class="sponsor-row">
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=CANON" alt="Canon Medical" />
              </div>
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=ThermoFisher" alt="Thermo Fisher Scientific" />
              </div>
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=Illumina" alt="Illumina" />
              </div>
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=DIAGNOLY" alt="Diagnoly" />
              </div>
            </div>
          </div>
          <div class="sponsor-category">
            <span>Silver Sponsors</span>
            <div class="sponsor-row">
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=pregnolia" alt="Pregnolia" />
              </div>
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=revity" alt="ReVity" />
              </div>
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=origin-medical" alt="Origin Medical" />
              </div>
              <div class="sponsor-item">
                <img src="https://via.placeholder.com/150x50?text=mindray" alt="Mindray" />
              </div>
            </div>
          </div>
          <div class="view-more">
            <span>View More Sponsors →</span>
          </div>
        </div>
      </div> -->

      <div class="previous-congresses block">
        <div class="vcontainer hcenter main-container">
          <div class="section-title">Sponsors and Exhibitors</div>
          <div class="section-subtitle">
            We are grateful for the support of our sponsors who make this
            congress possible
          </div>

          <div class="imgBox diamondSponsors">
            <div class="topMark">
              <div class="mark">Diamond Sponsors</div>
              <div class="line line1"></div>
            </div>
            <div
              class="congress-grid"
              :class="{emptyBox: !firstCarouseData.diamonSponsorsList}">
              <div
                v-for="(item, index) in (firstCarouseData.diamonSponsorsList || [])"
                :key="index"
                class="hcontainer flex-between congress-item logoBox"
              >
                <img :src="item.companyLogo" alt="" />
              </div>
            </div>
          </div>

          <div class="imgBox goldSponsors">
            <div class="topMark">
              <div class="mark ">Gold Sponsors</div>
              <div class="line line1"></div>
            </div>
            <div
              class="congress-grid"
              style="height: 114px"
              :class="{emptyBox: !firstCarouseData.goldSponsorsList}">
              <div
                v-for="(item, index) in (firstCarouseData.goldSponsorsList || [])"
                :key="index"
                class="hcontainer flex-between congress-item logoBox"
                style="height: 114px"
              >
                <img :src="item.companyLogo" alt="" />
              </div>
            </div>
          </div>

          <div class="imgBox silverSponsors">
            <div class="topMark">
              <div class="mark">Silver Sponsors</div>
              <div class="line line1"></div>
            </div>
            <div
              class="congress-grid"
              style="height: 88px; margin-bottom: 32px"
              :class="{emptyBox: !firstCarouseData.silverSponsorsList}">
              <div
                v-for="(item, index) in (firstCarouseData.silverSponsorsList || [])"
                :key="index"
                class="hcontainer flex-between congress-item logoBox"
                style="height: 88px"
              >
                <img :src="item.companyLogo" alt="" />
              </div>
            </div>
          </div>
          <div class="view-more" @click="goto('/sponsor?id='+firstCarouseData.id, '/sponsor')">
            <span>View More Sponsors  <span class="el-icon-caret-right"></span></span>
          </div>
        </div>
      </div>

      <div class="previous-world-congresses previous-congresses">
        <div class="vcontainer hcenter main-container">
          <div class="section-title">Previous World Congresses</div>
          <div class="section-subtitle">
            Explore our rich history of international fetal medicine conferences
          </div>
          <div
            class="congress-grid"
            :class="{
              emptyBox: !previousCongresses || previousCongresses.length == 0,
            }"
          >
            <div
              v-for="(congress, index) in (previousCongresses || [])"
              :key="index"
              class="hcontainer flex-between congress-item"
            >
              <div class="vcontainer">
                <span class="congress-year">{{ congress.year }}</span>
                <span class="congress-city">{{ congress.city }}</span>
                <span class="congress-country">{{ congress.country }}</span>
                <span class="congress-link">View Abstracts <span class="el-icon-caret-right"></span></span>
              </div>
              <el-image
                :src="require('@/assets/img/icon/icon_dw.png')"
                class="congress-dw"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
  background-color: #F5F7F9;
  .congress-hero {
    position: relative;
    height: 220px;
    background: linear-gradient(120deg, #0b4b8d, #0f5aa4 55%, #0b4b8d);
    overflow: hidden;
    margin-top: -6px;
    .congress-hero-bg {
      position: absolute;
      inset: 0;
      background: url("#{$imgUrl}/world_congress_top.png") center/cover no-repeat;
      opacity: 0.18;
    }
    .congress-hero-content {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      color: #fff;
    }
    .congress-hero-label {
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
    }
    .congress-hero-title {
      font-size: 36px;
      font-weight: 700;
      margin-top: 6px;
    }
    .congress-hero-meta {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      .hero-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
      }
    }
  }
  &-fmf {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    .carousel-empty {
      flex-shrink: 0;
      background: #eaf2fb;
      border-radius: 18px;
      width: 100%;
      max-width: 600px;
      height: 338px;
      object-fit: contain;
    }
    .carousel-form {
      width: 100%;
      margin-left: 0;
      background: #fff;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 12px 30px rgba(15, 42, 67, 0.08);
      .carousel-icon {
        width: 44px;
        height: 44px;
        margin-right: 12px;
        margin-top: 16px;
      }
      .carousel-label {
        font-weight: 600;
        font-size: 16px;
        color: #0e3045;
        margin-top: 16px;
      }
      .carousel-value {
        font-weight: 400;
        font-size: 14px;
        color: #6b7380;
        margin-top: 8px;
      }
      .carousel-link {
        margin-top: 24px;
        font-weight: 600;
        font-size: 14px;
        color: #0f5aa4;
        cursor: pointer;
      }
      .noFile{
        color: #999;
        cursor: no-drop;
      }
    }
    
    .carousel-container {
      width: 100%;
      max-width: 600px;
      flex-shrink: 0;
      border-radius: 18px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 12px 30px rgba(15, 42, 67, 0.08);
      .el-carousel__arrow {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
      }
      .el-carousel__indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.3);
        &.is-active {
          background-color: #3b97ff;
        }
      }
      .carousel-img {
        max-width: 100%;
        width: 100%;
        height: 338px;
        object-fit: cover;
      }
    }
  }
  .main-container {
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
    padding-top: 56px;
    margin-bottom: 40px;
  }
  .congress-info {
    .info-header {
      font-size: 18px;
      color: #8a9094;
      text-align: center;
      .info-title {
        font-weight: bold;
        font-size: 38px;
        color: #0e3045;
        margin-bottom: 16px;
      }
      .info-subTitle {
        font-weight: 400;
        font-size: 18px;
        color: #0e3045;
        margin-bottom: 32px;
      }
    }
    
  }
  .congress-about {
    // height: 212px;
    background-color: #ffffff;
    border-radius: 18px;
    padding: 32px 36px;
    margin: 0 auto 56px;
    box-shadow: 0 12px 30px rgba(15, 42, 67, 0.08);
    color: #0e3045;
    .about-title {
      font-weight: bold;
      font-size: 24px;
      color: #0e3045;
      margin-bottom: 24px;
      text-align: center;
    }
    .about-desc {
      font-weight: 400;
      font-size: 18px;
      color: #4b5662;
      line-height: 30px;
      text-align: justify;
    }
  }
  .congress-registration {
    width: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f1f6fb 100%);
    .section-title {
      font-weight: bold;
      font-size: 36px;
      color: #0e3045;
      margin-bottom: 16px;
      text-align: center;
    }
    .section-subtitle {
      font-weight: 400;
      font-size: 16px;
      color: #8a9094;
      text-align: center;
      margin-bottom: 32px;
    }
    .registration-info {
      font-weight: 400;
      font-size: 18px;
      color: #4b5662;
      line-height: 30px;
      margin-bottom: 45px;
      text-align: justify;
    }
    .registration-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      justify-items: stretch;
      .option-card {
        width: 100%;
        background-color: white;
        border-radius: 18px;
        padding: 32px;
        box-shadow: 0 12px 30px rgba(15, 42, 67, 0.08);
        transition: transform 0.3s ease;
        border: 1px solid #eef2f7;
        text-align: center;
        &:hover {
          transform: translateY(-2px);
        }
        .option-header {
          text-align: center;
          margin-bottom: 20px;
          .option-icon {
            font-size: 24px;
            color: #3b97ff;
            margin-bottom: 16px;
          }
          .option-title {
            font-weight: bold;
            font-size: 20px;
            color: #0e3045;
            line-height: 28px;
            text-align: center;
            margin-bottom: 12px;
          }
          .option-subtitle {
            font-weight: 400;
            font-size: 14px;
            color: #8a9094;
            line-height: 28px;
          }
        }
        .option-body {
          margin-bottom: 32px;
          .option-feature {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            justify-content: center;
            text-align: center;
            .option-feature-icon {
              width: 20px;
              height: 20px;
              margin-right: 16px;
            }
            span {
              font-weight: 400;
              font-size: 14px;
              color: #4b5662;
              line-height: 22px;
              text-align: center;
            }
          }
        }
        .option-price {
          width: 100%;
          padding: 18px;
          background: #f1f6fb;
          border-radius: 14px;
          text-align: center;
          margin-bottom: 48px;
          span:first-child {
            font-weight: bold;
            font-size: 32px;
            color: #0f5aa4;
            text-align: center;
            margin-bottom: 8px;
            span {
              font-weight: bold;
              font-size: 16px;
              color: #0f5aa4;
            }
          }
          span:last-child {
            font-weight: 400;
            font-size: 14px;
            color: #4b5662;
            line-height: 22px;
            text-align: center;
          }
        }
        .option-button {
          width: 100%;
          height: 52px;
          border-radius: 12px;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          color: #ffffff;
          &.attendee {
            background: #0f5aa4;
            &:hover {
              background: rgba($color: #0f5aa4, $alpha: 0.85);
            }
            &:active {
              background: #0f5aa4;
            }
          }
          &.abstract {
            background: #1b8f6a;
            &:hover {
              background: rgba($color: #1b8f6a, $alpha: 0.85);
            }
            &:active {
              background: #1b8f6a;
            }
          }
        }
      }
      .attendee {
        border: 1px solid #e0e0e0;
      }
      .abstract {
        border: 1px solid #e0e0e0;
      }
    }
  }
  .sponsors-section {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #0e3045;
      text-align: center;
      margin-bottom: 10px;
    }
    .section-subtitle {
      font-size: 18px;
      color: #8a9094;
      text-align: center;
      margin-bottom: 20px;
    }
    .sponsors-list {
      text-align: center;
      .sponsor-category {
        margin-bottom: 20px;
        span {
          font-size: 18px;
          font-weight: bold;
          color: #0e3045;
          margin-bottom: 10px;
          display: block;
        }
        .sponsor-row {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          .sponsor-item {
            flex: 1;
            min-width: 150px;
            padding: 10px;
            img {
              width: 100%;
              height: auto;
              max-height: 50px;
            }
          }
        }
      }
    }
  }
  .previous-congresses {
    background: linear-gradient(135deg, #ffffff 0%, #f1f6fb 100%);
    .section-title {
      font-weight: bold;
      font-size: 36px;
      color: #0e3045;
      text-align: center;
      font-style: normal;
      margin-bottom: 10px;
    }
    .section-subtitle {
      font-size: 16px;
      color: #8a9094;
      text-align: center;
      margin-bottom: 24px;
    }
    .congress-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(228px, 1fr));
      gap: 16px;
      margin-bottom: 56px;
      &.emptyBox {
        min-height: 200px;
        background: #ffffff;
      }
      .congress-item {
        background-color: #ffffff;
        border: 1px solid #eef2f7;
        padding: 14px;
        border-radius: 12px;
        box-shadow: 0 10px 22px rgba(15, 42, 67, 0.08);
        text-align: center;
      }
    }
    .view-more {
      width: auto;
      max-width: 100%;
      display: inline-block;
      padding: 10px 18px;
      font-weight: 600;
      font-size: 14px;
      color: #0f5aa4;
      text-align: center;
      font-style: normal;
      cursor: pointer;
      margin: 0 auto;
    }
  }
  .block {
    background: #fff;
  }
  .previous-world-congresses {
    .main-container {
      padding-top: 32px;
      margin-bottom: 0;
    }
    .section-title {
    }
    .section-subtitle {
      font-weight: 400;
      font-size: 16px;
      color: #8a9094;
      line-height: 24px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
    .congress-grid {
      .congress-item {
        padding: 18px 20px;
        // height: 160px;
        .congress-year {
          font-size: 18px;
          font-weight: bold;
          color: #0f5aa4;
          margin-bottom: 12px;
        }
        .congress-city {
          font-size: 16px;
          font-weight: bold;
          color: #0e3045;
          margin-bottom: 6px;
        }
        .congress-country {
          font-size: 14px;
          color: #8a9094;
          margin-bottom: 24px;
        }
        .congress-link {
          font-size: 14px;
          color: #0f5aa4;
          cursor: pointer;
        }
        .congress-dw {
          width: 40px;
          height: 40px;
          margin-left: 10px;
          object-fit: contain;
        }
      }
    }
  }

  .imgBox {
    overflow: hidden;
    .logoBox {
      position: relative;
      width: 100%;
      max-width: 288px;
      height: 120px;
      display: inline-block;
      margin-right: 10px;
      img {
        position: absolute;
        height: 60%;
        max-width: 80%;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        // height: 100%;
      }
    }
    .congress-grid {
      height: 120px;
      display: block;
      text-align: center;
      overflow: hidden;
      .congress-item {
        overflow: hidden;
      }
    }
    .topMark {
      .mark {
        font-weight: bold;
        color: #0e3045;
        font-size: 20px;
        text-align: center;
      }

      .line {
        width: 120px;
        height: 3px;
        background: linear-gradient(
          45deg,
          #ffffff 0%,
          #32b3ff 55.24%,
          #ffffff 100%
        );
        border-radius: 0px 0px 0px 0px;
        margin: 10px auto;
      }
      .line2 {
        background: linear-gradient(
          45deg,
          #fffdf9 0%,
          #ffad32 55.24%,
          #ffffff 100%
        );
      }
      .line3 {
        background: linear-gradient(
          45deg,
          #fffdf9 0%,
          #c3c3c3 55.24%,
          #ffffff 100%
        );
      }
    }
    &.diamondSponsors {
      .mark {
        font-size: 32px;
      }
      img {
        height: 72px;
      }
    }
    &.goldSponsors {
      .mark {
        font-size: 24px;
      }
      img {
        height: 56px;
      }
    }
    &.silverSponsors {
      .mark {
        font-size: 20px;
      }
      img {
        height: 40px;
      }
    }
  }

  @media (max-width: 1024px) {
    .main-container {
      padding-top: 32px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .worldcongress-fmf {
      flex-direction: column;
      align-items: center;
    }
    .worldcongress-fmf .carousel-container,
    .worldcongress-fmf .carousel-empty {
      width: 100%;
    }
    .worldcongress-fmf .carousel-container .carousel-img {
      width: 100%;
      max-width: 100%;
    }
    .worldcongress-fmf .carousel-form {
      padding: 20px;
    }
    .congress-about {
      padding: 24px;
    }
    .congress-registration .registration-options {
      flex-direction: column;
    }
    .congress-registration .registration-options .option-card {
      min-width: 0;
    }
  }

  @media (max-width: 768px) {
    .congress-hero {
      height: 200px;
    }
    .congress-hero .congress-hero-title {
      font-size: 28px;
    }
    .congress-hero .congress-hero-meta {
      flex-wrap: wrap;
      gap: 6px;
    }
    .congress-info .info-header .info-title {
      font-size: 28px;
    }
    .congress-info .info-header .info-subTitle {
      font-size: 16px;
    }
    .congress-about .about-title {
      font-size: 20px;
    }
    .congress-about .about-desc {
      font-size: 16px;
      line-height: 26px;
    }
    .congress-registration .section-title {
      font-size: 26px;
    }
    .congress-registration .registration-info {
      font-size: 16px;
      line-height: 26px;
    }
    .worldcongress-fmf .carousel-form {
      text-align: center;
    }
    .worldcongress-fmf .carousel-form .hcontainer {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .worldcongress-fmf .carousel-form .carousel-icon {
      margin-right: 0;
    }
    .worldcongress-fmf .carousel-form .carousel-label,
    .worldcongress-fmf .carousel-form .carousel-value {
      text-align: center;
    }
    .congress-about .about-desc {
      text-align: center;
    }
    .previous-world-congresses .congress-item {
      text-align: center;
    }
    .previous-congresses .section-title {
      font-size: 28px;
    }
    .previous-congresses .congress-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }
  
}
</style>
