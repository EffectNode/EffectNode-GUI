<template>
  <div class="">

    <Object3D
    @attach="(v) => { $parent.$emit('add', v) }"
    @detach="(v) => { $parent.$emit('remove', v) }"
    >
      <ConnectionLine
        :scene="scene"
        :key="getConnKey({ conn })" v-for="(conn, iConn) in connections"
        v-if="connections && scene && getConnKey({ conn, index: iConn }) && getOutputPos({ conn }) && getInputPos({ conn })"
        :p1="getOutputPos({ conn })"
        :p2="getInputPos({ conn })"
      >
        {{ getOutputPos({ conn }) }}
        {{ getInputPos({ conn }) }}
      </ConnectionLine>

      <Object3D :key="node.nid + iNode" v-for="(node, iNode) in nodes">
        <EffectBox
          :node="node"
          :nodes="nodes"
          :iNode="iNode"
          :pos="node.pos"
          @attach="(v) => { $nextTick(() => { setupBox({ v, node, nodes, iNode }) }) }"
          @detach="(v) => { cleanUpBox({ v, node, nodes, iNode }) }"
        >
        </EffectBox>
      </Object3D>
    </Object3D>

    <!-- </Scene> -->

  </div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
import _ from 'lodash'
import * as EN from './EffectNodeCore'
import ConnectionLine from './ConnectionLine/ConnectionLine'
import EffectBox from './EffectBox/EffectBox'

import MathEditor from './MathBufferGeometry/MathEditor'
import MathObject from './MathBufferGeometry/MathObject'
import MathPoints from './MathBufferGeometry/MathPoints'
import MathLineSegments from './MathBufferGeometry/MathLineSegments'
import Settings from './Settings/Settings.vue'

import Text3DComp from '../MindScene/Elements/Text/Text3DComp'

/* eslint-disable */
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
// import 'imports-loader?THREE=three!three/examples/js/controls/DragControls.js'
import 'imports-loader?THREE=three!./TrackTrack.js'
import 'imports-loader?THREE=three!./DragConCon.js'

// Bloom Effect
// import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js'
// import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js'
// import 'imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js'
// import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js'
// import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js'
// import 'imports-loader?THREE=three!three/examples/js/shaders/FXAAShader.js'
// import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader.js'
// import 'imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js'
// import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js'
// Bloom Effect

// import 'imports-loader?THREE=three!three/examples/js/controls/TrackballControls.js'
// import 'imports-loader?THREE=three!three/examples/js/controls/EditorControls.js'
/* eslint-enable */

// ENObj

export default {
  props: {
    touchPanControl: {},
    touchSurface: {},
    camera: {},
    root: {},
    scene: {}
  },
  components: {
    Text3DComp,
    ...Bundle,
    ConnectionLine,
    EffectBox,
    MathEditor,
    MathObject,
    MathPoints,
    MathLineSegments,
    Settings
  },
  methods: {
    // setupRoot ({ root }) {
    //   this.root = root
    //   this.$nextTick(() => {
    //     this.$forceUpdate()
    //     this.tryRefreshGLSL()
    //     this.tryRefreshGUI()
    //   })
    // },

    setup () {
      // let dpi = 1.25
      // let isFast = this.detectFast()
      // if (isFast) {
      //   this.useBloom = true
      //   this.$forceUpdate()
      //   // dpi = 2.0
      // }
      // this.setupBloom({ dpi: window.devicePixelRatio })
      // this.scene.background = new THREE.Color(0x374967)
      // this.setupRoot({ root: this.root })
      this.setupTouch()
      this.setupGLSLInterval()
      this.tryRefreshGUI()
      // this.hydrate({ use: 'template1' })
    },
    // detectFast () {
    //   var canvas = document.createElement('canvas')
    //   var gl
    //   var debugInfo
    //   var vendor
    //   var renderer

    //   try {
    //     gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    //   } catch (e) {
    //   }

    //   if (gl) {
    //     debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    //     vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    //     renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    //   }
    //   console.log(debugInfo)
    //   console.log(vendor)
    //   console.log(renderer)

    //   let iOSVer = (function iOSversion () {
    //     if (/iP(hone|od|ad)/.test(navigator.platform)) {
    //       // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    //       var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
    //       return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)]
    //     }
    //   }())

    //   if (
    //     (window.innerWidth >= 1080 && renderer.toUpperCase().indexOf('AMD') !== -1) ||
    //     (window.innerWidth >= 1080 && renderer.toUpperCase().indexOf('NVIDIA') !== -1) ||
    //     (iOSVer && iOSVer[0] >= 11 && devicePixelRatio >= 1.5)
    //   ) {
    //     return true
    //   }
    // },
    setupTouch () {
      var touchSurface = this.touchSurface
      var camera = this.camera
      // var controls = this.controls = new THREE.EditorControls(camera, touchSurface)

      // if (this.trackBallControls) {
      //   this.trackBallControls.dispose()
      // }
      if (this.boxDragControl) {
        this.boxDragControl.removeEventListener('dragstart', this.boxDragStart)
        this.boxDragControl.removeEventListener('drag', this.boxDragging)
        this.boxDragControl.removeEventListener('click', this.boxClickObj)
        this.boxDragControl.removeEventListener('dragend', this.boxDragEnd)
        this.boxDragControl.dispose()
      }
      if (this.inputsDragControl) {
        this.inputsDragControl.removeEventListener('dragstart', this.inputDragStart)
        this.inputsDragControl.removeEventListener('drag', this.inputDragging)
        this.inputsDragControl.removeEventListener('click', this.inputClickObj)
        this.inputsDragControl.removeEventListener('dragend', this.inputDragEnd)
        this.inputsDragControl.dispose()
      }
      if (this.outputDragControl) {
        this.outputDragControl.removeEventListener('dragstart', this.outputDragStart)
        this.outputDragControl.removeEventListener('drag', this.outputDragging)
        this.outputDragControl.removeEventListener('click', this.outputClickObj)
        this.outputDragControl.removeEventListener('dragend', this.outputDragEnd)
        this.outputDragControl.dispose()
      }

      // var trackBallControls = this.trackBallControls = new THREE.TrackballControls(camera, touchSurface)
      // trackBallControls.rotateSpeed = 1.0
      // trackBallControls.zoomSpeed = 3.0
      // trackBallControls.panSpeed = 0.5
      // trackBallControls.noZoom = false
      // trackBallControls.noPan = false
      // trackBallControls.staticMoving = false
      // trackBallControls.dynamicDampingFactor = 0.234

      var boxDragControl = this.boxDragControl = new THREE.DragControls(this.boxMeshes, camera, touchSurface)
      boxDragControl.addEventListener('dragstart', this.boxDragStart)
      boxDragControl.addEventListener('drag', this.boxDragging)
      boxDragControl.addEventListener('click', this.boxClickObj)
      boxDragControl.addEventListener('dragend', this.boxDragEnd)

      var inputsDragControl = this.inputsDragControl = new THREE.DragControls(this.inputMeshes, camera, touchSurface)
      inputsDragControl.addEventListener('dragstart', this.inputDragStart)
      inputsDragControl.addEventListener('drag', this.inputDragging)
      inputsDragControl.addEventListener('click', this.inputClickObj)
      inputsDragControl.addEventListener('dragend', this.inputDragEnd)

      let outputDragControl = this.outputDragControl = new THREE.DragControls(this.outputMeshes, camera, touchSurface)
      outputDragControl.addEventListener('dragstart', this.outputDragStart)
      outputDragControl.addEventListener('drag', this.outputDragging)
      outputDragControl.addEventListener('click', this.outputClickObj)
      outputDragControl.addEventListener('dragend', this.outputDragEnd)
    },
    // setupBloom ({ dpi = 1.25 }) {
    //   let bloomPass = this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85) // 1.0, 9, 0.5, 512)
    //   // bloomPass.renderToScreen = true;

    //   bloomPass.threshold = Number(0.5)
    //   bloomPass.strength = Number(0.5)
    //   bloomPass.radius = Number(0.5)

    //   var effectCopy = new THREE.ShaderPass(THREE.CopyShader)
    //   effectCopy.renderToScreen = true

    //   let renderPass = new THREE.RenderPass(this.scene, this.camera)
    //   this.scene.background = new THREE.Color(0x374967)

    //   let rtParameters = {
    //     minFilter: THREE.LinearFilter,
    //     magFilter: THREE.LinearFilter,
    //     format: THREE.RGBFormat// ,
    //     // stencilBuffer: true
    //   }
    //   // let dpi = window.devicePixelRatio || 1.0
    //   let composer = new THREE.EffectComposer(this.renderer, new THREE.WebGLRenderTarget(window.innerWidth * dpi, window.innerHeight * dpi, rtParameters))
    //   composer.setSize(window.innerWidth * dpi, window.innerHeight * dpi)
    //   window.addEventListener('resize', () => {
    //     composer.setSize(window.innerWidth * dpi, window.innerHeight * dpi)
    //   }, false)

    //   composer.addPass(renderPass)
    //   // composer.addPass(renderMask)
    //   composer.addPass(bloomPass)
    //   // composer.addPass(clearMask)
    //   composer.addPass(effectCopy)

    //   this.composer = composer
    // },
    setupBox ({ v, node, nodes }) {
      let mesh = v.box
      let group3D = v.group
      let output = v.output
      let inputs = v.inputs

      console.table([v])

      //
      mesh.userData = mesh.userData || {}
      mesh.userData.node = node
      mesh.userData.group3D = group3D
      mesh.userData.inputs = inputs
      if (output) {
        mesh.userData.output = output
      }

      // hydrate
      group3D.position.x = node.pos.x
      group3D.position.y = node.pos.y
      group3D.position.z = node.pos.z

      mesh.position.x = node.pos.x
      mesh.position.y = node.pos.y
      mesh.position.z = node.pos.z

      node.pos = {
        ...node.pos
      }

      // boxes draggables
      this.boxMeshes.push(v.box)

      // inputs draggables
      inputs.forEach((eInput, key) => {
        let inputMeshes = this.inputMeshes
        inputMeshes.push(eInput)
        eInput.userData = eInput.userData || {}
        eInput.userData.node = node
        eInput.userData.input = node.inputs[key]
      })

      // outputs draggables
      if (output) {
        this.outputMeshes.push(output)
        output.userData = output.userData || {}
        output.userData.node = node
        output.userData.output = node.output
      }

      this.tryRefreshGUI()
    },
    cleanUpBox ({ v, node, nodes }) {
      let boxMeshes = this.boxMeshes
      boxMeshes.forEach((v, k) => {
        if (v.userData.node && v.userData.node.nid === node.nid) {
          boxMeshes.splice(k, 1)
        }
      })

      let inputs = v.inputs
      inputs.forEach((eInput) => {
        this.inputMeshes.forEach((v, k) => {
          if (v.userData.node && v.userData.node.nid === node.nid) {
            this.inputMeshes.splice(k, 1)
          }
        })
      })

      let outputMeshes = this.outputMeshes
      outputMeshes.forEach((v, k) => {
        if (v.userData.node && v.userData.node.nid === node.nid) {
          outputMeshes.splice(k, 1)
        }
      })
    },

    getInputPos ({ conn }) {
      try {
        let inputMesh = this.inputMeshes.filter((iM) => {
          return iM.userData && iM.userData.input && iM.userData.input.nid === conn.input.nid && iM.userData.input.index === conn.input.index
        })[0]
        if (inputMesh) {
          let loc = inputMesh.position.clone().setFromMatrixPosition(inputMesh.matrixWorld)
          return {
            x: loc.x,
            y: loc.y
          }
        } else {
          return false
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
    getOutputPos ({ conn }) {
      try {
        let outputMesh = this.outputMeshes.filter((iM) => {
          return iM.userData && iM.userData.node && iM.userData.node.nid === conn.output.nid
        })[0]
        // console.log(outputMesh)
        if (outputMesh) {
          let loc = outputMesh.position.clone().setFromMatrixPosition(outputMesh.matrixWorld)
          return {
            x: loc.x,
            y: loc.y
          }
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
    inputDragStart (event) {
      this.touchPanControl.enabled = false
      let mesh = event.object
      mesh.userData.originalPos = new THREE.Vector3(0, 0, 0)
    },
    inputDragEnd (event) {
      this.touchPanControl.enabled = true
      let mesh = event.object
      let tween = new TWEEN.Tween(mesh.position)
        .to(mesh.userData.originalPos, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onStart(() => {
          this.tryRefreshGUI()
        })
        .onUpdate(() => {
          this.tryRefreshGUI()
        })
        .onComplete(() => {
          this.tryRefreshGUI()
        })

      tween.start()

      // console.log('sim sim ling')
      // this.scene.updateMatrixWorld(true)
      this.getNearest({ mesh, compares: this.outputMeshes }).then((nearest) => {
        this.addConnectionInputHand({ hand: mesh, land: nearest })
        EN.saveRoot({ root: this.root })
        this.tryRefreshGUI()
        this.tryRefreshGLSL()
      }, () => {
        this.removeConnectionAtInput({ input: mesh })
        this.tryRefreshGLSL()
      })
    },
    tryRefreshGLSL () {
      this.glsl.needsCompile = true
    },
    tryRefreshGUI () {
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    addConnectionInputHand ({ hand, land }) {
      let inputData = hand.userData.input
      let outputData = land.userData.output
      let iNode = hand.userData.node
      let oNode = land.userData.node
      console.log(inputData, outputData)

      let idx = this.connections.findIndex((conn) => {
        return conn.input.nid === inputData.nid && conn.input.index === inputData.index
      })

      if (idx === -1 && this.checkType({ iNode, oNode, inputData, outputData })) {
        this.connections.push({
          input: inputData,
          output: outputData
        })
        this.tryRefreshGUI()
      }
    },
    getNearest ({ mesh, compares }) {
      return new Promise((resolve, reject) => {
        let found = false
        compares.reduce((accu, item, key) => {
          let distance = item.position.clone().setFromMatrixPosition(item.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          if (distance < 3) {
            accu.push(item)
          }
          return accu
        }, []).sort((itemA, itemB) => {
          let distanceA = itemA.position.clone().setFromMatrixPosition(itemA.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          let distanceB = itemB.position.clone().setFromMatrixPosition(itemB.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          return distanceA > distanceB
        }).forEach((item, key) => {
          let distance = item.position.clone().setFromMatrixPosition(item.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          console.log(distance)

          if (key === 0) {
            found = true
            resolve(item)
          }
        })
        if (!found) {
          reject(new Error('cant find'))
          console.log('cant find', mesh, compares)
        }
      })
    },
    inputDragging () {
      this.tryRefreshGUI()
    },
    inputClickObj (event) {
      this.removeConnectionAtInput({ input: event.object })
    },
    removeConnectionAtInput ({ input }) {
      if (input) {
        console.log(input)
        let conns = this.connections
        conns.reduce((accu, item, key) => {
          let index = conns.findIndex(iConn => (iConn.input.nid === input.userData.input.nid && iConn.input.index === input.userData.input.index))
          if (index !== -1) {
            conns.splice(index, 1)
            accu.push(item)
          }
          return accu
        }, [])
        EN.saveRoot({ root: this.root })
      }
    },
    boxClickObj (event) {
      console.log(event)
      this.$emit('ENObj', event.object)
    },
    boxDragStart (event) {
      this.touchPanControl.enabled = false
      console.log(event)
    },
    boxDragging (event) {
      let mesh = event.object
      let group3D = mesh.userData.group3D
      let node = mesh.userData.node

      node.pos = {}
      node.pos.x = mesh.position.x
      node.pos.y = mesh.position.y
      node.pos.z = mesh.position.z

      // mesh.position.x = node.pos.x
      // mesh.position.y = node.pos.y
      // mesh.position.z = node.pos.z

      group3D.position.x = node.pos.x
      group3D.position.y = node.pos.y
      group3D.position.z = node.pos.z

      this.tryRefreshGUI()
    },
    boxDragEnd (event) {
      this.touchPanControl.enabled = true
      console.log(event)
      let mesh = event.object
      // let group3D = event.object.userData.group3D
      let node = mesh.userData.node

      node.pos.x = mesh.position.x
      node.pos.y = mesh.position.y
      node.pos.z = mesh.position.z

      this.$emit('root', this.root)

      EN.saveRoot({ root: this.root })
      this.tryRefreshGUI()
      this.tryRefreshGLSL()
    },
    outputDragStart (event) {
      this.touchPanControl.enabled = false
      let mesh = event.object
      mesh.userData.originalPos = new THREE.Vector3(0, 0, 0)
    },
    outputDragEnd (event) {
      this.touchPanControl.enabled = true
      let mesh = event.object
      let tween = new TWEEN.Tween(mesh.position)
        .to(mesh.userData.originalPos, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onStart(() => {
          this.tryRefreshGUI()
        })
        .onUpdate(() => {
          this.tryRefreshGUI()
        })
        .onComplete(() => {
          this.tryRefreshGUI()
        })

      tween.start()

      // this.scene.updateMatrixWorld(true)
      this.getNearest({ mesh, compares: this.inputMeshes }).then((nearest) => {
        this.addConnectionOutputHand({ hand: mesh, land: nearest })
        EN.saveRoot({ root: this.root })
        this.tryRefreshGUI()
        this.tryRefreshGLSL()
      }, () => {
        this.removeConnectionAtOutput({ output: mesh })
        this.tryRefreshGLSL()
      })
    },
    checkType ({ iNode, oNode, inputData, outputData }) {
      return (
        (iNode.shaderType === oNode.shaderType)// &&
        // (inputData.type === outputData.type)
      )
    },
    addConnectionOutputHand ({ hand, land }) {
      let outputData = hand.userData.output
      let inputData = land.userData.input
      let iNode = hand.userData.node
      let oNode = land.userData.node

      console.log(inputData, outputData)

      let idx = this.connections.findIndex((conn) => {
        return conn.output.nid === outputData.nid && conn.input.nid === inputData.nid && conn.input.index === inputData.index
      })

      if (idx === -1 && this.checkType({ iNode, oNode, inputData, outputData })) {
        this.connections.push({
          input: inputData,
          output: outputData
        })
        this.tryRefreshGUI()
      }
    },
    removeConnectionAtOutput ({ output }) {
      if (output) {
        console.log(output)

        let conns = this.connections
        conns.forEach((item, key) => {
          if (item.output.nid === output.userData.output.nid || item.input.nid === output.userData.output.nid) {
            conns.splice(key, 1)
          }
        })

        // let conns = this.connections
        // let outputNID = output.userData.output.nid
        // conns.forEach((iConn, key) => {
        //   if (iConn.input.nid === outputNID || iConn.output.nid === outputNID) {
        //     conns.splice(key, 1)
        //   }
        // })

        EN.saveRoot({ root: this.root })
        this.$forceUpdate()
      }
    },
    outputDragging () {
      this.tryRefreshGUI()
    },
    outputClickObj (event) {
      this.removeConnectionAtOutput({ output: event.object })
    },
    setupGLSLInterval () {
      setInterval(() => {
        if (this.glsl.needsCompile && this.root) {
          this.glsl.needsUpdate = false
          this.glsl = {
            ...EN.makeGLSL({ root: this.root }),
            needsUpdate: false
          }
          this.$emit('GLSL', this.glsl)
        }
      }, 100)
    },

    log (v) {
      console.log(v)
    },

    removeCurrentBox ({ nodes, node, iNode, mesh }) {
      // remove mesh box
      let meshIdx = this.boxMeshes.findIndex(iBMesh => (iBMesh === mesh))
      if (meshIdx !== -1) {
        this.boxMeshes.splice(meshIdx, node)
      }

      // remove connections
      let conns = this.connections
      conns.reduce((accu, item, key) => {
        let index = conns.findIndex(iConn => ((iConn.input.nid === node.nid) || (iConn.output.nid === node.nid)))
        if (index !== -1) {
          conns.splice(index, 1)
          accu.push(item)
        }
        return accu
      }, [])

      this.$nextTick(() => {
        conns.forEach((iConn, key) => {
          if (!iConn.input.nid || !iConn.output.nid) {
            conns.splice(key, 1)
          }
        })
      })

      // save
      // EN.saveRoot({ root: this.root })

      // remove data
      nodes.splice(iNode, 1)

      // close popup
      this.ENObj = false
      this.$emit('ENObj', false)
      EN.saveRoot({ root: this.root })
      this.$forceUpdate()
    },

    getConnKey ({ conn, index }) {
      return JSON.stringify(conn) + index
    },

    renderWebGL () {
      TWEEN.update()
    }
  },
  data () {
    return {
      Math,
      refreshToggle: true,
      EN,
      glsl: {
        needsUpdate: false,
        vertexShadedr: false,
        fragmentShader: false
      },
      loading: false,
      // useBloom: false,
      ENObj: false,
      camPos: { x: 0, y: 0, z: 35 },
      boxDragControl: false,
      toucher: false,
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      },
      // renderer: false,
      // scene: false,
      // camera: false,

      EffectNode: false,

      boxMeshes: [],
      inputMeshes: [],
      outputMeshes: []
    }
  },
  watch: {
    ENObj () {
      this.$emit('ENObj', this.ENObj)
    }
  },
  computed: {
    // preview () {
    //   if (this.root && this.root.state && this.root.state.previews) {
    //     return this.root.state.previews.choices[this.root.state.previews.index]
    //   } else {
    //     return false
    //   }
    // },
    connections: {
      get () {
        if (this.root && this.root.state && this.root.state.connections) {
          return this.root.state.connections
        } else {
          return false
        }
      },
      set (v) {
        if (this.root && this.root.state && this.root.state.connections) {
          this.root.state.connections = v
          return v
        }
      }
    },
    nodes () {
      if (this.root && this.root.state && this.root.state.nodes) {
        return this.root.state.nodes
      } else {
        return false
      }
    }
  },
  created () {
    window.addEventListener('resize', _.debounce(() => {
      this.size = {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      }
    }), false)
  },
  async mounted () {
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
    this.setup()
  },
  beforeDestroy () {
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
