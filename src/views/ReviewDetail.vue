<template>
  <div class="reviewdetail">
    <div class="vcontainer main-container">
      <span class="reviewdetail-title">Review Details</span>
      <div class="fill vcontainer reviewdetail-content">
        <span class="rc-title">Audit Results</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Audit Results</span>
            <span>{{ detailData.status }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Review Time</span>
            <span>{{ detailData.reviewTime }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <span class="rc-label">Notes</span>
          <span class="fill rc-word-wrap">{{ detailData.notes }}</span>
        </div>
        <span class="rc-title">Submitter Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitting name</span>
            <span>{{ detailData.submittingName }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitting Email</span>
            <span>{{ detailData.submittingEmail }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitter FMF ID</span>
            <span>{{ detailData.submittingFmfId }}</span>
          </div>
        </div>
        <span class="rc-title">Speaker Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Who is the speaker</span>
            <span>{{ detailData.whoIsTheSpeaker }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Speaker's Name</span>
            <span>{{ (detailData.speakersName || ' ')}}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Speaker's Country</span>
            <span>{{ detailData.speakerCountry }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Speaker's Email</span>
            <span>{{ detailData.email || 'N/A' }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Title</span>
            <span>{{ detailData.title }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Institution</span>
            <span>{{ detailData.institution }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Institution Name</span>
            <span>{{ detailData.institutionName }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Institution Country</span>
            <span>{{ detailData.institutionCountry }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Institution Town</span>
            <span>{{ detailData.institutionTown }}</span>
          </div>
        </div>
        <span class="rc-title">Abstracts Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Title</span>
            <span>{{ detailData.abstractsTitle }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Authors</span>
            <span>{{ detailData.authors }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Objective</span>
            <span class="fill rc-word-wrap">{{ detailData.objective }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Methods</span>
            <span class="fill rc-word-wrap">{{ detailData.methods }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Results</span>
            <span class="fill rc-word-wrap">{{ detailData.results }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Conclusion</span>
            <span class="fill rc-word-wrap">{{ detailData.conclusion }}</span>
          </div>
        </div>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Type</span>
            <span>{{ detailData.type }}</span>
          </div>
        </div>
        <span class="rc-title">Other Information</span>
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Congress Title</span>
            <span>{{ detailData.congressTitle }}</span>
          </div>
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Submitted at</span>
            <span>{{ detailData.submittedAt || 'N/A' }}</span>
          </div>
        </div>
        <!-- <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Status</span>
            <span>{{ detailData.status }}</span>
          </div>
        </div> -->
        <div class="hcontainer vcenter flex-between pv-10">
          <div class="fill hcontainer vcenter">
            <span class="rc-label">Presentation File</span>
            <a :href="detailData.presentationFileList && detailData.presentationFileList[0] && detailData.presentationFileList[0].url || ''" target="_blank" class="rc-link">
              {{ (detailData.presentationFileList && detailData.presentationFileList[0] && detailData.presentationFileList[0].url || '').split('/').pop() }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ReviewDetail',
    data() {
      return {
        detailData: {}
      }
    },
    methods: {
      getReviewDetailFn() {
        this.$api.presentationDetail({id: this.$route.query.id}).then((res) => {
          console.log('res:', res)
          if ((res.code === 200 || res.code === 0) && res.data) {
            this.detailData = res.data
          } else {
            this.detailData = {}
          }
          console.log('detailData:', this.detailData)
        }).catch((err) => {
          console.log('err:', err)
          this.detailData = {}
        })
      }
    },
    created() {
      this.getReviewDetailFn()
    }
  }
</script>

<style lang="scss" scoped>
  .reviewdetail {
    padding: 100px 0 20px;
    background: linear-gradient(135deg, #FCFFFF 0%, #F6FBFF 100%);
    .reviewdetail-title {
      font-weight: bold;
      font-size: 24px;
      color: #0E3045;
      margin-bottom: 10px;
    }
    .reviewdetail-content {
      font-weight: bold;
      font-size: 14px;
      color: #0E3045;
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 8px;
      background-color: #FFFFFF;
      box-shadow: 0px 10px 20px 1px rgba(14,48,69,0.1);
      .rc-title {
        font-weight: bold;
        font-size: 18px;
        color: #23272A;
        margin: 10px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #DCE4EA;
      }
      .rc-label {
        width: 200px;
        font-weight: normal;
        color: #8A9094;
        text-align: right;
        margin-right: 30px;
      }
      .rc-link {
        color: #036FC0;
        text-decoration: none;
      }
      .rc-word-wrap {
        word-wrap: break-word;
      }
    }
  }
</style>