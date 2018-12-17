<template>
  <rect :x="view.x.toFixed(2)" :y="view.y.toFixed(2)" :width="win.width" :height="win.height" fill="transparent" stroke="none">
  </rect>
</template>

<script>
export default {
  props: {
    view: {},
    win: {},
    svg: {}
  },
  data () {
    return {
      isDown: false
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
    console.log(this)
    this.$el.addEventListener('mousedown', h.onMD, false)
    this.$el.addEventListener('mouseup', h.onMU, false)
    this.$el.addEventListener('mousemove', h.onMM, false)
    this.$el.addEventListener('mouseleave', h.onMU, false)
    this.clean = () => {
      this.$el.removeEventListener('mousedown', h.onMD)
      this.$el.removeEventListener('mouseup', h.onMU)
      this.$el.removeEventListener('mousemove', h.onMM)
      this.$el.removeEventListener('mouseleave', h.onMU)
    }
  },
  methods: {
  },
  beforeDestroy () {
    this.clean()
  }
}
</script>

<style>

</style>
