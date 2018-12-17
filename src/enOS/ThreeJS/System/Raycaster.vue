<template>
<div></div>
</template>

<script>
// import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

export default {
  data () {
    return {
      mdown: 0,
      rAFID: 0,
      mouse: null,
      raycast () {},
      clean () {}
    }
  },
  props: {
    scene: {},
    camera: {},
    toucher: {}
  },
  watch: {
    toucher () {
      this.setupToucher()
    }
  },
  created () {
    var raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.setupToucher = () => {
      this.clean()
      this.toucher.addEventListener('mousedown', this.handleDown, false)
      this.toucher.addEventListener('click', this.handleClick, false)
      this.toucher.addEventListener('mousemove', this.handleMV, false)
      this.toucher.style['-webkit-tap-highlight-color'] = `rgba(0,0,0,0)`

      console.log(this.toucher)
      this.clean = () => {
        this.toucher.removeEventListener('mousedown', this.handleDown)
        this.toucher.removeEventListener('click', this.handleClick)
        this.toucher.removeEventListener('mousemove', this.handleMV)
      }
    }

    var raycast = () => {
      var mouse = this.mouse
      var scene = this.scene
      var camera = this.camera

      var restore = []
      this.scene.traverse((ele) => {
        if (ele.$skipRayCast) {
          restore.push({
            parent: ele.parent,
            ele: ele
          })
          ele.parent.remove(ele)
        }
      })

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera)
      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects(scene.children, true)

      restore.forEach((item) => {
        item.parent.add(item.ele)
      })

      return intersects
    }
    this.raycast = raycast
  },
  mounted () {
    this.setupToucher()
  },
  // activated () {
  //   this.setupToucher()
  //   // var rAF = () => {
  //   //   this.rAFID = window.requestAnimationFrame(rAF)
  //   //   // this.raycast()
  //   // }
  //   // this.rAFID = window.requestAnimationFrame(rAF)
  // },
  // deactivated () {
  //   this.setupToucher()
  //   // this.setupToucher()
  //   // window.cancelAnimationFrame(this.rAFID)
  //   // this.clean()
  // },
  beforeDestroy () {
    this.setupToucher()
  },
  methods: {
    handleDown (event) {
      // console.log(event)
      this.mdown = event.timeStamp
    },
    handleClick (event) {
      var diff = event.timeStamp - this.mdown
      if (diff < 350) {
        var intersects = this.raycast()

        var inter = intersects[0]
        if (inter && inter.object && inter.object.onClick) {
          inter.object.onClick({
            object: inter.object,
            intersection: inter,
            event,
            intersects
          })
        }
      }
    },
    handleMV (event) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
  }
}
</script>

<style>

</style>
