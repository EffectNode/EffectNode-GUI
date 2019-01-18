<template>
  <div class="editor" ref="editor"></div>
</template>

<script>
import 'quill/dist/quill.snow.css'
// npm install --save quill rich-text sharedb
// import Dimension from './Dimension/Index.vue'
var sharedb = require('sharedb/lib/client')
var richText = require('rich-text')
var Quill = require('quill')
// var io = require('socket.io-client')

sharedb.types.register(richText.type)

class LLWebSocket {
  constructor ({ uiAPI }) {
    this.uiAPI = uiAPI
    // Open WebSocket connection to ShareDB server
    this.___setup()
  }
  disconnect () {
    this.ss.disconnect()
  }
  connect () {
    this.ss.connect()
  }
  ___setup () {
    // let rememberMe = window.localStorage.getItem('jwt_remember_me')
    // let query = ``
    // if (rememberMe) {
    //   query = `auth_token=${rememberMe}`
    // }
    // let baseURL = 'http://' + window.location.hostname + ':3000/'
    // if (process.env.NODE_ENV === 'production') {
    //   baseURL = 'https://yoteach-cloud.herokuapp.com/'
    // }

    // let path = 'shareDB'
    // let ss = io(`${baseURL}${path}`, { transports: ['websocket'], query })
    // this.ss = ss
    // ss.on('connect', () => {
    //   ss.disconnected = false
    // })
    // setInterval(() => {
    //   if (ss.disconnected) {
    //     ss.connect()
    //   }
    // }, 1000)

    this.ss = this.uiAPI.API.makeSocket('shareDB')
  }
  get readyState () {
    return 1
  }
  send (v, fn) {
    v = JSON.parse(v)
    v.$$$system$$$ = 'shareDB'
    v = JSON.stringify(v)
    this.ss.emit('message', v, fn)
  }
  set onmessage (v) {
    this.ss.on('message', this.makeAsEvent(v))
  }
  set onerror (v) {
    this.ss.on('error', (data) => {
      v({ data })
    })
  }
  set onclose (v) {
    this.ss.on('close', v)
  }
  set onopen (v) {
    this.ss.on('connection', v)
  }
  makeAsEvent (v) {
    if (!v) {
      return console.log
    } else {
      return (data) => {
        try {
          let ans = JSON.parse(data)
          if (ans.$$$system$$$ === 'shareDB') {
            delete ans.$$$system$$$
            v({
              data: JSON.stringify(ans)
            })
          }
        } catch (e) {
        }
      }
    }
  }
  emit (msg, v, fn) {
    this.ss.emit(msg, v, fn)
  }
  close () {
    this.ss.close()
  }
}

export default {
  props: {
    uiAPI: {},
    collection: {},
    noteID: {}
  },
  data () {
    let data = {}
    data.socket = new LLWebSocket({ uiAPI: this.uiAPI })
    data.connection = new sharedb.Connection(data.socket)
    return data
  },
  watch: {
    disconnected () {
      if (this.disconnected) {
        this.quill.enable(false)
        if (this.doc) {
          this.doc.destroy()
          this.doc = false
        }
      } else {
        if (!this.doc) {
          this.makeDoc()
        }
        this.quill.enable(true)
      }
    }
  },
  computed: {
    disconnected () {
      return this.socket.ss.disconnected
    }
  },
  methods: {
    makeDoc () {
      let doc = this.doc = this.connection.get(this.collection, this.noteID)
      doc.subscribe((err) => {
        if (err) throw err
        let quill = this.quill
        quill.setContents(doc.data)
        quill.on('text-change', (delta, oldDelta, source) => {
          if (source !== 'user') return
          doc.submitOp(delta, { source: quill })
        })
        doc.on('op', (op, source) => {
          if (source === quill) return
          quill.updateContents(op)
        })
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

      this.quill = new Quill(this.$refs['editor'], { theme: 'snow' })
      this.quill.enable(false)
      this.makeDoc()
    }

  },
  mounted () {
    this.setup()
  }
}
</script>
<style>
.ql-container.ql-snow{
  border-radius: 0px 0px 10px 10px;
  font-size: 17px;
}
</style>
<style scoped>
.editor{
  color: black;
  width: 100%;
  height: calc(100% - 52px);
}
</style>
