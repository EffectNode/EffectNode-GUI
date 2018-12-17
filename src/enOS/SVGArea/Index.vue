<template>
  <div class="full pos-rel" v-if="ready">
    <svg v-if="win" ref="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :width="`${win.width}px`" :height="`${win.height - 30}px`" :viewBox="`${view.x.toFixed(1)} ${view.y.toFixed(1)} ${win.width} ${win.height - 30}`">

        <!-- <title>Simple connector with intermediate point example</title> -->

        <defs>
          <marker :id="`circle-ok`" style="overflow:visible; cursor: move;">
            <circle r="3" :fill="'lime'" />
          </marker>
          <marker :id="`circle-ready`" style="overflow:visible; cursor: move;">
            <circle r="3" :fill="'url(#kale-salad)'" />
          </marker>
           <marker :id="`circle-error`" style="overflow:visible; cursor: move;">
            <circle r="3" :fill="'red'" />
          </marker>
           <marker :id="`circle-info`" style="overflow:visible; cursor: move;">
            <circle r="3" :fill="'blue'" />
          </marker>

          <linearGradient id="kale-salad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00C9FF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#92FE9D;stop-opacity:1" />
          </linearGradient>

          <linearGradient id="disco-club" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FC466B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3F5EFB;stop-opacity:1" />
          </linearGradient>
        </defs>

        <Panner
          v-if="win && view && $refs['svg']"
          :svg="$refs['svg']"
          :view="view"
          :win="win"
          @move="onPannerMove"
        ></Panner>

        <g :key="`boxes-${box.id}`" v-for="box in modules">
          <ModuleBox :Data="Data" :Doc="Doc" @connect="onConnect" @disconnect="onDisconnect" :socketuis="socketuis" :hand="hand" :view="view" :win="win" :box="box" :svg="$refs['svg']" v-if="$refs.svg" @move="onMoveBox" />
        </g>

        <g :key="`cabel-${pair.socket.from + pair.socket.to}`" v-for="(pair) in linePairs">
          <Cable :pair="pair" :socketuis="socketuis" :svg="$refs['svg']" v-if="$refs.svg" @move="onMove"></Cable>
        </g>

        <!-- <rect :x="box.b.x" :y="box.b.y" :width="box.b.w" :height="box.b.h" fill="lightgreen" stroke="black" >
        </rect> -->
        <!-- <rect x="200" y="100" width="50" height="50" fill="lightgreen" stroke="black">
        </rect> -->
        <!-- M 100,75 C 150,75 150,125 200,125 -->
      </svg>
      <div class="tools">
        <button @click="scrolHome">View Home</button>
      </div>
  </div>
</template>

<script>
import Panner from './Panner'
import Cable from './Cable'
import ModuleBox from './ModuleBox'
import anime from 'animejs'
import makeUIO from '../lib/userio.js'
// import * as Hive from '../Hive/HiveDoc.js'

export default {
  props: {
    Doc: {},
    Data: {},
    root: {},
    modules: {},
    connectors: {},

    win: {},
    bonding: {}
  },
  components: {
    Cable,
    Panner,
    ModuleBox
  },
  mounted () {
    this.ready = true
    this.$nextTick(() => {
      this.setupTouchTarget()
    })
  },
  computed: {
    linePairs () {
      return this.connectors.filter(c => {
        return c.socket.to && c.type === 'output'
      })
    }
  },
  methods: {
    onConnect (v) {
      v.from.socket.to = v.to.socket.from
      v.to.socket.to = v.from.socket.to
      console.log('con', v)
    },
    onDisconnect (v) {
      v.from.socket.to = false
      v.to.socket.to = false

      console.log('dis', v)
    },
    scrolHome () {
      anime({
        targets: this.ui,
        aX: 0,
        aY: 0,
        aZ: 0,
        duration: Math.log(Math.abs(this.ui.aX + this.ui.aY)) * 300
      })
    },
    setupTouchTarget () {
      var uio = this.makeUIO({
        target: this.$refs.svg,
        preventTouchStart: true
      })
      // this.cleanUIO = uio.clean
      this.ui = uio.ui
      this.ui.deltaX = 0.00000000001
      this.ui.deltaY = 0.00000000001

      var rAF = () => {
        this.rAFID = requestAnimationFrame(rAF)
        uio.sim()
        this.view.x = -uio.ui.aX
        this.view.y = -uio.ui.aY
        this.view.z = -uio.ui.aZ
      }
      this.rAFID = requestAnimationFrame(rAF)
      this.onClose = () => {
        uio.clean()
        cancelAnimationFrame(this.rAFID)
      }
    },
    onMoveBox (evt) {
      evt.box.pos.x += evt.dx
      evt.box.pos.y += evt.dy
    },
    onMove (evt) {
      evt.box.rect.x += evt.dx
      evt.box.rect.y += evt.dy
    },
    onPannerMove (v) {
      this.ui.aX += v.dx
      this.ui.aY += v.dy
    },
    getID () {
      return '-' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
    }
  },
  data () {
    return {
      socketuis: [],
      hand: {
        shouod: '',
        hit: {},

        dragLine: false,
        socket: false
      },
      ready: false,
      view: { x: 0, y: 0 },
      onClose () {},
      rAFID: 0,
      makeUIO,
      ui: false
    }
  }
}
</script>

<style scoped>
.pos-rel{
  position: relative;
}
.tools{
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
