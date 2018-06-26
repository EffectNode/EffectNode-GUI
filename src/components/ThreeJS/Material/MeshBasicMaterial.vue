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
    },
    doubleSide: {
      default: false
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
    let config = { color: this.color, transparent: true, opacity: this.opacity }
    if (this.doubleSide) {
      config.side = THREE.DoubleSide
    }
    this.material = new THREE.MeshBasicMaterial(config)
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
