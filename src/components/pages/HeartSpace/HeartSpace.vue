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
            <pre>{{ node.from }}</pre>
            <pre>{{ node.to }}</pre>
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

      <Object3D>
        <Mesh>
          <PlaneBufferGeometry />
          <MeshBasicMaterial :color="0xffffff" />
        </Mesh>
      </Object3D>

      <Object3D>
        <!--  -->
        <!-- Nodes -->
        <Object3D :key="node.compiledFnName" v-for="(node, iNode) in nodes">

          <ConnectionLine :p1="{ x: 0, y: 0 }" :p2="getPos({ nodes, iNode })">
          </ConnectionLine>

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
      var objects = this.boxMeshes
      var camera = this.camera
      // var controls = this.controls = new THREE.EditorControls(camera, touchSurface)

      var trackBallControls = this.trackBallControls = new THREE.TrackballControls(camera, touchSurface)
      trackBallControls.rotateSpeed = 1.0
      trackBallControls.zoomSpeed = 3.0
      trackBallControls.panSpeed = 1.2
      trackBallControls.noZoom = false
      trackBallControls.noPan = false
      trackBallControls.staticMoving = true
      trackBallControls.dynamicDampingFactor = 0.3

      var boxDragControl = this.boxDragControl = new THREE.DragControls(objects, camera, touchSurface)

      boxDragControl.addEventListener('dragstart', this.dragStart)
      boxDragControl.addEventListener('drag', this.dragING)
      boxDragControl.addEventListener('click', this.clickObj)
      boxDragControl.addEventListener('dragend', this.dragEnd)
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
      this.boxMeshes.push(v.box)

      let mesh = v.box
      let group3D = v.group
      let inputs = v.inputs
      let output = v.output

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
    },
    cleanUpBox ({ v, node, nodes }) {
      let boxMeshes = this.boxMeshes
      boxMeshes.splice(boxMeshes.findIndex(a => a === v.box), 1)
    },
    getPos ({ nodes, iNode }) {
      return nodes[iNode].pos
    },
    clickObj (event) {
      console.log(event)
      this.currentObj = event.object
    },
    dragStart (event) {
      this.trackBallControls.enabled = false
      console.log(event)
    },
    dragING (event) {
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
    },
    dragEnd (event) {
      this.trackBallControls.enabled = true
      console.log(event)
      let mesh = event.object
      // let group3D = event.object.userData.group3D
      let node = mesh.userData.node

      node.pos.x = mesh.position.x
      node.pos.y = mesh.position.y
      node.pos.z = mesh.position.z

      EN.saveNode({ node, nodes: this.nodes })
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
