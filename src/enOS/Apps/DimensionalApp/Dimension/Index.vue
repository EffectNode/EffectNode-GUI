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
      <input type="number" v-model="numOfPlots" @keyup.enter="genPlots()" />
      <button @click="genPlots()">plot</button>
    </div>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="camPos"
      @camera="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scene = v }">

      <Object3D :ry="3.1415 * 0.5" @attach="(v) => { roller = v }">
        <LineSegments :key="ip" v-for="(plot, ip) in plots">
          <BufferGeometry :array3f="plot.a3f"></BufferGeometry>
          <ShaderMaterial :vs="plot.vs" :fs="plot.fs" :uniforms="plot.uniforms"></ShaderMaterial>
        </LineSegments>
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import Bundle from '../../../ThreeJS/Bundle.js'
import * as THREE from 'three'
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
      roller: false,
      numOfPlots: 70,
      plots: [
      ],
      THREE,
      scl: { onScroll () {} },
      // camPos: { x: 0, y: 0, z: 120 },
      camPos: { 'x': -50.13264832972849, 'y': -0.8317700923055616, 'z': -1.870877329984351 },
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
          this.$parent.$emit('resize', { portal: this.$parent.portal })
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
    makePlots (i, n, e) {
      return {
        i,
        n,
        e,
        a3f: [
        ],
        vs: `void main ( void ) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`,
        fs: `
uniform vec3 color;
void main () {
  gl_FragColor = vec4(color, 0.75);
}`,
        uniforms: {
          color: { value: new THREE.Color(`hsl(${Number(360 * e).toFixed(3)}, 100%, 50%)`) },
          time: { value: 0 }
        }
      }
    },
    updateEachLine (time, i, n, vtx, plot) {
      var dt = plot.e

      var twoPI = 2 * Math.PI

      var i0 = i + 0
      var i1 = i + 1
      var i2 = i + 2

      var i3 = i + 3
      var i4 = i + 4
      var i5 = i + 5

      var startAngle = (i0 / n) * twoPI
      var endAngle = (i3 / n) * twoPI

      endAngle = startAngle + Math.PI

      var ballRadius = 20.0

      // var numOfWaves = 5
      // var waveHeight = 5
      // var wavyRadius = ballRadius + waveHeight * Math.sin((endAngle + dt * 0.25) * numOfWaves)

      var x1 = ballRadius * Math.cos(startAngle)
      var y1 = ballRadius * Math.sin(startAngle)

      var x2 = ballRadius * Math.cos(endAngle * dt)
      var y2 = ballRadius * Math.sin(endAngle * dt)

      // start point
      vtx[i0] = x1
      vtx[i1] = y1
      vtx[i2] = (plot.n * 0.5 - plot.i) * 2.0

      // end
      vtx[i3] = x2
      vtx[i4] = y2
      vtx[i5] = (plot.n * 0.5 - plot.i) * 2.0
    },
    updateGeo () {
      this.plots.forEach((p, pi) => {
        let time = window.performance.now() * 0.001
        let n = 360 * 2
        p.a3f = []
        for (var i = 0; i < n; i += 6) {
          this.updateEachLine(time, i, n, p.a3f, p)
        }
      })
    },
    updateUniforms () {
      this.plots.forEach((p) => {
        let time = window.performance.now() * 0.001
        p.uniforms.time.value = time
      })
    },
    setupComposer () {
      var dpi = window.devicePixelRatio || 1.0

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
    updateRoller () {
      if (this.roller) {
        this.roller.rotation.x += 0.01
      }
    },
    renderWebGL () {
      if (this.isHidden) {
        return
      }
      this.updateRoller()
      this.updateUniforms()

      // this.updateGeo()

      this.renderer.render(this.scene, this.camera)

      // if (this.scene && this.camera && this.renderer && this.composer) {
      //   this.composer.render()
      // } else if (this.scene && this.camera && this.renderer) {
      //   this.renderer.render(this.scene, this.camera)
      // }
    },
    setupDomScroller () {
      // this.scl = Scroller.make({ scroller: this.$refs['scroll-container'], content: this.$refs['scroll-content'] })
    },
    genPlots () {
      this.plots = []
      let n = this.numOfPlots
      for (var i = 0; i < n; i++) {
        this.plots.push(this.makePlots(i, n, i / n))
      }
      this.updateGeo()
    }
  },
  created () {
    this.$on('add', (v) => {
      this.scene.add(v)
    })
    this.$on('remove', (v) => {
      this.scene.remove(v)
    })

    this.genPlots()
  },
  mounted () {
    var resizer = this.resizer = () => {
      let p = this.$parent.portal

      if (p && p.win) {
        // var rect = this.$refs.full.getBoundingClientRect()
        var rect = p.win
        this.size = {
          width: rect.width,
          height: rect.height - 30,
          aspect: rect.width / (rect.height - 30)
        }
      }
    }

    window.addEventListener('resize', resizer.bind(this))
    resizer()
    this.$nextTick(() => {
      resizer()
    })
    this.$parent.$on('resize', () => {
      resizer()
      this.composerResizer()
    })

    this.$refs['touch-surface'].addEventListener('touchstart', (e) => { e.preventDefault() })

    this.setupComposer()
    // this.setupDomScroller()
    this.controls = new THREE.OrbitControls(this.camera, this.$refs['touch-surface'])

    this.scene.background = new THREE.Color('#000000')

    // this.scene.background = new THREE.Color('#99c5c7')

    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.controls.update()
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
