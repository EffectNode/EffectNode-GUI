<template>

</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/shaders/WaterRefractionShader.js'
import 'imports-loader?THREE=three!three/examples/js/objects/Refractor.js'
/* eslint-enable */

export default {
  props: {
    position: {}
  },
  data () {
    return {
      clock: false,
      reflector: false
    }
  },
  created () {
    this.clock = new THREE.Clock()
    this.refractor = new THREE.Refractor(10, 10, {
      color: 0x999999,
      textureWidth: 1024,
      textureHeight: 1024,
      // shader: THREE.WaterRefractionShader
      shader: {
        uniforms: {
          color: { value: null },
          time: { value: 0 },
          tDiffuse: { value: null },
          tDudv: { value: null },
          textureMatrix: { value: null }
        },
        vertexShader:
`uniform mat4 textureMatrix;
varying vec2 vUv;
varying vec4 vUvRefraction;
void main() {
  vUv = uv;
  vUvRefraction = textureMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
        fragmentShader:
`uniform vec3 color;
uniform float time;
uniform sampler2D tDiffuse;
uniform sampler2D tDudv;

varying vec2 vUv;
varying vec4 vUvRefraction;
float blendOverlay( float base, float blend ) {
  return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
}
vec3 blendOverlay( vec3 base, vec3 blend ) {
  return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
}

void main() {
  float waveStrength = 0.1;
  float waveSpeed = 0.03;

  // simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)
  vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + time * waveSpeed, vUv.y ) ).rg * waveStrength;
  distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y + time * waveSpeed );
  vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveStrength;

  // new uv coords
  vec4 uv = vec4( vUvRefraction );
  uv.xy += distortion;

  // // Kelido scope
  // float sides = 6.0;
  // float angle = time;
  // vec2 p = vUv - 0.5;
  // float r = length(p);
  // float a = atan(p.y, p.x) + angle;
  // float tau = 2.0 * 3.1416;
  // a = mod(a, tau/sides);
  // a = abs(a - tau/sides/2.0);
  // p = r * vec2(cos(a), sin(a));
  // vec4 readColor = texture2D(tDiffuse, p + 0.5);

  vec4 base = texture2DProj( tDiffuse, uv );

  gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

}
`
      }
    })
    // this.refractor.position.set(0, 0, 3)
    if (this.position) {
      this.refractor.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      )
    }
    var dudvMap = new THREE.TextureLoader().load(require('../textures/waterdudv.jpg'), () => {
      this.$emit('refactor', this.refractor)
      this.$parent.$emit('add', this.refractor)
    })

    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping
    this.refractor.material.uniforms.tDudv.value = dudvMap
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.refractor)
  },
  methods: {
    update () {
      this.refractor.material.uniforms.time.value += this.clock.getDelta()
    },
    funz () {
      var el = this.refractor
      return new Promise((resolve, reject) => {
        let tween1 = new TWEEN.Tween(el.scale)
          .to({ y: '-1' }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)

        let tween2 = new TWEEN.Tween(el.scale)
          .to({ y: '+1' }, 0)
          .easing(TWEEN.Easing.Quadratic.Out)

        let tween3 = new TWEEN.Tween(el.scale)
          .to({ x: '-1' }, 0)
          .easing(TWEEN.Easing.Quadratic.Out)

        let tween4 = new TWEEN.Tween(el.scale)
          .to({ x: '+1' }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onComplete(resolve)

        tween1.chain(tween2)
        tween2.chain(tween3)
        tween3.chain(tween4)
        tween4.chain(tween1)
        tween1.start()
      })
    },
    async animate () {
      this.funz(0)
    }
  }
}
</script>

<style>

</style>
