<template>
  <div class="full pos-rel" v-if="ready">
    <svg v-if="win" ref="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :width="`${win.width}px`" :height="`${win.height - 30}px`" :viewBox="`${view.x.toFixed(1)} ${view.y.toFixed(1)} ${win.width} ${win.height - 30}`">

        <!-- <title>Simple connector with intermediate point example</title> -->

        <defs>
          <marker :id="`${uniq}circle-ok`" style="overflow:visible; cursor: move;">
            <circle r="3" :fill="'lime'" />
          </marker>
          <marker :id="`${uniq}circle-ready`" style="overflow:visible; cursor: move;">
            <!-- <circle r="3" :fill="`url(#${uniq}kale-salad)`" /> -->
            <circle r="3" :stroke="`rgba(255,255,255,0.3)`" :fill="`rgba(255,255,255,0.3)`" />
          </marker>
           <marker :id="`${uniq}circle-error`" style="overflow:visible; cursor: move;">
            <circle r="3" :fill="'red'" />
          </marker>
           <marker :id="`${uniq}circle-info`" style="overflow:visible; cursor: move;">
            <circle r="3" :fill="'blue'" />
          </marker>

          <linearGradient :id="`${uniq}kale-salad`" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00C9FF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#92FE9D;stop-opacity:1" />
          </linearGradient>

          <linearGradient :id="`${uniq}disco-club`" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FC466B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3F5EFB;stop-opacity:1" />
          </linearGradient>

          <linearGradient :id="`${uniq}danger`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF0000;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1" />
          </linearGradient>

          <linearGradient :id="`${uniq}calm-blue`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#52ACFF;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#52ACFF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFE32C;stop-opacity:1" />
          </linearGradient>

          <linearGradient :id="`${uniq}calm-pink`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FAACA8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#DDD6F3;stop-opacity:1" />
          </linearGradient>

        </defs>

        <Panner
          v-if="win && view && $refs['svg']"
          :svg="$refs['svg']"
          :view="view"
          :win="win"
          @move="onPannerMove"
        ></Panner>

        <g :key="`${uniq}boxes-${box._id}`" v-for="box in modules">
          <ModuleBox
          @cloneModule="cloneModule"
          @editBox="editBox"
          @toggle-size="toggleSize"
          :uniq="uniq" :Data="Data" :Doc="Doc" @connect="onConnect" @disconnect="onDisconnect" :socketuis="socketuis" :hand="hand" :view="view" :win="win" :box="box" :svg="$refs['svg']" v-if="$refs.svg" @move="onMoveBox" @removeBox="removeBox">
            <!-- <div class="full">
              <button @click="toggleSize(box)">Happy</button>
              {{ box }}
            </div> -->
          </ModuleBox>
        </g>

        <g :key="`${uniq}cabel-${pair.socket.from + pair.socket.to}`" v-for="(pair) in outputCable">
          <Cable :running="flowYo" :Data="Data" :Doc="Doc" :uniq="uniq" :pair="pair" :socketuis="socketuis" :svg="$refs['svg']" v-if="$refs.svg" @move="onMoveCable"></Cable>
        </g>

        <!-- <rect :x="box.b.x" :y="box.b.y" :width="box.b.w" :height="box.b.h" fill="lightgreen" stroke="black" >
        </rect> -->
        <!-- <rect x="200" y="100" width="50" height="50" fill="lightgreen" stroke="black">
        </rect> -->
        <!-- M 100,75 C 150,75 150,125 200,125 -->

      </svg>
      <!-- <div class="tools">
        <span style="display: none;">{{ root }}</span>
        <button @click="scrollHome">Home View</button>
        <button @click="duplicateWindow">Duplicate Window</button>
        <button @click="toggleFlow">Toggle Flow</button>
      </div> -->
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
    uiAPI: {},

    Doc: {},
    Data: {},
    root: {},
    modules: {},
    connectors: {},

    win: {},
    meta: {}
  },
  components: {
    Cable,
    Panner,
    ModuleBox
  },
  mounted () {
    console.log(this.meta)
    this.ready = true
    this.$nextTick(() => {
      this.setupWheel()
      // this.setupTouchTarget()
      // this.$forceUpdate()
    })
  },
  watch: {
  },
  computed: {
    outputCable () {
      return this.root.connectors.filter((c, idx) => {
        return c.socket.to && c.socket.from && c.type === 'output'
      })
        .slice()
        .sort((a, b) => {
          // console.log(a.idx, b.idx)
          return a.idx - b.idx
        })
    }
  },
  methods: {
    toggleFlow () {
      this.flowYo = !this.flowYo
    },
    cloneModule (v) {
      this.$emit('cloneModule', v)
    },
    removeBox (v) {
      this.$emit('removeBox', v)
    },
    editBox (v) {
      this.$emit('editBox', v)
    },
    toggleSize (box) {
      if (box.size.w === 200) {
        anime({
          targets: box.size,
          w: 500,
          h: 200,
          update: () => {
            this.$emit('animateBox', { box })
          },
          complete: () => {
            this.$emit('saveBox', { box })
          }
        })
      } else {
        anime({
          targets: box.size,
          w: 200,
          h: 40,
          update: () => {
            this.$emit('animateBox', { box })
          },
          complete: () => {
            this.$emit('saveBox', { box })
          }
        })
      }
    },
    duplicateWindow () {
      this.uiAPI.portal.addWindow({
        type: 'connector',
        data: {}
      })
    },
    onConnect (v) {
      v.from.socket.to = v.to.socket.from
      v.to.socket.to = v.from.socket.from

      v.from.mod.to = v.to.mod.from
      v.to.mod.to = v.from.mod.from

      console.log('con', v)
      this.$emit('connect', v)
    },
    onDisconnect (v) {
      v.from.socket.to = ''
      v.to.socket.to = ''

      v.from.mod.to = ''
      v.to.mod.to = ''

      console.log('dis', v)
      this.$emit('disconnect', v)
    },
    scrollHome () {
      anime({
        targets: this.ui,
        aX: 0,
        aY: 0,
        aZ: 0,
        duration: Math.log(Math.abs(this.ui.aX + this.ui.aY)) * 300
      })
    },
    isDescendant (parent, child) {
      var node = child.parentNode
      if (parent === child) {
        return true
      }

      while (node !== null) {
        if (node === parent) {
          return true
        }
        node = node.parentNode
      }
      return false
    },
    onWheel (evt) {
      if (this.isDescendant(this.$refs.svg, evt.target)) {
        evt.preventDefault()
      } else {
        return
      }
      let ui = this.ui
      ui.deltaX = -event.deltaX * 0.02
      ui.deltaY = -event.deltaY * 0.02

      if (event.deltaX) {
        ui.deltaTheta = -event.deltaX * 0.02 / (Math.PI * 2)
      }
      if (event.deltaY) {
        ui.deltaTheta = -event.deltaY * 0.02 / (Math.PI * 2)
      }
      ui.inertia = ui.mass
    },
    setupWheel () {
      let ui = this.ui
      let h = {
        onWheel: (e) => {
          this.onWheel(e)
        }
      }
      window.addEventListener('wheel', h.onWheel)
      var rAF = () => {
        this.rAFID = requestAnimationFrame(rAF)

        if (ui.inertia > 0.01) {
          ui.inX = (ui.deltaX * ui.inertia)
          ui.inY = (ui.deltaY * ui.inertia)
          ui.aX += ui.inX
          ui.aY += ui.inY

          // inertia
          ui.inertia *= 0.98
        }

        this.view.x = -ui.aX
        this.view.y = -ui.aY
      }
      this.rAFID = requestAnimationFrame(rAF)
      this.onClose = () => {
        // uio.clean()
        window.removeEventListener('wheel', h.onWheel)
        cancelAnimationFrame(this.rAFID)
      }
    },
    // setupTouchTarget () {
    //   var uio = this.makeUIO({
    //     target: this.$refs.svg,
    //     preventTouchStart: true
    //   })
    //   // this.cleanUIO = uio.clean
    //   this.ui = uio.ui
    //   this.ui.deltaX = 0.00000000001
    //   this.ui.deltaY = 0.00000000001

    //   var rAF = () => {
    //     this.rAFID = requestAnimationFrame(rAF)
    //     uio.sim()
    //     this.view.x = -uio.ui.aX
    //     this.view.y = -uio.ui.aY
    //     this.view.z = -uio.ui.aZ
    //   }
    //   this.rAFID = requestAnimationFrame(rAF)
    //   this.onClose = () => {
    //     uio.clean()
    //     cancelAnimationFrame(this.rAFID)
    //   }
    // },
    onMoveBox (evt) {
      evt.box.pos.x += evt.dx
      evt.box.pos.y += evt.dy

      this.$emit('moveBox', { box: evt.box })
    },
    onMoveCable (evt) {
      evt.box.rect.x += evt.dx
      evt.box.rect.y += evt.dy
    },
    onPannerMove (evt) {
      this.ui.aX += evt.dx
      this.ui.aY += evt.dy
    },
    getID () {
      return 'r' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
    }
  },
  data () {
    return {
      flowYo: window.screen.width >= 1600,
      ui: {
        aX: 0,
        aY: 0,
        deltaX: 0,
        deltaY: 0,
        inX: 0,
        inY: 0,
        mass: 5.0
      },
      uniq: this.getID(),
      socketuis: [],
      hand: {
        shouod: '',
        hit: {},

        dragLine: false,
        socket: false
      },
      ready: false,
      view: { x: 0.0000001, y: 0.0000001, z: 0.0000001 },
      onClose () {},
      rAFID: 0,
      makeUIO
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
