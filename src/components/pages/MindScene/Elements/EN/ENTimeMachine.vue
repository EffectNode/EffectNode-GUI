<template>
  <div>
    <input v-if="root && root.variations" v-model="variationIndex" type="range" min="0" :max="root.variations.length - 1" step="1">

    <button @click="makeVar()">Make Variation</button>
    <button @click="EN.exportRoot({ root: root })">Export Effect</button>
    <button for="restore-project" @click="$refs['restore-file'].click()">Load Effect</button>
    <input type="file" name="restore-project" ref="restore-file" @change="restoreProject">
  </div>
</template>

<script>
import * as EN from '../../../HeartSpace/EffectNodeCore.js'

export default {
  props: {
    root: {}
  },
  computed: {
    variationsLength () {
      return this.root.variations.length
    }
  },
  data () {
    return {
      variationIndex: this.root.variations.length - 1
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
    makeVar () {
      if (this.root.variations.length === 0) {
        EN.makeVariation({ root: this.root })
      }
      EN.makeVariation({ root: this.root })
      EN.saveRoot({ root: this.root })
      this.$forceUpdate()
    },
    loadVar ({ fromVar, toVar }) {
      this.$nextTick(() => {
        let history = EN.loadVariation({ root: this.root, index: toVar })
        console.log(history)
        if (history) {
          this.root.state = history
          this.$emit('root', this.root)
        }

        this.tryRefreshGUI()
        this.tryRefreshGLSL()
      })
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
