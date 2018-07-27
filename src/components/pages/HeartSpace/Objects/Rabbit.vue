<template>
  <div class="geo-TorusKnotBufferGeometry">

    <ShaderMaterial @material="(v) => { material = v; runLoader() }" :transparent="true" :vs="glsl.vertexShader" :fs="glsl.fragmentShader" :uniforms="uniforms" />

  </div>
</template>

<script>
import * as THREE from 'three'
import Bundle from '@/components/ThreeJS/Bundle.js'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/loaders/OBJLoader.js'
/* eslint-enable */export default {
  props: {
    transparent: {
      default: false
    },
    uniforms: {
      default () {
        return {}
      }
    },
    glsl: {}
  },
  components: {
    ...Bundle
  },
  data () {
    return {
      material: false,
      obj: false
    }
  },
  methods: {
    runLoader () {
      var group = new THREE.Object3D()

      let obj = this.obj

      if (this.group) {
        this.$parent.$emit('remove', this.group)
      }
      if (!obj.traverse) {
        return
      }
      obj.traverse((oo, key) => {
        if (oo instanceof THREE.Mesh) {
          let newObj = new THREE.Mesh(oo.geometry, this.material)
          newObj.scale.copy({ x: 20, y: 20, z: 20 })
          newObj.position.y = -15
          // newObj.rotation.y = Math.PI * 2 / 360 * -35
          group.add(newObj)
        }
      })
      this.$parent.$emit('add', group)
      this.group = group
    }
  },
  mounted () {
    var loader = new THREE.OBJLoader()

    /* eslint-disable */
    loader.load(require('file-loader!./rabbit.obj'), (obj) => {
      this.obj = obj
      this.runLoader()
    })
    /* eslint-enable */

    // let { radius, tube, tubularSegments, radialSegments, p, q } = this
    // let geometry = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q)
  },
  beforeDestroy () {
    if (this.group) {
      this.$parent.$emit('remove', this.group)
    }
  }
}
</script>

<style>

</style>
