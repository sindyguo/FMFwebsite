<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view/>
  </div>
</template>

<script>
let designWidth = 1920;
let designHeight = 1080;
export default {
  name: 'App',
  mounted() {
    // this.keepFit();
    // window.addEventListener('resize', () => {
    //   this.keepFit();
    // });
    // console.log(process.env)
  },
  methods: {
    keepFit() {
      let dom = document.querySelector('#app');
      let clientWidth = document.documentElement.clientWidth;
      let clientHeight = document.documentElement.clientHeight;
      let scale = (clientWidth / clientHeight < designWidth / designHeight) ? (clientWidth / designWidth) : (clientHeight / designHeight);
      /** +1 目的为处理精度计算丢失问题，通过overflow：hidden控制缩放后由于精度丢失导致浏览器出现宽度或高度空白区域问题 */
      dom.style.height = `${Math.ceil(1 + clientHeight / scale)}px`;
      dom.style.width = `${Math.ceil(1 + clientWidth / scale)}px`;
      dom.style.transformOrigin = `0 0`;

      console.log(scale);
      dom.style.transform = `scale(${scale})`;
    }
  },
}
</script>
<style lang="scss">
  html{
    font-family: Helvetica;
  }
  .cursor {
    cursor: pointer;
  }
  .link-span {
    @extend .cursor;
    &:hover {
      color: #036FC0 !important;
      div, span {
        color: #036FC0 !important;
      }
    }
  }
</style>

