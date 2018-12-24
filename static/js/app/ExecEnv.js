(function () {
  var getID = (prefix = '') => {
    return '_exec_' + prefix + '_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let ExecEnv = {
    init: (uiAPI) => {
      return new Promise((resolve) => {
        let Sys = ExecEnv.makeLgocialStructure(uiAPI)
        uiAPI.execEnv = { ExecEnv, Sys }
        resolve(uiAPI)
      })
    },
    makeLgocialStructure: (uiAPI) => {
      let { Doc, Data } = uiAPI.hive
      let { projectID } = Doc
      let Vue = window.Vue
      let Signal = new Vue({})
      let Resources = (() => {
        let api = {
          kvStore: {}
        }

        api.set = (key, value) => {
          api.kvStore[key] = value
        }
        api.get = (key) => {
          return api.kvStore[key]
        }

        return api
      })()

      let modRunner = {
        props: {
          sockets: {},
          mod: {}
        },
        data () {
          return {
            Signal,
            function: {},
            instance: {}
          }
        },
        template: `<span>{{ mod.src }}</span>`,
        async mounted () {
          try {
            await this.instantiate()
            this.$emit('made', this.instance)
          } catch (e) {
            console.log(e)
          }
        },
        watch: {
          code () {
            clearTimeout(this.codeTimeout)
            this.codeTimeout = setTimeout(() => {
              this.instantiate()
            }, 500)
          },
          sockets: {
            deep: true,
            handler () {
              clearTimeout(this.sTimeout)
              this.sTimeout = setTimeout(() => {
                this.instantiate()
              }, 500)
            }
          }
        },
        async beforeDestroy () {
          // this.sockets.forEach(i => {
          //   i.mod.to = false
          //   i.socket.to = false
          // })
          this.cleanInstance()
          this.$emit('clean', this.instance)
        },
        computed: {
          code () {
            return this.mod.src
          }
        },
        methods: {
          cleanInstance () {
            if (this.instance) {
              this.sockets.filter(s => s.type === 'input' && s.modID === this.mod.id).forEach((input) => {
                Signal.$off(input.id)
              })
              this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).forEach((output) => {
                Signal.$off(output.id)
              })
              this.$emit('refresh-sockets')
              this.instance.onClean && this.instance.onClean()
            }
          },
          readyInstance () {
            if (this.instance) {
              this.instance.onReady && this.instance.onReady()
            }
          },
          instantiate () {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                /* eslint-disable */
                try {
                  this.cleanInstance()
                  this.function = new Function('env', this.mod.src)
                  let self = this
                  this.instance = new this.function({
                    Resources,
                    Signal,
                    box: this.mod,
                    sockets: this.sockets,
                    inputs: this.sockets.filter(s => s.type === 'input' && s.modID === this.mod.id).slice().sort((a, b) => {
                      return b.idx - a.idx
                    }),
                    outputs: this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).slice().sort((a, b) => {
                      return b.idx - a.idx
                    })
                  })
                  console.log('INSTANCE', this.instance)
                  this.readyInstance()
                  resolve()
                } catch (e) {
                  console.log('======compiling======')
                  console.error(e)
                  reject(e)
                }
                /* eslint-enable */
              })
            })
          }
        }
      }
      modRunner = Vue.component('modrunner', modRunner)

      return new Vue({
        components: {
          'modrunner': modRunner
        },
        template: `
          <div style="width: 100%; height: 100%; position: relative;">
            <div v-if="ready" style="display: none; width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;" >
              <pre>{{ modules }}</pre>
              <span style="display: none;">{{ root }}</span>
              <modrunner :signal="Signal" @refresh-sockets="refreshSockets" :key="mod._id" :sockets="sockets" :mod="mod" v-for="mod in modules"></modrunner>
            </div>
            <div class="rootDOM" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;" ref="rootDOM"></div>
          </div>
        `,
        el: document.createElement('div'),
        mounted () {
          Resources.set('rootDOM', this.$refs.rootDOM)
          this.refreshSockets()
          this.ready = true
          this.$forceUpdate()
        },
        data () {
          return {
            ready: false,
            root: Doc.root,
            Signal,
            h: {}
          }
        },
        watch: {
          modules: {
            deep: true,
            handler () {
              this.refreshSockets()
            }
          }
        },
        methods: {
          refreshSockets () {
            this.sockets.filter(s => s.socket.to && s.type === 'output').forEach((soc) => {
              if (this.h[soc.socket.from]) {
                Signal.$off(soc.socket.from, this.h[soc.socket.from])
              }
              this.h[soc.socket.from] = (v) => {
                // console.log(soc.socket.from, soc.socket.to)
                Signal.$emit(soc.socket.to, v)
              }
              Signal.$on(soc.socket.from, this.h[soc.socket.from])
            })
          }
        },
        computed: {
          modules () {
            return Data.getAllModulesOfProject({ Doc, projectID })
          },
          sockets () {
            return Data.getAllSocketsOfProject({ Doc, projectID })
          },
          outputSignal () {
            return Doc.root.connectors.filter((c) => {
              return c.socket.to && c.socket.from && c.type === 'output'
            })
          }
        }
      })
    }
  }
  window.getID = getID
  window.ExecEnv = ExecEnv
}())
