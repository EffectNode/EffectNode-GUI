<template>
  <div class="geo-ring"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    innerRadius: {
      default: 5
    },
    outerRadius: {
      default: 1
    },

    thetaSegments: {
      default: 32
    },
    phiSegments: {
      default: 32
    }
  },
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    // let geometry = new THREE.BoxBufferGeometry(2, 2, 2, 12, 12, 12)
    let geometry = new THREE.RingBufferGeometry(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
