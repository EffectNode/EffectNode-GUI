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
      let { Doc, Data, projectID } = uiAPI.hive
      let Vue = window.Vue
      let FlowYo = new Vue({})
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
      Vue.component('module-runner', {
        props: {
          sockets: {},
          mod: {}
        },
        data () {
          return {
            FlowYo,
            function: {},
            instance: {}
          }
        },
        template: `<span></span>`,
        async mounted () {
          try {
            await this.instantiate()
            this.$emit('made', this.instance)
          } catch (e) {
            console.log(e)
          }
        },
        async beforeDestroy () {
          this.$emit('clean', this.instance)
          this.sockets.forEach(i => {
            i.mod.to = false
            i.socket.to = false
          })
          if (this.instance) {
            this.FlowYo.$emit('onClean', { modID: this.mod.id })
          }
        },
        methods: {
          instantiate () {
            return new Promise((resolve) => {
              setTimeout(() => {
                /* eslint-disable */
                try {
                  this.function = new Function('env', this.mod.src)
                  this.instance = new this.function({
                    Resources,
                    FlowYo,
                    mod: this.mod,
                    sockets: this.sockets,
                    inputs: this.sockets.filter(s => s.type === 'input'),
                    outputs: this.sockets.filter(s => s.type === 'output')
                  })
                  console.log('INSTANCE', this.instance)
                  this.FlowYo.$emit('onReady', { modID: this.mod.id })
                  resolve()
                } catch (e) {
                  reject(e)
                }
                /* eslint-enable */
              })
            })
          }
        }
      })

      return new Vue({
        template: `
          <div style="width: 100%; height: 100%;">
            <div style="width: 100%; height: 100%" ref="rootDOM"></div>
            <span style="display: none;">{{ root }}</span>
            <div v-if="ready">
              <module-runner :key="mod.id" :sockets="sockets" :mod="mod" v-for="mod in modules"></module-runner>
            </div>
          </div>
        `,
        el: document.createElement('div'),
        mounted () {
          Resources.set('rootDOM', this.$refs.rootDOM)
          this.ready = true
        },
        data: {
          ready: false,
          root: Doc.root,
          FlowYo
        },
        computed: {
          modules: () => Data.getAllModulesOfProject({ Doc, projectID }),
          sockets: () => Data.getAllSocketsOfProject({ Doc, projectID })
        }
      })
    }
  }
  window.getID = getID
  window.ExecEnv = ExecEnv
}())
