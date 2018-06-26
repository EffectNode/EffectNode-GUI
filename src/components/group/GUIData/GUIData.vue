<template>
  <div class="gui-data">
    <div v-if="uiVisible && root">

      <Collection
        :root="root"
        @send="commitObj(root)"
      />

      <div class="hr"></div>

      <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="root.rotation.x" @input="root.rotation.x = Number(root.rotation.x); commitObj(root)" />
      <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="root.rotation.x" @input="root.rotation.x = Number(root.rotation.x); commitObj(root)" />
      x <br />
      <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="root.rotation.y" @input="root.rotation.y = Number(root.rotation.y); commitObj(root)" />
      <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="root.rotation.y" @input="root.rotation.y = Number(root.rotation.y); commitObj(root)" />
      y <br />
      <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="root.rotation.z" @input="root.rotation.z = Number(root.rotation.z); commitObj(root)" />
      <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="root.rotation.z" @input="root.rotation.z = Number(root.rotation.z); commitObj(root)" />
      z <br />

      <!-- <Rotater style="width: 200px; height: 200px;" @rotation="(v) => { root.rotation = v; commitObj(root); }" /> -->

      <textarea v-model="root.note" @input="commitObj(root)" cols="30" rows="10"></textarea>
      <!-- {{ root }} -->
      <!-- <pre>{{ doc }}</pre> -->
    </div>
  </div>
</template>

<script>
import Rotater from './Rotater/Rotater.vue'

import Collection from './Collection.vue'
export default {
  props: {
    doc: {},
    sendData: {},
    uiVisible: {}
  },
  components: {
    Collection,
    Rotater
  },
  data () {
    return {
      PI: Math.PI,
      root: false,
      JSON
    }
  },
  created () {
  },
  methods: {
    commitSource (rootSRC) {
      let file = this.provideJSONFile()
      file.src = rootSRC

      this.sendData({
        type: 'root-data',
        detail: JSON.parse(rootSRC)
      })
    },
    commitObj (guiData) {
      let file = this.provideJSONFile()
      file.src = JSON.stringify(guiData, null, '\t')

      this.sendData({
        type: 'root-data',
        detail: guiData
      })
    },
    provideJSFile () {
      let jsFile = (this.doc.files || []).find(f => f.path === '@/root-data.js')

      let src =
`import root from '@/root.readonly.json'

export const state = {
  root: {
    ...root
  }
}

window.addEventListener('root-data', (evt) => {
  console.log('App Got Root Data Update:', evt.detail.detail);
  var data = evt.detail
  state.root = data.detail
}, false);
`
      if (!jsFile) {
        jsFile = {
          readOnly: true,
          path: '@/root-data.js',
          src: src
        }
        this.doc.files.push(jsFile)
        this.$emit('just-save')
      }
      return jsFile
    },
    provideJSONFile () {
      this.provideJSFile()

      let rootFile = (this.doc.files || []).find(f => f.path === '@/root.readonly.json')
      if (!rootFile) {
        rootFile = {
          readOnly: true,
          path: '@/root.readonly.json',
          src: JSON.stringify({
            note: 'haha'
          }, null, '\t')
        }
        this.doc.files.push(rootFile)
        this.$emit('just-save')
      }

      if (!rootFile.readOnly) {
        rootFile.readOnly = true
        this.$emit('just-save')
      }
      return rootFile
    },
    provideData () {
      let rootFile = this.provideJSONFile()
      let rootSrc = rootFile.src || '{}'
      let rootObj = JSON.parse(rootSrc)
      return rootObj
    }
  },
  mounted () {
    this.root = this.provideData()
  },
  watch: {
    doc () {
      this.root = this.provideData()
      this.commitObj(this.root)
    }
  },
  computed: {

  }
}
</script>

<style scoped>
.gui-data{
  margin: 8px;
}


.hr{
  margin-top: 18px;
  margin-bottom: 38px;
  height: 3px;
  border-top: black solid 1px;
  border-bottom: black solid 1px;

  width: 100%;
  max-width: 650px;
}

</style>
