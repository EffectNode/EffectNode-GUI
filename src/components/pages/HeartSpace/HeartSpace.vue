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

        <div class="content">
          <div :key="node.nid" v-for="(node, iNode) in nodes">
            <pre>{{ nodes[iNode].from }}</pre>
            <pre>{{ nodes[iNode].to }}</pre>
            <span v-if="node">{{ node.error }} <br /></span>
            <textarea :style="{ color: node.error ? 'red': 'black' }"  cols="50" rows="10" v-model="node.src" @input="updateSRC({ node, iNode, nodes })" />
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
        <!--  -->
        <!-- Nodes -->
        <Object3D :key="node.compiledFnName" v-for="(node, iNode) in nodes">

          <ConnectionLine :p1="{ x: 0, y: 0 }" :p2="getPos({ nodes, iNode })">
          </ConnectionLine>

          <Mesh @element="(v) => { setNodeUserData({ mesh: v, node }) }" @attach="(v) => { draggables.push(v); }"  @detach="(v) => { draggables.splice(draggables.findIndex(a => a === v), 1); }">
            <BoxBufferGeometry />
            <ShaderMaterial :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
          </Mesh>

        </Object3D>
      </Object3D>



    </Scene>

  </div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
import _ from 'lodash'
import * as EN from './effectNode'
import ConnectionLine from './ConnectionLine/ConnectionLine'

/* eslint-disable */
import * as THREE from 'three'
import 'imports-loader?THREE=three!three/examples/js/controls/DragControls.js'
import 'imports-loader?THREE=three!./TrackTrack.js'

// import 'imports-loader?THREE=three!three/examples/js/controls/TrackballControls.js'
// import 'imports-loader?THREE=three!three/examples/js/controls/EditorControls.js'
/* eslint-enable */

export default {
  components: {
    ...Bundle,
    ConnectionLine
  },
  methods: {
    setup () {
      var touchSurface = this.$refs.toucher
      var objects = this.draggables
      var camera = this.camera
      // var controls = this.controls = new THREE.EditorControls(camera, touchSurface)

      var controls = this.controls = new THREE.TrackballControls(camera, touchSurface)
      controls.rotateSpeed = 1.0
      controls.zoomSpeed = 3.0
      controls.panSpeed = 1.8
      controls.noZoom = false
      controls.noPan = false
      controls.staticMoving = true
      controls.dynamicDampingFactor = 0.3

      var dragControls = this.dragControls = new THREE.DragControls(objects, camera, touchSurface)

      dragControls.addEventListener('dragstart', this.dragStart)
      dragControls.addEventListener('drag', this.dragING)
      dragControls.addEventListener('dragend', this.dragEnd)
    },
    getPos ({ nodes, iNode }) {
      return nodes[iNode].pos
    },
    dragStart (event) {
      this.controls.enabled = false
      console.log(event)
    },
    dragING (event) {
      let mesh = event.object
      let node = mesh.userData.node

      node.pos.x = mesh.position.x
      node.pos.y = mesh.position.y
      node.pos.z = mesh.position.z
    },
    dragEnd (event) {
      this.controls.enabled = true
      console.log(event)
      let mesh = event.object
      let node = mesh.userData.node

      node.pos.x = mesh.position.x
      node.pos.y = mesh.position.y
      node.pos.z = mesh.position.z

      EN.saveNode({ node })
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
    setNodeUserData ({ mesh, node }) {
      mesh.userData = mesh.userData || {}
      mesh.userData.node = node

      mesh.position.x = node.pos.x
      mesh.position.y = node.pos.y
      mesh.position.z = node.pos.z
    },
    generateGLSL () {
      // EN.generateGLSL(this.EffectNode)
    },
    log (v) {
      console.log(v)
    },
    renderWebGL () {
      if (this.controls) {
        this.controls.update()
      }
      this.animatable.time.value = window.performance.now() * 0.001
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  data () {
    return {
      world: false,
      camPos: { x: 0, y: 0, z: 25 },
      dragControls: false,
      animatable: {
        time: { value: 0 }
      },
      toucher: false,
      demo: {
        vs: require('./Shaders/Simple/vs.vert'),
        fs: require('./Shaders/Simple/fs.frag')
      },
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      },
      renderer: false,
      scene: false,
      camera: false,
      EffectNode: false,
      draggables: []
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
  mounted () {
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)

    this.setup()

    EN.hydrate().then((v) => {
      this.EffectNode = v
    })
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.toucher{
  border: red solid 1px;
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
}
</style>
