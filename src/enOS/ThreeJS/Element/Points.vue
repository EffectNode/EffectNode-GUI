<template>
  <div class="points">
    <slot>
    </slot>
  </div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    position: {}
  },
  data () {
    return {
      element: false,
      points: false,
      material: false,
      geometry: false
    }
  },
  created () {
    this.element = this.points = new THREE.Points()
    this.$parent.$emit('add', this.points)
    this.$emit('element', this.points)
    this.$emit('attach', this.points)
    this.$on('material', (v) => {
      this.material = v
      this.tryUpdateMaterial()
    })
    this.$on('geometry', (v) => {
      this.geometry = v
      this.tryUpdateGeometry()
    })
  },
  beforeDestroy () {
    this.uninstall()
  },
  methods: {
    tryUpdateGeometry (v) {
      if (this.points) {
        this.points.geometry = this.geometry
      }
    },
    tryUpdateMaterial (v) {
      if (this.points) {
        this.points.material = this.material
      }
    },
    uninstall () {
      this.$emit('detach', this.points)
      this.$parent.$emit('remove', this.points)
    }
  }
}
</script>

<style>

</style>
