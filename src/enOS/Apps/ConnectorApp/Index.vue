<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      {{ portal.win.name }}
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <!-- Lok Lok -->
      <SVGArea

      @saveBox="updateBox"
      @animateBox="animateBox"
      @disconnect="updateBothSocket"
      @connect="updateBothSocket"
      @moveBox="updateBox"
      v-if="portal && ready && root" :Doc="Doc" :meta="portal.data" :connectors="connectors" :modules="root.modules" :uiAPI="uiAPI" :Data="Data" :root="root" :win="portal.win" />
    </div>
    <div class="buttons">
      <button @click="addModule">4by4</button>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar'
import SVGArea from '../../SVGArea/Index.vue'
// import nlp from 'compromise'
// import csv from 'csvtojson'
// import * as Hive from '../../data/HiveApp.js'

export default {
  components: {
    TitleBar,
    SVGArea
  },
  props: {
    uiAPI: {},
    portal: {}
  },
  created () {
    // this.$on('resize', ({ portal }) => {
    //   this.portal = portal
    // })
    let Data = this.uiAPI.hive.Data
    Data.ts.modules.$forceUpdate = () => {
      this.$forceUpdate()
    }
    Data.ts.connectors.$forceUpdate = () => {
      this.$forceUpdate()
    }
  },
  data () {
    return {
      Doc: false,
      Data: false,
      root: false,
      ready: false
      // portal: false
    }
  },
  methods: {
    updateBothSocket ({ from, to }) {
      let Data = this.uiAPI.hive.Data
      Data.ts.connectors.update(from)
      Data.ts.connectors.update(to)
    },
    animateBox ({ box }) {
      let Data = this.uiAPI.hive.Data
      // let Doc = this.uiAPI.hive.Doc
      Data.ts.modules.animate(box)
    },
    updateBox ({ box }) {
      let Data = this.uiAPI.hive.Data
      // let Doc = this.uiAPI.hive.Doc

      Data.ts.modules.animate(box)
      clearTimeout(this.boxTimeout)
      this.boxTimeout = setTimeout(() => {
        Data.ts.modules.update(box)
      }, 1000)
    },
    addModule () {
      let Data = this.uiAPI.hive.Data
      let Doc = this.uiAPI.hive.Doc
      Data.makein4out4Mod({ Doc })
    },
    init () {
      let { Doc, Data } = this.uiAPI.hive
      console.log(this.uiAPI.hive)
      this.Doc = Doc
      this.Data = Data
      this.root = Doc.root
      this.ready = true
    }
  },
  computed: {
    connectors () {
      if (this.root) {
        // let modIDs = this.modules.map(m => m.id)
        // return this.root.connectors.filter(c => {
        //   return modIDs.includes(c.mod.from) || modIDs.includes(c.mod.to)
        // })
        return this.root.connectors
      } else {
        return []
      }
    },
    modules () {
      if (this.root) {
        return this.root.modules
      } else {
        return []
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
@import url(../../jot.css);

.quotes-app{
  /* background: linear-gradient(90deg, #eef3ff 0%, #8aa3d4 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: white;
  background-image: radial-gradient( circle farthest-corner at 100% 100%, rgb(193, 234, 255) 0%, rgb(255, 255, 255) 90.1% );
/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  height: calc(100% - 30px);
  /* -webkit-overflow-scrolling: touch;
  overflow: auto; */
}

.quotes-list{
  margin: 20px;
}

.buttons{
  position: absolute;
  bottom: 0px;
  left: 0px;
}
</style>
