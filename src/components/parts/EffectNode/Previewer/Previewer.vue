<template>
  <div class="box">
    <span v-if="iframeURL === 'about:blank'">Loading...</span>
    <iframe ref="iframer" class="iframe" v-if="useFrame" :src="iframeURL" sandbox="allow-scripts allow-same-origin allow-modals" frameborder="0" ></iframe>
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
    }
  },
  data () {
    return {
      useFrame: true,
      iframeURL: 'about:blank'
    }
  },
  watch: {
    output () {
      this.loadFrame()
    }
  },
  mounted () {
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
        }
      }
    })
  },
  methods: {
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
    },
    loadFrame () {
      var url = this.makeURL(this.output.html)
      this.iframeURL = url
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
  outline: #939393 solid 1px;
}
.iframe{
  width: 100%;
  height: 100%;
}
</style>
