<template>
  <g>
    <rect :fill="ui.fill" :width="ui.w" :height="ui.h" :x="ui.x" :y="ui.y"></rect>

    <rect :fill="limit.fill" :width="limit.w" :height="limit.h" :x="limit.x" :y="limit.y"></rect>


    <g v-if="index > (outputs.length - 1)">
      <text class="linker" @click="changeLabel" :height="ui.h" :x="0 + 50" :y="ui.y + 17 / 2">{{ metaItem.label }}</text>
      <!-- <text :height="socket.h" :x="socket.x" :y="socket.y + 17 / 2" fill="red">no-socket</text> -->
    </g>
    <g v-else>
      <text class="linker" @click="changeLabel" :height="ui.h" :x="0 + 50" :y="ui.y + 17 / 2">{{ metaItem.label }}</text>
      <!-- <text :height="socket.h" :x="socket.x" :y="socket.y + 17 / 2">socket{{ index }}</text> -->
    </g>

    <text class="linker" v-if="ii === 0" @click="remove" :height="ui.h" :x="5" :y="ui.y + 17 / 2">Remove</text>
    <text class="linker" v-if="ii === 1" @click="remove" :height="ui.h" :x="5" :y="ui.y + 17 / 2">Confirm</text>

    <rect ref="timebox" class="grab" :fill="box.fill" :width="box.w" :height="box.h" :x="box.x" :y="box.y"></rect>

    <rect :fill="cursor.fill" :width="cursor.w" :height="cursor.h" :x="cursor.x" :y="cursor.y"></rect>

    <circle ref="start" class="point" :fill="k1.fill" :r="k1.radius" :cx="k1.cx" :cy="k1.cy"></circle>
    <circle ref="end" class="point" :fill="k2.fill" :r="k2.radius" :cx="k2.cx" :cy="k2.cy"></circle>

    <circle ref="afterStart" class="point" :fill="k3.fill" :r="k3.radius" :cx="k3.cx" :cy="k3.cy"></circle>
    <circle ref="beforeEnd" class="point" :fill="k4.fill" :r="k4.radius" :cx="k4.cx" :cy="k4.cy"></circle>
  </g>
</template>

<script>
export default {
  props: {
    currentMod: {},
    outputs: {},
    win: {},
    view: {},
    index: {},
    total: {},
    metaItem: {},
    marginLeft: {},
    timeMode: {},
    baseWidth: { default: 400 }
  },
  data () {
    return {
      currnetTime: 0,
      ii: 0,
      k1: {}, // start
      k2: {}, // end
      k3: {}, // fade in end
      k4: {}, // fade out start
      box: {},
      cursor: {},
      limit: {},
      socket: {},
      ui: {},
      time: {},
      h: {},
      targetProgress: 0,
      currnetProgress: 0
    }
  },
  computed: {
    meme () {
      return this.metaItem
    }
  },
  created () {
    this.refresh()
  },
  mounted () {
    this.h.timebox = this.dragMaker('timebox')
    this.h.timebox.setup()
    this.h.start = this.dragMaker('start')
    this.h.start.setup()
    this.h.end = this.dragMaker('end')
    this.h.end.setup()

    this.h.afterStart = this.dragMaker('afterStart')
    this.h.afterStart.setup()

    this.h.beforeEnd = this.dragMaker('beforeEnd')
    this.h.beforeEnd.setup()

    // let svg = this.$parent.$el
    // svg.addEventListener('move', (evt) => {
    //   let width = this.ui.wb || 1500
    //   let delta = evt.movementX / width * this.metaItem.value.totalTime

    // });
    this.handleIframe()
  },
  beforeDestroy () {
  },
  methods: {
    handleIframe () {
      let svg = this.$parent.$el
      // this.$emit('timeMode', '')
      svg.addEventListener('mousemove', (evt) => {
        this.$emit('timeMode', 'toEnv')
        // this.relayoutCurosr(0)
        let xPos = evt.offsetX - this.ui.x
        let progress = xPos / this.ui.wb
        if (progress <= 0) {
          progress = 0
        }
        this.relayoutCurosr(progress)
        window[this.currentMod.id + '-progress'] = progress
      }, false)

      // window[this.currentMod.id + '-progress']

      window.addEventListener('message', (evt) => {
        let data = evt.data
        if (data.type === 'timeline' && data.modID === this.currentMod.id && this.timeMode === 'listen') {
          this.relayoutCurosr(data.progress)
        }
      })
    },
    relayoutCurosr (progress) {
      let cursor = this.cursor
      cursor.w = 1
      cursor.h = 1000000
      if (this.ui) {
        cursor.x = this.ui.x + this.view.x + this.ui.wb * progress
        cursor.y = this.index * 13 + 2 * this.index
        cursor.fill = `red`
      }
      this.$forceUpdate()
    },
    dragMaker (refID) {
      let vm = this
      let svg = this.$parent.$el
      let h = {
        dom: vm.$refs[refID],
        isDown: false,
        aX: 0,
        oMD () {
          h.isDown = true
        },
        oMM: (evt) => {
          if (h.isDown) {
            h.aX += evt.movementX

            let width = this.baseWidth

            let delta = evt.movementX / width * this.metaItem.value.totalTime

            if (refID === 'timebox') {
              this.metaItem.value.start += delta
              this.metaItem.value.afterStart += delta
              this.metaItem.value.beforeEnd += delta
              this.metaItem.value.end += delta

              if (this.metaItem.value.start < 0) {
                this.metaItem.value.start -= delta
                this.metaItem.value.afterStart -= delta
                this.metaItem.value.beforeEnd -= delta
                this.metaItem.value.end -= delta
              }
            }

            if (refID === 'start') {
              this.metaItem.value.start += delta
              this.metaItem.value.afterStart += delta
              // this.metaItem.value.beforeEnd += delta
              // this.metaItem.value.end += delta

              if (this.metaItem.value.start < 0) {
                this.metaItem.value.start -= delta
                this.metaItem.value.afterStart -= delta
                // this.metaItem.value.beforeEnd -= delta
                // this.metaItem.value.end -= delta
              }
            }

            if (refID === 'end') {
              // this.metaItem.value.start += delta
              // this.metaItem.value.afterStart += delta
              this.metaItem.value.beforeEnd += delta
              this.metaItem.value.end += delta

              if (this.metaItem.value.start < 0) {
                // this.metaItem.value.start -= delta
                // this.metaItem.value.afterStart -= delta
                this.metaItem.value.beforeEnd -= delta
                this.metaItem.value.end -= delta
                if (this.metaItem.value.beforeEnd > this.metaItem.value.totalTime) {
                  this.metaItem.value.beforeEnd += delta
                }
                if (this.metaItem.value.end > this.metaItem.value.totalTime) {
                  this.metaItem.value.end += delta
                }
              }
            }

            if (refID === 'afterStart') {
              this.metaItem.value.afterStart += delta
              // if (this.metaItem.value.afterStart < this.metaItem.value.start || this.metaItem.value.afterStart > this.metaItem.value.end) {
              if (this.metaItem.value.afterStart < this.metaItem.value.start) {
                this.metaItem.value.afterStart -= delta
                if (this.metaItem.value.afterStart > this.metaItem.value.totalTime) {
                  this.metaItem.value.afterStart += delta
                }
              }
            }

            if (refID === 'beforeEnd') {
              this.metaItem.value.beforeEnd += delta
              // if (this.metaItem.value.beforeEnd < this.metaItem.value.start || this.metaItem.value.beforeEnd > this.metaItem.value.end) {
              if (this.metaItem.value.beforeEnd < this.metaItem.value.start) {
                this.metaItem.value.beforeEnd -= delta
                if (this.metaItem.value.beforeEnd > this.metaItem.value.totalTime) {
                  this.metaItem.value.beforeEnd += delta
                }
              }
            }

            this.refresh()
            this.$forceUpdate()
            this.$emit('save')
            console.log(evt)
          }
        },
        oMU () {
          h.isDown = false
        },
        setup () {
          h.dom.addEventListener('mousedown', h.oMD, false)
          svg.addEventListener('mousemove', h.oMM, false)
          svg.addEventListener('mouseup', h.oMU, false)
        },
        clean () {
          h.dom.removeEventListener('mousedown', h.oMD)
          svg.removeEventListener('mousemove', h.oMM)
          svg.removeEventListener('mouseup', h.oMU)
        }
      }
      return h
    },
    refresh () {
      let ui = this.ui
      ui.w = 500 * 5
      ui.wb = this.baseWidth // baseline size
      ui.h = 13
      ui.x = this.marginLeft + 0
      ui.y = this.index * 13 + 2 * this.index
      ui.fill = `hsl(${(this.index / this.total * 360 + 0).toFixed(0)}, 70%, 70%)`

      let socket = this.socket
      socket.w = 0
      socket.h = 13
      socket.x = 0 + 60 + 50
      socket.y = this.index * 13 + 2 * this.index
      socket.fill = `hsl(${(this.index / this.total * 360 + 0).toFixed(0)}, 70%, 70%)`

      let metaV = this.meme.value
      let time = this.time
      time.sf = metaV.start
      time.fd = metaV.afterStart
      time.fs = metaV.beforeEnd
      time.ea = metaV.end
      time.tt = metaV.totalTime
      time.length = time.ea - time.sf

      let k1cxp = time.sf / time.tt
      let k2cxp = time.ea / time.tt

      let k3cxp = time.fd / time.tt
      let k4cxp = time.fs / time.tt

      let k1 = this.k1
      k1.fill = `hsl(${(this.index / this.total * 360 + 60).toFixed(0)}, 70%, 70%)`
      k1.radius = 6.5
      k1.cx = ui.x + ui.wb * k1cxp
      k1.cy = ui.y + k1.radius

      let k2 = this.k2
      k2.fill = `hsl(${(this.index / this.total * 360 + 60).toFixed(0)}, 70%, 70%)`
      k2.radius = 6.5
      k2.cx = ui.x + ui.wb * k2cxp
      k2.cy = ui.y + k2.radius

      let k3 = this.k3
      k3.fill = `hsl(${(this.index / this.total * 360 + 120).toFixed(0)}, 70%, 70%)`
      k3.radius = 6.5 * 0.8
      k3.cx = ui.x + ui.wb * k3cxp
      k3.cy = ui.y + k1.radius

      let k4 = this.k4
      k4.fill = `hsl(${(this.index / this.total * 360 + 120).toFixed(0)}, 70%, 70%)`
      k4.radius = 6.5 * 0.8
      k4.cx = ui.x + ui.wb * k4cxp
      k4.cy = ui.y + k2.radius

      let box = this.box
      box.w = k2.cx - k1.cx
      box.h = 13
      box.x = k1.cx
      box.y = this.index * 13 + 2 * this.index
      box.fill = `hsl(${(this.index / this.total * 360 + 0).toFixed(0)}, 60%, 90%)`

      let limit = this.limit
      limit.w = 1
      limit.h = 1000000
      limit.x = ui.x + ui.wb
      limit.y = this.index * 13 + 2 * this.index
      limit.fill = `black`
    },
    remove (evt) {
      if (evt.metaKey) {
        this.ii++
        if (this.ii === 2) {
          this.ii = 0
          this.$emit('remove', this.metaItem)
        }
      } else {
        if (this.ii === 1) {
          this.ii = 0
          return
        }
        if (window.prompt(`Please enter '${this.metaItem.label}' to remove.`) === this.metaItem.label) {
          this.$emit('remove', this.metaItem)
        }
      }
      this.refresh()
      this.$nextTick(() => {
        this.refresh()
      })
    },
    changeLabel () {
      let newName = window.prompt('pleas enter new name for' + this.metaItem.label) || this.metaItem.label.item
      if (newName) {
        this.metaItem.label = newName
      }
      this.$emit('saveModule')
    }
  }
}
</script>

<style scoped>
.grab{
  cursor: grab;
}
.point{
  cursor: pointer;
}
.linker{
  text-decoration: underline;
  cursor: pointer;
}
</style>
