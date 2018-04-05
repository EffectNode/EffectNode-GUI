<template>
  <div class="geo-sphere"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    nx: {
      default: 5
    },
    ny: {
      default: 5
    },
    r: {
      default: 2
    }
  },
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let geometry = new THREE.SphereBufferGeometry(this.r, this.nx, this.ny)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
