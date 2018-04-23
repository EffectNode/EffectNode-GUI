<template>
  <div ref="mounter" class="mounter"><slot></slot></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      scene: false
    }
  },
  props: {
    size: { default () { return { width: 500, height: 500 } } },
    alpha: { default: true },
    antialias: { default: true }
  },
  created () {
    this.scene = new THREE.Scene()
    this.$on('add', (v) => {
      this.scene.add(v)
    })
    this.$on('remove', (v) => {
      this.scene.remove(v)
    })
  },
  mounted () {
    this.$emit('scene', this.scene)
  }
}
</script>

<style scoped>
/* .mounter {
  display: none;
} */
</style>
