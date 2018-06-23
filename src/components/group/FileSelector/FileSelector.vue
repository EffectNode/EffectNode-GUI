<template>
  <div>
    <div class="title-row">
      <div class="left-title">
        <div class="files-title">
          <div>Files</div> <img class="circle-add" @click="showAdd" src="./img/circle-add.svg" />
        </div>
      </div>
      <div class="right-title">
        <div class="files-search">
          <input class="search-input" autofocus v-model="query" ref="query-input" @keydown.enter="() => { $emit('select-file', qFiles[0].path); $emit('open-file', qFiles[0].path); }" />
          <img class="search-icon" src="./img/search.svg" />
        </div>
      </div>
    </div>

    <div class="file new-file" v-show="viewAdder">
      <div class="file-btn" @click="addItem">Add File</div>
      <input class="file-input" v-model="newFileName" @keydown.enter="addItem" />
    </div>

    <Draggable
      v-model="files" :options="{group:'people', handle: '.handle'}" @start="drag = true" @end="drag = false; $emit('save', files);" @change="() => {  }"
      :move="checkMove"
    >
    <div
      class="file"
      :key="iFile"
      v-for="(file, iFile) in files"
      v-show="isInQuery(file)"
      :isDraggable="!checkProtectedItem(file.path)"
    >
      <div class="handle"></div>
      <div
        class="file-btn"
        @click="
          $emit('select-file', file.path);
          $emit('open-file', file.path);
        "
      >
        Open
      </div>
      <div
        v-if="!checkProtectedItem(file.path)"
        class="file-btn"
        @click="
          confirmRemoveFile(file.path)
        "
      >
        Remove
      </div>
      <input class="file-input" :disabled="checkProtectedItem(file.path)" v-model="file.path" />
    </div>
    </Draggable>

  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  props: {
    doc: {}
  },
  data () {
    return {
      query: '',
      drag: false,
      viewAdder: false,
      newFileName: '@/src/new-file.vue'
    }
  },
  activated () {
    var input = this.$refs['query-input']
    if (input) {
      input.focus()
    }
  },
  computed: {
    files: {
      get () {
        return this.doc.files
      },
      set (v) {
        this.doc.files = v
      }
    },
    qFiles () {
      var files = this.files
      var queries = this.query.split(' ')

      queries.forEach((q) => {
        files = files.filter(e => e.path.toUpperCase().indexOf(q.toUpperCase()) !== -1)
      })

      return files
    }
  },
  methods: {
    checkMove (evt) {
      return !this.checkProtectedItem(evt.draggedContext.element.path)
    },
    confirmRemoveFile (path) {
      if (window.confirm('delete?\n\n' + path)) {
        this.$emit('close-file', path)
        this.$emit('remove-file', path)
      }
    },
    isInQuery (file) {
      return this.qFiles.find(q => q.path === file.path)
    },
    getExt (filename) {
      return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : 'js'
    },
    showAdd () {
      this.viewAdder = true
    },
    getTemplate (filename) {
      var ext = this.getExt(filename)
      console.log(ext)
      switch (ext) {
        case 'js':
          return ''

        case 'vert':
          return `void main ( void ) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`
        case 'frat':
          return `void main () {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}`

        case 'vue':
          return `<template>
  <div>
    123
  </div>
</template>

<script>
export default {

}
` + `<` + `/` + `script>

<style scoped>

</style>`

        default:
          return ''
      }
    },
    checkProtectedItem (src) {
      if (src === '@/index.html') {
        return true
      } else if (src === '@/main.js') {
        return true
      } else if (src === '@/root-data.js') {
        return true
      } else if (src === '@/root.readonly.json') {
        return true
      } else if (src === '@/router.js') {
        return true
      } else if (src === '@/style.css') {
        return true
      } else {
        return false
      }
    },
    addItem () {
      this.viewAdder = false
      var newItem = {
        path: this.newFileName,
        src: this.getTemplate(this.newFileName)
      }
      this.files.push(newItem)
    }
  }
}
</script>

<style scoped>
.title-row{
  width: 100%;
  display: flex;
}
.right-title{
  margin-left: 100px;
}

.files-title{
  display: flex;
  align-items: center;
  /* Files: */
  font-family: 'InterUI-Bold', Arial, Helvetica, sans-serif;
  font-size: 40px;
  color: #939393;
  letter-spacing: 0;
}

.circle-add{
  margin-left: 10px;
}

.files-search {
  width: 256px;
  height: 43px;
  border: 5px solid #979797;
  border-radius: 100px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-icon{
  margin-right: 15px;
}

.search-input{
  appearance: none;
  background-color: transparent;
  padding: 3px;
  border: none;
  width: 200px;
  margin-left: 15px;
  font-size: 20px;
  color: #939393;
  font-family: 'InterUI', Arial, Helvetica, sans-serif;
}

input:focus{
  outline: none;
}
.handle{
  width: 30px;
  height: 30px;
  background-color: rgba(185, 185, 185, 0.521);
  transition: background-color 1.0s;
  margin-right: 5px;
}
.file:hover .handle{
  background-color: cyan;
  background-image: linear-gradient(45deg, transparent, hotpink);
}

.file{
  transition: border-left-color 0.3s, text-decoration 0.3s;
  font-size: 20px;
  color: #939393;
}
.file:hover{
  /* border-left-color: lime; */
}
.file.new-file{
  padding-left: 10px;
}
.file.new-file:hover{
  border-left-color: cyan;
}



.new-file{
  border-left: blue solid 5px;
  margin-bottom: 10px;
}

.file-input{
  appearance: none;
  background-color: transparent;
  padding: 3px;
  border: none;
  width: 80%;
  font-size: 20px;
  font-family: 'InterUI', Arial, Helvetica, sans-serif;
}

.file{
  margin-top: 6.5px;
  display: flex;
  justify-content: flex-start;
}

.file-btn{
  display: block;
  text-decoration: underline;
  margin-right: 10px;
}

.file-btn:hover{
  color: black;
}

.file.new-file .file-btn{
  color: blue;
  text-decoration: underline;
}


</style>
