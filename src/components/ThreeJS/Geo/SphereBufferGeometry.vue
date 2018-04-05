<template>
  <div class="geo-sphere"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    nx: {
      default: 24
    },
    ny: {
      default: 24
    }
  },
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let geometry = new THREE.SphereBufferGeometry(1, this.nx, this.ny)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
