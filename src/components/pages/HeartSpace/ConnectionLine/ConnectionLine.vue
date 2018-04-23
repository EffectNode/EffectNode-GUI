<template>
<div><span :style="{ display: 'none' }">{{ p1 }}{{ p2 }}<slot></slot></span></div>
</template>

<script>
/* eslint-disable */
import * as THREE from 'three'
// import 'imports-loader?THREE=three!three/examples/js/lines/LineSegmentsGeometry.js'
// import 'imports-loader?THREE=three!three/examples/js/lines/LineGeometry.js'
// import 'imports-loader?THREE=three!three/examples/js/lines/WireframeGeometry2.js'
// import 'imports-loader?THREE=three!three/examples/js/lines/LineMaterial.js'
/* eslint-enable */

export default {
  props: {
    scene: {},
    p1: {
      default () {
        return { x: 0, y: 0 }
      }
    },
    p2: {
      default () {
        return { x: 15, y: 15 }
      }
    }
  },
  data () {
    return {
      temp: new THREE.Vector3(),
      rAFID: 0,
      animatable: {
        time: {
          value: 0
        }
      },
      geometry: false,
      down: {
        vs: require('../Shaders/Down/Down.vert'),
        fs: require('../Shaders/Down/Down.frag')
      }
    }
  },
  watch: {
    // p1 () {
    //   this.$nextTick(() => {
    //     this.updateGeo()
    //   })
    // },
    // p2 () {
    //   this.$nextTick(() => {
    //     this.updateGeo()
    //   })
    // },
    p1p2JSON () {
      this.updateGeo()
    }
  },
  computed: {
    p1p2JSON () {
      return JSON.stringify(this.p1) + JSON.stringify(this.p2)
    }
  },
  methods: {
    updateGeo () {
      if (!this.geometry) {
        this.geometry = new THREE.Geometry()
      }
      let v0 = this.geometry.vertices[0]
      let v1 = this.geometry.vertices[1]

      // let p1 = new THREE.Vector3(this.p1.x, this.p1.y, 0)
      // let p2 = new THREE.Vector3(this.p2.x, this.p2.y, 0)

      // v0.x = p1.x
      // v0.y = p1.y

      // v1.x = p2.x
      // v1.y = p2.y

      v0.x = this.p1.x
      v0.y = this.p1.y

      v1.x = this.p2.x
      v1.y = this.p2.y

      this.geometry.verticesNeedUpdate = true
      this.geometry.needsUpdate = true

      // this.scene.updateMatrixWorld(true)
    }
  },
  mounted () {
    // segments
    var geometry = this.geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(0, 0, 0))
    geometry.vertices.push(new THREE.Vector3(0, 0, 0))

    this.scene.updateMatrixWorld(true)
    this.updateGeo()

    // var curve = new THREE.CatmullRomCurve3([
    //   new THREE.Vector3(p1.x, p1.y),
    //   new THREE.Vector3((p2.x + p1.x) / 3 * 1, (p2.y - p1.y) / 2),
    //   new THREE.Vector3((p2.x + p1.x) / 3 * 2, (p2.y - p1.y) / 2),
    //   new THREE.Vector3(p2.x, p2.y)
    // ])
    // var points = curve.getPoints(4)
    // var geometry = new THREE.BufferGeometry().setFromPoints(points)

    var material = new THREE.ShaderMaterial({
      vertexShader: this.down.vs,
      fragmentShader: this.down.fs,
      uniforms: this.animatable
      // color: 0xffffff,
      // linewidth: 1
    })
    // material.linewidth = 1

    var line = this.line = new THREE.Line(geometry, material)
    // line.computeLineDistances()
    // line.scale.set(1, 1, 1)
    line.frustumCulled = false

    this.$parent.$emit('add', line)
    console.log('created connection line')

    var rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      this.animatable.time.value = window.performance.now() * 0.001
    }
    this.rAFID = window.requestAnimationFrame(rAF)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.line)
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style>

</style>
