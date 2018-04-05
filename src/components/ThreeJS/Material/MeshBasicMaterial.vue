<template>
<div class="mesh-basic-material"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    opacity: {
      default: 1
    },
    color: {
      default () {
        return new THREE.Color(Math.random() * 0xffffff)
      }
    }
  },
  watch: {
    opacity () {
      this.material.opacity = this.opacity
    }
  },
  data () {
    return {
      material: false
    }
  },
  mounted () {
    this.material = new THREE.MeshBasicMaterial({ color: this.color, transparent: true, opacity: this.opacity })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
