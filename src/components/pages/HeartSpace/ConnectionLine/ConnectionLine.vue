<template>
<div><span :style="{ display: 'none' }">{{ p1 }}{{ p2 }}</span></div>
</template>

<script>
/* eslint-disable */
import * as THREE from 'three'
import 'imports-loader?THREE=three!three/examples/js/lines/LineSegmentsGeometry.js'
import 'imports-loader?THREE=three!three/examples/js/lines/LineGeometry.js'
import 'imports-loader?THREE=three!three/examples/js/lines/WireframeGeometry2.js'
import 'imports-loader?THREE=three!three/examples/js/lines/LineMaterial.js'
/* eslint-enable */

export default {
  props: {
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
      geometry: false
    }
  },
  watch: {
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
      if (this.geometry) {
        let v0 = this.geometry.vertices[0]
        let v1 = this.geometry.vertices[1]
        let v2 = this.geometry.vertices[2]
        let v3 = this.geometry.vertices[3]

        let p1 = new THREE.Vector3(this.p1.x, this.p1.y, 0)
        let p2 = new THREE.Vector3(this.p2.x, this.p2.y, 0)

        // if (false) {
        // let temp = false
        // temp = p1
        // p1 = p2
        // p2 = temp
        // }

        // p1.x = this.p1x
        // p1.y = this.p1y

        // p2.x = this.p2x
        // p2.y = this.p2y

        this.temp.x = this.p1.x
        this.temp.y = this.p1.y
        this.temp.sub(p2).normalize()

        var n = Math.abs(this.temp.y) * 0.5
        v0.x = p1.x
        v0.y = p1.y

        v1.x = (p2.x + p1.x) * (n)
        v1.y = (p2.y - p1.y) / 2

        v2.x = (p2.x + p1.x) * (1.0 - n)
        v2.y = (p2.y - p1.y) / 2

        v3.x = p2.x
        v3.y = p2.y

        this.geometry.verticesNeedUpdate = true
        this.geometry.needsUpdate = true
      }
    }
  },
  mounted () {
    // segments
    var geometry = this.geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(0, 0, 0))
    geometry.vertices.push(new THREE.Vector3(0, 0, 0))
    geometry.vertices.push(new THREE.Vector3(0, 0, 0))
    geometry.vertices.push(new THREE.Vector3(0, 0, 0))

    this.updateGeo()

    // var curve = new THREE.CatmullRomCurve3([
    //   new THREE.Vector3(p1.x, p1.y),
    //   new THREE.Vector3((p2.x + p1.x) / 3 * 1, (p2.y - p1.y) / 2),
    //   new THREE.Vector3((p2.x + p1.x) / 3 * 2, (p2.y - p1.y) / 2),
    //   new THREE.Vector3(p2.x, p2.y)
    // ])
    // var points = curve.getPoints(4)
    // var geometry = new THREE.BufferGeometry().setFromPoints(points)

    var material = new THREE.LineBasicMaterial({
      color: 0xffffff// ,
      // linewidth: 1 * (window.devicePixelRatio || 1)
    })
    // material.linewidth = 1
    material.needsUpdate = true

    var line = this.line = new THREE.Line(geometry, material)
    line.computeLineDistances()
    line.scale.set(1, 1, 1)
    line.frustumCulled = false

    this.$parent.$emit('add', line)
    console.log('created connection line')
  },
  beforeDestroy () {
    this.$parent.$emit('add', this.line)
  }
}
</script>

<style>

</style>
