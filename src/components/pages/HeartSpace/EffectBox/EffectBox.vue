<template>
  <div>

    <Mesh @attach="(v) => { box = v }" @detach="() => { box = false }">
      <PlaneBufferGeometry />
      <MeshBasicMaterial :opacity="0.0" />
    </Mesh>

    <Object3D @element="(v) => { group = v }">
      <Mesh>
        <TorusKnotBufferGeometry />
        <ShaderMaterial :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
      </Mesh>

      <!-- inputs -->
      <Object3D py="3">
        <Object3D :key="input.aid" :px="((iInput + 1 - ((node.inputs.length + 1) / 2)) / node.inputs.length) * 10" v-for="(input, iInput) in node.inputs">
          <Mesh @element="addToInputs" @clean="removeFromInputs">
            <SphereBufferGeometry :nx="7" :ny="7" :r="0.65" />
            <MeshBasicMaterial :color="0xddddff" :size="1.0" :sizeAttenuation="false" :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
          </Mesh>
        </Object3D>
      </Object3D>

      <!-- output -->
      <Object3D py="-3">
        <Mesh @element="(v) => { output = v }" @clean="() => { output = false }">
          <SphereBufferGeometry :nx="7" :ny="7" :r="0.65" />
          <MeshBasicMaterial :color="0xddddff" :size="1.0" :sizeAttenuation="false" :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
        </Mesh>
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
      didOnce: false,

      group: false,

      box: false,
      inputs: [],
      output: false,

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
      if (this.box && this.output && this.inputs.length > 0) {
        this.setupBox()
      }
    },
    output () {
      if (this.box && this.output && this.inputs.length > 0) {
        this.setupBox()
      }
    },
    inputs () {
      if (this.box && this.output && this.inputs.length > 0) {
        this.setupBox()
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
      if (this.didOnce) { return }
      this.didOnce = true
      this.$emit('attach', {
        box: this.box,
        group: this.group,
        output: this.output,
        inputs: this.inputs
      })
      this.$parent.$emit('add', this.group)
      this.$parent.$emit('add', this.box)
    },
    cleanUpBox () {
      this.$emit('detach', {
        box: this.box,
        group: this.group,
        output: this.output,
        inputs: this.inputs
      })
      this.$parent.$emit('remove', this.group)
      this.$parent.$emit('remove', this.box)
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
    this.cleanUpBox()
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style>

</style>
