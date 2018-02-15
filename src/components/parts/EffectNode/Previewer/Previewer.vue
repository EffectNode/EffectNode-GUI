<template>
  <div>
    <iframe class="iframe" v-if="useFrame" :src="iframeURL" frameborder="0" width="600" height="350"></iframe>
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
  },

  methods: {
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
.iframe{
  outline: #939393 solid 1px;
}
</style>
