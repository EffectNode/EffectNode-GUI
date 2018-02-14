<template>
  <div>
    <StatusBar class="statusbar-top">
      <div slot="left">
      </div>
      <div slot="right">
        <button @click="state.mode = 'SceneEditor'">SceneEditor</button>
        <button @click="state.mode = 'CodeEditor'">CodeEditor</button>
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
            @compile="$emit('compile')"
            @select-file="(v) => { doc.currentFilePath = v }"
            @change-mode="(v) => { state.mode = v }"
          >
          </Component>
        </keep-alive>
      </div>
    </div>

    <ExecEnv ref="exec" :files="doc.files" @src="updatePreview" :init="true" />
  </div>
</template>

<script>
import ExecEnv from '@/components/parts/EffectNode/ExecEnv/ExecEnv.vue'
import StatusBar from '@/components/parts/EffectNode/StatusBar/StatusBar.vue'
import SceneEditor from '@/components/group/SceneEditor/SceneEditor.vue'
import CodeEditor from '@/components/group/CodeEditor/CodeEditor.vue'

export default {
  components: {
    ExecEnv,
    StatusBar,
    SceneEditor,
    CodeEditor
  },
  data () {
    return {
      state: {
        mode: 'CodeEditor'
      },
      document: {
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
    doc: {
      get () {
        return this.document.now
      },
      set (v) {
        this.document.now = JSON.parse(JSON.stringify(v))
      }
    },
    output: {
      get () {
        return this.document.output
      },
      set (v) {
        this.document.output = v
        return v
      }
    }
  },
  mounted () {
    this.setup()
    this.hydrate()
  },
  methods: {
    updatePreview (src) {
      this.output = src
    },
    hydrate () {
      this.doc.files = require('./sample/animation.json')
    },
    setup () {
      this.$on('compile', () => {
        if (this.$refs['exec']) {
          this.$refs['exec'].compile()
        }
      })
    }
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
