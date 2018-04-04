<template>
  <div class="mesh">
    <slot>
    </slot>
  </div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
  },
  data () {
    return {
      element: false,
      mesh: false,
      material: false,
      geometry: false
    }
  },
  created () {
    this.element = this.mesh = new THREE.Mesh()
    this.$parent.$emit('add', this.mesh)
    this.$emit('attach', this.mesh)
    this.$emit('element', this.mesh)

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
      if (this.mesh) {
        this.mesh.geometry = this.geometry
      }
    },
    tryUpdateMaterial (v) {
      if (this.mesh) {
        this.mesh.material = this.material
      }
    },
    uninstall () {
      this.$emit('detach', this.mesh)
      this.$parent.$emit('remove', this.mesh)
    }
  }
}
</script>

<style>

</style>
