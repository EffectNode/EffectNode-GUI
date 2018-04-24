<template>
  <div class="">

    <!-- Effect Node Editor -->
    <div class="editor-area" v-if="ENObj">
      <button v-if="!node.isEntry" @click="removeCurrentBox({ node, nodes, mesh: ENObj })">Remove me</button>
      <button @click="() => { $emit('ENObj', false) }">close</button>
      <br />
      <span :style="{ color: node.error ? 'red': 'black' }" v-if="node">{{ node.error }} <br /></span>
      <br />
      <textarea class="glsl-edit" :style="{ color: node.error ? 'red': 'black' }"  cols="50" rows="10" v-model="node.src" @input="updateSRC({ node, nodes })" />

      <h1>VertexShader</h1>
      <pre>{{ glsl.vertexShader }}</pre>
      <h1>FragmentShader</h1>
      <pre>{{ glsl.fragmentShader }}</pre>
    </div>

  </div>
</template>

<script>
// import * as THREE from 'three'
import * as EN from '../../../HeartSpace/EffectNodeCore.js'

export default {
  props: {
    glsl: {},
    root: {},
    ENObj: {},
    Heart: {}
  },
  data () {
    return {
      variationIndex: 0,
      EN
    }
  },
  computed: {
    node () {
      return this.ENObj.userData.node
    },
    nodes () {
      if (this.root && this.root.state && this.root.state.nodes) {
        return this.root.state.nodes
      } else {
        return false
      }
    }
  },
  watch: {
  },
  methods: {
    removeCurrentBox (v) {
      this.$emit('remove-box', v)
    },
    tryRefreshGUI () {
      this.$emit('refresh-gui')
    },
    tryRefreshGLSL () {
      this.$emit('refresh-glsl')
    },
    updateSRC ({ node, nodes }) {
      let iNode = nodes.findIndex(no => no.nid === node.nid)
      try {
        EN.updateSRC({ node, nodes, iNode })
        node.error = null
      } catch (e) {
        node.error = e.message
        // console.error(e)
        console.table([e])
      }
      this.tryRefreshGUI()
      this.tryRefreshGLSL()
    }
  }
}
</script>

<style scoped>
/* .editor-area{
  position: absolute;
  bottom: 20px;
  left: 20px;
} */
/* .tools{
  position: absolute;
  bottom: 20px;
  left: 20px;
} */
.glsl-edit{
  font-size: 17px;
}

</style>
