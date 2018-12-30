<template>
  <div class="full quotes-app">
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      <span  v-if="currentMod">
        {{ currentMod.name }}:
      </span>
      <span style="cursor: pointer; margin: 0px 6px; text-decoration: underline;" @click="view = 'inspect'">Insepctor</span>
      <span style="cursor: pointer; margin: 0px 6px; text-decoration: underline;" @click="view = 'remix'">Remixer</span>
      <span style="cursor: pointer; margin: 0px 6px; text-decoration: underline;" @click="view = 'code'">Code</span>

    </TitleBar>
    <div class="content-div" @click="$emit('activated')">

      <div v-show="view === 'remix'" class="full">
         <div v-if="currentMod && currentMod.meta.length === 0">
          Effect Settings, choose to use
          <button v-show="currentMod.meta.length === 0" @click="addRange()">Value Sliders</button>
          or
          <button v-show="currentMod.meta.length === 0" @click="addTimelineTrack()">Timeline</button>
        </div>

        <RemixTimeline
          v-if="currentMod && remixmode === 'timeline'"
          @addTimelineTrack="addTimelineTrack"
          @removeMeta="removeMeta"
          @saveMeta="saveMeta"
          @saveModule="saveModule"
          :outputs="outputs"
          :currentMod="currentMod"
          :portal="portal"
        ></RemixTimeline>
        <RemixValues
          v-if="currentMod && remixmode === 'values'"
          @addRange="addRange"
          @removeMeta="removeMeta"
          @saveMeta="saveMeta"

          :currentMod="currentMod"
          :portal="portal"
        ></RemixValues>
      </div>

      <div v-show="view === 'code'" class="full" ref="editor">

        <!-- <codemirror
          class="code-editor"

          ref="myCm"

          :options="cmOptions"
          @ready="onCmReady"
          @d-focus="onCmFocus"
          @d-blur="onCmBlur"
          @input="onCmCodeChange">
        </codemirror> -->

      </div>


      <div v-show="view === 'inspect'">
        <div style="width: 90%; margin: 0px 5%;" v-if="currentMod && inputs && outputs">

          <h1>Inspector</h1>
          <h2 v-if="currentMod">{{ currentMod.name }}</h2>
          <input type="text" v-if="currentMod" v-model="currentMod.name" @input="saveModuleBox()" style="width: 400px;" />

          <h2>
            I/O Input Sockets
          </h2>
          <ul>
            <li :key="input._id" v-for="(input, ii) in inputs">
              <input type="color" v-model="input.color" @change="saveConnection(input)" style="width: 20px;" />
              <input type="text" v-model="input.color" @change="saveConnection(input)" style="width: 40px;" />
              env.inputs[{{ ii }}].name
              <input type="text" v-model="input.name" @input="saveModuleBox()" /> <button class="en-btn en-btn-danger" @click="removeSocket(input)">-</button>
            </li>
            <li><button class="en-btn en-btn-successful" @click="addSocket(currentMod, 'input')">+</button></li>

          </ul>
          <h2>
            I/O Output Sockets
          </h2>
          <ul>
            <li :key="output._id" v-for="(output, ii) in outputs">
              <input type="color" v-model="output.color" @change="saveConnection(output)" style="width: 20px;" />
              <input type="text" v-model="output.color" @change="saveConnection(output)" style="width: 40px;" />
              env.outputs[{{ ii }}].name
              <input type="text" v-model="output.name" @input="saveModuleBox()" /> <button class="en-btn en-btn-danger" @click="removeSocket(output)">-</button>
            </li>
            <li><button class="en-btn en-btn-successful" @click="addSocket(currentMod, 'output')">+</button></li>
          </ul>

          <h1>Current Module</h1>
          <pre>{{ currentMod }}</pre>
          <h1>Portal</h1>
          <pre>{{ portal }}</pre>

          <h1>
            Module I/O Inspector
          </h1>
          <h2>Active & Connected Inputs</h2>
          <pre>{{ activeInputs }}</pre>
          <h2>Active & Connected Outpus</h2>
          <pre>{{ activeOutputs }}</pre>
        </div>
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
// import { codemirror } from 'vue-codemirror'
import TitleBar from '../TitleBar'
// import 'codemirror/mode/javascript/javascript.js'
import * as brace from 'brace'
import 'brace/mode/javascript'
import 'brace/mode/glsl'
import 'brace/theme/monokai'
import 'brace/ext/searchbox'
import RemixTimeline from './RemixTimeline'
import RemixValues from './RemixValues'

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
    RemixValues,
    RemixTimeline,
    // codemirror,
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
      get view () {
        return self.portal.data.view || 'inspect'
      },
      set view (v) {
        self.portal.data.view = v
      },
      Doc: false,
      Data: false,
      root: false,
      ready: false // ,

      // cmOptions: {
      //   extraKeys: {
      //     'Cmd-S': () => {
      //       self.saveModuleBox()
      //     },
      //     'Ctrl-S': () => {
      //       self.saveModuleBox()
      //     },
      //     // 'Ctrl-Space': 'autocomplete',
      //     'Ctrl-Q': function (cm) {
      //       cm.foldCode(cm.getCursor())
      //     }
      //   },
      //   // codemirror options
      //   keyMap: 'sublime',
      //   tabSize: 2,
      //   // codemirror options
      //   mode: 'text/javascript',
      //   theme: 'monokai',
      //   lineNumbers: true// ,
      //   // line: true
      //   // more codemirror options, 更多 codemirror 的高级配置...
      // }
      // portal: false
    }
  },
  methods: {
    addSocket (currentMod, type) {
      if (type === 'input' || type === 'output') {
        this.Data.makeSocket({ Doc: this.Doc, idx: this.Data.getIDX(), type, modID: currentMod.id })
      } else {
        console.error('bad types')
      }
    },
    removeSocket (socket) {
      this.Data.removeSocketFromMod({ socket })
    },
    setDefaultView () {
      let defaultView = this.currentMod.meta.length > 0 ? 'remix' : 'code'
      this.portal.data.view = this.portal.data.view || defaultView
    },
    saveModule () {
      this.Data.ts.modules.animate(this.currentMod)
      clearTimeout(this.metaDelay)
      this.metaDelay = setTimeout(() => {
        this.Data.ts.modules.update(this.currentMod)
        window.dispatchEvent(new Event(`refresh-iframe`))
      }, 500)
    },
    saveMeta ({ m, mi }) {
      if (m.type === 'range') {
        m.value = Number(m.value)
      }

      window.dispatchEvent(new CustomEvent('iframe-post-message', { detail: { type: 'send-module-meta', module: this.currentMod, meta: m } }))

      // this.Data.ts.modules.animate(this.currentMod)
      clearTimeout(this.metaDelay)
      this.metaDelay = setTimeout(() => {
        this.Data.ts.modules.update(this.currentMod)
      }, 500)
    },
    addRange () {
      this.addMeta({
        id: '_r' + (Math.random() * 1024 * 1024 * 1024).toFixed(0),
        label: 'translateX',
        type: 'range',
        min: -100,
        max: 100,
        step: 0.1,
        value: 0
      })
    },
    addTimelineTrack () {
      this.addMeta({
        id: '_r' + (Math.random() * 1024 * 1024 * 1024).toFixed(0),
        label: window.prompt(`what's the name of the time track? like opacity, speed, amount and etc`) || 'my-track',
        type: 'timeline-track',
        value: {
          // mode: 'starting',
          // starting: 0,
          // during: 0,
          // leaving: 0,
          // timebox: 0,
          // tick: 0,
          // now: 0,

          start: 0,
          afterStart: 3,
          beforeEnd: 12,
          end: 15,
          totalTime: 15
        }
      })
    },
    addMeta (v) {
      this.currentMod.meta.push(v)
      this.Data.ts.modules.update(this.currentMod)
    },
    removeMeta (v) {
      let idx = this.currentMod.meta.findIndex(e => e.id === v.id)
      this.currentMod.meta.splice(idx, 1)
      this.Data.ts.modules.update(this.currentMod)
    },
    saveConnection (v) {
      this.Data.ts.connectors.animate(v)
      clearTimeout(this.connTimeout)
      this.connTimeout = setTimeout(() => {
        this.Data.ts.connectors.update(v)
      }, 500)
    },
    saveModuleBox () {
      this.Data.ts.modules.animate(this.currentMod)
      clearTimeout(this.modTimeout)
      this.modTimeout = setTimeout(() => {
        window.dispatchEvent(new Event('refresh-iframe'))
        this.Data.ts.modules.update(this.currentMod)
      }, 500)
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

    setupBrace () {
      this.$refs.editor.innerHTML = ''
      var editor = this.editor = brace.edit(this.$refs.editor)
      editor.setTheme('ace/theme/monokai')
      editor.setFontSize(14)
      editor.setOptions({
        fontFamily: 'Inconsolata'
      })
      this.editor.$blockScrolling = Infinity

      this.$on('resize', () => {
        this.editor.resize()
      })

      this.editor.on('change', () => {
        if (this.stopWatch) {
          return
        }
        let newCode = this.editor.getValue()
        this.currentMod.src = newCode
        // this.Data.ts.modules.update(this.currentMod)
        this.saveModuleBox()
      })

      // on data down
      this.Data.ts.modules.onLocal({
        handler: ({ results }) => {
          this.stopWatch = true
          // console.log(results.src)
          this.currentMod.src = results.src
          this.editor.setValue(this.currentMod.src, 1)
          // this.editor.moveCursorTo(0, 0)
          // this.editor.focus()
          // cm.focus()
          this.stopWatch = false
        },
        method: 'update'
      })

      var session = editor.getSession()
      session.setUseWrapMode(false)
      session.setUseWorker(false)
      session.setMode('ace/mode/javascript')
      session.setOptions({ tabSize: 2, useSoftTabs: true })

      var commands = [
        {
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: () => {
            let newCode = this.editor.getValue()
            this.currentMod.src = newCode
            this.Data.ts.modules.update(this.currentMod)
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'multicursor',
          bindKey: { win: 'Ctrl-D', mac: 'Command-D' },
          exec: function (editor) {
            editor.selectMore(1)
          },
          // multiSelectAction: 'forEach',
          scrollIntoView: 'cursor',
          readOnly: true // false if this command should not apply in readOnly mode
        }
      ]

      commands.forEach((command) => {
        this.editor.commands.addCommand(command)
      })

      this.editor.setValue(this.currentMod.src, 1)
    }

    // onCmReady (cm) {
    //   console.log('the editor is readied!', cm)
    //   let doc = cm.getDoc()
    //   doc.setValue(this.currentMod.src)
    //   // this.Data.ts.modules.onLocal({
    //   //   handler: ({ results }) => {
    //   //     this.stopWatch = true
    //   //     // console.log(results.src)
    //   //     this.currentMod.src = results.src
    //   //     doc.setValue(results.src, {scroll: false})
    //   //     // cm.focus()
    //   //     this.stopWatch = false
    //   //   },
    //   //   method: 'update'
    //   // })
    // },
    // onCmFocus (cm) {
    //   console.log('the editor is focus!', this.scrollInfo)
    //   // cm.focus()
    //   if (this.scrollInfo) {
    //     // cm.scrollTo(this.scrollInfo.left, this.scrollInfo.top)
    //     // setInterval(() => {
    //     //   cm.scrollTo(this.scrollInfo.left, this.scrollInfo.top)
    //     // }, 1000)
    //   }
    // },
    // onCmBlur (cm) {
    //   this.scrollInfo = cm.getScrollInfo()
    //   console.log('the editor is blur!', this.scrollInfo)
    // },
    // onCmCodeChange (newCode) {
    //   if (this.stopWatch) {
    //     return
    //   }
    //   console.log('this is new code', newCode)
    //   this.currentMod.src = newCode
    //   // this.$forceUpdate()
    //   this.Data.ts.modules.update(this.currentMod)
    // },
  },
  watch: {
    // meta: {
    //   deep: true,
    //   handler () {
    //     this.meta.forEach((m, mi) => {
    //       window.dispatchEvent(new CustomEvent('iframe-post-message', { detail: { type: 'send-module-meta', module: this.currentMod, meta: m } }))
    //     })
    //   }
    // },

    // meta () {
    //   if (this.meta.length > 0) {
    //     this.setDefaultView()
    //   }
    // },
    // currentMod () {
    //   if (this.currentMod) {
    //     this.setupBrace()
    //   }
    // },
    currentMod (newVal, oldVal) {
      if (newVal && !oldVal) {
        let defaultView = 'inspect'
        if (this.currentMod && this.currentMod.meta.length > 0) {
          defaultView = 'remix'
        }
        this.view = defaultView
      }
    },
    view () {
      if (!this.editor) {
        this.setupBrace()
      }
    }
  },
  computed: {
    remixmode () {
      if (this.hasTimeTrack) {
        return 'timeline'
      } else {
        return 'values'
      }
    },
    hasTimeTrack () {
      return this.meta.filter(m => m.type === 'timeline-track').length > 0
    },
    hasRange () {
      return this.meta.filter(m => m.type === 'range').length > 0
    },
    meta () {
      if (!this.currentMod) {
        return []
      }
      return this.currentMod.meta
    },
    // codemirror () {
    //   return this.$refs.myCm.codemirror
    // },
    currentMod () {
      return this.modules.find(m => m._id === this.portal.data.boxID)
    },
    inputs () {
      return this.connectors.filter((c) => {
        return c.type === 'input'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    outputs () {
      return this.connectors.filter((c) => {
        return c.type === 'output'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
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
@import url(../../CodeMirror/mirror.css);

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
