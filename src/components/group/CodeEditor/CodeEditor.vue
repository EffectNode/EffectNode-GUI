<template>
  <div>
    <div class="opened-files">
      <div class="tab" :class="{ 'using': mode === 'browse' }" @click="toggleMode">Browse</div>
      <div class="tab" :class="{ 'active': isTabActive(tab.path) }" @click="selectFile(tab.path)" :key="tab.path + iTab" v-for="(tab, iTab) in openedFiles">{{ tab.path }} <img class="cross" src="./img/cross.svg" @click="removeTab(tab, iTab, openedFiles)" /></div>
    </div>
    <Previewer :output="output" />
    <div class="file-selector">
      <keep-alive>
        <FileSelector
          v-if="mode === 'browse'"
          :doc="doc"
          @remove-file="removeFile"
          @close-file="closeFile"
          @select-file="selectFile"
          @open-file="openFile"
          @save="() => { needsCompile = true; }"
        >
        </FileSelector>
      </keep-alive>
    </div>
    <div
      class="code-editor"
    >
      <keep-alive
        v-for="(openFile) in openedFiles"
        :key="openFile.path"
      >
        <Component
          :is="'ACE'"
          v-if="mode === 'edit' && currentFile && openFile.path === currentFilePath"
          v-model="currentFile.src"
          :filepath="openFile.path"

          @save="() => { $emit('compile') }"
          @input="() => { needsCompile = true; }"
          theme="chrome"
          width="100%"
          :height="height + 'px'"
        >
        </Component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import ACE from '@/components/parts/EffectNode/ACE/ACE.vue'
import Previewer from '@/components/parts/EffectNode/Previewer/Previewer.vue'
import FileSelector from '@/components/group/FileSelector/FileSelector.vue'

export default {
  components: {
    ACE,
    FileSelector,
    Previewer
  },
  props: {
    currentFilePath: {
      default () {
        return '@/index.html'
      }
    },
    doc: {
    },
    output: {
      default () {
        return {
          js: '',
          html: 'Loading....'
        }
      }
    }
  },
  data () {
    return {
      mode: 'edit', // browse or edit
      height: window.innerHeight * 0.7,
      dirtyCheckerTimer: 0,
      needsCompile: false
    }
  },
  computed: {
    currentFile: {
      get () {
        return this.files.find(f => f.path === this.currentFilePath)
      }
    },
    openedFiles: {
      get () {
        this.doc.openedFiles = this.doc.openedFiles || [
          {
            path: this.currentFilePath + ''
          }
        ]
        return this.doc.openedFiles
      }
    },
    files: {
      get () {
        return this.doc.files || []
      }
    }
  },
  methods: {
    toggleMode () {
      if (this.mode === 'browse' && this.openedFiles.length > 0) {
        this.mode = 'edit'
      } else {
        this.mode = 'browse'
      }
    },
    isTabActive (path) {
      return this.currentFilePath === path
    },
    removeFile (path) {
      if (this.doc.files.find(f => f.path === path)) {
        var idx = this.doc.files.findIndex(f => f.path === path)
        this.doc.files.splice(idx, 1)
      }
    },
    closeFile (path) {
      if (this.openedFiles.find(f => f.path === path)) {
        var idx = this.openedFiles.findIndex(f => f.path === path)
        this.openedFiles.splice(idx, 1)
      }
    },
    openFile (path) {
      if (!this.openedFiles.find(f => f.path === path)) {
        this.openedFiles.push({
          path: path
        })
      }
    },
    selectFile (path) {
      this.$emit('select-file', path)
      this.mode = 'edit'
    },
    removeTab (item, key, array) {
      array.splice(key, 1)
      this.$nextTick(() => {
        if (array.length >= 1) {
          let lastItem = array[array.length - 1]
          if (lastItem) {
            let path = lastItem.path
            this.$emit('select-file', path)
          } else {
            this.mode = 'browse'
          }
        } else {
          this.mode = 'browse'
        }
      })
    }
  },
  mounted () {
    this.dirtyCheckerTimer = setInterval(() => {
      if (this.needsCompile) {
        this.needsCompile = false
        this.$emit('compile')
      }
    }, 3000)
  },
  beforeDestroy () {
    clearTimeout(this.dirtyCheckerTimer)
  }
}
</script>

<style scoped>

.opened-files{
  /* height: 50px; */
}

.tab {
  color: #979797;
  border-radius: 26px;
  border: 1px solid #979797;

  display: inline-block;
  padding: 3px 15px;
  margin: 13px 5px;
  background-color: rgba(255,255,255,0.8);
  transform: translate3d(0,0,0.1px);
}
.tab.active{
  border-color: lime;
}
.tab.using{
  color: blue;
  border-color: blue;
}
.tab:first-child {
  margin-left: 8px;
}

.tab .cross{
  margin-left: 4px;
}

.file-selector{
  margin: 8px;
}

</style>
