<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
       Visual Effect Flow Editor
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <!-- Lok Lok -->
      <SVGArea
      ref="svgarea"
      @cloneModule="cloneModule"
      @removeBox="removeBox"
      @editBox="editBox"
      @saveBox="updateBox"
      @animateBox="animateBox"
      @disconnect="updateBothSocket"
      @connect="updateBothSocket"
      @moveBox="updateBox"
      @ready="hasSvg = true"
      v-if="portal && ready && root" :Doc="Doc" :meta="portal.data" :connectors="connectors" :modules="root.modules" :uiAPI="uiAPI" :Data="Data" :root="root" :win="portal.win">
      </SVGArea>
      <div class="buttons bottom-left" v-if="hasSvg">
        <span class="linker" @click="makePulseMod">Add Main Loop</span>
        <span class="linker" @click="makeDomMod">Add Dom Updater</span>
        <span class="linker" @click="openModuleGallery">Module Gallery</span>
      </div>
      <div class="tools top-left" v-if="hasSvg">
        <span class="linker" @click="scrollHome">Home View</span>
        <span class="linker" @click="duplicateWindow">Duplicate Window</span>
        <span class="linker" @click="toggleFlow">Toggle Flow</span>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar/Index.vue'
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
      hasSvg: false,
      Doc: false,
      Data: false,
      root: false,
      ready: false
      // portal: false
    }
  },
  methods: {
    scrollHome () {
      this.$refs['svgarea'].scrollHome()
    },
    duplicateWindow () {
      this.$refs['svgarea'].duplicateWindow()
    },
    toggleFlow () {
      this.$refs['svgarea'].toggleFlow()
    },
    async cloneModule ({ box }) {
      if (window.confirm('clone this module?\n' + box.name)) {
        let Data = this.uiAPI.hive.Data
        let Doc = this.uiAPI.hive.Doc
        Data.cloneModule({ Doc, mod: box })
      }
    },
    removeBox ({ box, inputs, outputs }) {
      if (window.prompt('type yes to remove this module and its connnections?') === 'yes') {
        let Data = this.uiAPI.hive.Data
        Data.ts.modules.remove(box)

        inputs.forEach((input) => {
          Data.ts.connectors.remove(input)
        })

        outputs.forEach((output) => {
          Data.ts.connectors.remove(output)
        })
      }
    },
    editBox (box) {
      console.log('editBox', box)

      let found = this.uiAPI.portal.portals.find(p => p.data.boxID === box._id)
      if (found) {
        this.$nextTick(() => {
          this.uiAPI.portal.activate(found)
        })
      } else {
        this.uiAPI.portal.addWindow({
          type: 'mod-editor',
          appName: box.name,
          data: {
            boxID: box._id,
            userID: box.userID,
            projectID: box.projectID,
            boxUUID: box.id
          }
        })
      }
    },
    openModuleGallery () {
      let found = this.uiAPI.portal.portals.find(p => p.app === 'ModuleGalleryApp')
      if (found) {
        this.$nextTick(() => {
          this.uiAPI.portal.activate(found)
        })
      } else {
        this.uiAPI.portal.addWindow({
          type: 'mod-gallery',
          appName: 'Module Gallery',
          data: {
          }
        })
      }
    },
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
      }, 500)
      // Data.ts.modules.update(box)
    },
    makePulseMod () {
      let Data = this.uiAPI.hive.Data
      let Doc = this.uiAPI.hive.Doc
      Data.makePulseMod({ Doc })
    },
    makeDomMod () {
      let Data = this.uiAPI.hive.Data
      let Doc = this.uiAPI.hive.Doc
      Data.makeDomMod({ Doc })
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
        return this.root.connectors.slice().sort((a, b) => {
          return a.idx - b.idx
        })
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

.linker{
  text-decoration: underline;
  cursor: pointer;
  color: black;
  margin-left: 8px;
  background-color: white;
}

.quotes-app{
  /* background: linear-gradient(90deg, #eef3ff 0%, #8aa3d4 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: white;
  background-image: radial-gradient( circle farthest-corner at 100% 100%, rgb(193, 234, 255) 0%, rgb(255, 255, 255) 90.1% );
/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  position: relative;
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

.tools.top-left{
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
