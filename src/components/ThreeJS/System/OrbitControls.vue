<template>
</template>

<script>
import * as THREE from 'three'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'
/* eslint-enable */

export default {
  props: {
    camera: {},
    toucher: {}
  },
  data () {
    return {
      controls: false
    }
  },
  mounted () {
    this.controls = new THREE.OrbitControls(this.camera, this.toucher)
    this.$emit('controls', this.controls)
  },
  beforeDestroy () {
    this.controls.dispose()
  }
}
</script>

<style>

</style>
