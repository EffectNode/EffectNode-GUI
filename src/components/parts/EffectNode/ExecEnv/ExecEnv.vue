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
    compile () {
      ExecAPI.compile({
        deps: this.getDeps(this.files),
        files: this.files
      })
    }
  },
  beforeDestroy () {
    this.clean()
  }
}
</script>

<style scoped>

</style>
