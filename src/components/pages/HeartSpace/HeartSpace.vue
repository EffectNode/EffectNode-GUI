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

        <!-- <transition name="slide-in-left"> -->
        <div class="editor-area" v-if="currentObj">

          <div :key="node.nid" v-for="(node, iNode) in nodes" v-if="node.nid === currentObj.userData.node.nid">

            <button v-if="!node.isEntry" @click="removeCurrentBox({ node, nodes, mesh: currentObj, iNode })">Remove me</button>

            <button @click="() => { currentObj = false }">close</button>
            <br />
            <span :style="{ color: node.error ? 'red': 'black' }" v-if="node">{{ node.error }} <br /></span>
            <br />
            <textarea class="glsl-edit" :style="{ color: node.error ? 'red': 'black' }"  cols="50" rows="10" v-model="node.src" @input="updateSRC({ node, iNode, nodes })" />
            <!-- node<br/><pre>{{ node }}</pre>
            connections<br/><pre>{{ connections }}</pre> -->
            <h1>VertexShader</h1>
            <pre>{{ glsl.vertexShader }}</pre>
            <h1>FragmentShader</h1>
            <pre>{{ glsl.fragmentShader }}</pre>
          </div>

        </div>
        <!-- </transition> -->

        <div class="tools" v-if="!welcome && !currentObj">
          <button @click="addEffectNode({ shaderType: EN.VERTEX_SHADER })">+VertexNode</button>
          <button @click="addEffectNode({ shaderType: EN.FRAGMENT_SHADER })">+FragmentNode</button>
          <br />
          <input v-if="EffectNode && EffectNode.variations" v-model="variationIndex" type="range" min="0" :max="EffectNode.variations.length - 1" step="1">

          <!-- <select :value="EffectNode.variations.length - 1" @input="loadVar({ iVar })">
            <option :key="iVar" v-for="(eVar, iVar) in EffectNode.variations">
              {{ eVar.date }}
            </option>
          </select> -->

          <button @click="makeVar()">Make Variation</button>
          <button @click="EN.exportRoot({ root: EffectNode })">Export Proj</button>
          <input type="file" @change="restoreProject">
          <br />

          Glowing funz: <input type="checkbox" v-model="useBloom" />
          <select v-model="useModel">
            <option value="rabbit">Rabbit</option>
            <option value="ball">Ball</option>
          </select>
          uImage1 <input accept="image/*" type="file" @change="loadImage1">
          <!-- Image2 <input accept="image/*" type="file" @change="loadImage2">
          Image3 <input accept="image/*" type="file" @change="loadImage3"> -->
        </div>

        <!-- <transition name="fade"> -->
          <div class="welcome-bg-overlay" v-if="welcome" @click="() => { }"></div>
        <!-- </transition> -->
        <div class="welcome-area" v-if="welcome">
          <div  v-if="!loading">
            Welcome to Effect Node~
            <br />
            <!-- <label for=""><input type="checkbox" v-model="useBloom">use bloom</label> -->
            <br />
            <ol>
              <!-- <li>Load Save: <input type="file" @schange="(evt) => { restoreProject(evt); welcome = false }"></li> -->
              <li><button @click="hydrate({ use: 'continue' })">Continue</button></li>
              <li><button @click="hydrate({ use: 'template1' })">Clean and Start with Clean Template</button></li>
              <!-- <li><button @click="hydrate({ use: 'template2' })">Clean and Start with Template 2</button></li> -->
              <!-- <li><button @click="hydrate({ use: 'template3' })">Clean and Start with Template 3</button></li> -->
              <!-- <li><button @click="hydrate({ use: 'template4' })">Clean and Start with Template 4</button></li> -->
            </ol>
          </div>
          <div class="full xy-center" v-if="loading">
            Loading....
          </div>
        </div>

        <div class="debug-area" v-if="!currentObj">
          <Settings v-if="this.EffectNode && this.EffectNode.state.previews" :previews="this.EffectNode.state.previews" />
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
      :far="10000"
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
          <ShaderMaterial :vs="demo.vs" :fs="demo.fs" :uniforms="uniforms" />
        </Points>
      </Object3D> -->

      <!-- <Object3D>
        <Mesh>
          <PlaneBufferGeometry />
          <MeshBasicMaterial :color="0xffffff" />
        </Mesh>
      </Object3D> -->

      <Object3D>
        <!-- Nodes -->

        <ConnectionLine
          :scene="scene"
          :key="getConnKey({ conn })" v-for="(conn) in connections"
          v-if="scene && getOutputPos({ conn }) && getInputPos({ conn })"
          :p1="getOutputPos({ conn })"
          :p2="getInputPos({ conn })"
        >
        </ConnectionLine>

        <Object3D :key="node.nid" v-for="(node, iNode) in nodes">
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

      <Object3D pz="-10">

        <Rabbit v-if="!preview && useModel === 'rabbit'" :transparent="true" :glsl="glsl" :uniforms="uniforms" />
        <Points v-if="!preview && useModel === 'ball'">
          <!-- <TorusKnotBufferGeometry radius="10" tube="1" tubularSegments="350" radialSegments="40" /> -->
          <SphereBufferGeometry :r="10" :nx="200" :ny="200" />
          <ShaderMaterial :transparent="true" :vs="glsl.vertexShader" :fs="glsl.fragmentShader" :uniforms="uniforms" />
        </Points>

        <!-- <MathObject
          v-if="preview"
          :objType="preview.objType"
          :geoType="preview.geoType"
          :vs="glsl.vertexShader"
          :fs="glsl.fragmentShader"
          :uniforms="uniforms"
          :attributes="preview.attributes"
        /> -->
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

import MathEditor from './MathBufferGeometry/MathEditor'
import MathObject from './MathBufferGeometry/MathObject'
import MathPoints from './MathBufferGeometry/MathPoints'
import MathLineSegments from './MathBufferGeometry/MathLineSegments'
import Settings from './Settings/Settings.vue'

import Rabbit from './Objects/Rabbit.vue'

/* eslint-disable */
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
// import 'imports-loader?THREE=three!three/examples/js/controls/DragControls.js'
import 'imports-loader?THREE=three!./TrackTrack.js'
import 'imports-loader?THREE=three!./DragConCon.js'

// Bloom Effect
import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/FXAAShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js'
// Bloom Effect

// import 'imports-loader?THREE=three!three/examples/js/controls/TrackballControls.js'
// import 'imports-loader?THREE=three!three/examples/js/controls/EditorControls.js'
/* eslint-enable */

// currentObj

export default {
  components: {
    ...Bundle,
    ConnectionLine,
    EffectBox,
    MathEditor,
    MathObject,
    MathPoints,
    MathLineSegments,
    Settings,
    Rabbit
  },
  methods: {
    async hydrate ({ use }) {
      this.loading = true
      this.EffectNode = await EN.hydrate({ use: use || 'template1' })
      this.loading = false
      this.welcome = false
      this.$nextTick(() => {
        this.variationIndex = this.EffectNode.variations.length - 1
        this.tryRefreshGLSL()
        this.tryRefreshGUI()
      })
    },
    loadImage1 (evt) {
      this.loadImageTo({ to: 'uImage1', evt })
    },
    // loadImage2 (evt) {
    //   this.loadImageTo({ to: 'uImage2', evt })
    // },
    // loadImage3 (evt) {
    //   this.loadImageTo({ to: 'uImage3', evt })
    // },
    loadImageTo ({ to, evt }) {
      let file = evt.target.files[0]
      if (file) {
        let reader = new FileReader()
        reader.onload = () => {
          this.uniforms[to].value = new THREE.TextureLoader().load(reader.result)
          console.log(this.uniforms[to].value)
        }
        reader.readAsDataURL(file)
      }
    },
    setup () {
      // let dpi = 1.25
      // let isFast = this.detectFast()
      // if (isFast) {
      //   this.useBloom = true
      //   this.$forceUpdate()
      //   // dpi = 2.0
      // }

      this.setupBloom({ dpi: window.devicePixelRatio })
      this.scene.background = new THREE.Color(0x374967)

      this.setupTouch()
      this.setupGLSLMaker()
      this.hydrate({ use: 'template2' })
    },
    detectFast () {
      var canvas = document.createElement('canvas')
      var gl
      var debugInfo
      var vendor
      var renderer

      try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      } catch (e) {
      }

      if (gl) {
        debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
      console.log(debugInfo)
      console.log(vendor)
      console.log(renderer)

      let iOSVer = (function iOSversion () {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
          // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
          var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
          return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)]
        }
      }())

      if (
        (window.innerWidth >= 1080 && renderer.toUpperCase().indexOf('AMD') !== -1) ||
        (window.innerWidth >= 1080 && renderer.toUpperCase().indexOf('NVIDIA') !== -1) ||
        (iOSVer && iOSVer[0] >= 11 && devicePixelRatio >= 1.5)
      ) {
        return true
      }
    },
    setupTouch () {
      var touchSurface = this.$refs.toucher
      var camera = this.camera
      // var controls = this.controls = new THREE.EditorControls(camera, touchSurface)

      // if (this.trackBallControls) {
      //   this.trackBallControls.dispose()
      // }
      // if (this.boxDragControl) {
      //   this.boxDragControl.removeEventListener('dragstart', this.boxDragStart)
      //   this.boxDragControl.removeEventListener('drag', this.boxDragging)
      //   this.boxDragControl.removeEventListener('click', this.boxClickObj)
      //   this.boxDragControl.removeEventListener('dragend', this.boxDragEnd)
      //   this.boxDragControl.dispose()
      // }
      // if (this.inputsDragControl) {
      //   this.inputsDragControl.removeEventListener('dragstart', this.inputDragStart)
      //   this.inputsDragControl.removeEventListener('drag', this.inputDragging)
      //   this.inputsDragControl.removeEventListener('click', this.inputClickObj)
      //   this.inputsDragControl.removeEventListener('dragend', this.inputDragEnd)
      //   this.inputsDragControl.dispose()
      // }
      // if (this.outputDragControl) {
      //   this.outputDragControl.removeEventListener('dragstart', this.outputDragStart)
      //   this.outputDragControl.removeEventListener('drag', this.outputDragging)
      //   this.outputDragControl.removeEventListener('click', this.outputClickObj)
      //   this.outputDragControl.removeEventListener('dragend', this.outputDragEnd)
      //   this.outputDragControl.dispose()
      // }

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

      bloomPass.threshold = Number(0.5)
      bloomPass.strength = Number(0.5)
      bloomPass.radius = Number(0.5)
      bloomPass.renderToScreen = true

      // var effectCopy = new THREE.ShaderPass(THREE.CopyShader)
      // effectCopy.renderToScreen = true

      let renderPass = new THREE.RenderPass(this.scene, this.camera)
      // this.scene.background = new THREE.Color(0x374967)

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
      // composer.addPass(effectCopy)

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
    restoreProject (evt) {
      EN
        .readTextFile({
          file: evt.target.files[0]
        })
        .then(EN.JSON2OBJ)
        .then((o) => {
          this.EffectNode = o
          this.tryRefreshGUI()
          this.tryRefreshGLSL()
          this.variationIndex = o.variations.length - 1
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
    loadVar ({ fromVar, toVar }) {
      this.$nextTick(() => {
        if (fromVar === this.EffectNode.variations - 1) {
          this.makeVar()
        }

        let history = EN.loadVariation({ root: this.EffectNode, index: toVar })
        this.EffectNode.state = history

        this.$forceUpdate()
        this.tryRefreshGUI()
        this.tryRefreshGLSL()
      })
    },
    makeVar () {
      if (this.EffectNode.variations.length === 0) {
        EN.makeVariation({ root: this.EffectNode })
        this.variationIndex++
      }
      EN.makeVariation({ root: this.EffectNode })
      this.variationIndex++
      EN.saveRoot({ root: this.EffectNode })
      this.$forceUpdate()
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
        if (this.glsl.needsCompile && this.EffectNode) {
          this.glsl.needsUpdate = false
          this.glsl = {
            ...EN.makeGLSL({ root: this.EffectNode }),
            needsUpdate: false
          }
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
      if (shaderType === EN.VERTEX_SHADER) {
        this.nodes.push(EN.makeNode({
          src:
`float floatModifier (float i1) {
  return sin(time * 3.0 + i1 + position.z) * 3.0;
}`,
          isEntry: false,
          shaderType,
          nodePos: { ...this.camera.position, y: this.camera.position.y + 12, z: 0 }
        }))
      } else {
        this.nodes.push(EN.makeNode({
          src:
`float floatModifier (float i1) {
  return sin(time * 3.0 + i1) * 3.0;
}`,
          isEntry: false,
          shaderType,
          nodePos: { ...this.camera.position, y: this.camera.position.y + 12, z: 0 }
        }))
      }

      this.tryRefreshGUI()
      this.tryRefreshGLSL()
    },
    renderWebGL () {
      TWEEN.update()
      if (this.trackBallControls) {
        this.trackBallControls.update()
      }

      this.uniforms.time.value = window.performance.now() * 0.001

      if (this.composer && this.useBloom) {
        this.composer.render()
      } else if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  data () {
    return {
      useModel: 'rabbit',
      uniforms: {
        uImage1: { value: new THREE.TextureLoader().load(require('./Objects/star.png')) },
        uImage2: { value: new THREE.TextureLoader() },
        uImage3: { value: new THREE.TextureLoader() },
        time: { value: 0 }
      },
      variationIndex: null,
      Math,
      refreshToggle: true,
      EN,
      glsl: {
        needsUpdate: false,
        vertexShadedr: false,
        fragmentShader: false
      },
      loading: false,
      welcome: true,
      useBloom: true,
      currentObj: false,
      camPos: { x: 0, y: 0, z: 35 },
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
    variationIndex (toVar, fromVar) {
      if (fromVar !== null) {
        this.loadVar({ toVar, fromVar })
      }
    }
  },
  computed: {
    preview () {
      if (this.EffectNode && this.EffectNode.state && this.EffectNode.state.previews) {
        return this.EffectNode.state.previews.choices[this.EffectNode.state.previews.index]
      } else {
        return false
      }
    },
    connections: {
      get () {
        if (this.EffectNode && this.EffectNode.state && this.EffectNode.state.connections) {
          return this.EffectNode.state.connections
        } else {
          return false
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

  background-color: rgba(255,255,255,0.2);
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
  left: 0px;
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

.slide-in-left-enter-active, .slide-in-left-leave-active {
  transform: translateX(0%);
  transition: transform 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.slide-in-left-enter, .slide-in-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-100%);
}

.glsl-edit{
  width: 100%;
  max-width: 768px;
}
</style>
