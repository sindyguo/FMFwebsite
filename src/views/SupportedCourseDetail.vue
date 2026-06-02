<template>
  <div v-loading="loading" class="vcontainer supported-course">
    <TopBanner height="260px" :listData="topBannerList" />
    <div class="vcontainer hcenter main-container supported-course-content">
      <div class="back-link-row">
        <router-link class="back-link" to="/fmf-supported-courses">back to FMF supported courses</router-link>
      </div>
      <div class="section">
        <div class="hero-split">
          <div class="hero-copy">
            <div class="section-title section-title-accent">{{ formData.title || 'Supported Course' }}</div>
            <div class="section-desc">
              {{formData.congressIntroduction || 'No introduction available'}}
            </div>
          </div>
          <div class="hero-image-card">
            <img v-if="formData.congressImageList" :src="formData.congressImageList[0].url" alt="Baltic Symposium" />
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-title">Date</div>
            <div class="info-value">{{ (formData.startTime && formData.endTime) ? formatFullDateRange(formData.startTime, formData.endTime) : 'Multiple dates' }}</div>
          </div>
          <div class="info-card">
            <div class="info-title">Venue</div>
            <div class="info-value">{{ formData.location || 'Other' }}</div>
            <div class="info-sub">{{ formData.address || 'Other' }}，{{ formData.city || 'Other' }}，{{ formData.country || 'Other' }}</div>
          </div>
          <div class="info-card">
            <div class="info-title">Programme</div>
            <el-link type="primary" class="info-value" style="word-break: break-word;" v-if="formData.programmeList && formData.programmeList.length > 0" @click="handlePreview(formData.programmeList[0].url)">{{ formData.programmeList[0].name }}</el-link>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Registration fee</div>
        <div class="fee-grid" v-html="formData.registrationIntroduction"></div>
        <div class="inline-actions" v-if="formData.registrationStartTime">
          <el-link class="action-text" v-if="currentDate < formatTime(formData.registrationStartTime)"> Registration opens soon </el-link>
          <template v-else>
            <a class="action-text" href="https://reg.eventas.lt/bsfmm26" target="_blank" rel="noopener"> Click here to register </a>
            <el-link v-if="formData.programmeList && formData.programmeList.length > 0" class="action-text" @click="handlePreview(formData.programmeList[0].url)"> Click here to view the programme </el-link>
          </template>
        </div>
      </div>
      <template v-if="formData.additionalInformationList && formData.additionalInformationList.length">
        <div class="section" v-for="(item, index) in formData.additionalInformationList" :key="index">
          <div class="section-title">{{ item.title }}</div>
          <div class="section-desc" v-html="item.info">
          </div>
        </div>
      </template>

      <div class="section">
        <div class="section-title">Keynote speakers</div>
        <div class="speaker-grid" v-if="formData.speakerList && formData.speakerList.length">
          <div v-for="speaker in formData.speakerList" :key="speaker.name" class="speaker-card">
            <img v-if="speaker.profilePicture" class="speaker-avatar" :src="speaker.profilePicture" :alt="speaker.name" />
            <div class="speaker-name">{{ speaker.name }}</div>
            <div class="speaker-title">{{ speaker.personalProfile }}</div>
          </div>
        </div>
        <div v-else>
          <div class="no-data">No keynote speakers available</div>
        </div>
      </div>
    </div>
    <ProfileIncompleteDialog :visible.sync="profileDialogVisible" />
  </div>
</template>

<script>
import TopBanner from '@/components/TopBanner.vue'
import store from '@/store'
 import ProfileIncompleteDialog from "@/components/ProfileIncompleteDialog.vue";
  export default {
    name: 'SupportedCoursePage',
    components: {
      TopBanner, ProfileIncompleteDialog
    },
    data() {
      return {
        topBannerList: [{
          img: require('@/assets/img/baltic_symposium_header.jpeg'),
          title: 'Baltic Symposium',
          desc: ''
        }],
        formData: {},
        loading: false,
        speakers: [],
        profileDialogVisible: false,
      }
    },
    computed: {
      isLogin() {
        return this.$store.getters['user/isLogin']
      },
      categoryName() {
        return this.$route.query.categoryName
      },
      currentDate() {
        return new Date().getTime();
      }
    },
    methods: {
      getCongressInfo() {
        this.loading = true
        this.$api
          .websiteCongressList({
            page: 1,
            pageSize: 1,
            publishStatus: 1,
            title: this.categoryName,
            congressType: 'Supported Courses'
          })
          .then((res) => {
            if (!res || (res.code !== 200 && res.code !== 0) || !res.data || !Array.isArray(res.data.list)) {
              this.formData = {}
              setTimeout(() => {
                this.loading = false
              }, 500)
              return
            }
            this.formData = res.data?.list?.[0] || {}; /**兼容异常格式返回引起渲染问题 */
            this.topBannerList = this.formData.bannerImageList?.map(item => ({
              img: item.url,
              title: this.formData.title,
              desc: ''
            }))
            setTimeout(() => {
              this.loading = false
            }, 500)
          });
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
        console.log(`${startFormatted} - ${endFormatted}`, 111)
        return `${startFormatted} - ${endFormatted}`;
      },
      handlePreview(url) {
        window.open(url, '_blank')
      },
      isProfileIncomplete() {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
          return !userInfo.firstName || !userInfo.lastName
        } catch {
          return false
        }
      },
      handleRouter() {
        if(!this.isLogin) {
          this.$confirm('Login has expired, please log in again', 'Tip', {
            confirmButtonText: 'Re login',
            cancelButtonText: 'Cancel',
            type: 'none'
          }).then(() => {
            store.dispatch('user/logout')
            this.$router.push('/login')
          }).catch(() => {})
        } else if(this.isProfileIncomplete()) {
          this.profileDialogVisible = true
          return
        } else {
          this.$router.push(`/congressSignUp?id=${this.formData.id}`)
        }
        
      },
      formatTime(time) {
        return new Date(time).getTime();
      }
    },
    created() {
      this.getCongressInfo(); 
    }
  }
</script>

<style lang="scss" scoped>
  .supported-course {
    width: 100%;
    box-sizing: border-box;
    background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%);
    padding: 0 20px 48px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-size: 16px;

    /* Override global .main-container fixed width for this page */
    .main-container {
      width: 100% !important;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      box-sizing: border-box;
      min-width: 0;
    }
  }

  .supported-course-content {
    gap: 28px;
    padding: 24px 16px 0;
    box-sizing: border-box;
    width: 100%;
  }

  .back-link-row {
    display: flex;
    justify-content: flex-start;
  }

  .back-link {
    color: #036fc0;
    font-weight: 600;
    text-decoration: underline;
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

  @media (max-width: 900px) {
    .supported-course {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  @media (max-width: 768px) {
    .supported-course {
      padding: 0 0px 32px;
      font-size: 15px;
    }

    .section {
      padding: 10px 14px 18px;
    }

    .section-title {
      font-size: 18px;
    }

    .section-desc {
      font-size: 15px;
      line-height: 24px;
    }

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
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
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

  .speaker-avatar {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    display: block;
    margin-bottom: 10px;
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
  ::v-deep .fee-title table{
    border-collapse: initial !important;
    border: none;
    td{
      border: 1px solid #eee !important;
      padding: 20px 10px !important;
      line-height: 32px !important;
      border-radius: 10px;
    }
    ul{
      margin-left: 20px !important;
    }
  }
</style>
<style lang="scss">
.fee-grid, .section-desc {
    margin-bottom: 12px;
    img {
      max-width: 100% !important;
    }
  }
  </style>