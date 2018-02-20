<template>
  <div>

    <StatusBar class="statusbar-top">
      <div slot="left">
        <button @click="state.mode = 'SceneEditor'">SceneEditor</button>
        <button @click="state.mode = 'CodeEditor'">CodeEditor</button>
      </div>
      <div slot="right">
        <TimeMachine
          :rootDoc="root"
          :output="output"
          @travel="travel"
          @load-root="loadRoot"
          @compile="$emit('compile')"
          @just-save="saveProject"
          @tooltip="(v) => { tooltip = v }"
        />
      </div>
    </StatusBar>

    <div class="container-box">
      <div :class="{
        'margin-box': useMarginBox
      }">
        <keep-alive>
          <Component
            :is="state.mode"
            :doc="doc"
            :output="output"
            :currentFilePath="doc.currentFilePath"
            @just-save="saveProject"
            @compile-now="compileNow"
            @compile="$emit('compile')"
            @select-file="(v) => { doc.currentFilePath = v }"
            @change-mode="(v) => { state.mode = v }"
            @tooltip="(v) => { tooltip = v }"
          >
          </Component>
        </keep-alive>
      </div>
    </div>

    <Tooltip v-show="tooltip" :tooltip="tooltip" />

    <ExecEnv ref="exec" :files="doc.files" @src="updatePreview"/>
  </div>
</template>

<script>
import TimeMachine from '@/components/parts/EffectNode/TimeMachine/TimeMachine.vue'
import ExecEnv from '@/components/parts/EffectNode/ExecEnv/ExecEnv.vue'
import StatusBar from '@/components/parts/EffectNode/StatusBar/StatusBar.vue'
import Tooltip from '@/components/parts/EffectNode/Tooltip/Tooltip.vue'

import SceneEditor from '@/components/group/SceneEditor/SceneEditor.vue'
import CodeEditor from '@/components/group/CodeEditor/CodeEditor.vue'

export default {
  components: {
    ExecEnv,
    StatusBar,
    SceneEditor,
    CodeEditor,
    TimeMachine,
    Tooltip
  },
  data () {
    return {
      tooltip: false,

      dirtyTimer: 0,
      needsCompile: false,
      state: {
        mode: 'SceneEditor' // CodeEditor / SceneEditor
      },
      root: {
        // basic data structure
        output: {
          html: '',
          js: ''
        },
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
        return this.root.output
      },
      set (v) {
        this.root.output = v
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
    },
    travel (v) {
      this.$nextTick(() => {
        this.doc = v
        this.saveProject()
      })
    },
    updatePreview (src) {
      this.output = src
      this.saveProject()
    },
    hydrate () {
      setTimeout(() => {
        var localRoot = window.localStorage.getItem('alpha-root')
        if (localRoot) {
          this.root = JSON.parse(localRoot)
          this.$forceUpdate()
        } else {
          window.localStorage.setItem('alpha-root', JSON.stringify(this.root))
        }
        this.$emit('compile')
      }, 100)
    },
    saveProject () {
      window.localStorage.setItem('alpha-root', JSON.stringify(this.root))
    },
    setup () {
      this.$on('compile', () => {
        this.needsCompile = true
      })
    },
    compileNow () {
      if (this.$refs['exec']) {
        this.$refs['exec'].compile()
      }
    },
    autoRun () {
      this.dirtyTimer = setInterval(() => {
        if (this.needsCompile) {
          this.needsCompile = false
          this.saveProject()
          this.compileNow()
        }
      }, 1000)
    }
  },
  beforeDestroy () {
    clearInterval(this.dirtyTimer)
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
