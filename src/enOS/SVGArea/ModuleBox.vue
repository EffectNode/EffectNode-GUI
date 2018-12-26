<template>
  <g>
    <rect ref="rect" :width="boxW" :height="boxH" :x="box.pos.x" :y="box.pos.y" class="box" :fill="`url(#${uniq}kale-salad)`"></rect>

    <!-- <foreignObject :x="box.pos.x" :y="box.pos.y + 10" :width="boxW" :height="boxH - 10">
      <div class="" style="width: 100%; height: 100%; position: relative;" xmlns="http://www.w3.org/1999/xhtml" >
        <div style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;">

        </div>
        <div style="position: absolute; top: 0px; left: 0px;" class="d-noselect text">
          <div :key="input.id" v-for="input in inputs" class="labels" >
            <input type="text" v-model="input.name" />
          </div>
          <div :key="output.id" v-for="output in outputs" class="labels" >
            <input type="text" v-model="output.name" />
          </div>
        </div>
      </div>
    </foreignObject> -->

    <g :key="input.id" v-for="(input, ii) in inputs">
      <IOSocket :boxH="boxH" :uniq="uniq" :Data="Data" :Doc="Doc" @connect="onConnect" @disconnect="onDisconnect" :socketuis="socketuis" :hand="hand" :view="view" :socket="input" :win="win" :svg="svg" type="input" :x="box.pos.x + ii * inputW" :y="box.pos.y - 13" :w="inputW" :h="13" />
    </g>

    <g :key="output.id" v-for="(output, ii) in outputs">
      <IOSocket :boxH="boxH" :uniq="uniq" :Data="Data" :Doc="Doc" @connect="onConnect" @disconnect="onDisconnect" :socketuis="socketuis" :hand="hand" :view="view" :socket="output" :win="win" :svg="svg" type="output" :x="box.pos.x + ii * outputW" :y="box.pos.y + boxH - 13 + 13" :w="outputW" :h="13" />
    </g>

    <circle style="cursor: pointer;" :cx="box.pos.x + 7.5 + 1" :cy="box.pos.y + 7.5 + 1" :r="7.5" :height="20" @click="$emit('toggle-size', box)" :fill="`url(#${uniq}disco-club)`"></circle>
    <circle style="cursor: pointer;" :cx="box.pos.x + 7.5 * 2.0 * 2.0 + 1" :cy="box.pos.y + 7.5 * 1.0 + 1" :r="7.5" :height="20" @click="$emit('editBox', box)" :fill="`url(#${uniq}kale-salad)`"></circle>

    <circle style="cursor: pointer;" :cx="box.pos.x + boxW - 7.5 * 1.0 - 1.0" :cy="box.pos.y + 7.5 * 1.0 + 1" :r="7.5" :height="20" @click="$emit('removeBox', { box, inputs, outputs })" :fill="`url(#${uniq}danger)`"></circle>

    <text class="noselect" :x="box.pos.x + 2" :y="box.pos.y + 7.5 * 4.0 + 1">{{ box.name }}</text>
  </g>
</template>

<script>
import IOSocket from './IOSocket.vue'
export default {
  components: {
    IOSocket
  },
  props: {
    uniq: {},
    Data: {},
    Doc: {},
    socketuis: {},
    hand: {},
    view: {},
    win: {},
    svg: {},
    box: {}
  },
  computed: {
    boxW () {
      return this.box.size.w
    },
    boxH () {
      return this.box.size.h
    },
    inputW () {
      return this.boxW / (this.inputs.length || 3)
    },
    outputW () {
      return this.boxW / (this.outputs.length || 3)
    },
    inputs () {
      return this.Data.getModInputs({ Doc: this.Doc, modID: this.box.id }) || []
    },
    outputs () {
      return this.Data.getModOutputs({ Doc: this.Doc, modID: this.box.id }) || []
    },
    bg () {
      return this.box
    }
  },
  watch: {
  },
  data () {
    return {
      // boxW: 300,
      // boxH: 100,
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
        if (evt.touches && evt.touches[0]) {
          evt.preventDefault()
          h.tsx = evt.touches[0].pageX
          h.tsy = evt.touches[0].pageY
        }

        this.isDown = true
      },
      onMM: (evt) => {
        if (evt.touches && evt.touches[0]) {
          evt.preventDefault()
          h.dx = evt.touches[0].pageX - h.tsx
          h.dy = evt.touches[0].pageY - h.tsy
          h.tsx = evt.touches[0].pageX
          h.tsy = evt.touches[0].pageY
          if (this.isDown) {
            this.$emit('move', {
              box: this.box,
              dx: h.dx,
              dy: h.dy
            })
          }
          return
        }

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

    this.$refs.rect.addEventListener('touchstart', h.onMD, false)
    this.$refs.rect.addEventListener('touchend', h.onMU, false)
    this.$refs.rect.addEventListener('touchmove', h.onMM, false)
    this.$refs.rect.addEventListener('touchcancel', h.onMU, false)

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
  /* fill: url(#kale-salad); */
  stroke: black;
  cursor: grab;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
.text{
  color: black;
}

.labels{
  display: inline-block;
}

</style>
