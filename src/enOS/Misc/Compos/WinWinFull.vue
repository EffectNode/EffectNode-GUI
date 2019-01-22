<template>
  <div class="winwin">
    <div class="win-iframe">
      <PreviewBox class="iframer" ref="preview" :project="project" :enabled="enabled"></PreviewBox>
      <div class="win-blocker" v-if="block"></div>
    </div>
  </div>
</template>

<script>
import PreviewBox from './PreviewBox'

export default {
  components: {
    PreviewBox
  },
  props: {
    block: {
      default: true
    },
    project: {},
    enabled: {}
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.win-iframe{
  height: 400px;
  min-width: calc(100vw);
  width: 100%;
  margin-top: -6px;
  /* background-color: rgb(187, 187, 187); */
  position: relative;
}

@media screen and (min-width: 767px) {
  .win-iframe{
    height: 500px;
    min-width: calc(100vw);
  }
}

.win-blocker{
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}

.iframer{
  width: 100%;
  height: 100%;
  min-height: calc(192px);
}

</style>
