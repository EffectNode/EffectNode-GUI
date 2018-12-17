<template>
<div class="object-3d"><slot></slot></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      object3d: false
    }
  },
  props: {
    activate: { default () { return () => {} } },
    deactivate: { default () { return () => {} } },
    visible: { default: true },
    px: { default: 0 },
    py: { default: 0 },
    pz: { default: 0 },

    sx: { default: 1 },
    sy: { default: 1 },
    sz: { default: 1 },

    rx: { default: 0 },
    ry: { default: 0 },
    rz: { default: 0 }
  },
  activated () {
    this.activate(this.object3d)
  },
  deactivated () {
    this.deactivate(this.object3d)
  },
  watch: {
    visible () { this.object3d.visible = this.visible },
    px () { this.updatePosition('x', this.px) },
    py () { this.updatePosition('y', this.py) },
    pz () { this.updatePosition('z', this.pz) },

    sx () { this.updateScale('x', this.sx) },
    sy () { this.updateScale('y', this.sy) },
    sz () { this.updateScale('z', this.sz) },

    rx () { this.updateRotation('x', this.rx) },
    ry () { this.updateRotation('y', this.ry) },
    rz () { this.updateRotation('z', this.rz) }
  },
  created () {
    this.object3d = new THREE.Object3D()
    this.object3d.visible = this.visible

    this.$emit('element', this.object3d)
    this.updatePosition()
    this.updateScale()
    this.updateRotation()
    this.$on('add', (v) => {
      this.object3d.add(v)
    })
    this.$on('remove', (v) => {
      this.object3d.remove(v)
    })
  },
  mounted () {
    this.$emit('attach', this.object3d)
    this.$parent.$emit('add', this.object3d)
  },
  beforeDestroy () {
    this.$emit('detach', this.object3d)
    this.$parent.$emit('remove', this.object3d)
  },
  methods: {
    updatePosition (key, val) {
      if (key) {
        this.object3d.position[key] = val
      } else {
        this.object3d.position.set(this.px, this.py, this.pz)
      }
    },
    updateScale (key, val) {
      if (key) {
        this.object3d.scale[key] = val
      } else {
        this.object3d.scale.set(this.sx, this.sy, this.sz)
      }
    },
    updateRotation (key, val) {
      if (key) {
        this.object3d.rotation[key] = val
      } else {
        this.object3d.rotation.set(this.rx, this.ry, this.rz)
      }
    }
  }
}
</script>

<style>

</style>
