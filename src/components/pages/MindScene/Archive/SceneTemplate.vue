<template>
<div>
  {{ sid }}

  <Scene @scene="(v) => { $emit('scene', v); scene = v }">

    <Mesh>
      <SphereBufferGeometry></SphereBufferGeometry>
      <MeshBasicMaterial :color="0x00ffff"></MeshBasicMaterial>
    </Mesh>

  </Scene>

  <PerspectiveCamera
    :fov="75"
    :aspect="size.aspect"
    :near="1"
    :far="10000"
    :position="camPos"
    @camera="(v) => { $emit('camera', v); camera = v }"
  />

</div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
import * as THREE from 'three'

export default {
  components: {
    ...Bundle
  },
  props: {
    renderer: {},
    size: {}
  },
  data () {
    return {
      rAFID: 0,
      scene: false,
      camear: false,
      camPos: {
        x: 0, y: 0, z: 25
      }
    }
  },
  computed: {
    sid () {
      return this.$route.params.sid
    }
  },
  methods: {
    runWebGL () {
      if (this.renderer && this.camera && this.scene) {
        this.renderer.render(this.scene, this.camera)
      }
    },
    setup () {
      this.scene.background = new THREE.Color('#374967')
    }
  },
  mounted () {
    this.setup()
    var rAF = () => {
      this.runWebGL()
      this.rAFID = window.requestAnimationFrame(rAF)
    }
    this.rAFID = window.requestAnimationFrame(rAF)
  }
}
</script>

<style>

</style>
