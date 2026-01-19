<template>
  <div class="updating">
    <div class="title">All Done</div>
    <div class="img">
      <img src="@/assets/img/img_succ1.png" alt="">
    </div>
    <div class="info">
      Congratulations! You have successfully completed all currently available course materials. However, since the
      course has not yet been fully released, you are not eligible to take the final exam at this time. Your learning
      progress will be saved. Once new
    </div>
    <div class="doBtn">
      <div class="btnItem back">Back to Course</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdatingPage',

}
</script>

<style lang="scss" scoped>
.updating {
  width: 513px;
  margin: 109px auto;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #0E3045;
  margin-bottom: 32px;
}

.info {
  font-size: 14px;
  color: #0E3045;
  line-height: 24px;
  margin: 37px auto 55px;
}

.doBtn {
  display: flex;
  justify-content: center;
}

.btnItem {
  width: 160px;
  height: 48px;
  border-radius: 4px;
  line-height: 48px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.back {
  border: 1px solid #C8D1D7;
}

.start {
  background: #036fc0;
  color: #fff;
}
</style>