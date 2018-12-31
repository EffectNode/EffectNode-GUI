<template>
  <svg ref="svg" :width="win.width - 2" :height="win.height - marginTop"  :viewBox="`${view.x.toFixed(1)} ${(view.y).toFixed(1)} ${win.width} ${win.height - marginTop}`">

    <g :key="m.id" v-for="(m, mi) in timetracks" v-if="refresher">
      <TimeTrack :baseWidth="baseWidth" :currentMod="currentMod" @timeMode="(v) => { $emit('timeMode', v) }" :timeMode="timeMode" :win="win" @saveModule="saveModule" @save="saveModule" :outputs="outputs" @remove="removeMeta(m)" :view="view" :marginLeft="marginLeft" :index="mi" :metaItem="m" :total="timetracks.length"></TimeTrack>
    </g>

  </svg>
</template>

<script>
import anime from 'animejs'
import TimeTrack from './TimeTrack.vue'
export default {
  components: {
    TimeTrack
  },
  props: {
    currentMod: {},
    outputs: {},
    refresher: {},
    win: {},
    meta: {},
    timeMode: {},
    baseWidth: {}
  },
  data () {
    return {
      marginLeft: 50 + 100, // 50 = remove words, 100 = label and socket
      marginTop: 30 + 30, // 30 buttons, 30 title bar
      ui: false,
      view: {
        x: 0,
        y: 0
      }
    }
  },
  mounted () {
    this.setupWheel()
  },
  watch: {
  },
  computed: {
    svg () {
      return this.$refs['svg']
    },
    timetracks () {
      return (this.meta || []).filter(m => m.type === 'timeline-track')
    }
  },
  methods: {
    saveModule () {
      this.$emit('saveModule')
    },
    removeMeta (v) {
      this.$emit('removeMeta', v)
      this.$forceUpdate()
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
      this.ui = {
        aX: 0,
        aY: 0,
        deltaX: 0,
        deltaY: 0,
        inX: 0,
        inY: 0,
        mass: 5.0,
        inertia: 5.0
      }
      let h = {
        onWheel: (e) => {
          this.onWheel(e)
        }
      }
      window.addEventListener('wheel', h.onWheel)
      var rAF = () => {
        this.rAFID = requestAnimationFrame(rAF)
        let ui = this.ui
        if (ui) {
          if (ui.inertia > 0.01) {
            ui.inX = (ui.deltaX * ui.inertia)
            ui.inY = (ui.deltaY * ui.inertia)
            ui.aX += ui.inX
            ui.aY += ui.inY

            // inertia
            ui.inertia *= 0.98
          }

          this.view.x = -ui.aX * 1.5
          this.view.y = -ui.aY * 1.5
          if (this.view.x < 0) {
            this.view.x = 0
            ui.inertia = 0
            // ui.aX = 0
            ui.inX = 0
          }
          if (this.view.y < 0) {
            this.view.y = 0
            ui.inertia = 0
            // ui.aY = 0
            ui.inY = 0
          }
        }
      }
      this.rAFID = requestAnimationFrame(rAF)
      this.onClose = () => {
        // uio.clean()
        window.removeEventListener('wheel', h.onWheel)
        cancelAnimationFrame(this.rAFID)
      }
    }
  }
}
</script>

<style scoped>
.margin-div{
  width: 90%;
  margin: 0px 5%;
}
</style>
