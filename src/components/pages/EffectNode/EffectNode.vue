<template>
  <div>

    <StatusBar class="statusbar-top">
      <div slot="left">
        <!-- <button @click="state.mode = 'SceneEditor'">SceneEditor</button> -->
        <button v-if="!root.notReady && state.mode === 'ProjectLoader'" @click="state.mode = 'CodeEditor'">CodeEditor</button>
        <button v-if="state.mode === 'CodeEditor'" @click="state.mode = 'ProjectLoader'">ProjectLoader</button>
        <!-- <button @click="state.mode = 'CodeEditor'">CodeEditor</button> -->
      </div>
      <div slot="right">
        <TimeMachine
          v-if="state.mode === 'CodeEditor'"
          :rootDoc="root"
          :output="output"

          @travel="travel"
          @load-root="loadRoot"
          @compile="(v) => { $emit('compile', v) }"
          @just-save="saveProject"
          @change-mode="(v) => { state.mode = v }"
          @tooltip="(v) => { tooltip = v }"
        />
      </div>
    </StatusBar>

    <div class="container-box">
      <div :class="{
        'margin-box': useMarginBox
      }">
        <!-- <keep-alive> -->
        <Component
          :is="state.mode"
          :doc="doc"
          :output="output"
          :currentFilePath="doc.currentFilePath"
          @just-save="saveProject"
          @compile-now="compileNow"
          @compile="(v) => { $emit('compile', v) }"
          @select-file="(v) => { doc.currentFilePath = v }"
          @tooltip="(v) => { tooltip = v }"

          @change-mode="(v) => { state.mode = v }"
          @load-root="loadRoot"
          @save-method="(v) => { saveMethod = v }"
        >
        </Component>
        <!-- </keep-alive> -->
      </div>
    </div>

    <Tooltip v-if="isBigEnough" v-show="tooltip" :tooltip="tooltip" />

    <ExecEnv ref="exec" :files="doc.files" @src="onCompileComplete" />

  </div>
</template>

<script>
import TimeMachine from '@/components/parts/EffectNode/TimeMachine/TimeMachine.vue'
import ExecEnv from '@/components/parts/EffectNode/ExecEnv/ExecEnv.vue'
import StatusBar from '@/components/parts/EffectNode/StatusBar/StatusBar.vue'
import Tooltip from '@/components/parts/EffectNode/Tooltip/Tooltip.vue'
import * as ENdb from '@/components/parts/EffectNode/ENdb/ENdb.js'

import SceneEditor from '@/components/group/SceneEditor/SceneEditor.vue'
import CodeEditor from '@/components/group/CodeEditor/CodeEditor.vue'
import ProjectLoader from '@/components/group/ProjectLoader/ProjectLoader.vue'

import debounce from 'debounce'

var makeID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export default {
  components: {
    ExecEnv,
    StatusBar,
    SceneEditor,
    CodeEditor,
    TimeMachine,
    Tooltip,
    ProjectLoader
  },
  data () {
    return {
      saveMethod (v) { console.log('Not Saving...', v) },
      projects: [],
      ENdb,
      compileNowTimer: false,
      isBigEnough: window.innerWidth >= 767,
      tooltip: false,

      // dirtyTimer: 0,
      // needsCompile: false,
      state: {
        mode: 'ProjectLoader', // 'CodeEditor', // CodeEditor / SceneEditor
        output: {
          html: '',
          js: ''
        }
      },
      root: {
        notReady: true,
        rID: makeID(),
        // basic data structure
        now: {
          currentFilePath: '@/index.html',
          openedFiles: [
            {
              path: '@/index.html'
            }
          ],
          files: [
            {
              path: '@/index.html',
              src: 'Welcome!'
            },
            {
              path: '@/main.js',
              src: 'console.log(\'main.js\')'
            }
          ]
        },
        backups: [
        ]
      }
    }
  },
  computed: {
    useMarginBox () {
      return this.state.mode === 'SceneEditor' || this.state.mode === 'FileSelector'
    },
    files: {
      get () {
        return this.doc.files
      },
      set (v) {
        this.doc.files = v
      }
    },
    doc: {
      get () {
        return this.root.now
      },
      set (v) {
        this.root.now = JSON.parse(JSON.stringify(v))
      }
    },
    output: {
      get () {
        return this.state.output
      },
      set (v) {
        this.state.output = v
        return v
      }
    }
  },
  mounted () {
    this.setup()
    this.hydrate()
    this.autoRun()
  },
  watch: {
    // files () {
    //   this.$emit('compile')
    // }
  },
  methods: {
    loadRoot (root) {
      console.log('load-root')
      this.root = root

      this.$nextTick(() => {
        this.saveProject()
      })
    },
    travel (v) {
      this.$nextTick(() => {
        this.doc = v
        this.$nextTick(() => {
          this.saveProject()
          this.compileLater()
        })
      })
    },
    onCompileComplete (src) {
      this.output = src
      this.compileNowTimer = false
      this.saveProject()
    },
    async hydrate () {
      // this.hydrateENdb()
      // setTimeout(() => {
      //   var localRoot = window.localStorage.getItem('alpha-root')
      //   if (localRoot) {
      //     this.root = JSON.parse(localRoot)
      //     this.$forceUpdate()
      //   } else {
      //     window.localStorage.setItem('alpha-root', JSON.stringify(this.root))
      //   }
      //   this.$nextTick(() => {
      //     this.$emit('compile')
      //   })
      // }, 100)
    },
    // async hydrateENdb (rootID) {
    //   let rootString = await ENdb.lf.getItem('current-project')
    //   console.log(rootString)
    //   if (rootString) {
    //     console.log('reading from idb')
    //     this.root = JSON.parse(rootString)
    //     this.$forceUpdate()
    //   } else {
    //     console.log('reading from json')
    //     let newProjString = JSON.stringify(require('@/components/parts/EffectNode/TimeMachine/samples/single-page.json'))
    //     await ENdb.lf.setItem('current-project', newProjString)
    //     let rootString = await ENdb.lf.getItem('current-project')
    //     if (rootString) {
    //       this.root = JSON.parse(rootString)
    //       this.$forceUpdate()
    //     }
    //   }

    //   this.$nextTick(() => {
    //     this.$emit('compile')
    //   })
    // },
    saveProject: debounce(function () {
      this.saveMethod({ projectJSON: JSON.stringify(this.root) })
      console.log('Saving')
    }, 333.333),
    // lsSaveProject: debounce(function () {
    //   window.localStorage.setItem('alpha-root', JSON.stringify(this.root))
    // }, 333.333),
    setup () {
      this.$on('compile', (v) => {
        this.output.isLoading = true
        // this.needsCompile = true
        this.compileLater(v)
        this.saveProject()
      })
    },
    compileLater (v) {
      if (!this.compileNowTimer) {
        this.compileNow(v)
      } else {
        clearTimeout(this.compileNowTimer)
        this.compileNowTimer = setTimeout(() => {
          this.compileNow(v)
        }, 3000)
      }
    },
    compileNow (v) {
      if (this.$refs['exec']) {
        this.$refs['exec'].compile(v)
      }
    },
    autoRun () {
      // this.dirtyTimer = setInterval(() => {
      //   if (this.needsCompile) {
      //     this.needsCompile = false
      //     this.saveProject()
      //     this.compileNow()
      //   }
      // }, 1000)
    }
  },
  beforeDestroy () {
    // clearInterval(this.dirtyTimer)
  }
}
</script>

<style scoped>
.statusbar-top{
  transform: translate3d(0,0,-0.1px);
}
.container-box{
  z-index: 100;
  transform: translate3d(0,0,0.1px);
  width: 100%;
}
.margin-box{
  margin: 8px;
}
</style>
