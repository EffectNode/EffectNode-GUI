<template>
  <div class="full pos-rel">
    <div class="full layer" ref="mounter"></div>
    <div class="full layer" ref="toucher"><slot></slot></div>
  </div>
</template>

<script>
import * as THREE from 'three'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'
/* eslint-enable */

export default {
  data () {
    return {
      // THREE,
      renderer: false
    }
  },
  props: {
    size: { default () { return { width: 500, height: 500 } } },
    alpha: { default: true },
    antialias: { default: true }
  },
  mounted () {
    this.renderer = new THREE.WebGLRenderer({
      alpha: this.alpha,
      antialias: this.antialias// ,
      // preserveDrawingBuffer: true
    })

    this.resize()
    this.renderer.domElement.style.marginBottom = '-6px'
    this.$refs.mounter.appendChild(this.renderer.domElement)

    this.$emit('renderer', this.renderer)
    this.$emit('toucher', this.$refs['toucher'])
  },
  beforeDestroy () {
    this.$refs.mounter.removeChild(this.renderer.domElement)
  },
  watch: {
    size () {
      this.resize()
    }
  },
  methods: {
    resize () {
      let ratio = window.devicePixelRatio || 1
      this.renderer.setPixelRatio(ratio)
      this.renderer.setSize(this.size.width, this.size.height)
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.pos-rel{
  position: relative;
}
.layer{
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
