<template>
  <div class="full" ref="full">

    <Renderer
      :alpha="true"
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <div class="full toucher" ref="touch-surface">
    </div>

    <div class="ui toucher">
    </div>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="camPos"
      @camera="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scene = v; setupPartilceSea({ scene }) }">
    </Scene>

  </div>
</template>

<script>
import Bundle from '../../../ThreeJS/Bundle.js'

import * as THREE from 'three'

import setupPartilceSea from './ParticleSea.js'
// import * as Scroller from '@/components/shared/DomScroller/DomScroller.js'

// import * as Relay from '@/components/shared/RelayConnector/relay.js'

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
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'

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

// import BoxesGroup from './Box/BoxesGroup.vue'
// DomToucher
export default {
  props: {
  },
  components: {
    ...Bundle
    // BoxesGroup
  },
  data () {
    // Relay.internal.$forceUpdate = () => {
    //   this.$forceUpdate()
    // }

    return {
      api: false,
      THREE,
      scl: { onScroll () {} },
      camPos: { x: 0, y: 0, z: 165 },
      ori: false,
      resizer () {},
      renderer: false,
      fullscreen: false,
      scene: false,
      camera: false,
      size: {
        width: 100,
        height: 100,
        aspect: 1
      }
    }
  },
  watch: {
    size () {
      this.composerResizer && this.composerResizer()
    },
    isHidden () {
      if (!this.isHidden) {
        this.$nextTick(() => {
          this.$parent.$emit('resize')
        })
      }
    }
  },
  computed: {
    isHidden () {
      return this.$parent.portal.win.minimised
    },
    res () {
      return this.size
    }
  },
  methods: {
    setupPartilceSea ({ scene }) {
      this.api = setupPartilceSea()
      scene.background = new THREE.Color('#ffffff')
      let mounter = this.api.setup({ renderer: this.renderer })
      scene.add(mounter.points)
    },
    setupComposer () {
      var dpi = 1.0

      let composer = this.composer = new THREE.EffectComposer(this.renderer)
      composer.setSize(this.res.width * dpi, this.res.height * dpi)
      window.addEventListener('resize', () => {
        this.composerResizer()
      }, false)
      this.composerResizer = () => {
        composer.setSize(this.res.width * dpi, this.res.height * dpi)
      }
      this.$nextTick(this.composerResizer)

      let renderBG = new THREE.RenderPass(this.scene, this.camera)
      let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(this.res.width * dpi, this.res.height * dpi), 1.5, 0.4, 0.85)
      bloomPass.renderToScreen = true

      // bloomPass.threshold = Number(0.0001)
      // bloomPass.strength = Number(3.5)
      // bloomPass.radius = Number(1.0)

      composer.addPass(renderBG)
      composer.addPass(bloomPass)
    },
    renderWebGL () {
      if (this.isHidden) {
        return
      }
      if (this.renderer && this.scene && this.camera) {
        if (this.api) {
          this.api.render()
        }
        let useBloom = false

        if (this.composer && useBloom) {
          this.composer.render(this.scene, this.camera)
        } else {
          this.renderer.render(this.scene, this.camera)
        }
      }
    }
  },
  created () {
    this.$on('add', (v) => {
      this.scene.add(v)
    })
    this.$on('remove', (v) => {
      this.scene.remove(v)
    })
  },
  mounted () {
    var resizer = this.resizer = () => {
      this.$nextTick(() => {
        if (this.$parent.portal) {
          // var rect = this.$refs.full.getBoundingClientRect()
          var rect = this.$parent.portal.win
          this.size = {
            top: rect.y,
            left: rect.x,
            depth: rect.z,
            width: rect.width,
            height: rect.height - 30,
            aspect: rect.width / (rect.height - 30)
          }
        }
      })
    }
    window.addEventListener('resize', resizer.bind(this))
    resizer()
    this.$parent.$on('resize', () => {
      resizer()
    })

    this.$refs['touch-surface'].addEventListener('mousemove', (evt) => {
      if (this.api) {
        console.log(evt)
        this.api.setMouse({ rect: this.size, mX: evt.pageX, mY: evt.pageY })
      }
    }, false)
    this.$refs['touch-surface'].addEventListener('touchmove', (evt) => {
      if (this.api) {
        console.log(evt)
        this.api.setMouse({ rect: this.size, mX: evt.touches[0].pageX, mY: evt.touches[0].pageY })
      }
    }, false)

    this.$refs['touch-surface'].addEventListener('touchstart', (e) => { e.preventDefault() })

    this.setupComposer()
    // this.setupDomScroller()
    // this.controls = new THREE.OrbitControls(this.camera, this.$refs['touch-surface'])

    this.scene.background = new THREE.Color('#000000')

    // this.scene.background = new THREE.Color('#99c5c7')

    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      // self.controls.update()
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style scoped>
* {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
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

.tall{
  height: 30vh;
}

.scroll-container{
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.white{
  color: white;
}

</style>
