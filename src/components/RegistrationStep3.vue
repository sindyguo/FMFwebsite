<template>
  <div class="vcontainer hcenter vcenter registrationstep3">
    <span class="title">All Done</span>
    <img src="@/assets/img/img_succ1.png" class="suc-img" alt="">
    <div class="tip">Perfect! You have successfully registered an FMF platform account. Log in and start using it now!</div>
    <div class="hcontainer hcenter">
      <div class="sign-btn" @click="toSignClick">Sign in now</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      toSignClick() {
        this.$router.replace('/login')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .registrationstep3 {
    width: 513px;
    margin: 10px auto 0;
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #0E3045;
      margin-bottom: 10px;
    }
    .suc-img {
      width: 329px;
      height: 225px;
    }
    .tip {
      font-size: 14px;
      color: #0E3045;
      line-height: 24px;
      margin: 37px auto 55px;
    }
    .sign-btn {
      width: 160px;
      height: 48px;
      border-radius: 4px;
      line-height: 48px;
      text-align: center;
      font-size: 14px;
      background: #036fc0;
      color: #ffffff;
      cursor: pointer;
    }
  }
</style>