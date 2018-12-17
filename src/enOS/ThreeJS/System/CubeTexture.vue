<template>
<div class="cube-texture"></div>
</template>

<script>
import * as THREE from 'three'

export default {
  props: {
    items: { default () { return [] } }
  },
  mounted () {
    let textureCube = new THREE.CubeTextureLoader()
    textureCube.load(
      this.items,
      (textureCube) => {
        this.$parent.$emit('apply-texture', textureCube)
        this.$emit('cube-texture', textureCube)
      }
    )
  }
}
</script>

<style>

</style>
