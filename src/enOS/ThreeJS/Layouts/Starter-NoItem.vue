<template>
  <div class="full" ref="full">
    <Renderer
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <div class="full touch-surface">
      <h1 class="center-text">
        Gallery
      </h1>
    </div>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="{ x: 0, y: 0, z: 11 }"
      @camera="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scene = v }">


      <BgWavyBox />


    </Scene>

  </div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
import * as THREE from 'three'

/* eslint-disable */
/*
https://threejs.org/examples/js/postprocessing/EffectComposer.js
https://threejs.org/examples/js/postprocessing/RenderPass.js
https://threejs.org/examples/js/postprocessing/MaskPass.js
https://threejs.org/examples/js/postprocessing/ShaderPass.js
https://threejs.org/examples/js/shaders/CopyShader.js
https://threejs.org/examples/js/shaders/FXAAShader.js
https://threejs.org/examples/js/shaders/ConvolutionShader.js
https://threejs.org/examples/js/shaders/LuminosityHighPassShader.js
https://threejs.org/examples/js/postprocessing/UnrealBloomPass.js
*/

import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/FXAAShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader.js'
import 'imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js'
import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js'
/* eslint-enable */

import BgWavyBox from '@/components/pages/Gallery/UIs/BgWavyBox/BgWavyBox.vue'

export default {
  components: {
    ...Bundle,
    BgWavyBox
  },
  computed: {
  },
  methods: {
    setupComposer () {
      var dpi = 1.0

      let composer = this.composer = new THREE.EffectComposer(this.renderer)
      composer.setSize(this.size.width * dpi, this.size.height * dpi)
      window.addEventListener('resize', () => {
        this.composerResizer()
      }, false)
      this.composerResizer = () => {
        composer.setSize(this.size.width * dpi, this.size.height * dpi)
      }
      this.$nextTick(this.composerResizer)

      let renderBG = new THREE.RenderPass(this.scene, this.camera)
      let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(this.size.width * dpi, this.size.height * dpi), 1.5, 0.4, 0.85)
      bloomPass.renderToScreen = true

      // bloomPass.threshold = Number(0.0001)
      // bloomPass.strength = Number(3.5)
      // bloomPass.radius = Number(1.0)

      composer.addPass(renderBG)
      composer.addPass(bloomPass)

      this.scene.background = new THREE.Color('#99c5c7')
    },
    setupSize () {
      var resizer = this.resizer = () => {
        this.$nextTick(() => {
          var rect = this.$refs.full.getBoundingClientRect()
          this.size = {
            width: rect.width,
            height: rect.height,
            aspect: rect.width / rect.height
          }
        })
      }
      window.addEventListener('resize', resizer.bind(this))
      resizer()
    },
    renderWebGL () {
      let useBloom = false
      if (useBloom && this.scene && this.camera && this.renderer && this.composer) {
        this.composer.render()
      } else if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  data () {
    return {
      resizer () {},
      time: 0,
      PI: Math.PI,

      size: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      },
      renderer: false,
      scene: false,
      camera: false
    }
  },
  created () {

  },
  mounted () {
    this.setupSize()
    this.setupComposer()

    var self = this
    let rAFID = this
    function loop () {
      rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    rAFID = window.requestAnimationFrame(loop)
    self.clean = () => {
      window.cancelAnimationFrame(rAFID)
    }
  },
  beforeDestroy () {
    this.clean()
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.touch-surface{
  position: absolute;
  top: 0px;
  left: 0px;
}

.center-text{
  text-align: center;
}

h1, h2{
  color: white;
}

a, a:active, a:visited {
  color: white;
}

</style>
