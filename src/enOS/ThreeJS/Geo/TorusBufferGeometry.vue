<template>
  <div class="geo-torus"></div>

  <!--

    <TorusBufferGeometry :radius="2" :tube="0.9" :nRadial="30" :nTube="192" />
   -->

</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    nRadial: {
      default: 30
    },
    nTube: {
      default: 192
    },
    radius: {
      default: 2
    },
    tube: {
      default: 0.9
    },
    arc: {
      default: Math.PI * 2.0
    }
  },
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let geometry = new THREE.TorusBufferGeometry(this.radius, this.tube, this.nRadial, this.nTube, this.arc)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
