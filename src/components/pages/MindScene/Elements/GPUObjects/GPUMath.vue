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
    pixels[p + 2] = SIZE
    pixels[p + 3] = 1.0
    p += 4
  }
}

export default {
  props: {
    touchSurface: {},
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
    let SIZE = 64

    var gpuCompute = new GPUComputationRenderer(SIZE, SIZE, this.renderer)

    var indexerTexture = gpuCompute.createTexture()
    prepIndexer(indexerTexture, SIZE)

    var pingTarget = gpuCompute.createRenderTarget()
    var pongTarget = gpuCompute.createRenderTarget()

    let pingMat, pongMat, randMat

    let randShader = require('./GPUMath/sim/rand.frag')
    let pingPongShader = require('./GPUMath/sim/pingpong.frag')

    let displayV = require('./GPUMath/show/display.vert')
    let displayF = require('./GPUMath/show/display.frag')

    let init = ({ pingPongShader }) => {
      randMat = gpuCompute.createShaderMaterial(randShader, {
        indexerTexture: { value: indexerTexture }
      })
      pingMat = gpuCompute.createShaderMaterial(pingPongShader, {
        lastTexture: { value: null },
        indexerTexture: { value: indexerTexture },
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      })
      pongMat = gpuCompute.createShaderMaterial(pingPongShader, {
        lastTexture: { value: null },
        indexerTexture: { value: indexerTexture },
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      })

      gpuCompute.doRenderTarget(randMat, pingTarget)
      gpuCompute.doRenderTarget(randMat, pongTarget)
    }
    init({ pingPongShader })

    var mouser = () => {
      window.addEventListener('mousemove', (evt) => {
        let x = (evt.pageX - window.innerWidth * 0.5) / window.innerWidth
        let y = (evt.pageY - window.innerHeight * 0.5) / window.innerHeight
        // let aRatio = window.innerWidth / window.innerHeight
        // let bRatio = window.innerHeight / window.innerWidth
        // let z = Math.min(aRatio, bRatio)

        let z = 0.0

        y *= -1

        pingMat.uniforms.mouse.value.copy({ x, y, z })
        pongMat.uniforms.mouse.value.copy({ x, y, z })
      }, false)

      this.touchSurface.addEventListener('touchmove', (evt) => {
        let x = (evt.touches[0].pageX - window.innerWidth * 0.5) / window.innerWidth
        let y = (evt.touches[0].pageY - window.innerHeight * 0.5) / window.innerHeight
        // let aRatio = window.innerWidth / window.innerHeight
        // let bRatio = window.innerHeight / window.innerWidth
        let z = 0.0

        y *= -1

        pingMat.uniforms.mouse.value.copy({ x, y, z })
        pongMat.uniforms.mouse.value.copy({ x, y, z })
      }, false)
    }
    mouser()

    // sim part
    let procSim = () => {
      pingMat.uniforms.lastTexture.value = pongTarget.texture
      pongMat.uniforms.lastTexture.value = pingTarget.texture

      pingMat.uniforms.time.value = window.performance.now() * 0.0001
      pongMat.uniforms.time.value = window.performance.now() * 0.0001

      if (count % 2 === 0) {
        gpuCompute.doRenderTarget(pongMat, pongTarget)
      } else {
        gpuCompute.doRenderTarget(pingMat, pingTarget)
      }
    }

    // display part
    var geometry = new THREE.PlaneBufferGeometry(1.0, 1.0, SIZE - 1, SIZE - 1)
    var material = new THREE.ShaderMaterial({
      // blending: THREE.AdditiveBlending,
      // depthTest: false,
      transparent: true,
      vertexShader: displayV,
      fragmentShader: displayF,
      defines: {
        resolution: 'vec2( ' + SIZE.toFixed(1) + ', ' + SIZE.toFixed(1) + ' )'
      },
      uniforms: {
        time: { value: 0 },
        opacity: { value: 1.0 },
        posTex: { value: null },
        indexerTexture: { value: indexerTexture },
        picture: { value: new THREE.TextureLoader().load('https://picsum.photos/200/300', (texture) => { texture.flipY = true; texture.needsUpdate = true }) },
        pointSize: { value: window.devicePixelRatio || 1.0 }
      }
    })

    var points = this.points = new THREE.LineSegments(geometry, material)
    points.matrixAutoUpdate = false
    points.updateMatrix()
    points.frustumCulled = false

    let rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      procSim()
      if (count % 2 === 0) {
        material.uniforms.posTex.value = pongTarget.texture
      } else {
        material.uniforms.posTex.value = pingTarget.texture
      }
      count++
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
