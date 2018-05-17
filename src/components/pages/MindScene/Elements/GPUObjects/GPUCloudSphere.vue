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
    renderer: {},
    pingPongShader: {
      default () {
        return require('./GPUCloudSphere/sim/pingpong.frag')
      }
    }
  },
  data () {
    return {
      init () {},
      gpuCompute: false,
      getTexture: () => {},
      runSim: () => {},
      updateMouse: () => {}
    }
  },
  watch: {
    pingPongShader () {
      this.init({ pingPongShader: this.pingPongShader })
    }
  },
  mounted () {
    var count = 0
    let SIZE = window.innerWidth >= 500 ? 256 : 192

    var gpuCompute = new GPUComputationRenderer(SIZE, SIZE, this.renderer)

    var indexerTexture = gpuCompute.createTexture()
    prepIndexer(indexerTexture, SIZE)

    var pingTarget = gpuCompute.createRenderTarget()
    var pongTarget = gpuCompute.createRenderTarget()

    let pingMat, pongMat

    let pingPongShader = this.pingPongShader

    let displayV = require('./GPUCloudSphere/show/display.vert')
    let displayF = require('./GPUCloudSphere/show/display.frag')

    let init = ({ pingPongShader }) => {
      let lastTap = 0

      if (pingMat) {
        lastTap = pingMat.uniforms.tapCount.value
      }

      pingMat = gpuCompute.createShaderMaterial(pingPongShader, {
        tapCount: { value: lastTap || 0 },
        lastTexture: { value: null },
        indexerTexture: { value: indexerTexture },
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      })
      pongMat = gpuCompute.createShaderMaterial(pingPongShader, {
        tapCount: { value: lastTap || 0 },
        lastTexture: { value: null },
        indexerTexture: { value: indexerTexture },
        time: { value: 0 },
        mouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      })
    }
    this.init = init
    init({ pingPongShader })

    var mouser = () => {
      window.addEventListener('mousemove', (evt) => {
        let x = (evt.pageX - window.innerWidth * 0.5) / window.innerWidth
        let y = (evt.pageY - window.innerHeight * 0.5) / window.innerHeight
        let z = 0.0
        y *= -1

        pingMat.uniforms.mouse.value.copy({ x, y, z })
        pongMat.uniforms.mouse.value.copy({ x, y, z })
      }, false)

      var isClick = false
      this.touchSurface.addEventListener('click', () => {
        pingMat.uniforms.tapCount.value++
        pongMat.uniforms.tapCount.value++
      }, false)
      this.touchSurface.addEventListener('touchstart', (evt) => {
        isClick = true
        setTimeout(() => {
          isClick = false
        }, 111)
      }, false)
      this.touchSurface.addEventListener('touchend', (evt) => {
        if (isClick) {
          pingMat.uniforms.tapCount.value++
          pongMat.uniforms.tapCount.value++
        }
      }, false)
      this.touchSurface.addEventListener('touchmove', (evt) => {
        evt.preventDefault()
        let x = (evt.touches[0].pageX - window.innerWidth * 0.5) / window.innerWidth
        let y = (evt.touches[0].pageY - window.innerHeight * 0.5) / window.innerHeight
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
      depthWrite: false,
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
        picture: { value: new THREE.TextureLoader().load('https://picsum.photos/256/256', (texture) => { texture.flipY = true; texture.needsUpdate = true }) },
        pointSize: { value: window.devicePixelRatio || 1.0 }
      }
    })

    var points = this.points = new THREE.Points(geometry, material)
    // var points = this.points = new THREE.Points(geometry, material)
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
