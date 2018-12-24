<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      {{ portal.app }}
      <button @click="view = 'debug'">Debug</button>
      <button @click="view = 'code'">Code</button>
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">

      <codemirror
        class="code-editor"
        v-if="currentMod && view === 'code'"
        ref="myCm"

        :options="cmOptions"
        @ready="onCmReady"
        @focus="onCmFocus"
        @input="onCmCodeChange">
      </codemirror>

      <div v-if="view === 'debug'">
        <h1>
          Mod Editor
        </h1>

        <pre>{{ currentMod }}</pre>
        <h1>portal</h1>
        <pre>{{ portal }}</pre>

        <h1>Active Inputs</h1>
        <pre>{{ activeInputs }}</pre>
        <h2>Active Outpus</h2>
        <pre>{{ activeOutputs }}</pre>
      </div>

      <!--
      {{ modules }}
      {{ connectors }}
      {{ pairs }}
      -->

      <!-- Lok Lok -->
      <!-- <SVGArea v-if="portal && ready" :Doc="Doc" :connectors="connectors" :modules="modules" :Data="Data" :root="root" :win="portal.win" /> -->
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import TitleBar from '../TitleBar'
import 'codemirror/mode/javascript/javascript.js'

// import axios from 'axios'
// import SVGArea from '../../SVGArea/Index.vue'
// import nlp from 'compromise'
// import csv from 'csvtojson'
// import { codemirror } from 'vue-codemirror'

// // require styles
// import 'codemirror/lib/codemirror.css'

// var CodeMirror = require('codemirror').default

// CodeMirror.defineMode('mymode', () => {
//   return {
//     token (stream, state) {
//       if (stream.match('const')) {
//         return 'style1'
//       } else if (stream.match('bbb')) {
//         return 'style2'
//       } else {
//         stream.next()
//         return null
//       }
//     }
//   }
// })

export default {
  components: {
    codemirror,
    TitleBar// ,
    // SVGArea
  },
  props: {
    uiAPI: {},
    portal: {}
  },
  created () {
    // this.$on('resize', ({ portal }) => {
    //   this.portal = portal
    // })
  },
  data () {
    let self = this
    return {
      view: 'code',
      Doc: false,
      Data: false,
      root: false,
      ready: false,

      cmOptions: {
        extraKeys: {
          'Cmd-S': () => {
            self.saveMe()
          },
          'Ctrl-S': () => {
            self.saveMe()
          },
          'Ctrl-Space': 'autocomplete',
          'Ctrl-Q': function (cm) {
            cm.foldCode(cm.getCursor())
          }
        },
        // codemirror options
        keyMap: 'sublime',
        tabSize: 2,
        // codemirror options
        mode: 'text/javascript',
        theme: 'monokai',
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
      // portal: false
    }
  },
  methods: {
    saveMe () {
      this.Data.ts.modules.update(this.currentMod)
    },
    init () {
      let { Doc, Data } = this.uiAPI.hive
      this.Doc = Doc
      this.Data = Data
      this.root = Doc.root
      this.ready = true

      // console.log('OMG', )

      // this.$refs.mounter.appendChild(this.uiAPI.execEnv.Sys.$el)

      // return Hive.get({ doc: 'happy' }).then(({ Data, Doc }) => {
      //   this.Doc = Doc
      //   this.Data = Data
      //   this.root = Doc.root
      //   this.ready = true
      // })
    },
    onCmReady (cm) {
      console.log('the editor is readied!', cm)
      let doc = cm.getDoc()
      doc.setValue(this.currentMod.src)
    },
    onCmFocus (cm) {
      console.log('the editor is focus!', cm)
    },
    onCmCodeChange (newCode) {
      console.log('this is new code', newCode)
      this.currentMod.src = newCode
      // this.$forceUpdate()
      this.Data.ts.modules.update(this.currentMod)
    },
    getCurrentMod () {
      return this.modules.find(m => m._id === this.portal.data.boxID)
    }
  },
  watch: {
  },
  computed: {
    codemirror () {
      return this.$refs.myCm.codemirror
    },
    currentMod () {
      return this.getCurrentMod()
    },
    activeInputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'input'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    activeOutputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'output'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    connectors () {
      if (this.root) {
        // let modIDs = this.root.modules.map(m => m.id)
        return this.root.connectors.filter(c => {
          return c.mod.from === this.portal.data.boxUUID
        }).slice().sort((a, b) => {
          return a.idx - b.idx
        })
        // .filter(c => {
        //   return modIDs.includes(c.mod.from) || modIDs.includes(c.mod.to)
        // })
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
  color: black;
  background-image: radial-gradient( circle farthest-corner at 100% 100%, rgb(193, 234, 255) 0%, rgb(255, 255, 255) 90.1% );
/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  height: calc(100% - 30px);
  overflow: auto;
  /* -webkit-overflow-scrolling: touch;
  overflow: auto; */
}

.quotes-list{
  margin: 20px;
}

.code-editor{
  height: 100%;
  overflow: scroll;
}
</style>
