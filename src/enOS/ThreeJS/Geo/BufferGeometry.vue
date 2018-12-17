<template>
  <div class="geo-box"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    array3f: {
      default () {
        return [
          -1.0, -1.0, 1.0,
          1.0, -1.0, 1.0,
          1.0, 1.0, 1.0,
          1.0, 1.0, 1.0,
          -1.0, 1.0, 1.0,
          -1.0, -1.0, 1.0
        ]
      }
    }
  },
  data () {
    return {
      float32Arr: false,
      geometry: false
    }
  },
  watch: {
    array3f () {
      this.updatePosition()
    }
  },
  methods: {
    updatePosition () {
      let n = this.array3f.length
      for (var i = 0; i < n; i += 1) {
        this.float32Arr[i] = this.array3f[i]
      }
      this.bufferAttribute.dynamic = true
      this.bufferAttribute.needsUpdate = true
    }
  },
  mounted () {
    var geometry = new THREE.BufferGeometry()
    this.float32Arr = new Float32Array(this.array3f)
    this.bufferAttribute = new THREE.BufferAttribute(this.float32Arr, 3)
    this.updatePosition()
    this.bufferAttribute.dynamic = true
    this.bufferAttribute.needsUpdate = true

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.addAttribute('position', this.bufferAttribute)

    geometry.computeBoundingSphere()
    geometry.computeVertexNormals()

    this.$parent.$emit('geometry', geometry)
  }
}
</script>

<style>

</style>
