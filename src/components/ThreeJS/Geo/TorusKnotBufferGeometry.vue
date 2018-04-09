<template>
  <div class="geo-TorusKnotBufferGeometry"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    radius: { default: 1.3 },
    tube: { default: 0.13 },
    tubularSegments: { default: 300 },
    radialSegments: { default: 20 },
    p: { default: 4 },
    q: { default: 3 }
  },
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let { radius, tube, tubularSegments, radialSegments, p, q } = this
    let geometry = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
