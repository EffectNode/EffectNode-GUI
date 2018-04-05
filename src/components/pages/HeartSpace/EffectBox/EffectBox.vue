<template>
  <div>

    <Mesh @attach="(v) => { box = v }" @detach="() => { box = false }">
      <BoxBufferGeometry />
      <ShaderMaterial :color="0xff0000" :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
    </Mesh>

    <Object3D @element="(v) => { group = v }">

      <Object3D :sx="0.25" :sy="0.25" :sz="0.25" py="5.0">
        <Object3D :key="input.aid" :px="((iInput + 1 - ((node.inputs.length + 1) / 2)) / node.inputs.length) * 30.0" v-for="(input, iInput) in node.inputs">
          <Mesh>
            <SphereBufferGeometry />
            <ShaderMaterial :color="0xff0000" :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
          </Mesh>
        </Object3D>
      </Object3D>



      <Object3D :sx="0.25" :sy="0.25" :sz="0.25" py="-5.0">
        <Mesh>
          <SphereBufferGeometry />
          <ShaderMaterial :color="0xff0000" :vs="demo.vs" :fs="demo.fs" :uniforms="animatable" />
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
      group: false,

      box: false,
      inputs: [],
      output: [1],

      animatable: {
        time: { value: 0 }
      },

      demo: {
        vs: require('../Shaders/Simple/vs.vert'),
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
    setupBox () {
      if (this.box && this.output.length > 0) {
        this.$emit('attach', {
          box: this.box,
          group: this.group
        })
        this.$parent.$emit('add', this.group)
        this.$parent.$emit('add', this.box)
      }
    },
    cleanUpBox () {
      if (this.box && this.output.length > 0) {
        this.$emit('detach', {
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
