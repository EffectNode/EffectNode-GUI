<template>
  <div class="light-point"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      light: false
    }
  },
  mounted () {
    this.light = new THREE.SpotLight({ color: 0xffffff })
    this.$parent.$emit('add', this.light.target)
    // if (this.$parent.object3d) {
    //   this.light.target = this.$parent.object3d
    // }
    this.$emit('element', this.light)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.light)
  }
}
</script>

<style>

</style>
