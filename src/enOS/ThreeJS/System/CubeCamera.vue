<template>
<div class="cube-camera"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    near: {},
    far: {},
    resolution: {},
    renderer: {},
    scene: {}
  },
  data () {
    return {
      camera: false,
      remove () {}
    }
  },
  created () {
    let camera = this.camera = new THREE.CubeCamera(this.near, this.far, this.resolution)

    this.$emit('cube-camera', camera)
    this.$parent.$emit('add', camera)
    this.remove = () => {
      this.$parent.$emit('remove', camera)
    }
  },
  beforeDestroy () {
    this.remove()
  },
  methods: {

  },
  watch: {
  }
}
</script>

<style scoped>
.perspective-camera{
  display: none;
}
</style>
