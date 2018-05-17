<template>
<div class="full">

  <div class="full toucher" ref="touch-surface"></div>

  <div class="debug">
    <ACE v-model="pingPongShader" filepath="file.frag" :width="debug.w" :height="debug.h" />
  </div>

  <Scene @scene="(v) => { $emit('scene', v); scene = v }">

    <Object3D :px="0.0" :pz="-5">
      <GPUCloudSphere
        v-if="renderer && touchSurface"
        :pingPongShader="pingPongShader"
        :renderer="renderer"
        :touchSurface="touchSurface"
      />
    </Object3D>


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
// import 'imports-loader?THREE=three!./Touch/TrackTrack.js'
// import 'imports-loader?THREE=three!./Touch/DragDrag.js'
/* eslint-enable */

import GPUCloudSphere from './Elements/GPUObjects/GPUCloudSphere.vue'
import ACE from '@/components/parts/EffectNode/ACE/ACE.vue'

export default {
  components: {
    ...Bundle,
    ACE,
    GPUCloudSphere
  },
  props: {
    renderer: {},
    size: {}
  },
  data () {
    return {
      debug: {
        w: 600,
        h: window.innerHeight
      },
      pingPongShader: require('./Elements/GPUObjects/GPUCloudSphere/sim/pingpong.frag'),

      rAFID: 0,
      scene: false,
      camera: false
    }
  },
  watch: {

  },
  computed: {
    lid () {
      return this.$route.params.lid
    }
  },
  methods: {
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

      this.touchSurface = this.$refs['touch-surface']
    }
  },
  mounted () {
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
* {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.debug {
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0.5;
}
.debug:hover{
  opacity: 0.75;
}

@media screen and (max-width: 500px) {
  .debug{
    display: none;
  }
}

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
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0,0,0,0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.0s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.tools{
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.en-create-btns{
  position: absolute;
  top: 20px;
  left: 20px;
}

.en-edit-glsl{
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(255,255,255,0.5);
  padding: 20px;
}

.en-edit-close{
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
}

.en-time-machine{
  position: absolute;
  bottom: 20px;
  left: 20px;
}

</style>
