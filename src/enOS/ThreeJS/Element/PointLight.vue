<template>
  <div class="light-point"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    color: {
      default: 0xffffff
    }
  },
  data () {
    return {
      light: false
    }
  },
  watch: {
    color () {
      this.$parent.$emit('remove', this.light)
      this.light = new THREE.PointLight(new THREE.Color(this.color))
    }
  },
  mounted () {
    this.light = new THREE.PointLight(new THREE.Color(this.color))
    this.$parent.$emit('add', this.light)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.light)
  }
}
</script>

<style>

</style>
