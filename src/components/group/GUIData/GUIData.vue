<template>
  <div class="gui-data">
    <div v-if="uiVisible && guiRootState">

      <Collection
        :root="guiRootState"
        @send="commitObj(guiRootState)"
      />

      <div class="hr"></div>

      <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="guiRootState.x" @input="guiRootState.x = Number(guiRootState.x); commitObj(guiRootState)" />
      <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="guiRootState.x" @input="guiRootState.x = Number(guiRootState.x); commitObj(guiRootState)" />
      x
      <br />

      <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="guiRootState.y" @input="guiRootState.y = Number(guiRootState.y); commitObj(guiRootState)" />
      <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="guiRootState.y" @input="guiRootState.y = Number(guiRootState.y); commitObj(guiRootState)" />
      y
      <br />

      <input type="range" :min="-PI" :max="PI" step="0.0001" v-model="guiRootState.z" @input="guiRootState.z = Number(guiRootState.z); commitObj(guiRootState)" />
      <input type="number" :min="-PI" :max="PI" step="0.0001" v-model="guiRootState.z" @input="guiRootState.z = Number(guiRootState.z); commitObj(guiRootState)" />
      z
      <br />

      <!-- <Rotater style="width: 200px; height: 200px;" @rotation="(v) => { root.rotation = v; commitObj(guiRootState); }" /> -->
      <textarea v-model="guiRootState.note" @input="commitObj(guiRootState)" cols="30" rows="10"></textarea>

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
      guiRootState: false,
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
    this.guiRootState = this.provideData()
  },
  watch: {
    doc () {
      this.guiRootState = this.provideData()
      this.commitObj(this.guiRootState)
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
