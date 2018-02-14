<template>
  <div class="geo-TorusKnotBufferGeometry"></div>
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
    let radius = 6
    let tube = 0.6
    let tubularSegments = 300
    let radialSegments = 20
    let p = 4
    let q = 3
    let geometry = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
