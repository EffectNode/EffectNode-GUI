<template>
<div class="mesh-basic-material"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    sizeAttenuation: {
      default: true
    },
    size: {
      default: 1.0
    },
    color: {
      default () {
        return new THREE.Color(Math.random() * 0xffffff)
      }
    }
  },
  data () {
    return {
      material: false
    }
  },
  mounted () {
    this.material = new THREE.PointsMaterial({ color: new THREE.Color(this.color), size: this.size })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
