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
      Steps
      <input class="f17" type="number" v-model="box2.uniforms.steps.value" @input="(e) => { box2.uniforms.steps.value = Number(e.target.value); }" />
      Alpha Correction
      <input class="f17" type="number" step="0.1" v-model="box2.uniforms.alphaCorrection.value" @input="(e) => { box2.uniforms.alphaCorrection.value = Number(e.target.value) }" />
      <button @click="mode = 'ball'" :disabled="mode === 'ball'">Ball</button>
      <button @click="mode = 'box'" :disabled="mode === 'box'">Box</button>
    </div>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="0.01"
      :far="1000"
      :position="camPos"
      @camera="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scenePass1 = v; }">

      <Object3D v-if="mode === 'box'" @attach="(v) => { spinner = v }">
        <Mesh>
          <BoxBufferGeometry :x="1" :y="1" :z="1"></BoxBufferGeometry>
          <!-- <SphereBufferGeometry :r="0.5" :nx="64" :ny="64"></SphereBufferGeometry> -->
          <ShaderMaterial :vs="box1.vs" :fs="box1.fs" :uniforms="box1.uniforms" :side="THREE.BackSide" :transparent="false"></ShaderMaterial>
        </Mesh>
      </Object3D>

      <Object3D v-if="mode === 'ball'" @attach="(v) => { spinner = v }">
        <Mesh>
          <!-- <BoxBufferGeometry :x="1" :y="1" :z="1"></BoxBufferGeometry> -->
          <SphereBufferGeometry :r="0.5" :nx="64" :ny="64"></SphereBufferGeometry>
          <ShaderMaterial :vs="box1.vs" :fs="box1.fs" :uniforms="box1.uniforms" :side="THREE.BackSide" :transparent="false"></ShaderMaterial>
        </Mesh>
      </Object3D>

    </Scene>

    <Scene @scene="(v) => { scenePass2 = v; }">

      <Object3D v-if="mode === 'box'" @attach="(v) => { spinner2 = v }">
        <Mesh>
          <BoxBufferGeometry :x="1" :y="1" :z="1"></BoxBufferGeometry>
          <!-- <SphereBufferGeometry :r="0.5" :nx="64" :ny="64"></SphereBufferGeometry> -->
          <ShaderMaterial :vs="box2.vs" :fs="box2.fs" :uniforms="box2.uniforms" :side="THREE.FrontSide" :transparent="true"></ShaderMaterial>
        </Mesh>
      </Object3D>

      <Object3D v-if="mode === 'ball'" @attach="(v) => { spinner2 = v }">
        <Mesh>
          <!-- <BoxBufferGeometry :x="1" :y="1" :z="1"></BoxBufferGeometry> -->
          <SphereBufferGeometry :r="0.5" :nx="64" :ny="64"></SphereBufferGeometry>
          <ShaderMaterial :vs="box2.vs" :fs="box2.fs" :uniforms="box2.uniforms" :side="THREE.FrontSide" :transparent="true"></ShaderMaterial>
        </Mesh>
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import Bundle from '@/enOS/ThreeJS/Bundle.js'
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
      mode: 'ball',
      box1: this.makeShaderPass1(),
      box2: this.makeShaderPass2(),
      spinner: false,
      spinner2: false,
      THREE,
      scl: { onScroll () {} },
      camPos: { x: 0, y: 0, z: 1.25 },
      // camPos: { "x":-50.13264832972849, "y":-0.8317700923055616, "z":-1.870877329984351 },
      ori: false,
      resizer () {},
      renderer: false,
      fullscreen: false,
      scenePass1: false,
      scenePass2: false,
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
    configScene ({ scene }) {
      scene.background = new THREE.Color('#bababa')
    },
    makeShaderPass1 () {
      return {
        vs: `

varying vec3 worldSpaceCoords;

void main()
{
  //Set the world space coordinates of the back faces vertices as output.
  worldSpaceCoords = position + vec3(0.5, 0.5, 0.5); //move it from [-0.5;0.5] to [0,1]
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,

        fs: `
precision highp float;
varying vec3 worldSpaceCoords;

void main()
{
  //The fragment's world space coordinates as fragment output.
  gl_FragColor = vec4( worldSpaceCoords.x , worldSpaceCoords.y, worldSpaceCoords.z, 1.0 );
}
//Leandro R Barbagallo - 2015 - lebarba at gmail.com

`,
        uniforms: {
          time: { value: 0 }
        }
      }
    },
    makeShaderPass2 () {
      var screenSize = new THREE.Vector2(this.$parent.portal.win.width, this.$parent.portal.win.height)
      this.rtTexture = new THREE.WebGLRenderTarget(screenSize.x, screenSize.y, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        format: THREE.RGBFormat,
        type: THREE.FloatType,
        generateMipmaps: false
      })

      return {
        vs: `
varying vec3 worldSpaceCoords;
varying vec4 projectedCoords;

void main () {
  worldSpaceCoords = (modelMatrix * vec4(position + vec3(0.5, 0.5,0.5), 1.0 )).xyz;
  gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1.0 );
  projectedCoords =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
      `,
        fs: `
precision highp float;

varying vec3 worldSpaceCoords;
varying vec4 projectedCoords;
uniform sampler2D tex; //, cubeTex, transferTex;
uniform float steps;
uniform float alphaCorrection;
const int MAX_STEPS = 128;

// //Acts like a texture3D using Z slices and trilinear filtering.
// vec4 sampleAs3DTexture2( vec3 texCoord )
// {
//   vec4 colorSlice1, colorSlice2;
//   vec2 texCoordSlice1, texCoordSlice2;

//   //The z coordinate determines which Z slice we have to look for.
//   //Z slice number goes from 0 to 255.
//   float zSliceNumber1 = floor(texCoord.z  * 255.0);

//   //As we use trilinear we go the next Z slice.
//   float zSliceNumber2 = min( zSliceNumber1 + 1.0, 255.0); //Clamp to 255

//   //The Z slices are stored in a matrix of 16x16 of Z slices.
//   //The original UV coordinates have to be rescaled by the tile numbers in each row and column.
//   texCoord.xy /= 16.0;

//   texCoordSlice1 = texCoordSlice2 = texCoord.xy;

//   //Add an offset to the original UV coordinates depending on the row and column number.
//   texCoordSlice1.x += (mod(zSliceNumber1, 16.0 ) / 16.0);
//   texCoordSlice1.y += floor((255.0 - zSliceNumber1) / 16.0) / 16.0;

//   texCoordSlice2.x += (mod(zSliceNumber2, 16.0 ) / 16.0);
//   texCoordSlice2.y += floor((255.0 - zSliceNumber2) / 16.0) / 16.0;

//   //Get the opacity value from the 2D texture.
//   //Bilinear filtering is done at each texture2D by default.
//   colorSlice1 = texture2D( cubeTex, texCoordSlice1 );
//   colorSlice2 = texture2D( cubeTex, texCoordSlice2 );

//   //Based on the opacity obtained earlier, get the RGB color in the transfer function texture.
//   colorSlice1.rgb = texture2D( transferTex, vec2( colorSlice1.a, 1.0) ).rgb;
//   colorSlice2.rgb = texture2D( transferTex, vec2( colorSlice2.a, 1.0) ).rgb;

//   //How distant is zSlice1 to ZSlice2. Used to interpolate between one Z slice and the other.
//   float zDifference = mod(texCoord.z * 255.0, 1.0);

//   //Finally interpolate between the two intermediate colors of each Z slice.
//   return mix(colorSlice1, colorSlice2, zDifference) ;
// }


//  Simplex 3D Noise
//  by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

uniform float time;
vec4 sampleAs3DTexture (vec3 pos) {
  float scale = 1.5;
  vec4 r4 = vec4(
    abs(snoise(scale * pos + time * 0.25 + pos.x * 0.25)),
    abs(snoise(scale * pos + time * 0.25 + pos.y * 0.25)),
    abs(snoise(scale * pos + time * 0.25 + pos.z * 0.25)),
    0.75
  );

  r4.a *= abs(r4.r) + abs(r4.g) + abs(r4.b) / float(MAX_STEPS);
  r4.a = 1.0 - r4.a;
  r4.rgb = 1.0 - r4.rgb;
  return r4;
}

void main( void ) {
  //Transform the coordinates it from [-1;1] to [0;1]
  vec2 texc = vec2(((projectedCoords.x / projectedCoords.w) + 1.0 ) / 2.0,
          ((projectedCoords.y / projectedCoords.w) + 1.0 ) / 2.0 );

  //The back position is the world space position stored in the texture.
  vec3 backPos = texture2D(tex, texc).xyz;

  //The front position is the world space position of the second render pass.
  vec3 frontPos = worldSpaceCoords;

  //The direction from the front position to back position.
  vec3 dir = backPos - frontPos;

  float rayLength = length(dir);

  //Calculate how long to increment in each step.
  float delta = 1.0 / steps;

  //The increment in each direction for each step.
  vec3 deltaDirection = normalize(dir) * delta;
  float deltaDirectionLength = length(deltaDirection);

  //Start the ray casting from the front position.
  vec3 currentPosition = frontPos;

  //The color accumulator.
  vec4 accumulatedColor = vec4(0.0);

  //The alpha value accumulated so far.
  float accumulatedAlpha = 0.0;

  //How long has the ray travelled so far.
  float accumulatedLength = 0.0;

  vec4 colorSample;
  float alphaSample;

  //Perform the ray marching iterations
  for(int i = 0; i < MAX_STEPS; i++)
  {
    //Get the voxel intensity value from the 3D texture.
    colorSample = sampleAs3DTexture( currentPosition );

    //Allow the alpha correction customization
    alphaSample = colorSample.a * alphaCorrection;

    //Perform the composition.
    accumulatedColor += (1.0 - accumulatedAlpha) * colorSample * alphaSample;

    //Store the alpha accumulated so far.
    accumulatedAlpha += alphaSample;

    //Advance the ray.
    currentPosition += deltaDirection;
    accumulatedLength += deltaDirectionLength;

    //If the length traversed is more than the ray length, or if the alpha accumulated reaches 1.0 then exit.
    if (accumulatedLength >= rayLength || accumulatedAlpha >= 1.0)
    // if (accumulatedAlpha >= 1.0)
      break;
  }

  gl_FragColor  = accumulatedColor;
  //Leandro R Barbagallo - 2015 - lebarba at gmail.com
}`,

        uniforms: {
          steps: { value: 10 },
          alphaCorrection: { value: 0.85 },
          tex: { value: this.rtTexture.texture },
          time: { value: 0 }
        }
      }
    },
    updateUniforms () {
      let time = window.performance.now() * 0.001
      this.box2.uniforms.time.value = time

      // this.spinner.rotation.y += 0.01;
    },
    // setupComposer () {
    //   var dpi = window.devicePixelRatio || 1.0

    //   let composer = this.composer = new THREE.EffectComposer(this.renderer)
    //   composer.setSize(this.res.width * dpi, this.res.height * dpi)
    //   window.addEventListener('resize', () => {
    //     this.composerResizer()
    //   }, false)
    //   this.composerResizer = () => {
    //     composer.setSize(this.res.width * dpi, this.res.height * dpi)
    //   }
    //   this.$nextTick(this.composerResizer)

    //   let renderBG = new THREE.RenderPass(this.scenePass1, this.camera)
    //   let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(this.res.width * dpi, this.res.height * dpi), 1.5, 0.4, 0.85)
    //   bloomPass.renderToScreen = true

    //   // bloomPass.threshold = Number(0.0001)
    //   // bloomPass.strength = Number(3.5)
    //   // bloomPass.radius = Number(1.0)

    //   composer.addPass(renderBG)
    //   composer.addPass(bloomPass)
    // },
    renderWebGL () {
      if (this.isHidden) {
        return
      }
      this.updateUniforms()

      // this.updateGeo()

      if (this.rtTexture) {
        this.renderer.render(this.scenePass1, this.camera, this.rtTexture, true)
        this.renderer.render(this.scenePass2, this.camera)
      }

      // if (this.scene && this.camera && this.renderer && this.composer) {
      //   this.composer.render()
      // } else if (this.scene && this.camera && this.renderer) {
      //   this.renderer.render(this.scene, this.camera)
      // }
    },
    setupDomScroller () {
      // this.scl = Scroller.make({ scroller: this.$refs['scroll-container'], content: this.$refs['scroll-content'] })
    }
  },
  created () {
    // this.$on('add', (v) => {
    //   this.scenePass2.add(v)
    // })
    // this.$on('remove', (v) => {
    //   this.scenePass2.remove(v)
    // })
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
      this.$nextTick(() => {
        resizer()
      })
      // this.composerResizer()
    })

    this.$refs['touch-surface'].addEventListener('touchstart', (e) => { e.preventDefault() })

    // this.setupComposer()
    // this.setupDomScroller()
    this.controls = new THREE.OrbitControls(this.camera, this.$refs['touch-surface'])
    this.controls.enableKeys = false
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.35
    // this.scene.background = new THREE.Color('#000000')

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

.f17{
  font-size: 17px;
}

</style>
