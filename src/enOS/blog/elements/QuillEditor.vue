<template>
  <div :class="{ 'max-full': toolbar }">
    <div class="editor" :class="{ 'no-toolbar': !toolbar }" ref="editor"></div>
  </div>
</template>

<script>
import * as API from '@/enOS/data/API'
// import 'highlight.js'
// import 'highlight.js/styles/monokai-sublime.css'
import 'quill/dist/quill.snow.css'
var Quill = require('quill')
window.hljs.configure({ // optionally configure hljs
  languages: ['javascript', 'glsl', 'php']
})

export default {
  props: {
    toolbar: { default: true },
    initText: {}
  },
  data () {
    let data = {
      quill: false
    }
    return data
  },
  watch: {
  },
  computed: {
  },
  methods: {
    async uploadBlob ({ blob, signedRequest, progress = () => {}, start = () => {}, end = () => {} }) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        xhr.addEventListener('progress', (oEvent) => {
          if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total * 100
            progress && progress(percentComplete)
          } else {
          }
        })
        xhr.open('PUT', signedRequest)
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              // NProgress.done()
              resolve()
            } else {
              // NProgress.done()
              reject(xhr.error)
            }
          }
          end && end()
        }
        start && start()
        // NProgress.start()
        xhr.send(blob)
      })
    },
    setup () {
      //   connection.close();
      // };
      // window.connect = function() {
      //   var socket = new LLWebSocket('ws://' + window.location.hostname + ':3003/socket.io/?EIO=3&transport=websocket');
      //   connection.bindToSocket(socket);
      // };
      // Create local Doc instance mapped to 'examples' collection document with id 'richtext'
      let options = {
        theme: 'snow',
        modules: {
          syntax: true
        }
      }
      if (!this.toolbar) {
        options.modules.toolbar = false
        options.readOnly = true
      } else {
        options.modules.toolbar = [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [
            { 'list': 'ordered' },
            { 'list': 'bullet' }
          ],
          ['image', 'code-block']
        ]
      }
      this.quill = new Quill(this.$refs['editor'], options)
      if (this.toolbar) {
        let editor = this.quill
        let selectLocalImage = () => {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.click()

          // Listen upload local image and save to server
          input.onchange = () => {
            const file = input.files[0]

            // file type is only image.
            if (/^image\//.test(file.type)) {
              saveToServer(file)
            } else {
              console.warn('You could only upload images.')
            }
          }
        }

        let saveToServer = (file) => {
          const fd = new FormData()
          fd.append('photos', file)
          this.$emit('status', 'uploading')
          const xhr = new XMLHttpRequest()
          xhr.open('POST', API.baseRoot + 'upload/image', true)
          let rememberMe = window.localStorage.getItem('jwt_remember_me')
          if (rememberMe) {
            xhr.setRequestHeader('Authorization', `bearer ${rememberMe}`)
          }
          xhr.onload = () => {
            if (xhr.status === 200) {
              // this is callback data: url
              const data = JSON.parse(xhr.responseText)
              console.log(data)
              insertToEditor(data[0].key)
            }
            this.$emit('status', 'done')
          }
          xhr.send(fd)
        }

        // let saveToServer = async (file) => {
        //   let fileMimeType = file.type
        //   let ext = file.name.split('.').pop()
        //   let signResp = await API.signS3({ fileMimeType, ext })
        //   let signResultData = signResp.data
        //   let signedRequest = signResultData.signedRequest
        //   await this.uploadBlob({
        //     blob: file,
        //     signedRequest,
        //     end: () => {
        //       insertToEditor(signResultData)
        //     }
        //   })
        // }

        let insertToEditor = (filename) => {
          // push image url to rich editor.
          const range = editor.getSelection()

          editor.insertEmbed(range.index, 'image', `https://ik.imagekit.io/effectnode/${filename}`)
          editor.formatText(range.index, 1, 'width', '300px')
        }
        this.quill.getModule('toolbar').addHandler('image', () => {
          selectLocalImage()
        })
      }
      if (this.initText) {
        this.quill.setContents(this.initText)
      }
      this.quill.on('text-change', (delta, oldDelta, source) => {
        console.log(delta)
        this.$emit('change', this.quill.getContents())
      })
    }
  },
  mounted () {
    this.setup()
  }
}
</script>
<style>
.ql-container{
  font-family: 'geomanistregular', 'Inconsolata', 'Avenir', Helvetica, Arial, sans-serif;
}
.no-toolbar.ql-container.ql-snow{
  border: none;
}
.no-toolbar .ql-editor{
  padding: 0px;
  margin: 0px;
  border: 0px;
}
.ql-container.ql-snow{
  /* border-radius: 0px 0px 10px 10px; */
  font-size: 17px;
}
.ql-toolbar.ql-snow{
  /* border-radius: 10px 10px 0px 0px; */
  background: white;
}
</style>
<style scoped>
.editor{
  background: white;
  color: black;
  width: 100%;
  height: calc(100% - 42px);
}
.max-full{
  height: 100vh - 250px;
}
.max-full .editor{
  height: 100vh - 250px;
}
</style>
