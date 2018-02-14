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
          uniforms: {
            ...this.uniforms// ,
            // ...THREE.UniformsUtils.merge([
            //   THREE.UniformsLib.common,
            //   THREE.UniformsLib.aomap,
            //   THREE.UniformsLib.lightmap,
            //   THREE.UniformsLib.emissivemap,
            //   THREE.UniformsLib.bumpmap,
            //   THREE.UniformsLib.normalmap,
            //   THREE.UniformsLib.displacementmap,
            //   THREE.UniformsLib.fog,
            //   THREE.UniformsLib.lights,
            //   THREE.UniformsLib.shadowmap,
            //   {
            //     flipEnvMap: {
            //       value: 1
            //     },
            //     emissive: {
            //       value: new THREE.Color(0x000000)
            //     },
            //     specular: {
            //       value: new THREE.Color(0x111111)
            //     },
            //     shininess: {
            //       value: 30
            //     },
            //     envMap: {
            //       // value: cubeCamera.renderTarget
            //     }
            //   }
            // ])
          },
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
