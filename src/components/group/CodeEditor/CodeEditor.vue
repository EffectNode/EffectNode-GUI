<template>
  <div>

    <div class="tabs-row" ref="tabs-row">
      <div class="tab" :class="{ 'using': mode === 'hot-data' }" @click="mode = 'hot-data'">Hot Data</div>
      <div
        @mouseover="$emit('tooltip', { name: 'Open File' })" @mouseout="$emit('tooltip', false)"
        class="tab" :class="{ 'using': mode === 'browse' }" @click="toggleMode">Browse</div>
      <Draggable class="opened-files" v-model="openedFiles" :move="onDragTabs">
        <div class="tab" :class="{ 'active': isTabActive(tab.path) }" @click="selectFile(tab.path)" :key="tab.path + iTab" v-for="(tab, iTab) in openedFiles"><img class="cross" src="./img/cross.svg" @click="removeTab(tab, iTab, openedFiles)" /> {{ getFileName(tab.path) }} </div>
      </Draggable>
    </div>

    <div class="content-row">

      <div>
        <HotData @just-save="$emit('just-save')" :doc="doc" v-if="$refs['viewer']" v-show="mode === 'hot-data'" :sendData="$refs['viewer'].sendData" />
      </div>

      <div class="file-selector">
        <keep-alive>
          <FileSelector
            v-if="mode === 'browse'"
            :doc="doc"
            @remove-file="removeFile"
            @close-file="closeFile"
            @select-file="selectFile"
            @open-file="openFile"
            @clone-file="cloneFile"
            @save="() => { needsCompile = true; }"
          >
          </FileSelector>
        </keep-alive>
      </div>

      <div
        class="code-editor"
      >
        <div
          v-for="(openFile) in openedFiles"
          :key="openFile.path"
        >
          <Component
            :is="'ACE'"
            v-if="mode === 'edit' && currentFile && openFile.path === currentFilePath"
            v-model="currentFile.src"
            :readOnly="currentFile.readOnly"
            :filepath="openFile.path"
            @close="closeFile"
            @open="() => { mode = 'browse' }"
            @save="() => { $emit('just-save'); $emit('compile') }"
            @input="() => { needsCompile = true; onKeyStrokeSendData({ file: currentFile }) }"
            theme="chrome"
            width="100%"
            :height="'calc(100vh - 85px)'"
          >
          </Component>
        </div>
      </div>

      <div class="previewer">
        <Previewer ref="viewer" :output="output" :defaultSize="'iphonex-chrome'" />
      </div>
    </div>

  </div>
</template>

<script>
import ACE from '@/components/parts/EffectNode/ACE/ACE.vue'
import Previewer from '@/components/parts/EffectNode/Previewer/Previewer.vue'

import FileSelector from '@/components/group/FileSelector/FileSelector.vue'

import HotData from '@/components/group/HotData/HotData.vue'
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable,
    ACE,
    FileSelector,
    Previewer,
    HotData
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
      mode: 'hot-data', // browse or edit or hot-data
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
        return this.doc.openedFiles || [
          {
            path: '@/index.html'
          }
        ]
      },
      set (v) {
        this.doc.openedFiles = v
      }
    },
    files: {
      get () {
        return this.doc.files || []
      }
    }
  },
  methods: {
    getFileName (path) {
      if (path.includes('/')) {
        let ans = path.split('/')
        ans = ans.pop()
        return ans
      } else {
        return path
      }
    },
    onKeyStrokeSendData ({ file }) {
      if (file.path === '@/hot-data.hydrate.json') {
        let file = (this.doc.files || []).find(f => f.path === '@/hot-data.hydrate.json')
        let viewer = this.$refs['viewer']
        if (file && viewer) {
          viewer.sendData({
            type: 'hot-data-root',
            detail: JSON.parse(file.src)
          })
          this.$emit('just-save')
        }
      }
    },
    onDragTabs (evt) {
      if (evt.draggedContext.element.path) {
        this.selectFile(evt.draggedContext.element.path)
        this.$emit('just-save')
      }
    },
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
    cloneFile (path) {
      if (this.doc.files.find(f => f.path === path)) {
        var idx = this.doc.files.findIndex(f => f.path === path)
        let orig = this.doc.files[idx]
        let clone = JSON.parse(JSON.stringify(orig))
        this.doc.files.splice(idx, 0, clone)
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
        this.openedFiles.unshift({
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
          if (array[key]) {
            let path = array[key].path
            this.$emit('select-file', path)
          } else if (array[key - 1]) {
            let path = array[key - 1].path
            this.$emit('select-file', path)
          } else {
            this.mode = 'browse'
          }
        } else {
          this.mode = 'browse'
        }
      })
    },
    adjustHeight () {
      var statusbar = document.querySelector('.statusbar')
      var tabs = this.$refs['tabs-row']
      if (statusbar) {
        this.height = window.innerHeight - statusbar.getBoundingClientRect().height - tabs.getBoundingClientRect().height
      }
    }
  },
  mounted () {
    this.adjustHeight()
    this.dirtyCheckerTimer = setInterval(() => {
      if (this.needsCompile) {
        this.needsCompile = false
        this.$emit('compile')
        this.$emit('just-save')
      }
    }, 8 * 1000)

    setInterval(() => {
      if (this.dirtyCheckerTimer) {
        this.$emit('just-save')
      }
    }, 5 * 1000)
  },
  beforeDestroy () {
    clearTimeout(this.dirtyCheckerTimer)
    this.dirtyCheckerTimer = false
  }
}
</script>

<style scoped>
.content-row{
  width: 100%;
  position: relative;
}

/* .browse-btn{
  color: #2e2e2e;
  border-radius: 26px;
  border: 1px solid #979797;

  display: inline-block;
  padding: 3px 15px;
  margin: 10px 0px 0px 5px;
  background-color: rgba(255,255,255,0.8);
  transform: translate3d(0,0,0.1px);
} */
.tab.using{
  color: blue;
  border-color: blue;
}
.tab.using:hover{
  color: blue;
  border-color: blue;
  box-shadow: rgb(144, 144, 144) 2px 2px 0px 0px;
}

.opened-files{
  display: inline;
}

.tab {
  color: #636363;
  /* border-radius: 26px; */
  border: 1px solid #4a4a4a;

  display: inline-block;
  padding: 3px 10px;
  margin: 10px 0px 0px 5px;
  background-color: rgba(255,255,255,0.8);
  transform: translate3d(0,0,0.1px);
}
.tab.active{
  color: black;
  border-color: lime;
}
.tab.active:hover{
  box-shadow: rgb(20, 140, 20) 1px 1px 0px 0px;
}
.tab:first-child {
  margin-left: 8px;
}

.tab .cross{
  margin-right: 4px;
  transition: transform 1s;
}
.tab:hover{
  box-shadow: #787878 1px 1px 0px 0px;
}
.tab .cross:hover{
  transform: scale(1.4);
}

.file-selector{
  margin: 8px;
}

.previewer{
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  z-index: 10000;

  /*
  width: 650px;
  height: 300px;
  */
}

</style>
