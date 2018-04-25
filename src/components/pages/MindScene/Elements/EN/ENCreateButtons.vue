<template>
  <div>
    <!-- Tools -->
    <div class="tools" v-if="root">

      <button @click="addEffectNode({ shaderType: EN.VERTEX_SHADER })">+VertexNode</button>
      <button @click="addEffectNode({ shaderType: EN.FRAGMENT_SHADER })">+FragmentNode</button>

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
    root: {},
    // Heart: {},
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
    }
    // variationsLength () {
    //   return this.root.variations.length
    // }
  },
  watch: {
    // variationsLength () {
    //   this.variationIndex = this.root.variations.length - 1
    //   this.variationIndex = this.variationIndex < 0 ? 0 : this.variationIndex
    // },
    // root () {
    //   this.variationIndex = 0
    // },
    // variationIndex (toVar, fromVar) {
    //   this.loadVar({ toVar, fromVar })
    // }
  },
  methods: {
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

    tryRefreshGUI () {
      this.$emit('refresh-gui')
    },
    tryRefreshGLSL () {
      this.$emit('refresh-glsl')
    }
  }
}
</script>

<style>

</style>
