<template>
  <div class="area">
    <div class="bg">
      <PreviewBox :enabled="true" class="iframe" v-if="project" :project="project"></PreviewBox>
    </div>
    <div class="padder"></div>
  </div>
</template>

<script>
import * as API from '@/enOS/data/API'
import PreviewBox from '../../Misc/Compos/PreviewBox.vue'
export default {
  components: {
    PreviewBox
  },
  data () {
    return {
      project: false
    }
  },
  mounted () {
    this.loadLatest()
  },
  methods: {
    loadLatest () {
      API.RT.en.emit('list-latest-oobe', { exp: { title: { $regex: 'OOBE-Blog' }, userID: '5c1daecd6168c20017eec65e' }, skip: 8 * this.page, limit: 10 }, (data) => {
        if (data.signal === 'ok') {
          console.log(data)
          this.project = data.projects[Math.floor(data.projects.length * Math.random())]
        }
      })
    }
  }
}
</script>

<style lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style scoped>
.area{
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(0,0,0,0.2);
  animation: bgColor 3s ease 0s 1 normal both;
  overflow: hidden;
}
.bg{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.iframe{
  /* animation: rollIn 4s ease 1s 1 normal both; */
}

@keyframes bgColor {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes rollIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
