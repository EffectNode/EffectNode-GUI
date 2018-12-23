(function () {
  var getID = (prefix = '') => {
    return '_exec_' + prefix + '_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let ExecEnv = {
    init: (uiAPI) => {
      return new Promise((resolve) => {
        let Sys = ExecEnv.makeLgocialStructure(uiAPI)
        resolve({ ExecEnv, Sys })
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
          }
        },
        async beforeDestroy () {
          this.$emit('clean', this.instance)
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
          <div>
            <module-runner :key="mod.id" :sockets="sockets" :mod="mod" v-for="mod in modules"></module-runner>
          </div>
        `,
        el: document.createElement('div'),
        data: {
          modules: Data.getAllModulesOfProject({ Doc, projectID }),
          sockets: Data.getAllSocketsOfProject({ Doc, projectID }),
          FlowYo
        }
      })
    }
  }
  window.getID = getID
  window.ExecEnv = ExecEnv
}())
