<template>
  <div>

    <Points @attach="(v) => { box = v }" @detach="() => { box = false }">
      <BoxBufferGeometry />
      <ShaderMaterial :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
    </Points>

    <Object3D @element="(v) => { group = v }">

      <!-- inputs -->
      <Object3D :sx="0.2" :sy="0.2" :sz="0.2" py="3">
        <Object3D :key="input.aid" :px="((iInput + 1 - ((node.inputs.length + 1) / 2)) / node.inputs.length) * 30.0" v-for="(input, iInput) in node.inputs">
          <Points @element="addToInputs" @clean="removeFromInputs">
            <SphereBufferGeometry />
            <MeshBasicMaterial :color="0xffffff" :size="1.0" :sizeAttenuation="false" :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
          </Points>
        </Object3D>
      </Object3D>

      <!-- output -->
      <Object3D :sx="0.2" :sy="0.2" :sz="0.2" py="-3">
        <Points @element="(v) => { output = v }">
          <SphereBufferGeometry />
          <MeshBasicMaterial :color="0xffffff" :size="1.0" :sizeAttenuation="false" :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
        </Points>
      </Object3D>

    </Object3D>

  </div>
</template>

<script>
/*
@element="(v) => { setNodeUserData({ mesh: v, node }) }"
@attach="(v) => { boxes.push(v); }"
@detach="(v) => { boxes.splice(boxes.findIndex(a => a === v), 1); }"
*/
import Bundle from '@/components/ThreeJS/Bundle.js'
// import * as THREE from 'three'

export default {
  components: {
    ...Bundle
  },
  props: {
    node: { required: true }
  },
  data () {
    return {
      group: false,

      box: false,
      inputs: [],
      output: true,

      animatable: {
        time: { value: 0 }
      },

      demo: {
        vs: require('../Shaders/Fling/vs.vert'),
        fs: require('../Shaders/Simple/fs.frag')
      },
      rAFID: 0
    }
  },
  watch: {
    box () {
      if (this.box) {
        this.setupBox()
      } else {
        this.cleanUpBox()
      }
    }
  },
  methods: {
    addToInputs (v) {
      this.inputs.push(v)
    },
    removeFromInputs (v) {
      let inputs = this.inputs
      inputs.splice(inputs.findIndex(a => a.aid === v.aid), 1)
    },
    setupBox () {
      if (this.box && this.output) {
        this.$emit('attach', {
          inputs: this.inputs,
          box: this.box,
          group: this.group
        })
        this.$parent.$emit('add', this.group)
        this.$parent.$emit('add', this.box)
      }
    },
    cleanUpBox () {
      if (this.box && this.output) {
        this.$emit('detach', {
          inputs: this.inputs,
          box: this.box,
          group: this.group
        })
        this.$parent.$emit('remove', this.group)
        this.$parent.$emit('remove', this.box)
      }
    }
  },
  mounted () {
    var rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      this.animatable.time.value = window.performance.now() * 0.001
    }
    this.rAFID = window.requestAnimationFrame(rAF)
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style>

</style>
