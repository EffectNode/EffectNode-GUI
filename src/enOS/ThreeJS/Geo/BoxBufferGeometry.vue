<template>
  <div class="geo-box"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    x: {
      default: 2
    },
    y: {
      default: 2
    },
    z: {
      default: 2
    },
    nx: {
      default: 50
    },
    ny: {
      default: 50
    },
    nz: {
      default: 50
    }
  },
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let { x, y, z, nx, ny, nz } = this
    let geometry = new THREE.BoxBufferGeometry(x, y, z, nx, ny, nz)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
