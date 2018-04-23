<template>
<div class="full">

  <div class="full toucher" ref="touch-surface"></div>
  <div v-if="current.data && mode === 'SceneEdit'" class="full closer" @click="current.data = false; current.mesh = false;"></div>
  <div class="editor">
    <div v-if="current.data && mode === 'SceneEdit'" >
      <button @click="mode = 'EffectNode'">EffectNode</button>
      <TextEdit v-if="current.data && current.data.arr === 'words'" :info="current.data" :current="current" :root="root" />
    </div>
  </div>

  <ENEditor
    class="editor"
    v-if="current.data && mode === 'EffectNode' && scene"
    :root="current.data.effect"
    :ENObj="ENObj"
    :camera="camera"
    :glsl="glsl"
    @refresh-glsl="refreshGLSL"
    @refresh-gui="refreshGUI"
    @remove-box="removeBox"
    @close="() => {
      mode = 'SceneEdit';
      current.data = false;
      current.mesh = false;
    }"
    @root="(v) => {
      current.data.effect = v
      refreshGUI()
    }"
    @ENObj="(v) => {
      ENObj = v
    }"
  />

  <Scene @scene="(v) => { $emit('scene', v); scene = v }">


    <Object3D pz="-5">
      <TextOutlet ref="text-outlet" v-if="root" :root="root" :group="dragGroup" />
    </Object3D>

    <Heart
      class="effect-node"
      v-if="touchSurface && mode === 'EffectNode' && current.data && current.data.effect && touchPanControl"
      :touchPanControl="touchPanControl"
      :root="current.data.effect"
      :touchSurface="touchSurface"
      :camera="camera"
      :scene="scene"
      ref="heart"

      @ENObj="(v) => {
        ENObj = v
        refreshGUI()
      }"

      @GLSL="(v) => {
        glsl = v
        refreshGUI()
      }"
    />

  </Scene>

  <PerspectiveCamera
    :fov="75"
    :aspect="size.aspect"
    :near="1"
    :far="10000"
    @camera="(v) => { $emit('camera', v); camera = v }"
  />

</div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
/* eslint-disable */
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
// import 'imports-loader?THREE=three!three/examples/js/controls/TrackBallControls.js'
import 'imports-loader?THREE=three!./Touch/TrackTrack.js'
import 'imports-loader?THREE=three!./Touch/DragDrag.js'
/* eslint-enable */

import TextOutlet from './Elements/Text/TextOutlet.vue'
import TextEdit from './Elements/Text/TextEdit.vue'

import * as MS from './Data/MindScene.js'
import * as EN from '../HeartSpace/EffectNodeCore.js'

import Heart from '../HeartSpace/Heart.vue'

import ENEditor from './Elements/EN/ENEditor.vue'

export default {
  components: {
    ...Bundle,
    TextOutlet,
    TextEdit,
    Heart,
    ENEditor
  },
  props: {
    renderer: {},
    size: {}
  },
  data () {
    return {
      glsl: false,
      EN,
      MS,
      touchSurface: false,

      ENObj: false,
      mode: 'SceneEdit',

      dragGroup: [],
      current: {
        mesh: false,
        data: false
      },
      root: false,
      rAFID: 0,
      scene: false,
      camera: false
    }
  },
  computed: {
    msid () {
      return this.$route.params.msid
    }
  },
  methods: {
    removeBox (v) {
      let heart = this.$refs['heart']
      if (heart) {
        heart.removeCurrentBox(v)
      }
    },
    refreshGLSL () {
      let text = this.$refs['text-outlet']
      if (text) {
        text.$forceUpdate()
      }
      // let heart = this.$refs['heart']
      // if (heart) {
      //   heart.tryRefreshGLSL()
      //   this.glsl = EN.makeGLSL({ root: this.current.data.effect })
      // }
    },
    refreshGUI () {
      let heart = this.$refs['heart']
      if (heart) {
        heart.tryRefreshGUI()
        setTimeout(() => {
          heart.tryRefreshGUI()
        }, 17)
        setTimeout(() => {
          heart.tryRefreshGUI()
        }, 30)
      }
    },
    runWebGL () {
      if (this.touchPanControl) {
        this.touchPanControl.update()
      }
      if (this.renderer && this.camera && this.scene) {
        this.renderer.render(this.scene, this.camera)
      }
    },
    setup () {
      this.camera.position.z = 30
      this.scene.background = new THREE.Color('#fdfdfd')

      let touchSurface = this.touchSurface = this.$refs['touch-surface']
      let camera = this.camera

      let touchPanControl = this.touchPanControl = new THREE.TrackTrack(camera, touchSurface)
      touchPanControl.rotateSpeed = 1.0
      touchPanControl.zoomSpeed = 3.0
      touchPanControl.panSpeed = window.innerWidth <= 500 ? 0.25 : 0.5
      touchPanControl.noZoom = false
      touchPanControl.noPan = false
      touchPanControl.staticMoving = false
      touchPanControl.dynamicDampingFactor = 0.234
      touchPanControl.enabled = true

      let touchDragControl = this.touchDragControl = new THREE.DragDrag(this.dragGroup, camera, touchSurface)
      touchDragControl.addEventListener('dragstart', this.itemDragStart)
      touchDragControl.addEventListener('drag', this.itemDragging)
      touchDragControl.addEventListener('click', this.itemClickObj)
      touchDragControl.addEventListener('dragend', this.itemDragEnd)
    },
    load () {
      setTimeout(() => {
        this.root = MS.makeDemoRoot()
      }, 200)
    },
    itemDragStart (evt) {
      this.touchPanControl.enabled = false
      this.updatePos(evt)
    },
    itemDragging (evt) {
      this.updatePos(evt)
    },
    itemClickObj (evt) {
      this.updatePos(evt)

      let obj = evt.object
      let info = obj.userData.info

      this.current.mesh = obj
      this.current.data = info
      this.refreshGUI()
    },
    itemDragEnd (evt) {
      this.touchPanControl.enabled = true
      let obj = evt.object
      let info = obj.userData.info
      this.$emit('pulse-update', { delta: info })
    },
    updatePos (evt) {
      let obj = evt.object
      let info = obj.userData.info
      // console.table([info])
      // console.table([obj.position])

      info.pos.x = obj.position.x
      info.pos.y = obj.position.y
      info.pos.z = obj.position.z
    }
  },
  mounted () {
    this.load()
    this.setup()
    var rAF = () => {
      this.runWebGL()
      this.rAFID = window.requestAnimationFrame(rAF)
    }
    this.rAFID = window.requestAnimationFrame(rAF)
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}

.toucher{
  position: absolute;
  top: 0px;
  left: 0px;
}
.editor{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  background-color: rgba(255,255,255,0.5);
}
.closer{
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(0,0,0,0.2);
}

.effect-node{
  position: absolute;
  top: 0px;
  left: 0px;
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

.glsl-edit{
  width: 100%;
  max-width: 768px;
}

</style>
