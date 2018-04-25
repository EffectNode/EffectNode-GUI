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
    variationsLength () {
      this.variationIndex = this.root.variations.length - 1
      this.variationIndex = this.variationIndex < 0 ? 0 : this.variationIndex
    },
    // root () {
    //   this.variationIndex = 0
    // },
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
    },
    loadVar ({ fromVar, toVar }) {
      let history = EN.loadVariation({ root: this.root, index: toVar })

      if (history) {
        this.root.state = history
        this.$emit('root', {
          ...this.root
        })
      }

      console.log(history)

      this.tryRefreshGUI()
      this.tryRefreshGLSL()
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
  return sin(time * 3.0 + i1 + position.x + position.y) * 1.0;
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
