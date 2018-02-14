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
          <input class="search-input" v-model="query" />
          <img class="search-icon" src="./img/search.svg" />
        </div>
      </div>
    </div>

    <div class="file new-file" v-show="viewAdder">
      <div class="file-btn" @click="addItem">Add File</div>
      <input class="file-input" v-model="newFileName" @keydown.enter="addItem" />
    </div>

    <Draggable
      v-model="files" :options="{group:'people'}" @start="drag = true" @end="drag = false; $emit('save', files);" @change="() => {  }"
    >
    <div
      class="file"
      :key="iFile"
      v-for="(file, iFile) in files"
      v-show="isInQuery(file)"
    >
      <div
        class="file-btn"
        @click="
          $emit('select-file', file.path);
          $emit('open-file', file.path);
        "
      >
        Edit
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
      <input class="file-input" v-model="file.path" />
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
      return this.files.filter(e => e.path.indexOf(this.query) !== -1)
    }
  },
  methods: {
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

.file{
  transition: border-left-color 0.3s, text-decoration 0.3s;
  border-left: #838383 solid 5px;
  padding-left: 10px;
  font-size: 25px;
  color: #939393;
}
.file:hover{
  border-left-color: lime;
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
  width: 100%;
  font-size: 25px;
  font-family: 'InterUI', Arial, Helvetica, sans-serif;
}

.file{
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
}

.file-btn{
  display: block;
  text-decoration: underline;
  margin-right: 10px;
}


.file.new-file .file-btn{
  width: 105px;
  color: blue;
  text-decoration: underline;
}


</style>
