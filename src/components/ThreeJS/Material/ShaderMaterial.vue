<template>
<div class="mesh-basic-material"></div>
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
    }
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
