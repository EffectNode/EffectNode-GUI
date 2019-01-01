(function () {
  var getID = (prefix = '') => {
    return '_exec_' + prefix + '_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }

  function getScript (source) {
    return new Promise((resolve, reject) => {
      window.EFFECT_NODE_HAS_URL = window.EFFECT_NODE_HAS_URL || []
      if (window.EFFECT_NODE_HAS_URL.indexOf(source) !== -1) {
        return resolve()
      }
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
            inputs: this.sockets.filter(s => s.type === 'input' && s.modID === this.mod.id).slice().sort((a, b) => {
              return a.idx - b.idx
            }),
            outputs: this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).slice().sort((a, b) => {
              return a.idx - b.idx
            }),
            cleanHandler () {},
            Signal,
            onInputArrive: {},
            function: {},
            instance: {}
          }
        },
        template: `<span>{{ mod.src }}/span>`,
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
        beforeDestroy () {
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
          },
          metaJSON () {
            return JSON.stringify(this.mod.meta)
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
          Input (mixed, onArrive, once = () => {}) {
            if (typeof mixed === 'number') {
              this.$on('input' + mixed, (v) => {
                onArrive(v)
                this.$emit('input-once' + mixed, v)
              })
              this.$once('input-once' + mixed, once)
            } else if (typeof mixed === 'string') {
              mixed = this.inputs.findIndex(so => so.name === mixed)
              this.$on('input' + mixed, (v) => {
                onArrive(v)
                this.$emit('input-once' + mixed, v)
              })
              this.$once('input-once' + mixed, once)
            } else if (typeof mixed === 'object' && mixed instanceof Array) {
              mixed.forEach(ee => {
                if (typeof ee === 'string') {
                  ee = this.inputs.findIndex(so => so.name === ee)
                }
                this.$on('input' + ee, (v) => {
                  onArrive(v)
                  this.$emit('input-once' + ee, v)
                })
                this.$once('input-once' + ee, once)
              })
            }
          },
          Output (mixed, valueToBeSent) {
            if (typeof mixed === 'number') {
              this.$emit('output' + mixed, valueToBeSent)
            } else if (typeof mixed === 'string') {
              mixed = this.outputs.findIndex(so => so.name === mixed)
              this.$emit('output' + mixed, valueToBeSent)
            } else if (typeof mixed === 'object' && mixed instanceof Array) {
              mixed.forEach(ee => {
                if (typeof ee === 'string') {
                  ee = this.outputs.findIndex(so => so.name === ee)
                }
                this.$emit('output' + ee, valueToBeSent)
              })
            }
          },
          OutputAll (valueToBeSent) {
            this.sockets.filter(s => s.type === 'output' && s.modID === this.mod.id).slice().sort((a, b) => {
              return a.idx - b.idx
            }).forEach((e, ei) => {
              this.$emit('output' + ei, valueToBeSent)
            })
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
                    getMeta: (key) => {
                      return ((this.mod.meta.find(e => e.label === key) || { value: { var: 0 } }).value)
                    },
                    box: this.mod,
                    sockets: this.sockets,
                    IO: this,
                    Input: this.Input,
                    Output: this.Output,
                    OutputAll: this.OutputAll,
                    inputs: this.inputs.map((e, ei) => {
                      Signal.$on(e.id, (v) => {
                        this.$emit('input' + ei, v)
                      })
                      return e
                    }),
                    outputs: this.outputs.map((e, ei) => {
                      this.$on('output' + ei, (v) => {
                        Signal.$emit(e.id, v)
                      })
                      return e
                    })
                  })
                  // console.log('INSTANCE', this.instance)
                  this.readyInstance()
                  resolve()
                } catch (e) {
                  console.log('======compiling======')
                  console.trace(e)
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
          <div ref="systemDOM" style="width: 100%; height: 100%; position: relative;">
            <div v-if="ready" style="display: none; width: 100%; height: 100%; position: absolute; top: 0px; left: 0px;" >
              <pre>{{ modules }}</pre>
              <span style="display: none;">{{ Doc }}</span>
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
            get Doc () {
              return uiAPI.hive.Doc
            },
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
            return this.Doc.root.modules
          },
          sockets () {
            return this.Doc.root.connectors
          },
          outputSignal () {
            return this.Doc.root.connectors.filter((c) => {
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
