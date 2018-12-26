(function () {
  var getID = (prefix = '') => {
    return '_exec_' + prefix + '_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }

  function getScript (source) {
    return new Promise((resolve, reject) => {
      var script = document.createElement('script')
      var prior = document.getElementsByTagName('script')[0]
      script.onload = () => { resolve() }
      script.src = source
      prior.parentNode.insertBefore(script, prior)
    })
  }

  function loadAllJS (allJS) {
    allJS = allJS || [
      'https://cdnjs.cloudflare.com/ajax/libs/rasterizehtml/1.3.0/rasterizeHTML.allinone.js',

      'https://threejs.org/build/three.min.js',
      'https://threejs.org/examples/js/controls/OrbitControls.js',

      'https://threejs.org/examples/js/postprocessing/EffectComposer.js',
      'https://threejs.org/examples/js/postprocessing/RenderPass.js',
      'https://threejs.org/examples/js/postprocessing/ShaderPass.js',
      'https://threejs.org/examples/js/shaders/CopyShader.js',
      'https://threejs.org/examples/js/shaders/LuminosityHighPassShader.js',
      'https://threejs.org/examples/js/postprocessing/UnrealBloomPass.js'
    ]
    function loopLoad () {
      let js = allJS.shift()
      return getScript(js)
        .then(() => {
          if (allJS.length > 0) {
            return loopLoad()
          } else {
            return Promise.resolve()
          }
        })
    }
    return loopLoad()
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
      let MakeResources = () => {
        let api = {
          kvStore: {},
          notifiers: []
        }

        api.set = (key, value) => {
          api.kvStore[key] = value
        }
        api.get = (key) => {
          return api.kvStore[key]
        }
        let js = api.js = {}
        js.need = (key, jsArr) => {
          loadAllJS(jsArr)
            .then(() => {
              api.set(key, true)
            })
        }
        js.ensure = api.ensure = (keys) => {
          console.log(keys)
          return Promise.all(
            keys.map((key) => {
              return new Promise((resolve) => {
                if (api.get(key)) {
                  resolve(api.get(key))
                } else {
                  let interval = setInterval(() => {
                    if (api.get(key)) {
                      console.log('ensure, got', key)
                      clearTimeout(interval)
                      resolve(api.get(key))
                    }
                  }, 1000 / 20)
                }
              })
            })
          )
        }

        return api
      }
      let Resources = MakeResources()

      let modRunner = {
        props: {
          sockets: {},
          mod: {}
        },
        data () {
          return {
            cleanHandler () {},
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
              try {
                this.instance.onClean && this.instance.onClean()
              } catch (e) {
                console.log(e)
              }
            }
          },
          readyInstance () {
            if (this.instance) {
              try {
                this.instance.onReady && this.instance.onReady()
              } catch (e) {
                console.log(e)
              }
            }
          },
          instantiate () {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                /* eslint-disable */
                try {
                  this.cleanInstance()
                  this.function = new Function('env', this.mod.src)
                  this.instance = new this.function({
                    loadAllJS,
                    Resources,
                    Signal,
                    box: this.mod,
                    sockets: this.sockets,
                    inputs: this.sockets.filter(s => s.type === 'input' && s.modID === this.mod.id).slice().sort((a, b) => {
                      return a.idx - b.idx
                    }),
                    outputs: this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).slice().sort((a, b) => {
                      return a.idx - b.idx
                    })
                  })
                  console.log('INSTANCE', this.instance)
                  this.readyInstance()
                  resolve()
                } catch (e) {
                  console.log('======compiling======')
                  console.error(e)
                  console.error(this.mod.src)
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
              <modrunner v-if="canRunSystem" :signal="Signal" @refresh-sockets="refreshSockets" :key="mod._id + mod.id" :sockets="sockets" :mod="mod" v-for="mod in modules"></modrunner>
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
            canRunSystem: true,
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
          reset () {
            Resources = MakeResources()
            Resources.set('rootDOM', this.$refs.rootDOM)
            this.refreshSockets()
            this.canRunSystem = false
            setTimeout(() => {
              this.canRunSystem = true
            }, 100)
          },
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
