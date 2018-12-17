<template>
  <g>
    <rect ref="rect" :width="300" :height="100" :x="box.pos.x" :y="box.pos.y" class="box"></rect>

    <g :key="input.id" v-for="(input, ii) in inputs">
      <IOSocket :Data="Data" :Doc="Doc" @connect="onConnect" @disconnect="onDisconnect" :socketuis="socketuis" :hand="hand" :view="view" :socket="input" :win="win" :svg="svg" type="input" :x="box.pos.x + ii * inputW" :y="box.pos.y - 13" :w="inputW" :h="13" />
    </g>

    <g :key="output.id" v-for="(output, ii) in outputs">
      <IOSocket :Data="Data" :Doc="Doc" @connect="onConnect" @disconnect="onDisconnect" :socketuis="socketuis" :hand="hand" :view="view" :socket="output" :win="win" :svg="svg" type="output" :x="box.pos.x + ii * outputW" :y="box.pos.y + 100 - 13 + 13" :w="outputW" :h="13" />
    </g>

  </g>
</template>

<script>
import IOSocket from './IOSocket.vue'
export default {
  components: {
    IOSocket
  },
  props: {
    Data: {},
    Doc: {},

    socketuis: {},
    hand: {},
    view: {},
    win: {},
    svg: {},
    box: {
      default () {
        return {
          pos: {
            x: 100,
            y: 100
          }
        }
      }
    }
  },
  computed: {
    inputW () {
      return 300 / (this.inputs.length || 3)
    },
    outputW () {
      return 300 / (this.outputs.length || 3)
    },
    inputs () {
      return this.Data.getModInputs({ Doc: this.Doc, modID: this.box.id }) || []
    },
    outputs () {
      return this.Data.getModOutputs({ Doc: this.Doc, modID: this.box.id }) || []
    }
  },
  watch: {
  },
  data () {
    return {
      boxW: 300,
      boxH: 100,
      clean () {}
    }
  },
  methods: {
    onConnect (v) {
      this.$emit('connect', v)
    },
    onDisconnect (v) {
      this.$emit('disconnect', v)
    },
    onMove (evt) {
      evt.box.rect.x += evt.dx
      evt.box.rect.y += evt.dy
    }
  },
  mounted () {
    let h = {
      onMD: (evt) => {
        this.isDown = true
      },
      onMM: (evt) => {
        if (this.isDown) {
          this.$emit('move', {
            box: this.box,
            dx: evt.movementX,
            dy: evt.movementY
          })
          // console.log(evt)
        }
      },
      onMU: (evt) => {
        this.isDown = false
      }
    }

    this.$refs.rect.addEventListener('mousedown', h.onMD, false)
    this.$refs.rect.addEventListener('mouseup', h.onMU, false)
    this.svg.addEventListener('mousemove', h.onMM, false)
    this.svg.addEventListener('mouseleave', h.onMU, false)
    this.svg.addEventListener('mouseup', h.onMU, false)

    this.clean = () => {
      this.$refs.rect.removeEventListener('mousedown', h.onMD)
      this.$refs.rect.removeEventListener('mouseup', h.onMU)
      this.svg.removeEventListener('mousemove', h.onMM)
      this.svg.removeEventListener('mouseleave', h.onMU)
      this.svg.removeEventListener('mouseup', h.onMU)
    }
  },
  beforeDestroy () {
    this.clean()
  }
}
</script>

<style scoped>
.box{
  fill: url(#kale-salad);
  stroke: black;
}
</style>
