/* dis-eslint-disable */
import * as THREE from 'three'
import GPUComputationRenderer from '../../../ThreeJS/System/GPUComputationRenderer.js'

/* eslint-disable */
import particleVelocityShader from './ParticleShader/velocityShader.frag'
import particlePositionShader from './ParticleShader/positionShader.frag'

import particleVertexShader from './ParticleShader/vertexShader.vert'
import particleFragmentShader from './ParticleShader/fragmentShader.frag'
/* eslint-enable */

export default function () {
  var api = {}

  var WIDTH = 256
  var BOUNDS = 128

  var gpuCompute
  var positionVariable
  var velocityVariable
  var particleShader

  function fillTexture (texture) {
    // var waterMaxHeight = 10
    // function noise(x, y, z) {
    //   var multR = waterMaxHeight
    //   var mult = 0.025
    //   var r = 0
    //   for (var i = 0; i < 15; i++) {
    //     r += multR * simplex.noise(x * mult, y * mult)
    //     multR *= 0.53 + 0.025 * i
    //     mult *= 1.25
    //   }
    //   return r
    // }
    var pixels = texture.image.data
    var p = 0
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        var x = (WIDTH / 2 - i) * 128 / WIDTH
        var y = (WIDTH / 2 - j) * 128 / WIDTH

        pixels[ p + 0 ] = x
        pixels[ p + 1 ] = y

        pixels[ p + 2 ] = 0// noise(Math.sin(x), Math.sin(y), 0.0)
        // pixels[ p + 1 ] = 0
        // pixels[ p + 2 ] = 0
        pixels[ p + 3 ] = 0
        p += 4
      }
    }
  }

  function setupCompute ({ renderer }) {
    gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer)

    var positionTexture = gpuCompute.createTexture()
    fillTexture(positionTexture)
    positionVariable = gpuCompute.addVariable('positionInfo', particlePositionShader, positionTexture)
    positionVariable.material.uniforms.mousePos = {
      value: new THREE.Vector2(0, 0)
    }

    var velocityTexture = gpuCompute.createTexture()
    velocityVariable = gpuCompute.addVariable('velocityInfo', particleVelocityShader, velocityTexture)
    velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(1)
    velocityVariable.wrapS = THREE.ClampToEdgeWrapping
    velocityVariable.wrapT = THREE.ClampToEdgeWrapping
    velocityVariable.material.uniforms.mousePos = {
      value: new THREE.Vector2(0, 0)
    }

    api.setMouse = ({ mX, mY, rect }) => {
      var posMouse = velocityVariable.material.uniforms.mousePos.value
      var velMouse = positionVariable.material.uniforms.mousePos.value
      if (rect && typeof mX !== 'undefined' && typeof mY !== 'undefined') {
        velMouse.x = ((mX - rect.left) / rect.width) * 2 - 1
        velMouse.y = -((mY - rect.top) / rect.height) * 2 + 1
        posMouse.x = ((mX - rect.left) / rect.width) * 2 - 1
        posMouse.y = -((mY - rect.top) / rect.height) * 2 + 1

        velMouse.y *= rect.aspect
        posMouse.y *= rect.aspect
        // console.log(mouse)
      }
    }

    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])
    gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])

    var error = gpuCompute.init()
    if (error !== null) {
      console.error(error)
    }
    return {}
  }

  function setupScene () {
    var material = particleShader = new THREE.ShaderMaterial({
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      uniforms: {
        positionInfo: {
          value: null
        },
        velocityInfo: {
          value: null
        }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader // THREE.ShaderChunk[ 'meshphong_frag' ]
    })

    material.defines.WIDTH = WIDTH.toFixed(1)
    material.defines.BOUNDS = BOUNDS.toFixed(1)

    var geometry = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1)
    var points = new THREE.Points(geometry, material)
    // points = new THREE.Points( geometry, material );
    // points.rotation.x = -Math.PI / 2 * 0;
    points.matrixAutoUpdate = false
    points.updateMatrix()

    return {
      points
    }
  }

  function setup ({ renderer }) {
    return {
      ...setupCompute({ renderer }),
      ...setupScene()
    }
  }
  api.setup = setup

  function render () {
    // @.@
    particleShader.uniforms.positionInfo.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture
    particleShader.uniforms.velocityInfo.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture
    gpuCompute.compute()
  }
  api.render = render

  return api
}
