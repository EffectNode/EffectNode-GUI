<template>
  <div>
    <!-- Effect Node Editor -->
    <div class="editor-area" v-if="ENObj">
      <div :key="node.nid" v-for="(node, iNode) in nodes" v-if="node.nid === ENObj.userData.node.nid">
        <button v-if="!node.isEntry" @click="removeCurrentBox({ node, nodes, mesh: ENObj, iNode })">Remove me</button>
        <button @click="() => { $emit('ENObj', false) }">close</button>
        <br />
        <span :style="{ color: node.error ? 'red': 'black' }" v-if="node">{{ node.error }} <br /></span>
        <br />
        <textarea class="glsl-edit" :style="{ color: node.error ? 'red': 'black' }"  cols="50" rows="10" v-model="node.src" @input="updateSRC({ node, iNode, nodes })" />
        <!-- node<br/><pre>{{ node }}</pre>
        connections<br/><pre>{{ connections }}</pre> -->
        <h1>VertexShader</h1>
        <pre>{{ glsl.vertexShader }}</pre>
        <h1>FragmentShader</h1>
        <pre>{{ glsl.fragmentShader }}</pre>
      </div>
    </div>

    <!-- Tools -->
    <div class="tools" v-if="!ENObj && root">
      <button @click="() => { $emit('close');  }">close</button>

      <button @click="addEffectNode({ shaderType: EN.VERTEX_SHADER })">+VertexNode</button>
      <button @click="addEffectNode({ shaderType: EN.FRAGMENT_SHADER })">+FragmentNode</button>
      <br />
      <input v-if="root && root.variations" v-model="variationIndex" type="range" min="0" :max="root.variations.length - 1" step="1">

      <button @click="makeVar()">Make Variation</button>
      <button @click="EN.exportRoot({ root: root })">Export Proj</button>
      <input type="file" @change="restoreProject">
      <br />
      Image1 <input accept="image/*" type="file" @change="loadImage1">
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
    Heart: {},
    camera: {}
  },
  data () {
    return {
      variationIndex: 0,
      EN
    }
  },
  computed: {
    nodes () {
      if (this.root && this.root.state && this.root.state.nodes) {
        return this.root.state.nodes
      } else {
        return false
      }
    },
    variationsLength () {
      return this.root.variations.length
    }
  },
  watch: {
    variationsLength () {
      this.variationIndex = this.root.variations.length - 1
      this.variationIndex = this.variationIndex < 0 ? 0 : this.variationIndex
    },
    root () {
      this.variationIndex = 0
    },
    variationIndex (toVar, fromVar) {
      this.loadVar({ toVar, fromVar })
    }
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
    makeVar () {
      if (this.root.variations.length === 0) {
        EN.makeVariation({ root: this.root })
      }
      EN.makeVariation({ root: this.root })
      EN.saveRoot({ root: this.root })
      this.$forceUpdate()
    },
    updateSRC ({ node, nodes, iNode }) {
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
    },
    loadVar ({ fromVar, toVar }) {
      this.$nextTick(() => {
        let history = EN.loadVariation({ root: this.root, index: toVar })

        if (history) {
          this.root.state = history
          this.$emit('root', this.root)
        }

        this.tryRefreshGUI()
        this.tryRefreshGLSL()
      })
    },

    loadImage1 (evt) {
      this.loadImageTo({ to: 'uImage1', evt })
    },

    loadImageTo ({ to, evt }) {
      let file = evt.target.files[0]
      if (file) {
        this.root.state.uniforms.find(u => u.src.indexOf(to) !== -1).val = URL.createObjectURL(file)
      }
    },

    addEffectNode ({ shaderType = EN.VERTEX_SHADER }) {
      if (shaderType === EN.VERTEX_SHADER) {
        this.nodes.push(EN.makeNode({
          src:
`float floatModifier (float i1) {
  return sin(time * 3.0 + i1) * 3.0;
}`,
          isEntry: false,
          shaderType,
          nodePos: { ...this.camera.position, y: this.camera.position.y + 12, z: 0 }
        }))
      } else {
        this.nodes.push(EN.makeNode({
          src:
`vec4 textureReader () {
  return texture2D(uImage1, (vUv - 0.5) * 1.0 + 0.5);
}`,
          isEntry: false,
          shaderType,
          nodePos: { ...this.camera.position, y: this.camera.position.y + 12, z: 0 }
        }))
      }

      this.tryRefreshGUI()
      this.tryRefreshGLSL()
    },

    restoreProject (evt) {
      EN
        .readTextFile({
          file: evt.target.files[0]
        })
        .then(EN.JSON2OBJ)
        .then((o) => {
          this.$emit('root', o)
          this.tryRefreshGUI()
          this.tryRefreshGLSL()
          this.$nextTick(() => {
            this.variationIndex = o.variations.length - 1
          })
        })
    }
  }
}
</script>

<style>

</style>
