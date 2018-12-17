<template>
<div class="texture-loader"><slot></slot></div>
</template>

<script>
import * as THREE from 'three'

/* eslint-disable */
// import 'imports-loader?THREE=three!./TextureLoader.js'
import 'imports-loader?THREE=three!three/examples/js/loaders/SVGLoader.js'
// import 'imports-loader?THREE=three!three/examples/js/renderers/SVGRenderer.js'
/* eslint-enable */

export default {
  props: {
    src: { default () { return require('../textures/tiger.svg') } }
  },
  data () {
    return {
      SVGObj: false
    }
  },
  mounted () {
    let loader = new THREE.SVGLoader()
    loader.load(
      this.src,
      (doc) => {
        let paths = doc
        console.log(doc)

        var group = new THREE.Group()
        group.scale.multiplyScalar(0.1)
        group.scale.y *= -1
        for (var i = 0; i < paths.length; i++) {
          var path = paths[i]
          var material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false
          })
          var shapes = path.toShapes(true)
          for (var j = 0; j < shapes.length; j++) {
            var shape = shapes[ j ]
            var geometry = new THREE.ShapeBufferGeometry(shape)
            var mesh = new THREE.Mesh(geometry, material)
            group.add(mesh)
          }
        }

        this.$parent.$emit('add', group)

        // console.log(texture)
        // this.texture = texture
        // this.$emit('texture', { texture })
        // this.$emit('image', texture.image)
        // this.$parent.$emit('texture', this.texture)
      }
    )
  },
  beforeDestroy () {
  }
}
</script>

<style scoped>
</style>
