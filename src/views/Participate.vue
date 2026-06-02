<template>
  <div class="participate-page vcontainer" v-loading="loading">
    <div class="page-body">
      <div class="main-container">
        <!-- Page header -->
        <div class="page-header">
          <div class="header-info">
            <h1 class="page-title">FMF Clinical Image Contest</h1>
            <div class="page-subtitle" v-if="congressInfo.title">{{ congressInfo.title }}</div>
          </div>
          <el-button class="back-btn" icon="el-icon-back" circle @click="$router.back()"></el-button>
        </div>

        <!-- Introduction content -->
        <div class="content-card" v-if="congressInfo.contestIntroduction">
          <div
            class="rich-content"
            v-html="congressInfo.contestIntroduction">
          </div>
        </div>

        <!-- Sponsors -->
        <div class="sponsors-section" v-if="sponsorList && sponsorList.length">
          <div class="sponsors-label">Sponsored by</div>
          <div class="sponsors-grid">
            <div
              v-for="(s, i) in sponsorList"
              :key="i"
              class="sponsor-item">
              <img
                :src="s.companyLogo"
                :alt="s.companyName || 'Sponsor'"
                class="sponsor-logo" />
            </div>
          </div>
        </div>

        <!-- CTA button -->
        <div class="cta-row">
          <el-button
            type="primary"
            class="cta-btn"
            @click="handleProceed">
            Proceed to submission
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog
      title="FMF Clinical Image Contest"
      :visible.sync="notRegisteredDialog"
      width="min(480px, calc(100vw - 32px))"
      append-to-body>
      <p style="line-height:1.7;color:#333;font-size:15px;margin:0;">
        Please complete your congress registration before participating in the Image Contest.
      </p>
      <span slot="footer">
        <el-button type="primary" @click="notRegisteredDialog = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ParticipatePage',
  data() {
    return {
      loading: false,
      congressInfo: {},
      notRegisteredDialog: false,
    }
  },
  computed: {
    congressId() {
      return this.$route.query.id
    },
    sponsorList() {
      return this.congressInfo.contestSponsorsList || []
    },
  },
  methods: {
    async handleProceed() {
      const cId = this.congressId || (this.congressInfo && this.congressInfo.id)
      if (cId) {
        this.loading = true
        try {
          const regRes = await this.$api.registrationGet({
            congressId: cId,
            pageSize: 10,
          }).catch(() => null)
          if (regRes && (regRes.code === 200 || regRes.code === 0)) {
            const isRegistered =
              regRes.data &&
              Array.isArray(regRes.data.list) &&
              regRes.data.list.some(item => item.registrationStatus === 'Registered')
            if (!isRegistered) {
              this.notRegisteredDialog = true
              return
            }
          }
        } finally {
          this.loading = false
        }
      }
      if (this.congressId) {
        this.$router.push('/imageContest?id=' + this.congressId)
      } else {
        this.$router.push('/imageContest')
      }
    },
    async loadCongressInfo() {
      this.loading = true
      try {
        if (this.congressId) {
          const res = await this.$api.websiteCongressGet({ id: this.congressId }).catch(() => null)
          if (res && (res.code === 200 || res.code === 0) && res.data) {
            this.congressInfo = res.data
          }
        } else {
          const res = await this.$api.websiteCongressList({
            page: 1,
            pageSize: 1,
            publishStatus: 1,
            congressType: 'Congress',
          }).catch(() => null)
          if (res && (res.code === 200 || res.code === 0) && res.data && Array.isArray(res.data.list) && res.data.list[0]) {
            this.congressInfo = res.data.list[0]
          }
        }
      } finally {
        this.loading = false
      }
    },
  },
  created() {
    this.loadCongressInfo()
  },
}
</script>

<style lang="scss" scoped>
.participate-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fcffff 0%, #f6fbff 100%);

  .page-body {
    padding: 100px 20px 80px;
  }

  .main-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .header-info {
      .page-title {
        font-size: 32px;
        font-weight: bold;
        color: #036fc0;
        margin: 0 0 6px;
        line-height: 1.2;
      }
      .page-subtitle {
        font-size: 16px;
        color: #656b6f;
      }
    }

    .back-btn {
      flex-shrink: 0;
      margin-left: 16px;
    }
  }

  .content-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 40px 48px;
    box-shadow: 0 2px 20px rgba(3, 111, 192, 0.08);
    margin-bottom: 24px;
  }

  .rich-content {
    line-height: 1.8;
    color: #333;
    font-size: 15px;

    ::v-deep {
      h1, h2, h3, h4 {
        color: #0e3045;
        margin-top: 28px;
        margin-bottom: 10px;
        line-height: 1.3;
      }
      h1 { font-size: 24px; }
      h2 { font-size: 20px; }
      h3 { font-size: 17px; }

      p {
        margin: 0 0 14px;
        color: #444;
      }

      strong, b {
        color: #0e3045;
        font-weight: 700;
      }

      a {
        color: #036fc0;
        text-decoration: underline;
        &:hover { opacity: 0.8; }
      }

      ul, ol {
        padding-left: 22px;
        margin: 0 0 14px;
        li {
          margin-bottom: 6px;
          color: #444;
        }
      }

      img {
        max-width: 100%;
        border-radius: 6px;
        margin: 8px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 14px;
        td, th {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          font-size: 14px;
        }
        th {
          background: #f0f7ff;
          font-weight: 600;
          color: #0e3045;
        }
      }

      span[style*="color"] {
        font-weight: 600;
      }
    }
  }

  .sponsors-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 32px 48px;
    box-shadow: 0 2px 20px rgba(3, 111, 192, 0.08);
    margin-bottom: 32px;

    .sponsors-label {
      font-size: 13px;
      font-weight: 600;
      color: #8a9094;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .sponsors-grid {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 32px;
    }

    .sponsor-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sponsor-logo {
      height: 48px;
      max-width: 180px;
      object-fit: contain;
      filter: grayscale(10%);
      transition: filter 0.2s;
      &:hover { filter: none; }
    }
  }

  .cta-row {
    display: flex;
    justify-content: center;
    padding: 8px 0 16px;

    .cta-btn {
      min-width: 220px;
      height: 52px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(135deg, #036fc0 0%, #0257a0 100%);
      border: none;
      box-shadow: 0 4px 16px rgba(3, 111, 192, 0.35);
      letter-spacing: 0.3px;
      transition: box-shadow 0.2s, transform 0.15s;

      &:hover {
        box-shadow: 0 6px 24px rgba(3, 111, 192, 0.45);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(3, 111, 192, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    .page-body { padding: 80px 14px 60px; }

    .page-header .header-info .page-title { font-size: 24px; }

    .content-card { padding: 24px 20px; }

    .sponsors-section {
      padding: 24px 20px;
      .sponsors-grid { gap: 20px; }
      .sponsor-logo { height: 36px; }
    }

    .cta-row .cta-btn {
      min-width: 180px;
      height: 46px;
      font-size: 15px;
    }
  }
}
</style>
