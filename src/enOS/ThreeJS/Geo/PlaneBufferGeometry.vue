<template>
  <div class="geo-Plane"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    w: {
      default: 5
    },
    h: {
      default: 5
    },
    nx: {
      default: 30
    },
    ny: {
      default: 30
    }
  },
  data () {
    return {
      geometry: false
    }
  },
  watch: {
    w () {
      this.makeGeometry()
    },
    h () {
      this.makeGeometry()
    },
    nx () {
      this.makeGeometry()
    },
    ny () {
      this.makeGeometry()
    }
  },
  methods: {
    makeGeometry () {
      let geometry = new THREE.PlaneBufferGeometry(this.w, this.h, this.nx, this.ny)
      this.$parent.$emit('geometry', geometry)
    }
  },
  mounted () {
    this.makeGeometry()
  }
}
</script>

<style>

</style>
