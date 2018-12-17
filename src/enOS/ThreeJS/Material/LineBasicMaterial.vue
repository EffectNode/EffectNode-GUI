<template>
<div class="line-basic-material"></div>
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
  mounted () {
    this.material = new THREE.LineBasicMaterial({
      color: this.color
    })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
