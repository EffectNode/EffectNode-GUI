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
    this.light = new THREE.PointLight({ color: 0xffffff })
    this.$parent.$emit('add', this.light)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.light)
  }
}
</script>

<style>

</style>
