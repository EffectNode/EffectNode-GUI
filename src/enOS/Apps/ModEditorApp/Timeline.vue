<template>
  <div>
    <svg ref="svg" :width="win.width - 2" :height="win.height - marginTop"  :viewBox="`${view.x.toFixed(1)} ${(view.y * 0).toFixed(1)} ${win.width} ${win.height - marginTop}`">

      <g :key="m.id" v-for="(m, mi) in meta.filter(m => m.type === 'timeline-track')">
        <TimeTrack :svg="$refs.svg" :marginLeft="40" :index="mi" :metaItem="m" :total="meta.filter(m => m.type === 'timeline-track').length"></TimeTrack>
      </g>

    </svg>
  </div>
</template>

<script>
import anime from 'animejs'
import TimeTrack from './TimeTrack.vue'
export default {
  components: {
    TimeTrack
  },
  props: {
    win: {},
    meta: {}
  },
  data () {
    return {
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
  methods: {
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

          this.view.x = -ui.aX * 1.3
          if (this.view.x < 0) {
            this.view.x = 0
            ui.inertia = 0
            ui.aX = 0
            ui.inX = 0
          }
          this.view.y = -ui.aY
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
