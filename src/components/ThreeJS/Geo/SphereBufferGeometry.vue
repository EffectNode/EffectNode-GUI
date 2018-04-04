<template>
  <div class="geo-sphere"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let geometry = new THREE.SphereBufferGeometry(2, 64, 64)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
