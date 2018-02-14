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
    files () {
      this.compile()
    }
  },
  methods: {
    compile () {
      ExecAPI.compile({
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
