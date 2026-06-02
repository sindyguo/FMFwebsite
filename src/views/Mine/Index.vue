<template>
  <div class="mine">
    <div class="vcontainer main-container">
      <span class="mine-title">Own Page</span>
      <div class="fill hcontainer mine-body">
        <div class="vcontainer mine-left">
          <div class="vcontainer vcenter">
            <!-- <el-avatar :size="64" style="font-size: 40px;background-color: #DCE4EA;" icon="el-icon-user-solid"></el-avatar> -->
            <span class="mine-name">{{ userInfo.firstName }} {{ userInfo.lastName }}</span>
            <!-- <span class="mine-title">{{ userInfo.title }}</span> -->
            <span class="mine-title mine-title1">FMF ID: {{ userInfo.fmfId }}</span>
          </div>
          <div class="fill vcontainer mine-userinfo-container">
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_ins.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Institution</span>
                <span>{{ userInfo.institution }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_ins_name.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Institution name</span>
                <span>{{ userInfo.institutionName }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_clin.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Clinical specialty</span>
                <span>{{ userInfo.clinicalSpecialty }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_email.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Email</span>
                <span>{{ userInfo.email }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_birDate.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Date of birth</span>
                <span>{{ userInfo.birthday }}</span>
              </div>
            </div>
            <div class="hcontainer mine-userinfo">
              <el-image :src="require('@/assets/img/icon/icon_country.png')" class="mine-userinfo-icon"></el-image>
              <div class="vcontainer">
                <span class="mine-userinfo-label">Country</span>
                <span>{{ userInfo.country }}</span>
              </div>
            </div>
          </div>
          <el-button type="text" class="mine-btn" @click="editClick">Details</el-button>
        </div>
        <div class="fill vcontainer mine-right">
          <div class="tabs-scroll-wrap">
            <button
              v-if="tabsCanScrollLeft"
              class="tabs-arrow tabs-arrow--left"
              @click="shiftTab(-1)">&#8249;</button>
            <div class="tabs-inner" ref="tabsWrap">
              <div class="hcontainer vcenter tabs">
                <span
                  v-for="(tabItem, tabIndex) in tabList"
                  :key="tabIndex"
                  :ref="'tab_' + tabIndex"
                  :class="['tab-item', {'active': tabIndex === curTabIndex}]"
                  @click="tabClick(tabIndex)">
                  {{ tabItem.name }}
                </span>
              </div>
            </div>
            <button
              v-if="tabsCanScrollRight"
              class="tabs-arrow tabs-arrow--right"
              @click="shiftTab(1)">&#8250;</button>
          </div>
          <div class="hcontainer vcenter flex-between mine-right-top">
            <div class="header-title" v-if="curTabIndex != tabList.length - 1">{{ tabList[curTabIndex].name }}{{ curTabIndex !== 4 ? ` (${pageConfig.total})` : '' }}</div>
            <div class="myCountry-title" v-else>
              <span :class="{active: currentType == 'all'}" @click="currentType = 'all'">All Assessments</span>
              <span :class="{active: currentType == 'history'}" @click="currentType = 'history'">Assessment History</span>
            </div>
            <el-pagination
              v-if="curTabIndex !== 4"
              layout="total, prev, pager, next"
              class="pagination-container"
              :current-page.sync="pageConfig.pageNo"
              :page-size="pageConfig.pageSize"
              :total="pageConfig.total"
              :pager-count="7"
              @current-change="getListDataFn">
            </el-pagination>
          </div>
          <div class="fill vcontainer mine-content">
            <!-- My Licence -->
            <MyLicence v-if="curTabIndex === 4"></MyLicence>
            <!-- Other tabs list -->
            <template v-else>
              <div v-for="(item, index) in listData" :key="index"
                :class="['hcontainer vcenter', 'flex-between mine-item']">
                <!-- courses -->
                <MyCourses v-if="curTabIndex === 0" :item="item"></MyCourses>
                <!-- orders — layout matches My Registrations: main block + action column bottom-right -->
                <MyOrders v-else-if="curTabIndex === 1" :item="item"></MyOrders>
                <!-- MyRegistrations -->
                <MyRegistrations v-else-if="curTabIndex === 2" :item="item"></MyRegistrations>
                <!-- abstract approvals -->
                <AbstractApprovals v-else-if="curTabIndex === 3" :item="item"></AbstractApprovals>
                <!-- fellowShip -->
                <MyFellowShip :userInfo="userInfo" v-else-if="curTabIndex === 5" :item="item"></MyFellowShip>
                <!-- country -->
                <MyCountry :userInfo="userInfo" :currentType="currentType" v-else-if="curTabIndex === 6" :item="item" @refreshList="getListDataFn"></MyCountry>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- <p class="mine-platform-tip">
        Until this website is fully functional, please access your license through the
        <a href="https://courses.fetalmedicine.com/login/login?locale=en" target="_blank" rel="noopener noreferrer">original platform</a>
      </p> -->
    </div>
    <!-- Image Contest closed dialog -->
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import MyLicence from '@/views/Mine/MyLicence.vue'
  import MyOrders from '@/views/Mine/MyOrders.vue'
  import MyRegistrations from '@/views/Mine/MyRegistrations.vue'
  import AbstractApprovals from '@/views/Mine/AbstractApprovals.vue'
  import MyCourses from '@/views/Mine/MyCourses.vue'
  import MyFellowShip from '@/views/Mine/MyFellowShip.vue'
  import MyCountry from '@/views/Mine/MyCountry.vue'
  export default {
    name: 'MinePage',
    components: {
      MyLicence,
      MyOrders,
      MyRegistrations,
      AbstractApprovals,
      MyCourses,
      MyFellowShip,
      MyCountry
    },
    provide() {
      return {
        letterClick: this.letterClick,
        getListDataFn: this.getListDataFn
      }
    },
    data() {
      return {
        userInfo: {},
        tabList: [
          { name: 'My Courses' },
          { name: 'My Orders' },
          { name: 'My Registrations' },
          { name: 'Abstract Approvals' },
          { name: 'My Licence' },
          { name: 'My FellowShip' },
          { name: 'My Country' },
        ],
        curTabIndex: 0,
        currentType: 'all',
        pageConfig: {
          pageNo: 1,
          pageSize: 5,
          total: 0
        },
        listData: [],
        paymentToken: '',
        showPaymentDialog: false,
        uploadFileList: [],
        currentTime: new Date(),
        imageContestClosedDialog: false,
        tabsCanScrollLeft: false,
        tabsCanScrollRight: false,
        uploadObj:{
          accept: '.pdf',
          size: 200*1024*1024,
          limit: 1
        },
        uploadDialogWidth: '500px',
        uploadDialogFullscreen: false,
        uploadDialogTop: '8vh'
      }
    },
    
    
    computed: {
      baseUrl() {
        return window.location.origin + process.env.VUE_APP_BASE_API;
      }
    },
    watch: {
      currentType() {
        this.pageConfig.pageNo = 1
        this.pageConfig.total = 0
        this.getListDataFn()
      }
    },
    methods: {
      ...mapActions('user', ['changeActiveId']),
      getOwnUserInfoFn() { 
        this.$api.getOwnUserInfo({}).then(res => { 
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.userInfo = res.data
          } else {
            this.userInfo = {}
          }
        }).catch(err => {
          console.log('err:', err)
          this.userInfo = {}
        })
      },
      tabClick(index) {
        this.curTabIndex = index
        this.pageConfig.pageNo = 1
        this.pageConfig.total = 0
        this.currentType = 'all'
        this.getListDataFn()
        this.$nextTick(() => this.scrollTabIntoView(index))
      },
      scrollTabIntoView(index) {
        const wrap = this.$refs.tabsWrap
        const tabRef = this.$refs['tab_' + index]
        if (!wrap || !tabRef) return
        const el = Array.isArray(tabRef) ? tabRef[0] : tabRef
        const pad = 12
        const wrapRect = wrap.getBoundingClientRect()
        const elRect   = el.getBoundingClientRect()
        const relLeft  = elRect.left  - wrapRect.left
        const relRight = elRect.right - wrapRect.left
        if (relLeft < pad) {
          wrap.scrollBy({ left: relLeft - pad, behavior: 'smooth' })
        } else if (relRight > wrapRect.width - pad) {
          wrap.scrollBy({ left: relRight - wrapRect.width + pad, behavior: 'smooth' })
        }
        this.$nextTick(() => this.updateTabArrows())
      },
      /* shift active tab index by ±1 and navigate */
      shiftTab(dir) {
        const next = Math.max(0, Math.min(this.tabList.length - 1, this.curTabIndex + dir))
        if (next !== this.curTabIndex) {
          this.tabClick(next)
        } else {
          // Already at boundary — just scroll the bar a bit
          const wrap = this.$refs.tabsWrap
          if (wrap) wrap.scrollBy({ left: dir * 80, behavior: 'smooth' })
          this.$nextTick(() => this.updateTabArrows())
        }
      },
      updateTabArrows() {
        const wrap = this.$refs.tabsWrap
        if (!wrap) return
        this.tabsCanScrollLeft  = wrap.scrollLeft > 2
        this.tabsCanScrollRight = wrap.scrollLeft + wrap.clientWidth < wrap.scrollWidth - 2
      },
      editClick() {
        // console.log('editClick')
        this.$router.push({ path: 'personalInformation' })
      },
      letterClick(url) {
        // this.$api.exportCongressFile(templateCode,row.congressId,templateCode,templateCode)
        window.open(this.baseUrl + url)
      },
      async getListDataFn() {
        if (this.curTabIndex === 4) {
          this.listData = []
          this.pageConfig.total = 0
          return
        }
        // Only clear data if we're on the first page to avoid flickering during pagination
        if (this.pageConfig.pageNo === 1) {
          this.listData = []
        }
        let res = null
        if(this.curTabIndex === 6) {
          if(this.currentType == "all") {
            res = await this.$api.getImageReviewLogUserPage({
              pageNo: this.pageConfig.pageNo,
              pageSize: this.pageConfig.pageSize,
              publishStatus: "1",
              country: this.userInfo.country
            }).catch(err => err)
          } else {
            res = await this.$api.getImageReviewLogPage({
            // res = await this.$api.getImageReviewPublishPage({
              pageNo: this.pageConfig.pageNo,
              pageSize: this.pageConfig.pageSize,
              fmfId: this.userInfo.fmfId,
            }).catch(err => err)
          }
        }else if(this.curTabIndex === 5) {
          res = await this.$api.getCourseCertificatePage({
            fmfId: this.userInfo.fmfId,
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        }else if (this.curTabIndex === 3) {
          // For abstract approvals, ensure pagination is passed
          res = await this.$api.presentationGet({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        } else if (this.curTabIndex === 2) {
          res = await this.$api.registrationGet({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        } else if (this.curTabIndex === 1) {
          res = await this.$api.orderGet({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        } else {
          // For courses, ensure we pass pagination if the API supports it
          res = await this.$api.webUserLearingProcessPage({
            pageNo: this.pageConfig.pageNo,
            pageSize: this.pageConfig.pageSize
          }).catch(err => err)
        }

        if (res && (res.code === 200 || res.code === 0) &&
          res.data && Array.isArray(res.data.list)) {
          this.listData = res.data.list
          this.pageConfig.total = res.data.total || 0
        } else {
          this.listData = []
          this.pageConfig.total = 0
        }
      },
    },
    mounted() {
      
      this.getOwnUserInfoFn()
      this.getListDataFn()
      this.$nextTick(() => {
        this.updateTabArrows()
        const wrap = this.$refs.tabsWrap
        if (wrap) wrap.addEventListener('scroll', () => this.updateTabArrows())
      })
    },
  }
</script>

<style lang="scss">
/* ─── Original styles (unchanged) ────────────────────────── */
.mine {
  padding: 80px 0 20px;
  background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
  /* prevent horizontal overflow on any screen size */
  overflow-x: hidden;

  /* Override global .main-container fixed 1200px */
  .main-container {
    width: 100% !important;
    max-width: 1200px;
    box-sizing: border-box;
  }

  .mine-title {
    color: #000000;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  /* ── Left profile card ──────────────────────────────────── */
  .mine-left {
    height: 100%;
    width: 300px;
    border-radius: 8px;
    padding: 20px;
    margin-right: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .mine-name {
      font-size: 18px;
      font-weight: bold;
      color: #0E3045;
      margin-bottom: 10px;
    }
    .mine-title {
      font-size: 14px;
      color: #656B6F;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .mine-title1 {
      margin-bottom: 40px;
    }
    .mine-userinfo-container {
      font-size: 14px;
      margin-bottom: 20px;
      border-bottom: 1px solid #C8D1D7;
      .mine-userinfo {
        font-size: 14px;
        color: #0E3045;
        margin-bottom: 36px;
        .mine-userinfo-icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
        .mine-userinfo-label {
          font-size: 12px;
          color: #8A9094;
          margin-bottom: 8px;
        }
      }
    }
  }

  /* ── Right content card ─────────────────────────────────── */
  .mine-right {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    min-width: 0;   /* stop flex child from growing wider than container */
    overflow: hidden;

    /* ── Tab scroll wrapper (new — carries original .tabs bg) */
    .tabs-scroll-wrap {
      display: flex;
      align-items: stretch;
      background-color: #E3F3FF;
      border-radius: 8px 8px 0 0;
    }

    /* Arrow nav buttons */
    .tabs-arrow {
      flex-shrink: 0;
      width: 28px;
      border: none;
      background: rgba(255,255,255,0.4);
      color: #036FC0;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      transition: background 0.15s;
      &:hover { background: rgba(255,255,255,0.7); }
      &--left  { border-radius: 8px 0 0 0; }
      &--right { border-radius: 0 8px 0 0; }
    }

    /* Scrollable inner strip */
    .tabs-inner {
      flex: 1;
      min-width: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }

    .tabs {
      padding: 20px;
      height: 64px;
      flex-wrap: nowrap;
      white-space: nowrap;

      .tab-item {
        position: relative;
        flex-shrink: 0;
        font-size: 12px;
        color: #656B6F;
        margin-right: 36px;
        cursor: pointer;
        display: block;
        text-align: center;
        font-weight: bold;

        &.active, &:hover {
          font-weight: bold;
          color: #036FC0;
          &:after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -10px;
            transform: translateX(-50%);
            width: 16px;
            height: 3px;
            background: #036FC0;
          }
        }
      }
    }

    .mine-right-top {
      padding: 20px 20px 0;
      color: #656B6F;
      font-size: 14px;
      font-weight: bold;
      flex-wrap: wrap;
      gap: 8px;
      .pagination-container {
        color: #8A9094;
        font-size: 14px;
      }
    }

    .mine-content {
      padding: 0 20px 20px;
      overflow-y: auto;

      .mine-item {
        padding: 16px;
        margin-top: 16px;
        border-radius: 8px;
        background-color: #F7FCFF;

        .mine-item-status {
          margin-left: 20px;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 14px;
          &.pass                    { background-color: #E5FFF6; color: #23C36E; border: 1px solid #23C36E; }
          &.failed                  { background-color: #FFE3E3; color: #FF7A7A; border: 1px solid #FF7A7A; }
          &.examPending             { background-color: #F0F9FF; color: #0895FF; border: 1px solid #0895FF; }
          &.not-attempted           { background-color: #EEEEEE; color: #656B6F; border: 1px solid #656B6F; }
          &.unpaid                  { background-color: #F0F9FF; color: #0895FF; border: 1px solid #0895FF; }
          &.paid                    { background-color: #E5FFF6; color: #23C36E; border: 1px solid #23C36E; }
          &.refunded                { background-color: #FFF0DD; color: #F8AC48; border: 1px solid #F8AC48; }
          &.free                    { background-color: #D9F1FF; color: #036fc0; border: 1px solid #036fc0; }
          &.pending-payment         { background-color: #E2F3FF; color: #0895FF; border: 1px solid #0895FF; }
          &.registered              { background-color: #E2F3FF; color: #23C36E; border: 1px solid #23C36E; }
          &.incomplete-registration { background-color: #FFF0DD; color: #F8AC48; border: 1px solid #F8AC48; }
          &.PendingReview           { background-color: #E2F3FF; color: #0895FF; border: 1px solid #0895FF; }
          &.Approved                { background-color: #E5FFF6; color: #23C36E; border: 1px solid #23C36E; }
          &.Rejected                { background-color: #FFF0DD; color: #F8AC48; border: 1px solid #F8AC48; }
        }

        .mine-item-label {
          font-size: 12px;
          color: #8A9094;
        }
        .mine-item-value {
          font-size: 12px;
          margin-left: 14px;
          color: #0E3045;
        }
        .mine-item-link {
          font-size: 12px;
          margin-left: 14px;
          color: #036FC0;
          text-decoration-line: underline;
          cursor: pointer;
        }
        .mine-item-header {
          margin-bottom: 12px;
          .mine-item-title {
            font-size: 16px;
            font-weight: bold;
            color: #0E3045;
            max-width: 487px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .mine-registration-title {
            font-size: 16px;
            font-weight: bold;
            max-width: 487px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        
      }
    }
  }

  .myCountry-title {
    width: 400px;
    background: #f9f8f8;
    display: flex;
    padding: 6px 8px;
    gap: 14px;
    span {
      width: 50%;
      font-size: 14px;
      line-height: 40px;
      color: #656B6F;
      cursor: pointer;
      text-align: center;
      font-weight: bold;
      background: #fff;
      &.active {
        color: #036FC0;
        background: #dcedfa;
      }
    }
  }

  .mine-platform-tip {
    margin-top: 16px;
    font-size: 13px;
    color: #656B6F;
    text-align: justify;
    width: 220px;
    line-height: 1.6;
    a { color: #036FC0; text-decoration: underline; }
  }

  .mine-btn {
    padding: 5px 10px;
    font-size: 14px;
    text-decoration: none;
    &.mine-btn--contest-active {
    }
  }

  /* Responsive action overflow controls */
  .reg-desktop-only { display: inline-block; }
  .reg-more-btn    { display: none; }
  .reg-more-trigger {
    cursor: pointer;
    user-select: none;
    color: #036FC0;
    font-size: 14px;
    padding: 5px 10px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
}
::v-deep .el-dropdown-menu__item{
  color: #036FC0;
}

::v-deep .el-dropdown-menu__item.is-disabled {
    cursor: default;
    color: #bbb;
    pointer-events: none;
}
/* ─── Responsive ──────────────────────────────────────────── */

/* Tablet ≤ 1200px */
@media (max-width: 1200px) {
  .mine .main-container {
    padding: 0 16px !important;
  }
  .mine .mine-left { width: 260px; }
}

/* Tablet ≤ 900px */
@media (max-width: 900px) {
  .mine .mine-left { width: 220px; }
  .mine .mine-right .tabs .tab-item { margin-right: 28px; font-size: 13px; }
}

/* Mobile ≤ 767px — stack panels */
@media (max-width: 767px) {
  .mine {
    padding-top: 60px;
    padding-bottom: 24px;
  }

  .mine .main-container {
    padding: 0 10px !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Stack left card above right card */
  .mine-body {
    flex-direction: column !important;
  }

  .mine .mine-left {
    width: 100%;
    height: auto;       /* no longer needs to fill row height */
    margin-right: 0;
    margin-bottom: 0;
  }

  .mine .mine-right {
    width: 100%;
    overflow: visible;  /* expand downward; page-level scroll handles it */
  }

  /* Tab bar */
  .mine .mine-right .tabs-scroll-wrap { border-radius: 8px 8px 0 0; }
  .mine .mine-right .tabs-arrow--left  { border-radius: 8px 0 0 0; }
  .mine .mine-right .tabs-arrow--right { border-radius: 0 8px 0 0; }
  .mine .mine-right .tabs {
    padding: 12px 8px;
    height: 52px;
    .tab-item { margin-right: 20px; font-size: 13px; }
  }

  /* Right header */
  .mine .mine-right .mine-right-top {
    padding: 14px 14px 8px;
    flex-direction: column;
    align-items: flex-start !important;
  }

  /* Content padding */
  .mine .mine-right .mine-content { padding: 0 12px 16px; }

  /* Item cards: stack content + actions */
  .mine .mine-right .mine-content .mine-item {
    flex-direction: column !important;
    align-items: flex-start !important;

    .mine-item-header {
      width: 100%;
      .mine-item-title,
      .mine-registration-title {
        max-width: 100%;
        white-space: normal;
      }
    }

    /* metadata rows: wrap */
    .hcontainer.vcenter.flex-between {
      flex-wrap: wrap;
      gap: 4px 12px;
    }

    /* fill column: full width in column layout */
    .fill { width: 100%; }
  }

  /* Action buttons (Final test / Certification / etc.) */
  .ml-50 {
    margin-left: 0 !important;
    margin-top: 8px;
    flex-direction: row !important;
    width: 100%;
    justify-content: flex-end;
    gap: 4px;
  }

  /* Overflow: hide individual buttons, show More dropdown */
  .reg-desktop-only { display: none !important; }
  .reg-more-btn     { display: inline-flex !important; align-items: center; }
}

/* Small mobile ≤ 479px */
@media (max-width: 479px) {
  .mine .main-container { padding: 0 8px !important; }

  .mine .mine-right .tabs {
    padding: 10px 4px;
    height: 48px;
    .tab-item { margin-right: 14px; font-size: 12px; }
  }

  .mine .mine-right .mine-content .mine-item { padding: 10px 10px; }

  .mine .mine-right .mine-content .mine-item .mine-item-status {
    margin-left: 8px;
    font-size: 12px;
  }
}
</style>

<style lang="scss">
  /* Image Contest active state inside More dropdown */
  .reg-more-contest-active {
    

  }

  /* Upload e-poster (Abstract Approvals) — center in viewport (see licence-details-dialog) */
  .el-dialog__wrapper:has(> .upload-dialog:not(.is-fullscreen)) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
    box-sizing: border-box;
  }

  /* Upload e-poster (Abstract Approvals) */
  .el-dialog.upload-dialog {
    display: flex;
    flex-direction: column;
    max-height: 92vh;
    width: min(500px, calc(100vw - 32px)) !important;
    max-width: calc(100vw - 32px);
    box-sizing: border-box;
  }

  .el-dialog.upload-dialog:not(.is-fullscreen) {
    margin: 0 auto !important;
  }

  .el-dialog.upload-dialog.is-fullscreen {
    max-height: 100vh;
    height: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    margin-top: 0 !important;
    margin-bottom: 0;
    border-radius: 0;
  }

  .upload-dialog .el-dialog__header {
    flex-shrink: 0;
    padding: 10px 20px;
  }

  .upload-dialog .el-dialog__title {
    word-break: break-word;
    padding-right: 8px;
  }

  .upload-dialog .el-dialog__body {
    height: auto !important;
    min-height: 0;
    flex: 1 1 auto;
    max-height: min(420px, calc(92vh - 200px));
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px 20px;
    box-sizing: border-box;
  }

  .upload-dialog.is-fullscreen .el-dialog__body {
    flex: 1 1 0;
    max-height: none;
  }

  .upload-dialog .el-dialog__footer {
    flex-shrink: 0;
    padding: 12px 20px 16px;
    box-sizing: border-box;
  }

  .upload-dialog-inner {
    text-align: left;
  }

  .upload-dialog-note {
    color: #f56c6c;
    margin: 16px 0 0;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .upload-dialog-tags {
    text-align: left;
    margin-top: 12px;
  }

  .upload-dialog .el-dialog__body .el-tag {
    max-width: 100%;
    white-space: normal;
    height: auto;
    line-height: 1.45;
    padding-top: 6px;
    padding-bottom: 6px;
  }

  .upload-dialog-footer {
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  .upload-dialog-footer .el-button {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .upload-dialog-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .upload-dialog-footer .el-button {
      width: 100%;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }

    .upload-dialog .el-dialog__body {
      max-height: calc(92vh - 200px);
    }
  }

  @media (max-width: 576px) {
    .upload-dialog .el-dialog__body {
      padding: 12px 14px;
    }

    .upload-dialog .el-dialog__header {
      padding: 10px 14px;
    }

    .upload-dialog .el-dialog__footer {
      padding: 10px 14px 14px;
    }

    .upload-dialog-note {
      margin-top: 12px;
      font-size: 13px;
    }
  }

  @supports not (selector(:has(*))) {
    .el-dialog.upload-dialog:not(.is-fullscreen) {
      margin-top: 8vh !important;
    }
  }

  
</style>