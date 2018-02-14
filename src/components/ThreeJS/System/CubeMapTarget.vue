<template>

</template>

<script>
import * as THREE from 'three'

export default {
  props: {
    sceneRenderer: {},
    sceneCamera: {},
    width: { default: window.innerWidth },
    height: { default: window.innerHeight }
  },
  data () {
    return {
      scene: false,
      texture: false,
      mesh: false,
      cube: false,
      material: false
    }
  },
  mounted () {
    let cubeScene = this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 100000)

    let textureCube = this.texture = new THREE.CubeTexture()
    // textureCube.load(
    //   [
    //     require('../textures/cubemap/empty/px.png'), require('../textures/cubemap/empty/nx.png'),
    //     require('../textures/cubemap/empty/py.png'), require('../textures/cubemap/empty/ny.png'),
    //     require('../textures/cubemap/empty/pz.png'), require('../textures/cubemap/empty/nz.png')
    //   ],
    //   () => {
    //   }
    // )
    this.$emit('cube-map-target', this)

    let shader = THREE.ShaderLib.cube
    shader.uniforms.tCube.value = textureCube
    textureCube.mapping = THREE.CubeRefractionMapping

    let material = this.material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    })

    let mesh = this.cube = this.mesh = new THREE.Mesh(new THREE.BoxGeometry(300, 300, 300), material)
    cubeScene.add(mesh)

    this.sceneRenderer.autoClear = false
  },
  beforeDestroy () {
    this.sceneRenderer.autoClear = true
  },
  // activated () {
  //   this.sceneRenderer.autoClear = true
  // },
  // deactivated () {
  //   this.sceneRenderer.autoClear = false
  // },
  methods: {
    update () {
      if (this.sceneRenderer && this.scene && this.camera) {
        this.camera.rotation.copy(this.sceneCamera.rotation)
        this.sceneRenderer.render(this.scene, this.camera)
      }
    }
  }
}
</script>

<style>

</style>
