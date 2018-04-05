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

        <div class="content-clicker" v-if="currentObj" @click="() => { currentObj = false }"></div>
        <div class="content" v-if="currentObj">
          <label for=""><input type="checkbox" v-model="useBloom">use bloom</label>

          <div :key="node.nid" v-for="(node, iNode) in nodes" v-if="node.nid === currentObj.userData.node.nid">
            <button @click="() => { currentObj = false }">close</button>
            <br />
            <textarea :style="{ color: node.error ? 'red': 'black' }"  cols="50" rows="10" v-model="node.src" @input="updateSRC({ node, iNode, nodes })" />
            <br />
            <span :style="{ color: node.error ? 'red': 'black' }" v-if="node">{{ node.error }} <br /></span>
            <pre>{{ connections }}</pre>
          </div>
        </div>



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
          :key="conn.outputNID" v-for="(conn) in connections"
          v-if="scene && getOutputPos({ conn }) && getInputPos({ conn })"
          :p1="getOutputPos({ conn })"
          :p2="getInputPos({ conn })"
        >
          {{ getInputPos({ conn }) }}
          {{ getOutputPos({ conn }) }}
        </ConnectionLine>

        <Object3D :key="node.compiledFnName" v-for="(node, iNode) in nodes">

          <!-- <ConnectionLine :p1="{ x: 0, y: 0 }" :p2="getPos({ nodes, iNode })">
          </ConnectionLine> -->

          <EffectBox
            :node="node"
            :nodes="nodes"
            :iNode="iNode"

            @attach="(v) => { setupBox({ v, node, nodes, iNode }) }"
            @detach="(v) => { cleanUpBox({ v, node, nods, iNode }) }"
          >
          </EffectBox>

        </Object3D>
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
    setup () {
      this.setupBloom()
      this.setupTouch()
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
    },
    setupBloom () {
      let bloomPass = this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85) // 1.0, 9, 0.5, 512)
      // bloomPass.renderToScreen = true;

      bloomPass.threshold = Number(0.85)
      bloomPass.strength = Number(1.0)
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
      let dpi = window.devicePixelRatio || 1.0
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
      mesh.userData.output = output

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
      this.outputMeshes.push(output)
      output.userData = output.userData || {}
      output.userData.node = node
      output.userData.output = node.output

      this.tryRefresh()
    },
    cleanUpBox ({ v, node, nodes }) {
      let boxMeshes = this.boxMeshes
      let boxIndex = boxMeshes.findIndex(a => a === v.box)
      if (boxIndex !== -1) {
        boxMeshes.splice(boxIndex, 1)
      } else {
        console.error('cant find box meshes')
      }

      let inputs = v.inputs
      inputs.forEach((eInput) => {
        let inputMeshes = this.inputMeshes
        let inputIndex = inputMeshes.findIndex(a => a === eInput)
        if (inputIndex !== -1) {
          inputMeshes.splice(inputIndex, 1)
        } else {
          console.error('cant find input meshes')
        }
      })

      let outputs = v.outputs
      outputs.forEach((eOutput) => {
        let outputMeshes = this.outputMeshes
        let outputIndex = outputMeshes.findIndex(a => a === eOutput)
        if (outputIndex !== -1) {
          outputMeshes.splice(outputIndex, 1)
        } else {
          console.error('cant find output meshes')
        }
      })
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
      mesh.userData.originalPos = new THREE.Vector3().copy(mesh.position)
    },
    inputDragEnd (event) {
      this.trackBallControls.enabled = true
      let mesh = event.object
      new TWEEN.Tween(mesh.position)
        .to(mesh.userData.originalPos, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onStart(() => {
          this.tryRefresh()
        })
        .onUpdate(() => {
          this.tryRefresh()
        })
        .onComplete(() => {
          this.tryRefresh()
        })
        .start()

      // console.log('sim sim ling')
      this.scene.updateMatrixWorld(true)
      this.getNearest({ mesh, compares: this.outputMeshes }).then((nearest) => {
        this.addConnectionInputHand({ hand: mesh, land: nearest })
        EN.saveRoot({ root: this.EffectNode })
        this.tryRefresh()
      }, () => {
        this.removeConnectionAtInput({ input: mesh })
      })
    },
    addConnectionInputHand ({ hand, land }) {
      let inputData = hand.userData.input
      let outputData = land.userData.output
      console.log(inputData, outputData)

      this.connections.push({
        input: inputData,
        output: outputData
      })
      this.tryRefresh()
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
      this.tryRefresh()
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

      this.tryRefresh()
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
      this.tryRefresh()
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
      this.tryRefresh()
    },
    tryRefresh () {
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    generateGLSL () {
      // EN.generateGLSL(this.EffectNode)
    },
    log (v) {
      console.log(v)
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
      useBloom: window.innerWidth >= 767,
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
    connections () {
      if (this.EffectNode && this.EffectNode.state && this.EffectNode.state.connections) {
        return this.EffectNode.state.connections
      } else {
        return []
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

    this.setup()

    this.EffectNode = await EN.hydrate()
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
.content{
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 16px;
}
.content-clicker{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
textarea{
  font-size: 16px;
  max-width: 100%;
}
</style>
