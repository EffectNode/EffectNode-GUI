<template>
  <div class="geo-circle"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    n: {
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
  watch: {
    n () {
      let geometry = new THREE.CircleBufferGeometry(this.r, this.n)
      this.$parent.$emit('geometry', geometry)
    }
  },
  mounted () {
    // n = segments
    // r = radius
    let geometry = new THREE.CircleBufferGeometry(this.r, this.n)
    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
