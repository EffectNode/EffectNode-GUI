<template>
  <div class="full quotes-app">
    <TitleBar ref="title-bar" :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      {{ portal.win.name }} <span class="linker" @click="runIframe()">Reset</span> <span class="linker" @click="setSquare(portal)">Square</span> <span class="linker" @click="downloadFrame()">Download</span>
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <iframe
      sandbox="allow-same-origin allow-scripts allow-forms"
      :src="iframe.src"
      ref="iframe"
      :width="portal.win.width"
      :height="portal.win.height - 30"
      :style="{ width: portal.win.width + 'px', height: (portal.win.height - 30) + 'px' }"
      v-if="iframe.enabled" frameborder="0"></iframe>

      <div ref="dragger-prevent-loss-mouse" class="full" style="position: absolute; top: 30px; left: 0px; height: calc(100% - 30px);" v-show="isDown">
      </div>
      <!--
      <h1>Inputs</h1>
      <pre>{{ connectedInputs }}</pre>
      <h2>Outpus</h2>
      <pre>{{ connectedOutputs }}</pre> -->
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
// import axios from 'axios'
import TitleBar from '../TitleBar'
// import SVGArea from '../../SVGArea/Index.vue'
// import nlp from 'compromise'
// import csv from 'csvtojson'

export default {
  components: {
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
    return {
      isDown: false,
      iframe: {
        enabled: true,
        src: ''
      },
      Doc: false,
      Data: false,
      root: false,
      ready: false
      // portal: false
    }
  },
  watch: {
    modules: {
      deep: false,
      handler (newV, oldV) {
        clearTimeout(this.iFrameTimeout)
        this.iFrameTimeout = setTimeout(() => {
          this.runIframe()
        }, 500)
      }
    },
    connectors: {
      deep: true,
      handler () {
        clearTimeout(this.iFrameTimeout)
        this.iFrameTimeout = setTimeout(() => {
          this.runIframe()
        }, 500)
      }
    }
  },
  methods: {
    setSquare () {
      this.uiAPI.portal.square(this.portal)
      this.$forceUpdate()
    },
    async downloadFrame () {
      let html = await this.uiAPI.Builder.fromDocToHTMLProd({ Doc: this.Doc })
      let link = this.uiAPI.Builder.makeHTMLLink({ HTML: html })
      var a = document.createElement('a')
      a.href = link
      a.download = 'EffectNode.html'
      a.click()
    },
    async runIframe () {
      console.log('run iframe')
      let html = await this.uiAPI.Builder.fromDocToHTMLProd({ Doc: this.Doc })
      let link = this.uiAPI.Builder.makeHTMLLink({ HTML: html })
      this.iframe.src = link
      this.iframe.srcdoc = html
      this.iframe.enabled = true
      if (this.iframe.postMessage) {
        window.removeEventListener('iframe-post-message', this.iframe.postMessage)
      }
      this.iframe.postMessage = (evt) => {
        if (this.$refs.iframe) {
          this.$refs.iframe.contentWindow.postMessage(evt.detail, this.$refs.iframe.contentWindow.location.origin)
        }
      }
      window.addEventListener('iframe-post-message', this.iframe.postMessage, false)
    },
    isDescendant (parent, child) {
      var node = child.parentNode
      if (parent === child) {
        return true
      }

      while (node !== null) {
        if (node === parent) {
          return true
        }
        node = node.parentNode
      }
      return false
    },
    init () {
      let { Doc, Data } = this.uiAPI.hive
      this.Doc = Doc
      this.Data = Data
      this.root = Doc.root
      this.ready = true

      this.runIframe()

      window.addEventListener('refresh-iframe', () => {
        this.runIframe()
      })
      window.addEventListener('mousedown', (evt) => {
        if (this.isDescendant(this.$refs['title-bar'], evt.target) || !this.isDescendant(this.$refs['iframe'], evt.target)) {
          this.isDown = true
          this.$forceUpdate()
        }
      }, true)
      window.addEventListener('mouseup', (evt) => {
        this.isDown = false
      }, true)

      window.addEventListener('iframe-time-mode', (evt) => {
        if (this.$refs.iframe) {
          this.$refs.iframe.contentWindow.postMessage(evt.detail, window.location.origin)
        }
      }, false)

      // console.log('OMG', )
      // this.$refs.mounter.appendChild(this.uiAPI.execEnv.Sys.$el)
      // return Hive.get({ doc: 'happy' }).then(({ Data, Doc }) => {
      //   this.Doc = Doc
      //   this.Data = Data
      //   this.root = Doc.root
      //   this.ready = true
      // })
    }
  },
  computed: {
    connectedInputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'input'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    connectedOutputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'output'
      }).slice().sort((a, b) => {
        return a.idx - b.idx
      })
    },
    connectors () {
      if (this.root) {
        // let modIDs = this.root.modules.map(m => m.id)
        return this.root.connectors.slice().sort((a, b) => {
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

    this.resizeInterval = setInterval(() => {
      if (this.$refs.iframe) {
        this.$refs.iframe.contentWindow.postMessage({ type: 'resize', width: this.portal.win.width, height: this.portal.win.height }, window.location.origin)
      }
    }, 1000 / 60)
  },
  beforeDestroy () {
    clearInterval(this.resizeInterval)
  }
}
</script>

<style scoped>
@import url(../../jot.css);

.linker{
  text-decoration: underline;
}

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
  border-radius: 0px 0px 10px 10px;
  overflow: hidden;
  /* -webkit-overflow-scrolling: touch;
  overflow: auto; */
}

.quotes-list{
  margin: 20px;
}
</style>
