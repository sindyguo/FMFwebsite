<template>
  <div v-loading="loading" class="vcontainer advancesCourses">
    <div class="">
      <TopBanner height="520px" :listData="topData" />
    </div>
    <div class="vcontainer">
      <div class="vcontainer hcenter main-container congress-info">
        <div class="vcontainer hcenter info-header">
          <span class="info-title">{{contentData.content.fmfAdvancesCourses.title1[0].contentDescription}}</span>
          <!-- <span class="info-subTitle">{{ firstCarouseData.title }}</span> -->
        </div>
        <div class="advancesCourses-fmf">
          <el-carousel
            v-if="firstCarouseData.congressImageList && firstCarouseData.congressImageList[0]"
            arrow="never"
            indicator-position="none"
            class="carousel-container"
            :interval="3000"
            height="338px">
            <el-carousel-item
              v-for="(carouselItem, i) in (firstCarouseData.congressImageList || [])"
              :key="i">
              <el-image :src="carouselItem.url" class="carousel-img" alt="" />
            </el-carousel-item>
          </el-carousel>
          <div v-else class="carousel-empty"></div>
          <div class="fill vcontainer carousel-form" style="height: 100%">
            <div class="hcontainer vcenter" style="margin-bottom: 24px;">
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
            <div class="hcontainer vcenter" style="margin-bottom: 24px;">
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
                <span class="carousel-value" style="margin-top: 2px;">{{
                  firstCarouseData.address || ""
                }}</span>
              </div>
            </div>
            <!-- <div class="hcontainer vcenter" v-if="!canRegistered" style="margin-bottom: 24px;">
              <div class="carousel-label">Registrations will open in {{formatFullDateRange1(firstCarouseData.registrationStartTime, false)}}</div>
            </div> -->
            <span v-if="firstCarouseData.programmeList && firstCarouseData.programmeList.length > 0" class="carousel-link haveFile" @click="handlePreview(firstCarouseData.programmeList)">Click here to view the programme 
              <span class="el-icon-caret-right"></span>
            </span>
          </div>
        </div>
      </div>
      <div class="main-container congress-about">
        <div class="about-title">About the Advances Course</div>
        <span class="about-desc">{{
          firstCarouseData.congressIntroduction
        }}</span>
      </div>
      <div class="vcontainer hcenter congress-registration">
        <div class="vcontainer main-container">
          <span class="section-title">Registration</span>
          <span class="section-subtitle"
            >Secure your place at the <span v-html="firstCarouseData.title"></span></span
          >
          <span class="registration-info">{{
            firstCarouseData.registrationIntroduction
          }}</span>
          <div class="registration-options">
            <div class="option-card attendee">
              <div class="attendee-left">
                <div class="option-header">
                  <el-image
                    :src="
                      require('@/assets/img/icon/icon_attendee_registration.png')
                    "
                    class="option-icon"
                    alt=""
                  />
                  <div class="option-title">
                    Attendee Registration
                    <div class="option-subtitle">
                      Join us as a congress participant
                    </div>
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
              </div>
              <div class="attendee-right">
                <div class="vcontainer option-price">
                  <span
                    >{{ currency == "GBP" ? "£" : "€" || ""
                    }}{{ minFeeAmount }}</span
                  >
                  <span>Registration fee per person</span>
                </div>
                <div
                  class="option-button"
                  :class="{'disabled': isAttendeeDisable}"
                  @click="attendeeRegistrationClick">
                  Attendee Registration
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div class="previous-congresses block"  v-if="(firstCarouseData.diamonSponsorsList && firstCarouseData.diamonSponsorsList.length > 0) || (firstCarouseData.goldSponsorsList && firstCarouseData.goldSponsorsList.length > 0) || (firstCarouseData.silverSponsorsList && firstCarouseData.silverSponsorsList.length > 0) || (firstCarouseData.bronzeSponsorsList && firstCarouseData.bronzeSponsorsList.length > 0)">
        <div class="vcontainer hcenter main-container">
          <div class="section-title">Sponsors and Exhibitors</div>
          <div class="section-subtitle">
            We are grateful for the support of our sponsors who make this
            congress possible
          </div>

          <div class="imgBox diamondSponsors" v-if="firstCarouseData.diamonSponsorsList && firstCarouseData.diamonSponsorsList.length > 0">
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

          <div class="imgBox goldSponsors" v-if="firstCarouseData.goldSponsorsList && firstCarouseData.goldSponsorsList.length > 0">
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

          <div class="imgBox silverSponsors" v-if="firstCarouseData.silverSponsorsList && firstCarouseData.silverSponsorsList.length > 0">
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
    </div>
    <ProfileIncompleteDialog :visible.sync="profileDialogVisible" />
  </div>
</template>

<script>
import TopBanner from "@/components/TopBanner.vue";
import ProfileIncompleteDialog from "@/components/ProfileIncompleteDialog.vue";
import { mapActions } from "vuex";
export default {
  name: "FmfAdvancesCourses",
  components: {
    TopBanner,
    ProfileIncompleteDialog,
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
      carouselListData: [],
      firstCarouseData: {},
      topData: [],
      previousCongresses: [],
      profileDialogVisible: false,
      loading: false,
    };
  },
  computed: {
    categoryName() {
      return this.$route.query.categoryName;
    },
    isLogin() {
      return this.$store.getters['user/isLogin']
    },
    canRegistered() {
      let currentTime = new Date().getTime()
      return currentTime > new Date(this.firstCarouseData.registrationStartTime).getTime()
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
    },
    minFeeAmount() {
      if (!this.firstCarouseData.typeOfFeeList?.length) return 0;
      return Math.min(
        ...this.firstCarouseData?.typeOfFeeList
        .flatMap(item => item.detailList || []) // 兼容 detailList 为空的情况
        .map(detail => detail.feeAmount)
      )
    },
    currency() {
      return this.firstCarouseData?.typeOfFeeList?.[0]?.currency || ''
    },
    contentData() {
      const raw = this.$store.state.content.contentData
      if (!raw) return { content: {} }
      if (typeof raw === 'object') return raw
      try {
        return JSON.parse(raw) || { content: {} }
      } catch {
        return { content: {} }
      }
    },
  },
  watch: {
    isLogin(val) {
      if (!val) {
        this.profileDialogVisible = false
      }
    }
  },
  methods: {
    ...mapActions('user', ['changeActiveId']),
    isProfileIncomplete() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        return !!localStorage.getItem('token') && (!userInfo.firstName || !userInfo.lastName)
      } catch {
        return false
      }
    },
    attendeeRegistrationClick() {
      // this.$api
      //   .userCongressAttendeeRegistration({ congressId: this.firstCarouseData.id })
      //   .then(() => {
          this.goto('/congressSignUp?id=' + this.firstCarouseData.id, '/congressSignUp')
        // })
        // .catch((err) => {
        //   this.$message?.error(err?.msg || err?.message || 'Request failed')
        // })
    },
    abstractSubmissionClick() {
      if (this.isProfileIncomplete()) {
        this.profileDialogVisible = true
        return
      }
      this.$api
        .userCongressAbstractSubmission({ congressId: this.firstCarouseData.id })
        .then(() => {
          this.goto('/speech?id=' + this.firstCarouseData.id, '/speech')
        })
        .catch((err) => {
          this.$message?.error(err?.msg || err?.message || 'Request failed')
        })
    },
    gotoUrl(e) {
      this.$router.push(`/congressHistory?year=${e}`)
    },
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
      const startFormatted = `${startDay} ${startMonth}`;
      const endFormatted = `${endDay} ${endMonth} ${year}`;

      return `${startFormatted} - ${endFormatted}`;
    },
     formatFullDateRange1(startString, showDay = true) {

      const startDate = new Date(startString);

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
      const year = startDate.getFullYear();
      const startFormatted = showDay ? `${startDay} ${startMonth} ${year}` : `${startMonth} ${year}`;
      return `${startFormatted}`;
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
      this.loading = true
      this.$api
        .websiteCongressList({
          page: 1,
          pageSize: 1,
          publishStatus: 1,
          title: this.categoryName,
          congressType: 'Advances Course'
        })
        .then((res) => {
          if (!res || (res.code !== 200 && res.code !== 0) || !res.data || !Array.isArray(res.data.list)) {
            this.firstCarouseData = {}
            this.carouselListData = []
            this.topData = []
            setTimeout(() => {
              this.loading = false
            }, 500)
            return
          }
          this.carouselListData = res.data.list || []; /**兼容异常格式返回引起渲染问题 */
          this.firstCarouseData = this.carouselListData?.[0];
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
          setTimeout(() => {
            this.loading = false
          }, 500)
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
    this.previousCongresses = this.$dataCom.years.sort((a, b) => {
        // 将字符串类型的 year 转为数字，确保排序准确
        const yearA = Number(a.year);
        const yearB = Number(b.year);
        // 倒序：b - a；正序：a - b
        return yearB - yearA;
    });
    this.getCongressInfo();
  },
};
</script>

<style lang="scss" scoped>
.advancesCourses {
  background-color: #ffffff;
  &-fmf {
    display: flex;
    .carousel-empty {
      flex-shrink: 0;
      background: #eee;
      width: 600px;
      height: 338px;
      object-fit: contain;
    }
    .carousel-form {
      width: 100%;
      margin-left: 48px;
      .carousel-icon {
        width: 56px;
        height: 56px;
        margin-right: 12px;
        margin-top: 24px;
      }
      .carousel-label {
        font-weight: bold;
        font-size: 18px;
        color: #0e3045;
        margin-top: 24px;
      }
      .carousel-value {
        font-weight: 400;
        font-size: 18px;
        color: #656b6f;
        margin-top: 10px;
      }
      .carousel-link {
        margin-top: 40px;
        font-weight: 400;
        font-size: 18px;
        color: #036fc0;
        cursor: pointer;
      }
      .noFile{
        color: #999;
        cursor: no-drop;
      }
    }
    
    .carousel-container {
      width: 600px;
      flex-shrink: 0;
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
        max-width: 600px;
        width: 600px;
        height: 338px;
        object-fit: contain;
        border-radius: 10px;
        overflow: hidden;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          // background-color: rgba($color: #036FC0, $alpha: .3);
        }
      }
    }
  }
  .main-container {
    padding-top: 40px;
    margin-bottom: 40px;
  }
  .congress-info {
    .info-header {
      font-size: 18px;
      color: #8a9094;
      text-align: center;
      .info-title {
        font-weight: bold;
        font-size: 40px;
        color: #036FC0;
        margin-bottom: 40px;
      }
      .info-subTitle {
        font-weight: 400;
        font-size: 18px;
        color: #036FC0;
        margin-bottom: 40px;
      }
    }
    
  }
  .congress-about {
    // height: 212px;
    background-color: #eff9ff;
    border-radius: 8px;
    padding: 32px;
    margin: 0 auto 40px;
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
      font-size: 24px;
      color: #0e3045;
      line-height: 36px;
      text-align: justify;
      display: block;
    }
  }
  .congress-registration {
    width: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #effbff 100%);
    .section-title {
      font-weight: bold;
      font-size: 40px;
      color: #036fc0;
      margin-bottom: 16px;
      text-align: center;
    }
    .section-subtitle {
      height: 26px;
      font-weight: 400;
      font-size: 24px;
      color: #8a9094;
      line-height: 20px;
      text-align: center;
      font-style: normal;
      margin-bottom: 32px;
    }
    .registration-info {
      font-weight: 400;
      font-size: 18px;
      color: #0e3045;
      line-height: 26px;
      margin-bottom: 45px;
      text-align: justify;
    }
    .registration-options {
      display: flex;
      gap: 24px;
      justify-content: center;
      .option-card {
        flex: 1;
        min-width: 320px;
        background-color: white;
        border-radius: 8px;
        padding: 42px 48px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        &:hover {
          transform: translateY(-2px);
        }
        
        
      }
      .attendee {
        border: 1px solid #e0e0e0;
        display: flex;
        .attendee-left {
          width: 100%;
          .option-header {
            margin-bottom: 20px;
            display: flex;
            .option-icon {
              width: 96px;
              height: 96px;
              color: #3b97ff;
              margin-right: 20px;
            }
            .option-title {
              font-weight: bold;
              font-size: 24px;
              color: #0e3045;
              line-height: 56px;
              margin-bottom: 12px;
            }
            .option-subtitle {
              font-weight: 400;
              font-size: 18px;
              color: #8a9094;
              line-height: 28px;
            }
          }
          .option-body {
            height: 160px;
            margin-bottom: 32px;
            .option-feature {
              display: flex;
              align-items: center;
              margin-bottom: 18px;
              .option-feature-icon {
                width: 20px;
                height: 20px;
                margin-right: 16px;
              }
              span {
                font-weight: 400;
                font-size: 18px;
                color: #23272a;
                line-height: 28px;
              }
            }
          }
        }
        .attendee-right {
          width: 300px;
          .option-price {
            width: 100%;
            height: 120px;
            border-radius: 8px 8px 8px 8px;
            text-align: right;
            margin-bottom: 80px;
            span:first-child {
              font-weight: bold;
              font-size: 40px;
              color: #036fc0;
              height: 52px;
              line-height: 52px;
              text-align: right;
              margin-bottom: 8px;
              span {
                font-weight: bold;
                font-size: 18px;
                color: #036fc0;
              }
            }
            span:last-child {
              height: 28px;
              font-weight: 400;
              font-size: 18px;
              color: #8a9094;
              line-height: 28px;
              text-align: center;
            }
          }
          .option-button {
            width: 100%;
            height: 64px;
            line-height: 64px;
            border-radius: 32px;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            color: #ffffff;
            background: #0c63d5;
            &.disabled {
              background: #e0e0e0;
              color: #8a9094;
              cursor: not-allowed;
              pointer-events: none;
              &:hover {
                background: #e0e0e0;
              }
            }
            cursor: pointer;
            &:hover {
              background: rgba($color: #0c63d5, $alpha: 0.85);
            }
            &:active {
              background: #0c63d5;
            }
          }
        }
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
    background: linear-gradient(135deg, #ffffff 0%, #effbff 100%);
    .section-title {
      height: 64px;

      font-weight: bold;
      font-size: 40px;
      color: #036fc0;
      text-align: center;
      font-style: normal;
      margin-bottom: 10px;
    }
    .section-subtitle {
      font-size: 18px;
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
        border: 1px solid #e1f4ff;
        padding: 10px;
      }
    }
    .view-more {
      width: 288px;
      height: 19px;
      font-weight: 400;
      font-size: 18px;
      color: #036fc0;
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
      padding-top: 40px;
      margin-bottom: 0;
    }
    .section-subtitle {
      height: 26px;

      font-weight: 400;
      font-size: 24px;
      color: #8a9094;
      line-height: 28px;
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
          color: #036fc0;
          margin-bottom: 12px;
        }
        .congress-city {
          font-size: 18px;
          font-weight: bold;
          color: #0e3045;
          margin-bottom: 6px;
        }
        .congress-country {
          font-size: 18px;
          color: #8a9094;
          margin-bottom: 5px;
        }
        .congress-link {
          font-size: 18px;
          color: #036fc0;
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

  /* ============================================================
     RESPONSIVE BREAKPOINTS
     ============================================================ */

  /* Tablet: 768px ~ 1279px */
  @media (min-width: 768px) and (max-width: 1279px) {
    .main-container {
      width: 100% !important;
      padding-left: 32px !important;
      padding-right: 32px !important;
    }
    .congress-info .info-header .info-title { font-size: 30px; margin-bottom: 28px; }
    &-fmf {
      .carousel-container,
      .carousel-empty { width: 48%; flex-shrink: 0; }
      .carousel-container ::v-deep .carousel-img { width: 100%; max-width: 100%; }
      .carousel-form {
        margin-left: 24px;
        .carousel-label { font-size: 16px; }
        .carousel-value { font-size: 16px; }
        .carousel-link  { font-size: 16px; }
        .carousel-icon  { width: 40px; height: 40px; }
      }
    }
    .congress-about {
      .about-title { font-size: 20px; }
      .about-desc  { font-size: 18px; line-height: 28px; }
    }
    .congress-registration {
      .section-title    { font-size: 32px; }
      .section-subtitle { font-size: 18px; height: auto; }
      .registration-info { font-size: 16px; }
      .registration-options .option-card {
        padding: 32px 32px;
        .option-body { height: auto; }
        .attendee-right {
          width: 240px;
          .option-price { height: auto; span:first-child { font-size: 32px; } }
          .option-button { height: 52px; font-size: 16px; }
        }
      }
    }
    .previous-congresses {
      .section-title    { font-size: 32px; height: auto; }
      .section-subtitle { font-size: 16px; }
    }
    .previous-world-congresses {
      .section-subtitle { font-size: 18px; height: auto; }
      .congress-grid .congress-item {
        .congress-year, .congress-city, .congress-country, .congress-link { font-size: 15px; }
      }
    }
  }

  /* Large phone: 480px ~ 767px */
  @media (min-width: 480px) and (max-width: 767px) {
    .main-container {
      width: 100% !important;
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
    .congress-info .info-header .info-title { font-size: 20px; margin-bottom: 20px; }
    &-fmf {
      flex-direction: column;
      .carousel-container {
        width: 100%;
        ::v-deep .el-carousel__container { height: 200px !important; }
        ::v-deep .carousel-img { width: 100%; max-width: 100%; height: 200px; }
      }
      .carousel-empty { width: 100%; height: 200px; }
      .carousel-form {
        width: 100%;
        height: auto !important;
        margin-left: 0;
        margin-top: 16px;
        .carousel-icon  { width: 36px; height: 36px; margin-top: 12px; }
        .carousel-label { font-size: 14px; margin-top: 12px; }
        .carousel-value { font-size: 14px; margin-top: 6px; }
        .carousel-link  { font-size: 14px; margin-top: 20px; }
      }
    }
    .congress-about {
      padding: 20px 16px;
      margin-bottom: 24px;
      .about-title { font-size: 17px; margin-bottom: 12px; }
      .about-desc  { font-size: 14px; line-height: 22px; }
    }
    .congress-registration {
      .section-title    { font-size: 24px; }
      .section-subtitle { font-size: 14px; height: auto; line-height: 1.4; margin-bottom: 16px; }
      .registration-info { font-size: 13px; line-height: 20px; margin-bottom: 24px; }
      .registration-options .option-card {
        min-width: unset;
        padding: 24px 20px;
        flex-direction: column;
        .attendee-left {
          .option-header {
            .option-icon  { width: 64px; height: 64px; }
            .option-title { font-size: 18px; line-height: 1.3; }
            .option-subtitle { font-size: 14px; }
          }
          .option-body {
            height: auto;
            margin-bottom: 16px;
            .option-feature {
              margin-bottom: 10px;
              span { font-size: 14px; line-height: 20px; }
            }
          }
        }
        .attendee-right {
          width: 100%;
          .option-price {
            height: auto;
            padding: 12px;
            margin-bottom: 20px;
            text-align: left;
            span:first-child { font-size: 28px; height: auto; line-height: 1.2; text-align: left; }
            span:last-child  { font-size: 14px; height: auto; text-align: left; }
          }
          .option-button { height: 48px; font-size: 15px; line-height: 48px; }
        }
      }
    }
    .previous-congresses {
      .section-title    { font-size: 24px; height: auto; }
      .section-subtitle { font-size: 14px; }
      .imgBox {
        .congress-grid { height: auto; }
        .logoBox       { width: 140px; height: 80px; }
        &.diamondSponsors img { height: 44px; }
        &.goldSponsors img   { height: 36px; }
        &.silverSponsors img { height: 28px; }
      }
    }
    .previous-world-congresses {
      .section-subtitle { font-size: 14px; height: auto; line-height: 1.5; }
      .congress-grid    { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
      .congress-item {
        padding: 12px 12px;
        .congress-year, .congress-city, .congress-country { font-size: 13px; }
        .congress-link { font-size: 12px; white-space: nowrap; }
      }
    }
  }

  /* Small phone: 360px ~ 479px */
  @media (min-width: 360px) and (max-width: 479px) {
    .main-container {
      width: 100% !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
    }
    .congress-info .info-header .info-title { font-size: 18px; }
    &-fmf {
      flex-direction: column;
      .carousel-container {
        width: 100%;
        ::v-deep .el-carousel__container { height: 180px !important; }
        ::v-deep .carousel-img { width: 100%; max-width: 100%; height: 180px; }
      }
      .carousel-empty { width: 100%; height: 180px; }
      .carousel-form {
        width: 100%;
        height: auto !important;
        margin-left: 0;
        margin-top: 14px;
        .carousel-icon  { width: 32px; height: 32px; margin-top: 10px; }
        .carousel-label { font-size: 13px; margin-top: 10px; }
        .carousel-value { font-size: 13px; }
        .carousel-link  { font-size: 13px; }
      }
    }
    .congress-about {
      padding: 16px 12px;
      .about-title { font-size: 16px; }
      .about-desc  { font-size: 13px; line-height: 20px; }
    }
    .congress-registration {
      .section-title    { font-size: 20px; }
      .section-subtitle { font-size: 13px; height: auto; line-height: 1.4; }
      .registration-info { font-size: 12px; line-height: 18px; }
      .registration-options .option-card {
        min-width: unset;
        padding: 20px 16px;
        flex-direction: column;
        .attendee-left {
          .option-header {
            .option-icon  { width: 56px; height: 56px; }
            .option-title { font-size: 16px; }
            .option-subtitle { font-size: 13px; }
          }
          .option-body {
            height: auto;
            .option-feature span { font-size: 13px; }
          }
        }
        .attendee-right {
          width: 100%;
          .option-price {
            height: auto;
            text-align: left;
            span:first-child { font-size: 24px; height: auto; text-align: left; }
            span:last-child  { font-size: 13px; height: auto; text-align: left; }
          }
          .option-button { height: 44px; font-size: 14px; line-height: 44px; }
        }
      }
    }
    .previous-congresses {
      .section-title    { font-size: 20px; height: auto; }
      .section-subtitle { font-size: 13px; }
      .imgBox {
        .congress-grid { height: auto; }
        .logoBox       { width: 120px; height: 70px; }
        &.diamondSponsors img { height: 38px; }
        &.goldSponsors img   { height: 30px; }
        &.silverSponsors img { height: 24px; }
      }
    }
    .previous-world-congresses {
      .section-subtitle { font-size: 13px; height: auto; }
      .congress-grid    { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
      .congress-item {
        padding: 10px 10px;
        .congress-year, .congress-city, .congress-country { font-size: 12px; }
        .congress-link { font-size: 11px; white-space: nowrap; }
      }
    }
  }

  /* Very small: < 360px */
  @media (max-width: 359px) {
    .main-container {
      width: 100% !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    .congress-info .info-header .info-title { font-size: 16px; }
    &-fmf {
      flex-direction: column;
      .carousel-container {
        width: 100%;
        ::v-deep .el-carousel__container { height: 160px !important; }
        ::v-deep .carousel-img { width: 100%; max-width: 100%; height: 160px; }
      }
      .carousel-empty { width: 100%; height: 160px; }
      .carousel-form {
        width: 100%;
        height: auto !important;
        margin-left: 0;
        margin-top: 12px;
        .carousel-icon  { width: 28px; height: 28px; margin-top: 8px; }
        .carousel-label { font-size: 12px; margin-top: 8px; }
        .carousel-value { font-size: 12px; }
        .carousel-link  { font-size: 12px; }
      }
    }
    .congress-about {
      padding: 14px 10px;
      .about-title { font-size: 14px; }
      .about-desc  { font-size: 12px; line-height: 18px; }
    }
    .congress-registration {
      .section-title    { font-size: 18px; }
      .section-subtitle { font-size: 12px; height: auto; }
      .registration-info { font-size: 12px; }
      .registration-options .option-card {
        min-width: unset;
        padding: 16px 12px;
        flex-direction: column;
        .attendee-left {
          .option-header {
            .option-icon  { width: 48px; height: 48px; }
            .option-title { font-size: 15px; }
            .option-subtitle { font-size: 12px; }
          }
          .option-body {
            height: auto;
            .option-feature span { font-size: 12px; line-height: 18px; }
          }
        }
        .attendee-right {
          width: 100%;
          .option-price {
            height: auto;
            text-align: left;
            span:first-child { font-size: 22px; height: auto; text-align: left; }
            span:last-child  { font-size: 12px; height: auto; }
          }
          .option-button { height: 40px; font-size: 13px; line-height: 40px; }
        }
      }
    }
    .previous-congresses {
      .section-title    { font-size: 18px; height: auto; }
      .section-subtitle { font-size: 12px; }
      .imgBox {
        .congress-grid { height: auto; }
        .logoBox       { width: 100px; height: 60px; }
        &.diamondSponsors img { height: 32px; }
        &.goldSponsors img   { height: 26px; }
        &.silverSponsors img { height: 20px; }
      }
    }
    .previous-world-congresses {
      .section-subtitle { font-size: 12px; height: auto; }
      .congress-grid    { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
      .congress-item {
        padding: 8px 8px;
        .congress-year, .congress-city, .congress-country { font-size: 11px; }
        .congress-link { font-size: 10px; white-space: nowrap; }
      }
    }
  }

  .imgBox {
    overflow: hidden;
    .logoBox {
      position: relative;
      width: 288px;
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
        font-size: 18px;
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
        font-size: 18px;
      }
      img {
        height: 40px;
      }
    }
  }
  
}
</style>