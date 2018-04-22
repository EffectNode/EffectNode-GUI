<template>
  <div>

    <Component :is="objType">
      <!-- <SphereBufferGeometry :r="10" :nx="200" :ny="200" /> -->
      <Component :is="geoType" :attributes="attributes" />
      <!-- <MathLineSegments /> -->
      <!-- <TorusKnotBufferGeometry radius="10" tube="1" tubularSegments="300" radialSegments="40" /> -->
      <ShaderMaterial ref="shader" :transparent="true" :vs="vs" :fs="fs" :uniforms="uniforms" />
      <!-- <ShaderMaterial :uniforms="animatable" /> -->
    </Component>

  </div>
</template>

<script>
import MathPoints from './MathPoints'
import MathLineSegments from './MathLineSegments'

// import * as THREE from 'three'

import Bundle from '@/components/ThreeJS/Bundle.js'

export default {
  components: {
    ...Bundle,
    MathPoints,
    MathLineSegments
  },
  props: {
    objType: { default () { return 'MathPoints' } },
    geoType: {},

    vs: {},
    fs: {},
    uniforms: {},
    attributes: {}
  },
  data () {
    return {
      // uniforms: {
      //   time: { value: 0 }
      // },
      rAFID: 0
    }
  },
  created () {
    this.$on('add', (v) => {
      this.$parent.$emit('add', v)
    })
    this.$on('remove', (v) => {
      this.$parent.$emit('remove', v)
    })
  },
  mounted () {
    var rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      // this.uniforms.time.value = window.performance.now() * 0.001
    }
    this.rAFID = window.requestAnimationFrame(rAF)
  },
  computed: {
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style>

</style>
