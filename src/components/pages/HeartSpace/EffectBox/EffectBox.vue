<template>
  <div>

    <Mesh @attach="(v) => { box = v }" @detach="() => { box = false }">
      <CircleBufferGeometry :r="2.5" />
      <MeshBasicMaterial :opacity="0.0" />
    </Mesh>

    <Object3D @element="(v) => { group = v }" v-if="node">
      <Points v-if="node.shaderType === 'vertexShader'" >
        <TorusKnotBufferGeometry />
        <ShaderMaterial :vs="VSDesc.vs" :fs="VSDesc.fs" :uniforms="VSDesc.animatable" />
      </Points>
      <Mesh v-if="node.shaderType === 'fragmentShader'">
        <TorusKnotBufferGeometry />
        <ShaderMaterial :vs="FSDesc.vs" :fs="FSDesc.fs" :uniforms="FSDesc.animatable" />
      </Mesh>

      <!-- inputs -->
      <Object3D py="3.5">
        <Object3D :key="input.aid" :px="((iInput + 1 - ((node.inputs.length + 1) / 2)) / node.inputs.length) * (node.inputs.length * 2.5)" v-for="(input, iInput) in node.inputs">

          <Mesh @element="addToInputs" @clean="() => {}">
            <CircleBufferGeometry :nx="7" :ny="7" :r="0.65" />
            <MeshBasicMaterial :color="0xffffff" :size="1.0" :sizeAttenuation="false" />
          </Mesh>

        </Object3D>
      </Object3D>

      <!-- output -->
      <Object3D py="-3.5" v-if="node.output.type !== 'void'">
        <Mesh @element="(v) => { output = v }" @clean="() => { }">
          <CircleBufferGeometry :nx="7" :ny="7" :r="0.65" />
          <MeshBasicMaterial :color="0xffffff" :size="1.0" :sizeAttenuation="false" />
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
      output: false,

      VSDesc: {
        vs: require('../Shaders/VSDesc/VSDesc.vert'),
        fs: require('../Shaders/VSDesc/VSDesc.frag'),
        animatable: {
          time: { value: 0 }
        }
      },
      FSDesc: {
        vs: require('../Shaders/FSDesc/FSDesc.vert'),
        fs: require('../Shaders/FSDesc/FSDesc.frag'),
        animatable: {
          time: { value: 0 }
        }
      },
      rAFID: 0
    }
  },
  watch: {
    box () {
      if (this.isReady()) {
        this.cleanUpBox()
        this.$nextTick(() => {
          this.setupBox()
        })
      }
    },
    output () {
      if (this.isReady()) {
        this.cleanUpBox()
        this.$nextTick(() => {
          this.setupBox()
        })
      }
    },
    inputsLength () {
      if (this.isReady()) {
        this.cleanUpBox()
        this.$nextTick(() => {
          this.setupBox()
        })
      }
    },
    inputs () {
      if (this.isReady()) {
        this.cleanUpBox()
        this.$nextTick(() => {
          this.setupBox()
        })
      } else {
        this.$nextTick(() => {

        })
      }
    }
  },
  methods: {
    isReady () {
      return (this.output || this.node.output.type === 'void') && this.box
    },
    inputsLength () {
      return this.inputs.length
    },
    addToInputs (v) {
      this.inputs.push(v)
    },
    removeFromInputs (v) {
      let inputs = this.inputs
      inputs.splice(inputs.findIndex(a => a.aid === v.aid), 1)
    },
    setupBox () {
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

      if (this.node.shaderType === 'vertexShader') {
        this.VSDesc.animatable.time.value = window.performance.now() * 0.001
      }
      if (this.node.shaderType === 'fragmentShader') {
        this.FSDesc.animatable.time.value = window.performance.now() * 0.001
      }
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
