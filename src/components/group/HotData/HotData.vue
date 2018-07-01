<template>
  <div class="gui-data">
    <div v-if="guiRootState">

      <div v-if="page === 'Collections'">
        <NewCollection
          v-if="guiRootState"
          :root="guiRootState"
          @send="commitObj(guiRootState);"
        />
        <MyCollections
          :root="guiRootState"
          @enter-collection="enterCollection"
          @send="commitObj(guiRootState);"
        />
      </div>

      <div v-if="page === 'Entries'">
        <NavBar
          @home="page = 'Collections'"
          :collection="collection"
          :root="guiRootState"
          @send="commitObj(guiRootState)"
        />
        <DataTemplate
          :root="guiRootState"
          @send="commitObj(guiRootState)"
        />
      </div>

      <!-- {{ root }} -->
      <!-- <pre>{{ doc }}</pre> -->
    </div>
  </div>
</template>

<script>
import Rotater from './Rotater/Rotater.vue'

import DataTemplate from './DataTemplate.vue'
import NewCollection from './NewCollection.vue'
import MyCollections from './MyCollections.vue'
import NavBar from './NavBar.vue'
import * as Hot from './HotData.js'
export default {
  props: {
    doc: {},
    sendData: {}
  },
  components: {
    NavBar,
    DataTemplate,
    MyCollections,
    NewCollection,
    Rotater
  },
  data () {
    return {
      Hot,
      enable: true,
      collection: false,
      page: 'Collections', // Entries
      PI: Math.PI,
      guiRootState: false
    }
  },
  methods: {
    enterCollection ({ collection }) {
      this.page = 'Entries'
      this.collection = collection
    },
    commitSource (rootSRC) {
      let file = this.provideJSONFile()
      file.src = rootSRC

      this.sendData({
        type: 'hot-data-root',
        detail: JSON.parse(rootSRC)
      })
      this.$emit('just-save')
    },
    commitObj (guiData) {
      let file = this.provideJSONFile()
      file.src = JSON.stringify(guiData, null, '\t')

      this.sendData({
        type: 'hot-data-root',
        detail: guiData
      })
      this.$emit('just-save')
    },
    provideJSFile () {
      let jsFile = (this.doc.files || []).find(f => f.path === '@/hot-data.access.js')
      let src =
`import root from '@/hot-data.hydrate.json'

export const state = {
  root: {
    ...root
  }
}

window.addEventListener('hot-data-root', (evt) => {
  console.log('App Got Root Data Update:', evt.detail.detail);
  var data = evt.detail
  state.root = data.detail
}, false);
`
      if (!jsFile) {
        jsFile = {
          readOnly: true,
          path: '@/hot-data.access.js',
          src: src
        }
        this.doc.files.push(jsFile)
        this.$emit('just-save')
      }
      return jsFile
    },
    provideJSONFile () {
      // this.provideAccessV1()
      this.provideJSFile()

      let rootFile = (this.doc.files || []).find(f => f.path === '@/hot-data.hydrate.json')
      if (!rootFile) {
        this.doc.files.push({
          path: '@/hot-data.hydrate.json',
          src: JSON.stringify({
            dbs: [],
            cTrash: []
          }, null, '\t')
        })
        this.$emit('just-save')
      }

      return (this.doc.files || []).find(f => f.path === '@/hot-data.hydrate.json')
    },
    provideData () {
      let file = this.provideJSONFile()
      return JSON.parse(file.src)
    },
    loadUI () {
      this.guiRootState = this.provideData()
      this.$forceUpdate()
      Hot.fillRoot({ root: this.guiRootState })
      this.commitObj(this.guiRootState)
    }
  },
  mounted () {
    this.loadUI()
  },
  watch: {
    doc () {
      this.loadUI()
    }
  },
  computed: {
  }
}
</script>

<style scoped>
@import url(./Shared.css);

.gui-data{
  margin: 8px;
}


</style>
