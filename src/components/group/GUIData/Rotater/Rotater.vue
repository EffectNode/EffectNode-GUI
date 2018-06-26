<template>
  <div class="wrapper" ref="wrapper">

    <Renderer
      v-if="size"
      ref="renderer"
      @toucher="gotToucher"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <div class="camera-control" v-if="!noControl">
      <button @click="lookAt('xy')">XY</button>
      <input type="checkbox" v-model="helper.xy">


      <button @click="lookAt('xz')">XZ</button>
      <input type="checkbox" v-model="helper.xz">

      <button @click="lookAt('yz')">YZ</button>
      <input type="checkbox" v-model="helper.yz">
    </div>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="camPos"
      @camera="(v) => { camera = v }"
      @refresh="() => { camera = v;  }"
    />

    <Scene @scene="(v) => { scene = v }">

      <!-- x plane -->
      <Object3D :rz="PI / 2.0" v-if="helper.yz">
        <!-- <PlaneHelper :colorAxis="'#000000'" :colorGrid="'rgb(185,185,255)'" /> -->
        <Mesh>
          <RingBufferGeometry :innerRadius="100" :outerRadius="95" />
          <MeshBasicMaterial :doubleSide="true" :color="0xbabbaba" />
        </Mesh>
      </Object3D>

      <!-- y plane -->
      <Object3D :ry="PI / 2.0" v-if="helper.xz">
        <!-- <PlaneHelper :colorAxis="'#000000'" :colorGrid="'rgb(185,255,185)'" /> -->
        <Mesh>
          <RingBufferGeometry :innerRadius="100" :outerRadius="95" />
          <MeshBasicMaterial :doubleSide="true" :color="0xbabbaba" />
        </Mesh>
      </Object3D>

      <!-- xy plane -->
      <Object3D :rx="PI / 2.0" v-if="helper.xy">
        <!-- <PlaneHelper :colorAxis="'#000000'" :colorGrid="'rgb(255,185,185)'" /> -->
        <Mesh>
          <RingBufferGeometry :innerRadius="100" :outerRadius="95" />
          <MeshBasicMaterial :doubleSide="true" :color="0xbabbaba" />
        </Mesh>
      </Object3D>

      <!-- <Object3D :pz="200">
        <PointLight />
      </Object3D> -->


    </Scene>

  </div>
</template>

<script>
import * as TWEEN from '@tweenjs/tween.js'

import * as THREE from 'three'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'
/* eslint-enable */

import Bundle from '@/components/ThreeJS/Bundle.js'
// import simpleVS from '@/components/Shaders/Simple/vs.vert'
// import simpleFS from '@/components/Shaders/Simple/fs.frag'

export default {
  props: {
    noControl: {
      default: false
    }
  },
  components: {
    ...Bundle
  },
  computed: {
  },
  methods: {
    lookAt (lookAtCase) {
      if (lookAtCase === 'xy') {
        new TWEEN.Tween(this.camera.position)
          .to({ x: 0, y: 0, z: 200 }, 1200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            this.camera.lookAt(this.scene)
          })
          .start()
      } else if (lookAtCase === 'xz') {
        new TWEEN.Tween(this.camera.position)
          .to({ x: 0, y: 200, z: 0 }, 1200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            this.camera.lookAt(this.scene)
          })
          .start()
      } else if (lookAtCase === 'yz') {
        new TWEEN.Tween(this.camera.position)
          .to({ x: 200, y: 0, z: 0 }, 1200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            this.camera.lookAt(this.scene)
          })
          .start()
      }
    },
    gotToucher (toucher) {
      this.toucher = toucher
      toucher.addEventListener('click', () => { this.$emit('click') })
      this.control = new THREE.OrbitControls(this.camera, this.toucher)
      this.control.enableKeys = false
      this.control.noPan = true
      this.control.noZoom = true

      var position = new THREE.Vector3()
      var quaternion = new THREE.Quaternion()
      var scale = new THREE.Vector3()

      this.control.addEventListener('change', () => {
        this.camera.matrixWorld.decompose(position, quaternion, scale)
        this.$emit('rotation', {
          x: quaternion.x * 2,
          y: quaternion.y * 2,
          z: quaternion.z * 2
        })
      })
    },
    renderWebGL () {
      TWEEN.update()

      this.animatable.time.value = window.performance.now() * 0.001
      if (this.control) {
        this.control.update()
      }
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  data () {
    return {
      helper: {
        xy: true,
        yz: true,
        xz: true
      },
      camPos: { x: 0, y: 0, z: 200 },
      // camPos: {x: 191.33165902870596, y: 31.286893008046246, z: -49.125620395330465},
      PI: Math.PI,
      world: {
        rx: 0,
        ry: 0,
        rz: 0
      },
      THREE,
      control: false,
      toucher: false,
      animatable: {
        time: { value: 0 }
      },
      size: false,
      renderer: false,
      scene: false,
      camera: false
    }
  },
  created () {
  },
  mounted () {
    var resizer = () => {
      var rect = this.$refs['wrapper'].getBoundingClientRect()
      this.size = {
        width: rect.width,
        height: rect.height,
        aspect: rect.width / rect.height
      }
      this.$nextTick(() => {
        this.$refs['renderer'].resize()
      })
    }
    window.addEventListener('resize', resizer, false)
    resizer()

    this.$nextTick(resizer)

    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.plotters{
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.plotter{
  width: 500px;
}
</style>
