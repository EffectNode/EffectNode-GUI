<template>
  <div class="full oobe-visual">
    <PreviewBox v-if="featuredProjects[0]" class="full" :enabled="true" :project="featuredProjects[0]"></PreviewBox>
  </div>
</template>

<script>
import * as API from '@/enOS/data/API'
// import * as Builder from '@/enOS/data/builder'
import PreviewBox from './PreviewBox.vue'

export default {
  components: {
    PreviewBox
  },
  data () {
    return {
      sliderAt: 1,
      featuredProjects: [],
      page: 0,
      API,
      navTo: 0,
      winWidth: window.innerWidth
    }
  },
  computed: {
    show () {
      if (this.winWidth >= 767) {
        return 'big'
      } else {
        return 'small'
      }
    }
  },
  mounted () {
    this.loadLatest()
    window.addEventListener('resize', () => {
      this.winWidth = window.innerWidth
    }, false)
  },
  methods: {
    async viewFull (project) {
      try {
        let compo = this.$refs[project._id][0]
        let html = compo.$refs.preview.html
        let win = window.open('about:blank')
        win.document.write(html)
      } catch (e) {
        console.log(e)
        console.log('cannot ref vue compos')
      }
    },
    loadLatest () {
      API.RT.en.emit('list-latest-oobe', { exp: { title: { $regex: 'OOBE-1' }, userID: '5c1daecd6168c20017eec65e' }, skip: 8 * this.page, limit: 1 }, (data) => {
        if (data.signal === 'ok') {
          console.log(data)
          this.featuredProjects = data.projects.slice().reverse()
        }
      })
    }
  }
}
</script>

<style>
.hero-slider .VueCarousel-wrapper{
  overflow: visible !important;
}
.hero-slider .VueCarousel-dot-container{
  margin-top: 0px !important;
}
.hero-slider .VueCarousel-dot[data-v-438fd353]:focus {
  outline: none !important;
}
</style>

<style scoped>
.linker{
  cursor: pointer;
  text-decoration: underline;
}
.full{
  width: 100%;
  height: 100%;
}
.oobe-visual{
  background: linear-gradient(45deg, #eeeeee, white);
}
</style>
