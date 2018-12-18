<template>
  <g>
    <!-- <TerminalBox :box="bridge.a" :svg="svg" @move="onMove" />
    <TerminalBox :box="bridge.b" :svg="svg" @move="onMove" /> -->
    <path class="path" v-if="aBridge && bBridge" :style="getStyle()" :d="getFromNode(aBridge, bBridge)" :stroke="`url(#${uniq}kale-salad)`" fill="none" :marker-start="`url(#${uniq}circle-ready)`" :marker-mid="`url(#${uniq}square)`" :marker-end="`url(#${uniq}circle-ready)`" />
  </g>
</template>

<script>
export default {
  props: {
    uniq: {},
    socketuis: {},
    pair: {},
    svg: {}
    // bridge: {
    //   required: true
    // }
  },
  components: {
  },
  computed: {
    aBridge () {
      let socketUI = this.socketuis.find(s => {
        // console.log(s)
        return this.pair.socket.from === s.socket.socket.from
      })
      if (socketUI) {
        return socketUI.bridge.a
      } else {
        return false
      }
    },
    bBridge () {
      let socketUI = this.socketuis.find(s => {
        // console.log(s)
        return this.pair.socket.to === s.socket.socket.to
      })
      if (socketUI) {
        return socketUI.bridge.a
      } else {
        return false
      }
    }
  },
  data () {
    // console.log(this.socketuis)
    let getID = () => {
      return '--' + (Math.random() * 1024 * 1024 * 1024).toFixed(0)
    }
    return {

      bridge: {
        id: getID(),
        line: {
          running: false,
          stroke: `green`
        },
        a: {
          rect: {
            x: 50,
            y: 50,
            w: 1,
            h: 1,
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
            x: 200,
            y: 10,
            w: 1,
            h: 1,
            stroke: ``,
            fill: `lime`
          },
          marker: {
            stroke: ``,
            fill: `green`
          }
        }
      }
    }
  },
  methods: {
    onMove (v) {
      v.bridge = this.bridge
      this.$emit('move', v)
    },
    getStyle () {
      return {
        'stroke-dasharray': this.bridge.line.running ? '8px' : '0px',
        'animation-play-state': this.bridge.line.running ? 'running' : 'paused',
        'animation-direction': this.bridge.a.voltage > this.bridge.b.voltage ? `normal` : `reverse`
      }
    },
    getFromNode (a, b) {
      return this.getFromCenter(a, b)
      // if (a.x < b.x) {
      //   return this.getFromNodeLeftToRight(a, b)
      // } else if (a.y < b.y) {
      //   return this.getFromNodeUpToDown(a, b)
      // }
    },
    getFromCenter (a, b) {
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
    getFromNodeLeftToRight (a, b) {
      let ax = a.rect.x + a.rect.w
      let ay = a.rect.y + a.rect.h / 2

      let bx = b.rect.x // + b.rect.w / 2
      let by = b.rect.y + b.rect.h / 2

      return `
        M ${ax},${ay}
        C ${ax},${(ay + by) / 2}
          ${bx},${(ay + by) / 2}
          ${bx},${by}
      `
    },
    getFromNodeUpToDown (a, b) {
      let ax = a.rect.x + a.rect.w
      let ay = a.rect.y + a.rect.h / 2

      let bx = b.rect.x // + b.rect.w / 2
      let by = b.rect.y + b.rect.h / 2

      return `
        M ${ax},${ay}
        C ${ax},${(ay + by) / 2}
          ${bx},${(ay + by) / 2}
          ${bx},${by}
      `
    }
  }
}
</script>

<style scoped>
@keyframes dash {
  to {
    stroke-dashoffset: 1000;
  }
}

.path {
  animation: dash 30s linear infinite;
  animation-play-state: paused;
  stroke-dasharray: 8;


}
</style>
