<template>
  <div class="full blog-home">
    <div class="left-right">
      <div class="left">
        <BlogMeta></BlogMeta>
      </div>
      <div class="right">
        <!-- <BlogIndex></BlogIndex> -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import BlogMeta from '../parts/BlogMeta.vue'
import BlogIndex from '../parts/BlogIndex.vue'
export default {
  components: {
    BlogMeta,
    BlogIndex
  }
}
</script>

<style lang="css">
.padder {
  width: calc(100% - 15px * 2);
  margin: 0px auto;
}
@media screen and (min-width: 413px) {
  .padder {
    width: calc(100% - 15px * 2);
  }
}
@media screen and (min-width: 767px) {
  .padder {
    width: calc(100% - 15px * 2);
  }
}
@media screen and (min-width: 959px) {
  .padder {
    width: calc(100% - 15px * 2);
  }
}
@media screen and (min-width: 1440px) {
  .padder {
    width: calc(100% - 15px * 2);
  }
}
</style>
<style scoped>
.full{
  width: 100%;
  height: 100%;
  position: relative;
}
.layer-fix{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.layer-abs{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100%;
}
.dark-content{
  height: 100%;
  padding: 1px;
  box-sizing: border-box;
}
.dark-content.loading{
  color: white;
  background: black;
}

.unified{
  width: 100%;
  height: 100%;
  position: relative;
}
.layer{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.left-right{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: space-between;
  flex-direction: column;

  background: linear-gradient(45deg, #4F00BC, #29ABE2); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.left, .right{
  width: 100%;
  height: 50%;
  box-sizing: border-box;
}
.left{
  height: 35%;
  /* background: linear-gradient(0deg, #c7f8cf 0%, #bbd2fa 100%); */
  /* border-bottom: grey solid 1px; */
}
.right{
  height: 65%;
  /* background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%); */
}

@media screen and (min-width: 767px) {
  .left-right{
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
  .left, .right {
    width: 50%;
    height: 100%;
  }
  .right{
    /* order: -1; */
    /* border-right: grey solid 1px;
    border-bottom: none; */
  }
}
</style>
