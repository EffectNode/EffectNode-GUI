<template>
<div class="mesh-basic-material"><slot /></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      material: false
    }
  },
  props: {
    transparent: {
      default: false
    },
    vs: {
      default:
`void main ( void ) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`
    },
    fs: {
      default:
`void main () {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}`
    },
    uniforms: {
      default () {
        return {}
      }
    },
    side: {
      default () {
        return THREE.FrontSide
        // THREE.FrontSide THREE.BackSide and THREE.DoubleSide
      }
    }
  },
  created () {
  },
  watch: {
    transparent () { this.initShader() },
    vs () { this.initShader() },
    fs () { this.initShader() },
    uniforms () { this.initShader() }
  },
  mounted () {
    this.initShader()
  },
  methods: {
    initShader () {
      try {
        this.material = new THREE.ShaderMaterial({
          side: this.side,
          transparent: this.transparent,
          uniforms: this.uniforms,
          vertexShader: this.vs || this.$options.props.vs.default,
          fragmentShader: this.fs || this.$options.props.fs.default
        })
        this.$parent.$emit('material', this.material)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
