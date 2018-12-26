<template>
  <g>
    <rect ref="socket" v-if="type === 'input'" class="mover cross-hair" stroke="black" :fill="socket.color" :x="x" :y="y" :width="w" :height="h" />
    <rect ref="socket" v-else-if="type === 'output'" class="mover cross-hair" stroke="black" :fill="socket.color" :x="x" :y="y" :width="w" :height="h" />

    <circle ref="socket" v-if="type === 'input'" class="mover cross-hair stroke-only" :stroke="'black'" :fill="'none'" :cx="x + w / 2" :cy="y + h / 2" :dwidth="w" :r="h / 4" />
    <circle ref="socket" v-else-if="type === 'output'" class="mover cross-hair stroke-only " :stroke="'black'" :fill="'none'" :cx="x + w / 2" :cy="y + h / 2" :dwidth="w" :r="h / 4" />

    <path class="path" :stroke="`url(#${uniq}kale-salad)`" v-if="isDown" :style="getStyle()" :d="getFromNode(bridge.a, bridge.b)" :fill="'none'" :marker-start="`url(#${uniq}circle-ok)`" marker-mid="url(#${uniq}square)" :marker-end="`url(#${uniq}circle-ok)`" />
  </g>
</template>

<script>
export default {
  props: {
    uniq: {},
    Data: {},
    Doc: {},

    socketuis: {},
    hand: {},
    view: {},
    socket: {},
    win: {},
    svg: {},
    type: {},
    x: {},
    y: {},
    w: {},
    h: {}
  },
  data () {
    let getID = () => {
      return '--' + (Math.random() * 1024 * 1024 * 1024).toFixed(0)
    }
    let self = this
    let bridge = {
      id: getID(),
      line: {
        running: true,
        stroke: `green`
      },
      a: {
        rect: {
          get x () {
            return self.x
          },
          get y () {
            return self.y
          },
          // x: this.x,
          // y: this.y,
          get w () {
            return self.w
          },
          get h () {
            return self.h
          },
          stroke: ``,
          fill: `lime`
        },
        marker: {
          stroke: ``,
          fill: `green`
        }
      },
      b: {
        rect: {
          _mX: 0,
          _mY: 0,
          get x () {
            return bridge.b.rect._mX
          },
          get y () {
            return bridge.b.rect._mY
          },
          // y: 10,
          w: 10,
          h: 10,
          stroke: ``,
          fill: `lime`
        },
        marker: {
          stroke: ``,
          fill: `green`
        }
      }
    }
    return {
      from: false,
      to: false,
      onHand: false,
      isDown: false,
      bridge,
      should: ''
    }
  },
  watch: {
    isDown () {
      this.socket.onHand = this.isDown
      this.$emit('down', this.isDown)
      if (this.isDown) {
        this.svg.classList.add('is-down')
        this.hand.dragLine = this.bridge
        this.hand.socket = this.socket
      } else {
        this.svg.classList.remove('is-down')
        this.hand.dragLine = false
        this.hand.socket = false
      }
    }
  },
  beforeDestroy () {
    let idx = this.socketuis.findIndex(e => e === this)
    this.socketuis.splice(idx, 1)
  },
  mounted () {
    this.socketuis.push(this)
    this.$forceUpdate()

    this.$el.socket = this.socket
    let h = {
      onMD: (evt) => {
        this.onHand = true
        this.isDown = true
        this.bridge.b.rect._mX = evt.offsetX - this.bridge.b.rect.w + this.view.x
        this.bridge.b.rect._mY = evt.offsetY - this.bridge.b.rect.h + this.view.y
      },
      onMM: (evt) => {
        if (this.isDown) {
          this.bridge.b.rect._mX = evt.offsetX - this.bridge.b.rect.w + this.view.x
          this.bridge.b.rect._mY = evt.offsetY - this.bridge.b.rect.h + this.view.y
        }
      },
      onMUBox: () => {

      },
      onMU: () => {
        if (this.onHand) {
          if (this.hand.should === 'connect') {
            this.$emit('connect', { ...this.hand.hit })
          }
        }
        if (this.hand.should === 'disconnect') {
          let to = this.Data.getToSocketByFromID({ Doc: this.Doc, fromSocketID: this.socket.socket.from })
          if (to && this.socket && this.onHand) {
            this.$emit('disconnect', {
              to,
              from: this.socket
            })
          } else if (!to && this.socket && this.onHand) {
            to = this.Data.getToSocketByFromID({ Doc: this.Doc, fromSocketID: this.socket.socket.to })
            this.$emit('disconnect', {
              to,
              from: this.socket
            })
          }
          this.hand.hit = {}
        }
        this.onHand = false
        this.isDown = false
      },
      onME: () => {
        let from = this.hand.socket
        let to = this.socket

        // hit
        if (!this.onHand && from && to && from.id !== to.id && from.mod.from !== to.mod.from && from.type !== to.type) {
          /*
          // socket object
          mod: {
            from: modID,
            to: false
          },
          socket: {
            from: sID,
            to: false
          }
          */
          this.hand.hit.from = from
          this.hand.hit.to = to

          console.log('enter')
          this.hand.should = 'connect'
        } else {
          this.hand.should = 'nothing'
        }
        // console.log(from, to)
      },
      onML: () => {
        if (this.onHand) {
          this.hand.should = 'nothing'
          if (this.socket.socket.to) {
            this.hand.should = 'disconnect'
          }
        }
      }
    }

    // this.$el.addEventListener('touchstart', h.onMD, false)
    // this.$el.addEventListener('touchend', h.onMU, false)
    // this.$el.addEventListener('touchmove', h.onMM, false)
    // this.$el.addEventListener('touchcancel', h.onMU, false)

    this.$el.addEventListener('mouseenter', h.onME, false)
    this.$el.addEventListener('mouseleave', h.onML, false)
    this.$el.addEventListener('mouseup', h.onMUBox, false)

    this.$el.addEventListener('mousedown', h.onMD, false)
    this.svg.addEventListener('mousemove', h.onMM, false)
    this.svg.addEventListener('mouseleave', h.onMU, false)
    this.svg.addEventListener('mouseup', h.onMU, false)
    this.$el.addEventListener('mouseup', h.onMU, false)
    this.clean = () => {
      this.$el.removeEventListener('mouseenter', h.onME)
      this.$el.removeEventListener('mouseleave', h.onML)
      this.$el.removeEventListener('mouseup', h.onMUBox)

      this.$el.removeEventListener('mousedown', h.onMD)
      this.svg.removeEventListener('mousemove', h.onMM)
      this.svg.removeEventListener('mouseleave', h.onMU)
      this.svg.removeEventListener('mouseup', h.onMU)
      this.$el.removeEventListener('mouseup', h.onMU)
    }
  },
  methods: {
    invertColor (hex) {
      /* eslint-disable */
      if (hex.indexOf('#') === 0) {
          hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
          throw new Error('Invalid HEX color.');
      }
      // invert color components
      var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
          g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
          b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
      // pad each with zeros and return
      return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
      /* eslint-enable */
    },
    padZero (str, len) {
      /* eslint-disable */
      len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
      /* eslint-enable */
    },
    getFromNode (a, b) {
      let ax = a.rect.x + a.rect.w / 2
      let ay = a.rect.y + a.rect.h / 2
      let bx = b.rect.x + b.rect.w / 2
      let by = b.rect.y + b.rect.h / 2

      return `
        M ${ax},${ay}
        C ${ax},${(ay + by) / 2}
          ${bx},${(ay + by) / 2}
          ${bx},${by}
      `
    },
    // getStroke () {
    //   return `${this.bridge.line.stroke}`
    // },
    getStyle () {
      return {
        'stroke-dasharray': this.bridge.line.running ? '8px' : '0px',
        'animation-play-state': this.bridge.line.running ? 'running' : 'paused',
        'animation-direction': this.type === 'input' ? `normal` : `reverse`
      }
    }
  }
}
</script>

<style scoped>
.mover{
  cursor: move;
}
.is-down .crosshair{
  cursor: crosshair;
}
/* .input{
  stroke: black;
  fill: rgb(201, 201, 201);
}
.output{
  stroke: black;
  fill: rgb(201, 201, 201);
} */

@keyframes dash {
  to {
    stroke-dashoffset: 1000;
  }
}
/* .stroke-only{
  fill: transparent;
  stroke: black;
} */
.path {
  /* stroke: url('#kale-salad'); */
  animation: dash 30s linear infinite;
  animation-play-state: paused;
  stroke-dasharray: 8;
}
</style>
