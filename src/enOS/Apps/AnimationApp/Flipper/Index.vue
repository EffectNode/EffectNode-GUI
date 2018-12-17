<template>
  <div class="layout-fs layout-cc" ref="touch-target">
      <div class="space layout-s3d" :style="spaceCSS">
          <div class="gruop layout-gp layout-rp" :ref="'group'">
            <div v-for="(item, key) in info" :key="key" class="layout-ap card" :style="item.cardStyle" :ref="`card-${key}`" >
                <div>
                  {{ item.text }}
                </div>
            </div>
          </div>
      </div>
      <div class="overlay" v-if="chosen">
        <div class="poster">
          {{ chosen.text }} - {{ chosen.author }}
        </div>
      </div>
  </div>
</template>

<script>
import makeUIO from '@/enOS/lib/userio'

export default {
  props: {
    info: {
      default () {
        return [
          {
            text: '1 Apple'
          },
          {
            text: '2O range'
          },
          {
            text: '3 Siu Ming'
          },
          {
            text: '4 Dai Ming'
          },
          {
            text: '5 Lok Lok'
          },
          {
            text: '6 Fun fun'
          },
          {
            text: '7 Falala'
          },
          {
            text: '8 Didi DaDa'
          },
          {
            text: '9 Oh My'
          }
        ]
      }
    }
  },
  data () {
    return {
      nowIndex: 0,
      spaceCSS: {},
      renderables: []
    }
  },
  watch: {
    info () {
      setTimeout(() => {
        this.setupCards()
        this.$emit('resize', { portal: this.$parent.portal })
        this.$forceUpdate()
      }, 100)
    }
  },
  mounted () {
    this.spaceCSS = this.getSpaceCSS()
    this.$parent.$on('resize', ({ portal }) => {
      console.log('resize')
      this.spaceCSS = this.getSpaceCSS()
      this.$forceUpdate()
    })

    this.setupTouchTarget()
    this.setupGroup()
    this.setupCards()
    this.startLoop()
  },
  beforeDestroy () {
    this.endLoop()
  },
  destroyed () {
    setTimeout(() => {
      this.renderables.forEach((renderable) => {
        renderable.animation.cancel()
      })
    }, 1000)
  },
  computed: {
    chosen () {
      return this.info[this.nowIndex]
    }
  },
  methods: {
    setupGroup () {
      this.$refs.group.style.transform = this.getGroupTransform()
    },
    setupCards () {
      this.renderables = this.info.map((item, key) => {
        var api = { lastTime: 0, moving: true }
        var dom = this.$refs['card-' + key][0]

        var { keyframes, timing } = this.setupEachCard(item, key, dom)

        var animation = dom.animate(keyframes, timing)
        animation.pause()

        var update = (progress) => {
          var time = timing.duration * (progress % 1)
          if (time < 1) {
            time = timing.duration + time
          }
          if (api.lastTime !== time) {
            animation.currentTime = time
            api.lastTime = time
            api.moving = true
          } else {
            api.moving = false
          }
        }

        api.animation = animation
        api.dom = dom
        api.update = update
        return api
      })
    },
    renderEachCard (item, key) {
      var progress = this.getProgress(item, key, this.ui)
      item.update(progress)
    },
    setupTouchTarget () {
      var uio = makeUIO({
        target: this.$parent.$el,
        preventTouchStart: true
      })
      this.clean = uio.clean
      this.ui = uio.ui
      this.sim = uio.sim
    },
    startLoop () {
      this.rAF = () => {
        this.rAFID = window.requestAnimationFrame(this.rAF)
        if (this.$el.style.display === 'none') {
          return
        }

        if (this.ui) {
          let progress = this.getProgress(null, null, this.ui)
          let calc = Math.ceil((progress % 1) * (this.renderables.length - 1))
          calc = Math.abs(calc)
          if (this.nowIndex !== calc) {
            this.nowIndex = calc
          }
        }

        this.sim()
        this.renderables.forEach(this.renderEachCard)
      }
      this.rAFID = window.requestAnimationFrame(this.rAF)
    },
    endLoop () {
      window.cancelAnimationFrame(this.rAFID)
    },

    getProgress (item, key, ui) {
      var m = Math.min(window.innerWidth, window.innerHeight)
      // return (1.8 * ui.aX / window.innerWidth) % 1
      return (-ui.aY / m) * 2.35
    },
    getSpaceCSS () {
      let con = this.$parent.$el
      let rect = con.getBoundingClientRect()
      var w = rect.width * 0.40
      var h = rect.height * 0.40
      // var a = w / h
      var vmin = Math.min(w, h)
      vmin = Math.max(vmin, 150)
      return {
        width: vmin + 'px',
        height: vmin + 'px'
      }
    },
    getGroupTransform () {
      return `
        translateY(-50px)
        rotateY(45deg)
      `
    },
    getCardTransform ({ tZ, rZ, rX, progress }) {
      return `
        rotateX(${45 * progress}deg)
        rotateX(${90 * -progress}deg)
        translateZ(${tZ + progress * 100.0}px)
        rotateX(${-45 * progress}deg)
      `
    },
    setupEachCard (item, key, dom) {
      var i = key
      var n = this.info.length
      // var e = i / n

      // var startTrasKF = this.getCardTransform({ rZ: -67.5 })
      // var middleTransKF = this.getCardTransform({ rZ: 0 })
      // var endTransKF = this.getCardTransform({ rZ: 67.5 })

      var startTrasKF = this.getCardTransform({ tZ: -20 * 10, rX: 0, progress: -1 })
      // var middleTransKF = this.getCardTransform({ tZ: 0, rX: 0 })
      var endTransKF = this.getCardTransform({ tZ: 20 * 10, rX: 0, progress: 1 })
      var keyframes = [
        // START
        {
          offset: 0,
          opacity: 0,
          transform: startTrasKF
        },
        {
          offset: 0.1,
          opacity: 1,
          transform: startTrasKF
        },
        // {
        //   offset: 0.5,
        //   opacity: 1,
        //   transform: middleTransKF
        // },

        {
          offset: 0.8,
          opacity: 1,
          transform: endTransKF
        },
        {
          offset: 0.93,
          opacity: 1,
          transform: endTransKF
        },
        {
          offset: 1,
          opacity: 0,
          transform: endTransKF
        }
      ]

      var timing = {
        easing: 'linear',
        direction: 'normal',
        fill: 'both',

        delay: 0,
        iterationStart: Math.abs(((i + n / 2) / n) % 1),
        duration: 1000,

        iterations: 1
      }

      return {
        keyframes, timing
      }
    }
  }
}
</script>

<style scoped>
.item{
  width: 100px;
  height: 100px;
}
.layout-fs{
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.layout-cc{
  display: flex;
  justify-content: center;
  align-items: center;
}
.layout-ap{
  position: absolute;
}
.layout-tl{
  top: 0px;
  left: 0px;
}
.layout-rp{
  position: relative;
}
.layout-s3d{
  perspective: 100vmax;
}
.layout-gp{
  transform-style: preserve-3d;
}
.layout-oh{
  overflow: hidden;
}

.gruop{
  width: 100%;
  height: 100%;
}

.space{
  width: 50%;
  height: 50%;
}

.card{
  /* font-weight: bold; */
  font-size: 14px;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  border: grey solid 1px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.904);
  width: 100%;
  height: 100%;
}

.overlay{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.35);
  border-radius: 0px 0px 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.poster{
  width: 50%;
  height: 50%;
  padding: 10%;
  border: black solid 1px;
  background-color: rgba(255,255,255,0.6);
}

</style>
