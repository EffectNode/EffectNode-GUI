<template>
  <div class="geo-circle"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    segments: {
      default: 32
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
    let geometry = new THREE.CircleBufferGeometry(this.r, this.segments)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
