<template>
  <div></div>
</template>

<script>
import ExecAPI from './ExecAPI.js'
export default {
  props: {
    init: {
      default: false
    },
    files: {
      default () {
        /* eslint-disable */
        return [
          {
            path: '@/index.html',
            src: `ExecEnv`

          },
          {
            path: '@/main.js',
            src: `console.log('main.js');`
          }
        ]
      }
    }
  },
  data () {
    return {
      clean () {}
    }
  },
  mounted () {
    var onWorkerDone = (evt) => {
      console.log('done-compiling', evt.data)
      this.$emit('src', evt.data)
    }
    window.addEventListener('main-system-ready', () => {
        window.document.documentElement.classList.remove('loading')
    }, false)

    this.clean = ExecAPI.setUp({ onWorkerDone })
    if (this.init) {
      this.compile()
    }
  },
  watch: {
    // files () {
    //   this.compile()
    // }
  },
  methods: {
    getHTML () {
      return (this.files.find(f => f.path === '@/index.html') || {}).src || false
    },
    getDeps () {
      var tagToDetect = 'required'
      var html = this.getHTML()
      if (html) {
        var el = document.createElement('html')
        el.innerHTML = html
        var query = el.querySelectorAll('script[' + tagToDetect + ']')

        var bucket = []
        for (var i = 0; i < query.length; i++) {
          bucket.push({
            global: query[i].getAttribute(tagToDetect),
            src: query[i].getAttribute('src')
          })
        }
        // console.log(bucket)
        return bucket
      } else {
        return []
      }
    },
    compile (v) {
      let minify = false
      if (v) {
        minify = v.minify
      }
      window.document.documentElement.classList.add('loading')

      ExecAPI.compile({
        deps: this.getDeps(this.files),
        files: this.files,
        minify
      })
    }
  },
  beforeDestroy () {
    this.clean()
  }
}
</script>

<style>
html.loading *{
  cursor: url('./img/loading-fire.svg'), progress;
}
html *{
  cursor: url('./img/arrow.svg'), auto;
}
</style>
