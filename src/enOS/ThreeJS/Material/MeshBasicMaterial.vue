<template>
<div class="mesh-basic-material"><slot /></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    texture: {},
    opacity: {
      default: 1
    },
    color: {
      default () {
        return Math.random() * 0xffffff
      }
    }
  },
  watch: {
    color () {
      this.material.color = new THREE.Color(this.color)
    },
    texture () {
      this.material.map = this.texture
    },
    opacity () {
      this.material.opacity = this.opacity
    }
  },
  data () {
    return {
      config: false,
      material: false
    }
  },
  created () {
  },
  methods: {
    makeMaterial (options) {
      this.config = { color: new THREE.Color(this.color), transparent: true, opacity: this.opacity, ...options }
      this.material = new THREE.MeshBasicMaterial(this.config)
      this.$parent.$emit('material', this.material)
    }
  },
  mounted () {
    let config = {}
    if (this.texture) {
      config.map = this.texture
    }
    this.makeMaterial({ ...config })
    this.$on('texture', ({ texture }) => {
      this.makeMaterial({ map: texture })
    })
  }
}
</script>

<style>

</style>
