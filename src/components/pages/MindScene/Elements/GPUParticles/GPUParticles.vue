<template>
<div></div>
</template>

<script>
import GPUComputationRenderer from '@/components/ThreeJS/System/GPUComputationRenderer.js'
import * as THREE from 'three'

function fillTexture (texture, WIDTH) {
  var pixels = texture.image.data
  var p = 0
  for (var j = 0; j < WIDTH; j++) {
    for (var i = 0; i < WIDTH; i++) {
      var x = (WIDTH / 2 - i) * 128 / WIDTH
      var y = (WIDTH / 2 - j) * 128 / WIDTH

      pixels[p + 0] = x * 1.5
      pixels[p + 1] = y * 1.5

      pixels[p + 2] = 0.0
      pixels[p + 3] = 0.0
      p += 4
    }
  }
}

export default {
  props: {
    camera: {},
    renderer: {},
    scene: {}
  },
  data () {
    return {
      displayMaterial: false,
      gpuCompute: false,
      getTexture: () => {},
      runSim: () => {},
      updateMouse: () => {}
    }
  },
  mounted () {
    var WIDTH = 128
    var renderer = this.renderer
    var gpuCompute = this.gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer)
    var pos0 = gpuCompute.createTexture()
    var vel0 = gpuCompute.createTexture()
    var res0 = gpuCompute.createTexture()

    fillTexture(pos0, WIDTH)
    fillTexture(vel0, WIDTH)
    fillTexture(res0, WIDTH)

    var velVar = gpuCompute.addVariable('velTex', require('./Shaders/velocity.frag'), vel0)
    var posVar = gpuCompute.addVariable('posTex', require('./Shaders/position.frag'), pos0)
    gpuCompute.setVariableDependencies(velVar, [velVar, posVar])
    gpuCompute.setVariableDependencies(posVar, [velVar, posVar])

    posVar.material.uniforms = {
      mouse: { value: new THREE.Vector2(0, 0) },
      resTex: { value: res0 }
    }

    velVar.material.uniforms = {
      time: { value: 0.0 },
      mouse: { value: new THREE.Vector2(0, 0) },
      resTex: { value: res0 }
    }

    this.updateMouse = (x, y) => {
      var positionMouse = posVar.material.uniforms.mouse.value
      var velocityMouse = velVar.material.uniforms.mouse.value
      velocityMouse.x = x
      velocityMouse.y = y

      positionMouse.x = x
      positionMouse.y = y
    }

    this.getTexture = () => {
      return {
        velTex: gpuCompute.getCurrentRenderTarget(velVar).texture,
        posTex: gpuCompute.getCurrentRenderTarget(posVar).texture
      }
    }

    this.runSim = () => {
      velVar.material.uniforms.time.value = window.performance.now() / 1000
      gpuCompute.compute()
    }

    var error = gpuCompute.init()
    if (error !== null) {
      alert(error)
      console.error(error)
    }

    // -0-0-0-0-0-0-0-
    var geometry = new THREE.PlaneBufferGeometry(3.0, 3.0, WIDTH, WIDTH)
    var material = this.displayMaterial = new THREE.ShaderMaterial({
      // blending: THREE.AdditiveBlending,
      // depthTest: false,
      transparent: true,
      vertexShader: require('./Shaders/particle.vert'),
      fragmentShader: require('./Shaders/particle.frag'),
      uniforms: {
        opacity: { value: 1.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        picture: { value: new THREE.TextureLoader().load('https://picsum.photos/200/300', (texture) => { texture.flipY = true; texture.needsUpdate = true }) },
        pointSize: { value: window.devicePixelRatio || 1.0 },
        posTex: { value: null },
        velTex: { value: null }
      }
    })

    var points = this.points = new THREE.Points(geometry, material)
    points.matrixAutoUpdate = false
    points.updateMatrix()

    // this.scene.background = new THREE.Color(0x000000)
    this.loop()

    this.$parent.$emit('add', points)
    this.$emit('gpgpu', this)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.points)
    window.cancelAnimationFrame(this.rAFID)
  },
  methods: {
    loop () {
      let rAF = () => {
        this.rAFID = window.requestAnimationFrame(rAF)
        this.update()
      }
      this.rAFID = window.requestAnimationFrame(rAF)
    },
    update () {
      if (this.displayMaterial) {
        let { posTex, velTex } = this.getTexture()
        if (posTex && velTex) {
          this.displayMaterial.uniforms.posTex.value = posTex
          this.displayMaterial.uniforms.velTex.value = velTex
          this.runSim()
        }
      }
    }
  }
}
</script>

<style>
</style>
