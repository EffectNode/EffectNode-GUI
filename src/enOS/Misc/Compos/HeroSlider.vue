<template>
  <div class="hero-slider">
    <!-- not so legit but kinda works -->
    <div class="caro-parent">
      <Carousel class="caro" :per-page="1" :navigateTo="navTo" @pageChange="(v) => { sliderAt = v }">
        <Slide :key="pj._id" v-for="(pj, pi) in featuredProjects" class="slide-width">
          <div>
            <WinWinBig v-if="show === 'big'" :project="pj" :enabled="sliderAt >= (pi - 1) && sliderAt <= (pi + 1)" :block="true" :ref="pj._id"></WinWinBig>
            <WinWinSmall v-if="show === 'small'" :project="pj" :enabled="true" :ref="pj._id"></WinWinSmall>
            <p>
              Title: {{ pj.title }}, by: {{ pj.author }}
            </p>
            <p>
              <span class="linker" @click="viewFull(pj)">Fullscreen Interactive</span>
            </p>
          </div>
        </Slide>
      </Carousel>
    </div>
    <!-- not so legit but kinda works -->

  </div>
</template>

<script>
import * as API from '@/enOS/data/API'
// import * as Builder from '@/enOS/data/builder'
import WinWinSmall from './WinWinSmall.vue'
import WinWinBig from './WinWinBig.vue'
import { Carousel, Slide } from 'vue-carousel'

export default {
  components: {
    Carousel,
    Slide,

    WinWinSmall,
    WinWinBig
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
      API.RT.en.emit('list-latest-featured', { skip: 8 * this.page, limit: 8 }, (data) => {
        if (data.signal === 'ok') {
          console.log(data)
          this.featuredProjects = data.projects.slice().reverse()
          if (this.featuredProjects.length >= 2) {
            this.navTo = 1
          }
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
.slider-items{
  display: inline-block;
}

.caro{
  width: 365px;
}
.slide-width{
  width: 365px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (min-width: 767px) {
  .caro{
    width: 650px;
  }
  .slide-width{
    width: 650px;
  }
}

.caro-parent{
  padding-top: 35px;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
