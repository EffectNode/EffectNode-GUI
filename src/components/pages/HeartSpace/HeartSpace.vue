<template>
  <div class="full">

    <keep-alive>
      <Renderer
        ref="renderer"
        :size="size"
        @renderer="(v) => { renderer = v }"
        @d-toucher="(v) => { toucher = v; log(v) }"
      >
        <div class="toucher" ref="toucher"></div>

        <transition name="fade">
          <div class="editor-bg-overlay" v-if="currentObj" @click="() => { currentObj = false }"></div>
        </transition>

        <div class="editor-area" v-if="currentObj">
          <div :key="node.nid" v-for="(node, iNode) in nodes" v-if="node.nid === currentObj.userData.node.nid">

            <button v-if="!node.isEntry" @click="removeCurrentBox({ node, nodes, mesh: currentObj, iNode })">Remove me</button>

            <button @click="() => { currentObj = false }">close</button>
            <br />
            <textarea :style="{ color: node.error ? 'red': 'black' }"  cols="50" rows="10" v-model="node.src" @input="updateSRC({ node, iNode, nodes })" />
            <br />
            <span :style="{ color: node.error ? 'red': 'black' }" v-if="node">{{ node.error }} <br /></span>
            node<br/><pre>{{ node }}</pre>
            connections<br/><pre>{{ connections }}</pre>
          </div>

        </div>

        <div class="tools" v-if="!welcome">
          <button @click="addEffectNode({ shaderType: EN.VERTEX_SHADER })">+VertexNode</button>
          <button @click="addEffectNode({ shaderType: EN.FRAGMENT_SHADER })">+FragmentNode</button>
        </div>

        <transition name="fade">
          <div class="welcome-bg-overlay" v-if="welcome" @click="() => { }"></div>
        </transition>
        <div class="welcome-area" v-if="welcome">
          <div  v-if="!loading">
            Welcome to Effect Node~
            <br />
            <label for=""><input type="checkbox" v-model="useBloom">use bloom</label>
            <br />
            <ol>
              <li><button @click="hydrate({ use: 'continue' })">Continue</button></li>
              <li><button @click="hydrate({ use: 'template1' })">Start with Clean Template</button></li>
            </ol>
          </div>
          <div class="full xy-center" v-if="loading">
            Loading....
          </div>
        </div>

        <div class="debug-area" v-if="!currentObj && !welcome">
          <h1>VertexShader</h1>
          <pre>{{ glsl.vertexShader }}</pre>

          <h1>FragmentShader</h1>
          <pre>{{ glsl.fragmentShader }}</pre>
        </div>
        <!-- CREATION -->
        <!--  -->

        <!-- <pre :style="{ display: 'none' }">{{ connections }}</pre> -->

      </Renderer>
    </keep-alive>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="camPos"
      @camera="(v) => { camera = v }"
    />

    <Scene @scene="(v) => { scene = v }">

      <!-- <Object3D pz="10">
        <PointLight />
      </Object3D> -->

      <!-- <Object3D pz="0">
        <Points>
          <SphereBufferGeometry />
          <ShaderMaterial :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
        </Points>
      </Object3D> -->

      <!-- <Object3D>
        <Mesh>
          <PlaneBufferGeometry />
          <MeshBasicMaterial :color="0xffffff" />
        </Mesh>
      </Object3D> -->

      <Object3D>
        <!--  -->
        <!-- Nodes -->

        <ConnectionLine
          :scene="scene"
          :key="getConnKey({ conn })" v-for="(conn) in connections"
          v-if="scene && getOutputPos({ conn }) && getInputPos({ conn })"
          :p1="getOutputPos({ conn })"
          :p2="getInputPos({ conn })"
        >
          {{ getInputPos({ conn }) }}
          {{ getOutputPos({ conn }) }}
        </ConnectionLine>

        <!-- <Object3D > -->
        <EffectBox
          :key="node.nid" v-for="(node, iNode) in nodes"
          :node="node"
          :nodes="nodes"
          :iNode="iNode"

          @attach="(v) => { $nextTick(() => { setupBox({ v, node, nodes, iNode }) }) }"
          @detach="(v) => { cleanUpBox({ v, node, nodes, iNode }) }"
        >
        </EffectBox>
        <!-- </Object3D> -->
      </Object3D>


    </Scene>

  </div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
import _ from 'lodash'
import * as EN from './EffectNodeCore'
import ConnectionLine from './ConnectionLine/ConnectionLine'
import EffectBox from './EffectBox/EffectBox'

/* eslint-disable */
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import 'imports-loader?THREE=three!three/examples/js/controls/DragControls.js'
import 'imports-loader?THREE=three!./TrackTrack.js'

import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/FXAAShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js'

// import 'imports-loader?THREE=three!three/examples/js/controls/TrackballControls.js'
// import 'imports-loader?THREE=three!three/examples/js/controls/EditorControls.js'
/* eslint-enable */

// currentObj

export default {
  components: {
    ...Bundle,
    ConnectionLine,
    EffectBox
  },
  methods: {
    async hydrate ({ use }) {
      this.loading = true
      this.EffectNode = await EN.hydrate({ use: use || 'template1' })
      this.tryRefreshGLSL()
      this.loading = false
      this.welcome = false
    },
    setup () {
      this.setupBloom({ dpi: 1.25 })
      this.setupTouch()
      this.setupGLSLMaker()
    },
    setupTouch () {
      var touchSurface = this.$refs.toucher
      var camera = this.camera
      // var controls = this.controls = new THREE.EditorControls(camera, touchSurface)

      var trackBallControls = this.trackBallControls = new THREE.TrackballControls(camera, touchSurface)
      trackBallControls.rotateSpeed = 1.0
      trackBallControls.zoomSpeed = 3.0
      trackBallControls.panSpeed = 0.5
      trackBallControls.noZoom = false
      trackBallControls.noPan = false
      trackBallControls.staticMoving = false
      trackBallControls.dynamicDampingFactor = 0.234

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
    setupBloom ({ dpi = 1.25 }) {
      let bloomPass = this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85) // 1.0, 9, 0.5, 512)
      // bloomPass.renderToScreen = true;

      bloomPass.threshold = Number(0.95)
      bloomPass.strength = Number(0.5)
      bloomPass.radius = Number(0.5)

      var effectCopy = new THREE.ShaderPass(THREE.CopyShader)
      effectCopy.renderToScreen = true

      let renderPass = new THREE.RenderPass(this.scene, this.camera)
      this.scene.background = new THREE.Color(0x374967)

      let rtParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat// ,
        // stencilBuffer: true
      }
      // let dpi = window.devicePixelRatio || 1.0
      let composer = new THREE.EffectComposer(this.renderer, new THREE.WebGLRenderTarget(window.innerWidth * dpi, window.innerHeight * dpi, rtParameters))
      composer.setSize(window.innerWidth * dpi, window.innerHeight * dpi)
      window.addEventListener('resize', () => {
        composer.setSize(window.innerWidth * dpi, window.innerHeight * dpi)
      }, false)

      composer.addPass(renderPass)
      // composer.addPass(renderMask)
      composer.addPass(bloomPass)
      // composer.addPass(clearMask)
      composer.addPass(effectCopy)

      this.composer = composer
    },
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
      let boxIndex = boxMeshes.findIndex(a => a === v.box)
      if (boxIndex !== -1) {
        boxMeshes.splice(boxIndex, 1)
      }

      let inputs = v.inputs
      inputs.forEach((eInput) => {
        let inputIndex = this.inputMeshes.findIndex(a => a === eInput)
        if (inputIndex !== -1) {
          this.inputMeshes.splice(inputIndex, 1)
        }
      })

      let outputMeshes = this.outputMeshes
      let outputIndex = outputMeshes.findIndex(a => a === v.output)
      if (outputIndex !== -1) {
        outputMeshes.splice(outputIndex, 1)
      }

      // let outputs = v.output
      // outputs.forEach((eOutput) => {
      //    else {
      //     console.error('cant find output meshes')
      //   }
      // })
    },
    getInputPos ({ conn }) {
      let inputMesh = this.inputMeshes.filter((iM) => {
        return iM.userData.input.nid === conn.input.nid && iM.userData.input.index === conn.input.index
      })[0]
      // console.log(inputMesh)
      if (inputMesh) {
        let loc = inputMesh.position.clone().setFromMatrixPosition(inputMesh.matrixWorld)
        return {
          x: loc.x,
          y: loc.y
        }
      } else {
        return false
      }
    },
    getOutputPos ({ conn }) {
      let outputMesh = this.outputMeshes.filter((iM) => {
        return iM.userData.node.nid === conn.output.nid
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
    },
    inputDragStart (event) {
      this.trackBallControls.enabled = false
      let mesh = event.object
      mesh.userData.originalPos = new THREE.Vector3(0, 0, 0)
    },
    inputDragEnd (event) {
      this.trackBallControls.enabled = true
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
        EN.saveRoot({ root: this.EffectNode })
        this.tryRefreshGUI()
        this.tryRefreshGLSL()
      }, () => {
        // this.removeConnectionAtInput({ input: mesh })
        this.tryRefreshGLSL()
      })
    },
    tryRefreshGLSL () {
      this.glsl.needsUpdate = true
    },
    tryRefreshGUI () {
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    addConnectionInputHand ({ hand, land }) {
      let inputData = hand.userData.input
      let outputData = land.userData.output
      console.log(inputData, outputData)

      let idx = this.connections.findIndex((conn) => {
        return conn.output.nid === outputData.nid && conn.input.nid === inputData.nid && conn.input.index === inputData.index
      })

      if (idx === -1) {
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
        EN.saveRoot({ root: this.EffectNode })
      }
    },
    boxClickObj (event) {
      console.log(event)
      this.currentObj = event.object
    },
    boxDragStart (event) {
      this.trackBallControls.enabled = false
      console.log(event)
    },
    boxDragging (event) {
      let mesh = event.object
      let group3D = event.object.userData.group3D
      let node = mesh.userData.node

      node.pos.x = mesh.position.x
      node.pos.y = mesh.position.y
      node.pos.z = mesh.position.z

      mesh.position.x = node.pos.x
      mesh.position.y = node.pos.y
      mesh.position.z = node.pos.z

      group3D.position.x = node.pos.x
      group3D.position.y = node.pos.y
      group3D.position.z = node.pos.z

      this.tryRefreshGUI()
    },
    boxDragEnd (event) {
      this.trackBallControls.enabled = true
      console.log(event)
      let mesh = event.object
      // let group3D = event.object.userData.group3D
      let node = mesh.userData.node

      node.pos.x = mesh.position.x
      node.pos.y = mesh.position.y
      node.pos.z = mesh.position.z

      EN.saveRoot({ root: this.EffectNode })
      this.tryRefreshGUI()
      this.tryRefreshGLSL()
    },
    outputDragStart (event) {
      this.trackBallControls.enabled = false
      let mesh = event.object
      mesh.userData.originalPos = new THREE.Vector3(0, 0, 0)
    },
    outputDragEnd (event) {
      this.trackBallControls.enabled = true
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
        EN.saveRoot({ root: this.EffectNode })
        this.tryRefreshGUI()
        this.tryRefreshGLSL()
      }, () => {
        // this.removeConnectionAtOutput({ output: mesh })
        this.tryRefreshGLSL()
      })
    },
    addConnectionOutputHand ({ hand, land }) {
      let outputData = hand.userData.output
      let inputData = land.userData.input
      console.log(inputData, outputData)

      let idx = this.connections.findIndex((conn) => {
        return conn.output.nid === outputData.nid && conn.input.nid === inputData.nid && conn.input.index === inputData.index
      })

      if (idx === -1) {
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

        EN.saveRoot({ root: this.EffectNode })
        this.$forceUpdate()
      }
    },
    outputDragging () {
      this.tryRefreshGUI()
    },
    outputClickObj (event) {
      this.removeConnectionAtOutput({ output: event.object })
    },
    updateSRC ({ node, nodes, iNode }) {
      try {
        EN.updateSRC({ node, nodes, iNode })
        node.error = null
      } catch (e) {
        node.error = e.message
        // console.error(e)
        console.table([e])
      }
      this.tryRefreshGUI()
      this.tryRefreshGLSL()
    },
    setupGLSLMaker () {
      setInterval(() => {
        if (this.glsl.needsUpdate) {
          this.glsl = {
            ...EN.makeGLSL({ root: this.EffectNode }),
            needsUpdate: false
          }
        }
      }, 333)
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
      EN.saveRoot({ root: this.EffectNode })

      // remove data
      nodes.splice(iNode, 1)

      // close popup
      this.currentObj = false
      EN.saveRoot({ root: this.EffectNode })
      this.$forceUpdate()
    },
    getConnKey ({ conn }) {
      return JSON.stringify(conn)
    },
    addEffectNode ({ shaderType = EN.VERTEX_SHADER }) {
      this.nodes.push(EN.makeNode({
        src:
`float floatSource () {
  return time;
}`,
        isEntry: false,
        shaderType,
        nodePos: { ...this.camera.position, z: 0 }
      }))
      this.tryRefreshGUI()
      this.tryRefreshGLSL()
    },
    renderWebGL () {
      TWEEN.update()
      if (this.trackBallControls) {
        this.trackBallControls.update()
      }
      // this.animatable.time.value = window.performance.now() * 0.001
      if (this.composer && this.useBloom) {
        this.composer.render()
      } else if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  data () {
    return {
      EN,
      glsl: {
        needsUpdate: false,
        vertexShadedr: ``,
        fragmentShader: ``
      },
      loading: false,
      welcome: true,
      useBloom: false,
      currentObj: false,
      camPos: { x: 0, y: 0, z: 25 },
      boxDragControl: false,
      toucher: false,
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      },
      renderer: false,
      scene: false,
      camera: false,
      EffectNode: false,
      boxMeshes: [],
      inputMeshes: [],
      outputMeshes: []
    }
  },
  watch: {
  },
  computed: {
    connections: {
      get () {
        if (this.EffectNode && this.EffectNode.state && this.EffectNode.state.connections) {
          return this.EffectNode.state.connections
        } else {
          return []
        }
      },
      set (v) {
        if (this.EffectNode && this.EffectNode.state && this.EffectNode.state.connections) {
          this.EffectNode.state.connections = v
          return v
        }
      }
    },
    nodes () {
      if (this.EffectNode && this.EffectNode.state && this.EffectNode.state.nodes) {
        return this.EffectNode.state.nodes
      } else {
        return []
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

    setTimeout(() => {
      // this.hydrate({ use: 'continue' })
    }, 2000)

    this.setup()
  }
}
</script>

<style scoped>
.full{
  color: white;
  width: 100%;
  height: 100%;
}
.toucher{
  /* border: red solid 1px; */
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

.editor-area{
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 16px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
  max-height: 100%;
}

.welcome-bg-overlay,
.editor-bg-overlay{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.welcome-area{
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 16px;
  width: calc(100% - 20% * 2);
  height: calc(100% - 20% * 2);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
  max-height: 100%;
  background-color: rgba(255,255,255,0.1);
}

.debug-area{
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 12px;
  max-width: 50%;
  max-height: 80%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.debug-area pre{
  white-space: pre-wrap;
}

textarea{
  font-size: 16px;
  max-width: 100%;
}

.xy-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tools{
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.0s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
