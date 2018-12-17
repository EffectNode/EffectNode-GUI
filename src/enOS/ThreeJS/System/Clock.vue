<template>
<div class="clock"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      clock: false
    }
  },
  mounted () {
    this.clock = new THREE.Clock()
    this.$parent.$emit('clock', this.clock)
  }
}
</script>

<style>

</style>
