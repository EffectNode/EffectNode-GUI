<template>
  <div class="lineSegments">
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
      lineSegments: false,
      material: false,
      geometry: false
    }
  },
  created () {
    this.element = this.lineSegments = new THREE.LineSegments()
    this.$parent.$emit('add', this.lineSegments)
    this.$emit('element', this.element)

    this.$on('material', (v) => {
      this.material = v
      this.tryUpdateMaterial()
    })
    this.$on('geometry', (v) => {
      // var wireframe = new THREE.WireframeGeometry(v)
      this.geometry = v
      this.tryUpdateGeometry()
    })
  },
  beforeDestroy () {
    this.uninstall()
  },
  methods: {
    tryUpdateGeometry (v) {
      if (this.lineSegments) {
        this.lineSegments.geometry = this.geometry
      }
    },
    tryUpdateMaterial (v) {
      if (this.lineSegments) {
        this.lineSegments.material = this.material
      }
    },
    uninstall () {
      this.$parent.$emit('remove', this.lineSegments)
    }
  }
}
</script>

<style>

</style>
