<template>
<div></div>
</template>

<script>
import GPUComputationRenderer from '@/components/ThreeJS/System/GPUComputationRenderer.js'
import * as THREE from 'three'

// function fillTexture (texture, WIDTH) {
//   var pixels = texture.image.data
//   var p = 0
//   for (var j = 0; j < WIDTH; j++) {
//     for (var i = 0; i < WIDTH; i++) {
//       var x = (WIDTH / 2 - i) * 128 / WIDTH
//       var y = (WIDTH / 2 - j) * 128 / WIDTH

//       pixels[p + 0] = x * 1.5
//       pixels[p + 1] = y * 1.5

//       pixels[p + 2] = 0.0
//       pixels[p + 3] = 0.0
//       p += 4
//     }
//   }
// }

export default {
  props: {
    renderer: {}
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
    var count = 0
    let SIZE = 128

    var gpuCompute = new GPUComputationRenderer(SIZE, SIZE, this.renderer)

    var originalTarget = gpuCompute.createRenderTarget()
    var pingTarget = gpuCompute.createRenderTarget()
    var pongTarget = gpuCompute.createRenderTarget()

    let pingMat, pongMat, initMat

    let pingPongShader = require('./Shaders/pingpong.frag')
    let initShader = require('./Shaders/init.frag')

    let init = () => {
      pingMat = gpuCompute.createShaderMaterial(pingPongShader, {
        startTexture: { value: null },
        lastTexture: { value: null },
        time: { value: 0 }
      })
      pongMat = gpuCompute.createShaderMaterial(pingPongShader, {
        startTexture: { value: null },
        lastTexture: { value: null },
        time: { value: 0 }
      })

      initMat = gpuCompute.createShaderMaterial(initShader, {})

      pingMat.uniforms.lastTexture.value = pongTarget.texture
      pongMat.uniforms.lastTexture.value = pingTarget.texture

      pingMat.uniforms.startTexture.value = originalTarget.texture
      pongMat.uniforms.startTexture.value = originalTarget.texture

      gpuCompute.doRenderTarget(initMat, originalTarget)
      gpuCompute.doRenderTarget(initMat, pingTarget)
      gpuCompute.doRenderTarget(initMat, pongTarget)
    }

    // sim part
    let procSim = () => {
      pingMat.uniforms.lastTexture.value = pongTarget.texture
      pongMat.uniforms.lastTexture.value = pingTarget.texture

      pingMat.uniforms.time.value = window.performance.now() * 0.0001
      pongMat.uniforms.time.value = window.performance.now() * 0.0001

      if (count % 2 === 0) {
        gpuCompute.doRenderTarget(pingMat, pingTarget)
      } else {
        gpuCompute.doRenderTarget(pongMat, pongTarget)
      }
      count++
    }

    // display part
    var geometry = new THREE.PlaneBufferGeometry(1.0, 1.0, SIZE, SIZE)
    var material = this.displayMaterial = new THREE.ShaderMaterial({
      // blending: THREE.AdditiveBlending,
      // depthTest: false,
      transparent: true,
      vertexShader: require('./Shaders/display.vert'),
      fragmentShader: require('./Shaders/display.frag'),
      defines: {
        resolution: 'vec2( ' + SIZE.toFixed(1) + ', ' + SIZE.toFixed(1) + ' )'
      },
      uniforms: {
        time: { value: 0 },
        opacity: { value: 1.0 },
        posTex: { value: null },
        picture: { value: new THREE.TextureLoader().load('https://picsum.photos/200/300', (texture) => { texture.flipY = true; texture.needsUpdate = true }) },
        pointSize: { value: window.devicePixelRatio || 1.0 }
      }
    })

    var points = this.points = new THREE.Points(geometry, material)
    points.matrixAutoUpdate = false
    points.updateMatrix()
    points.frustumCulled = false

    let rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      procSim()
      if (count % 2 === 0) {
        material.uniforms.posTex.value = pingTarget.texture
      } else {
        material.uniforms.posTex.value = pongTarget.texture
      }
      material.uniforms.time.value = window.performance.now() * 0.0001
    }
    init()
    this.rAFID = window.requestAnimationFrame(rAF)

    this.$parent.$emit('add', points)
    this.$emit('gpgpu', this)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.points)
    window.cancelAnimationFrame(this.rAFID)
  },
  methods: {
  }
}
</script>

<style>
</style>
