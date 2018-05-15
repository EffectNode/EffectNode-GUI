<template>
<div></div>
</template>

<script>
import GPUComputationRenderer from '@/components/ThreeJS/System/GPUComputationRenderer.js'
import * as THREE from 'three'

function prepIndexer (texture, SIZE) {
  var pixels = texture.image.data
  var p = 0
  let max = SIZE * SIZE
  for (var j = 0; j < max; j++) {
    pixels[p + 0] = j
    pixels[p + 1] = j / (max)
    pixels[p + 2] = j / SIZE
    pixels[p + 3] = 1.0
    p += 4
  }
}

export default {
  props: {
    renderer: {}
  },
  data () {
    return {
      gpuCompute: false,
      getTexture: () => {},
      runSim: () => {},
      updateMouse: () => {}
    }
  },
  mounted () {
    var count = 0
    let SIZE = 256

    var gpuCompute = new GPUComputationRenderer(SIZE, SIZE, this.renderer)

    var indexerTexture = gpuCompute.createTexture()
    prepIndexer(indexerTexture, SIZE)

    var originalTarget = gpuCompute.createRenderTarget()
    var pingTarget = gpuCompute.createRenderTarget()
    var pongTarget = gpuCompute.createRenderTarget()
    var outputTarget = gpuCompute.createRenderTarget()

    let pingMat, pongMat, initMat, outputMat, randMat

    let pingPongShader = require('./GPUSpiral/pingpong.frag')
    let initShader = require('./GPUSpiral/init.frag')
    let outputShader = require('./GPUSpiral/output.frag')
    let randShader = require('./GPUSpiral/rand.frag')

    let init = ({ initShader, pingPongShader, outputShader }) => {
      randMat = gpuCompute.createShaderMaterial(randShader, {
      })

      initMat = gpuCompute.createShaderMaterial(initShader, {
        indexerTexture: { value: indexerTexture }
      })

      pingMat = gpuCompute.createShaderMaterial(pingPongShader, {
        indexerTexture: { value: indexerTexture },
        startTexture: { value: null },
        lastTexture: { value: null },
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      })
      pongMat = gpuCompute.createShaderMaterial(pingPongShader, {
        indexerTexture: { value: indexerTexture },
        startTexture: { value: null },
        lastTexture: { value: null },
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      })

      outputMat = gpuCompute.createShaderMaterial(outputShader, {
        simTexture: { value: null },
        indexerTexture: { value: indexerTexture },
        startTexture: { value: null },
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      })

      outputMat.uniforms.startTexture.value = originalTarget.texture

      gpuCompute.doRenderTarget(randMat, pingTarget)
      gpuCompute.doRenderTarget(randMat, pongTarget)

      gpuCompute.doRenderTarget(initMat, originalTarget)
      gpuCompute.doRenderTarget(initMat, outputTarget)
    }
    init({ initShader, pingPongShader, outputShader })

    var mouser = () => {
      window.addEventListener('mousemove', (evt) => {
        let x = (evt.pageX - window.innerWidth * 0.5) / window.innerWidth
        let y = (evt.pageY - window.innerHeight * 0.5) / window.innerHeight
        let aRatio = window.innerWidth / window.innerHeight
        let bRatio = window.innerHeight / window.innerWidth
        let z = Math.min(aRatio, bRatio)

        y *= -1

        pingMat.uniforms.mouse.value.copy({ x, y, z })
        pongMat.uniforms.mouse.value.copy({ x, y, z })
        outputMat.uniforms.mouse.value.copy({ x, y, z })
      }, false)
    }
    mouser()

    // sim part
    let procSim = () => {
      pingMat.uniforms.lastTexture.value = pongTarget.texture
      pongMat.uniforms.lastTexture.value = pingTarget.texture

      pingMat.uniforms.time.value = window.performance.now() * 0.0001
      pongMat.uniforms.time.value = window.performance.now() * 0.0001
      outputMat.uniforms.time.value = window.performance.now() * 0.0001

      if (count % 2 === 0) {
        gpuCompute.doRenderTarget(pingMat, pingTarget)
        outputMat.uniforms.simTexture.value = pingTarget.texture
      } else {
        gpuCompute.doRenderTarget(pongMat, pongTarget)
        outputMat.uniforms.simTexture.value = pongTarget.texture
      }
      gpuCompute.doRenderTarget(outputMat, outputTarget)
      count++
    }

    // display part
    var geometry = new THREE.PlaneBufferGeometry(1.0, 1.0, SIZE, SIZE)
    var material = new THREE.ShaderMaterial({
      // blending: THREE.AdditiveBlending,
      // depthTest: false,
      transparent: true,
      vertexShader: require('./GPUSpiral/display.vert'),
      fragmentShader: require('./GPUSpiral/display.frag'),
      defines: {
        resolution: 'vec2( ' + SIZE.toFixed(1) + ', ' + SIZE.toFixed(1) + ' )'
      },
      uniforms: {
        time: { value: 0 },
        opacity: { value: 1.0 },
        simTex: { value: null },
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
        material.uniforms.simTex.value = pingTarget.texture
      } else {
        material.uniforms.simTex.value = pongTarget.texture
      }
      material.uniforms.posTex.value = outputTarget.texture
      material.uniforms.time.value = window.performance.now() * 0.0001
    }
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
