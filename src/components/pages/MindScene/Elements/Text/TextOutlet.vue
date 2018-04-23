<template>
  <Object3D v-if="root" @element="(el) => { textEl = el }">
    <Object3D :key="info.id" v-for="(info) in root.state.words">
      <Text3DComp
        :vs="getGLSL({ root: info.effect }).vertexShader"
        :fs="getGLSL({ root: info.effect }).fragmentShader"
        :effect="info.effect"
        :pos="info.pos"
        :transparent="info.transparent"
        :placeholder="'Click to edit me.'"
        :text="info.text"
        :width="info.width"
        @attach="(mesh) => { attachText({ mesh, info }) }"
        @detach="(mesh) => { detachText({ mesh }) }" />
    </Object3D>
  </Object3D>
</template>

<script>
import Text3DComp from './Text3DComp'
// import * as THREE from 'three'
import Bundle from '@/components/ThreeJS/Bundle.js'
import * as EN from '../../../HeartSpace/EffectNodeCore.js'

export default {
  components: {
    ...Bundle,
    Text3DComp
  },
  props: {
    props: {},
    group: {
      default () {
        return []
      }
    },
    root: {}
  },
  data () {
    return {
      meshes: [],
      textEl: false
    }
  },
  mounted () {
    this.$parent.$emit('add', this.textEl)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.textEl)
  },
  computed: {
  },
  methods: {
    getGLSL ({ root }) {
      return EN.makeGLSL({ root })
    },
    attachText ({ mesh, info }) {
      mesh.userData = mesh.userData || {}
      mesh.userData.info = info
      this.meshes.push(mesh)
      this.group.push(mesh)
    },
    detachText ({ mesh }) {
      this.meshes.forEach((im, idx) => {
        if (mesh.uuid === im.uuid) {
          this.meshes.splice(idx, 1)
        }
      })
      this.group.forEach((im, idx) => {
        if (mesh.uuid === im.uuid) {
          this.group.splice(idx, 1)
        }
      })
    }
  }
}
</script>

<style scoped>
.hidden{
  display: none;
}
</style>
