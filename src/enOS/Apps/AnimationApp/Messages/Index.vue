<template>
  <div class="layout-fs layout-cc" ref="touch-target">
      <div class="space layout-s3d" :style="spaceCSS">
          <div class="gruop layout-gp layout-rp" :ref="'group'">
            <div v-for="(item, key) in info" :key="key" class="layout-ap card" :style="item.cardStyle" :ref="`card-${key}`" >
                <div @click="chosen = item">
                  {{ item.text }}
                </div>
            </div>
          </div>
      </div>
      <!-- <div class="overlay" v-if="chosen">
        {{ chosen.text }}
      </div> -->
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
      spaceCSS: {},
      chosen: false,
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
    if (this.$parent.portal) {
      this.spaceCSS = this.getSpaceCSS({ portal: this.$parent.portal })
    }
    this.$parent.$on('resize', ({ portal }) => {
      console.log('resize')
      this.spaceCSS = this.getSpaceCSS({ portal })
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
        this.sim()
        this.renderables.forEach(this.renderEachCard)
      }
      this.rAFID = window.requestAnimationFrame(this.rAF)
    },
    endLoop () {
      window.cancelAnimationFrame(this.rAFID)
    },

    // getProgress (item, key, ui) {
    //   // return (1.8 * ui.aX / window.innerWidth) % 1
    //   return ((ui.aTheta * 0.75 % (2 * Math.PI)) / (2 * Math.PI))
    // },
    getProgress (item, key, ui) {
      var m = Math.min(window.innerWidth, window.innerHeight)
      // return (1.8 * ui.aX / window.innerWidth) % 1
      return (-ui.aY / m) * 1.35
    },

    getSpaceCSS () {
      let con = this.$parent.$el
      let rect = con.getBoundingClientRect()
      var w = rect.width * 0.40
      var h = rect.height * 0.40
      // var a = w / h
      var vv = Math.min(w, h)
      return {
        width: vv + 'px',
        height: vv + 'px'
      }
    },
    getGroupTransform () {
      return `
      `
    },
    getCardTransform ({ tY, tX, tZ }) {
      return `
          translate3d(${tX * 1.5}px, ${tY}px, ${tZ * 3.5}px)
          rotateX(1deg)
      `
    },
    setupEachCard (item, key, dom) {
      var i = key
      var n = this.info.length
      // var e = i / n

      var deviation = 500
      var extras = 100
      var depth = -200 + 700 * (0.5 - Math.random())
      var height = 500 * (0.5 - (i / n)) * 1.5

      var startTrasKFEdge = this.getCardTransform({ tZ: depth, tX: -1 * (deviation + extras), tY: height })
      var startTrasKF = this.getCardTransform({ tZ: depth, tX: -1 * (deviation), tY: height })
      var endTransKF = this.getCardTransform({ tZ: depth, tX: (deviation), tY: height })
      var endTransKFEdge = this.getCardTransform({ tZ: depth, tX: (deviation + extras), tY: height })

      var keyframes = [
        // START
        {
          offset: 0,
          opacity: 0,
          transform: startTrasKFEdge
        },
        {
          offset: 0.1,
          opacity: 1,
          transform: startTrasKF
        },
        {
          offset: 0.9,
          opacity: 1,
          transform: endTransKF
        },
        {
          offset: 1,
          opacity: 0,
          transform: endTransKFEdge
        }
      ]

      var timing = {
        easing: 'linear',
        direction: 'normal',
        fill: 'both',

        delay: 0,
        iterationStart: Math.abs(((i) / n) + 0.1 % 1),
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
  font-size: 18px;
  background-color: rgba(255,255,255,0.25);
  width: 100%;
}

.overlay{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.2);
  border-radius: 0px 0px 10px 10px;
}

</style>
