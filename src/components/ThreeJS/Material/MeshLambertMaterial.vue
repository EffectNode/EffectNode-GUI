<template>
<div class="mesh-lambert-material"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    color: {
      default () {
        return Math.random() * 0xffffff
      }
    }
  },
  data () {
    return {
      material: false
    }
  },
  created () {
    this.material = new THREE.MeshLambertMaterial({
      color: this.color
    })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
