<template>
  <div class="box">
    <select class="select" v-model="selected">
      <option :value="size.id" :key="size.id" v-for="size in sizes">{{ size.name }}</option>
    </select>
    Scale: {{ this.sizer.scale.toFixed(2) }}
    <button @click="openWindows">window</button>

    <span v-show="output.isLoading">Loading...</span>

    <div :style="getRect()">
      <iframe ref="iframer" :style="getScaler()" class="iframe" v-if="useFrame" :src="iframeURL" sandbox="allow-scripts allow-same-origin allow-modals" frameborder="0" ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    output: {
      defualt () {
        return {
          html: 'No Input',
          js: ''
        }
      }
    },
    defaultSize: {
      default: 'ipad-v'
    }
  },
  data () {
    return {
      wins: [],
      selected: this.defaultSize,
      sizes: [
        {
          id: 'iphonex-chrome',
          name: 'iPhone X Chrome',
          width: 375,
          height: 677,
          scale: 1.0
        },
        {
          id: 'safari-414',
          name: 'iPhone 8+',
          width: 414,
          height: 630,
          scale: 1.0
        },
        {
          id: 'safari-375',
          name: 'iPhone 8',
          width: 375,
          height: 562,
          scale: 1.0
        },
        {
          id: 'safari-320',
          name: 'iPhone SE',
          width: 320,
          height: 463,
          scale: 1.0
        },
        {
          id: 'ipad-v',
          name: 'iPad Safari Vertical',
          width: 768,
          height: 1024,
          scale: 500 / 768
        },
        {
          id: 'ipad-h',
          name: 'iPad Safari Horizontal',
          width: 1024,
          height: 768,
          scale: 500 / 1024
        }
      ],
      useFrame: true,
      iframeURL: 'about:blank'
    }
  },
  computed: {
    sizer () {
      return this.sizes.find(s => s.id === this.selected) || this.sizes.find(s => s.id === 'safari-414')
    }
  },
  watch: {
    // selected () {
    //   this.useFrame = false
    //   this.$nextTick(() => {
    //     this.useFrame = true
    //   })
    //   // this.sendData({ type: 'resize', detail: {} })
    // },
    output () {
      this.loadFrame()
    }
  },
  mounted () {
    window.addEventListener('unload', () => {
      this.wins.forEach(w => w.close())
    })
    this.loadFrame()
    let sandboxedFrame = this.$refs['iframer']
    window.addEventListener('message', (e) => {
      // Normally, you should verify that the origin of the message's sender
      // was the origin and source you expected. This is easily done for the
      // unsandboxed frame. The sandboxed frame, on the other hand is more
      // difficult. Sandboxed iframes which lack the 'allow-same-origin'
      // header have "null" rather than a valid origin. This means you still
      // have to be careful about accepting data via the messaging API you
      // create. Check that source, and validate those inputs!
      if (
        (e.origin === null && e.source === sandboxedFrame.contentWindow) ||
        (e.origin === (window.location.protocol + '//' + window.location.host))
      ) {
        console.log('Main Got iFrame Message: ', e.data)
        if (
          e.data &&
          e.data.type
        ) {
          console.log('Main Dispatching Custom Event: ', e.data)
          let customEvent = new CustomEvent(e.data.type, { detail: e.data })
          window.dispatchEvent(customEvent)
          this.$emit(e.data.type, { detail: e.data })
        }

        if (e.data.type === 'iframe-system-ready') {
          this.sendData({
            type: 'main-system-ready',
            detail: { status: 'ok' }
          })
          let customEvent = new CustomEvent('main-system-ready', { detail: { status: 'ok' } })
          window.dispatchEvent(customEvent)
        }
      }
    })
  },
  methods: {
    getRect () {
      let scale = this.sizer.scale
      return {
        width: this.sizer.width * scale + 'px',
        height: this.sizer.height * scale + 'px'
      }
    },
    getScaler () {
      let scale = this.sizer.scale
      return {
        width: (this.sizer.width) + 'px',
        height: (this.sizer.height) + 'px',
        transformOrigin: '0% 0%',
        transform: `scale(${scale})`
      }
    },
    sendData (data) {
      let sandboxedFrame = this.$refs['iframer']
      if (!data.type) {
        throw new Error('require event type')
      }
      if (!data.detail) {
        throw new Error('require event detail')
      }
      if (!sandboxedFrame.contentWindow) {
        return
      }
      console.log('Main Send iFrame Message: ', data)
      sandboxedFrame.contentWindow.postMessage({ type: data.type, detail: data.detail }, this.iframeURL)

      this.wins.forEach((w) => {
        w.postMessage({ type: data.type, detail: data.detail }, window.location.origin)
      })
    },
    loadFrame () {
      var url = this.makeURL(this.output.html)
      this.iframeURL = url
      this.wins.forEach((w) => { w.location = url })
    },
    openWindows () {
      this.wins.push(window.open(this.iframeURL))
    },
    makeURL (html) {
      return window.URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    }
  }
}
</script>

<style scoped>
.box{
  width: 100%;
  height: 100%;
}
.iframe{
  border: #bababa solid 1px;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
