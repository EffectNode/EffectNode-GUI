(function () {
  let g = window
  var getID = () => {
    return '_exec_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let ExecEnv = {
    init: ({ Doc, Data }) => {
      return new Promise((resolve) => {
        let Sys = ExecEnv.makeLgocialStructure({ Doc, Data })
        resolve({ ExecEnv, Sys })
      })
    },
    makeLgocialStructure: ({ Doc, Data }) => {
      let Vue = window.Vue
      let FlowYo = new Vue({})
      let global = {
        FlowYo
      }
      Vue.component('mod-holder', {
        props: {
          mod: {}
        },
        data () {
          return {
            global,
            FlowYo,
            instance: {}
          }
        },
        template: `<span></span>`,
        mounted () {
          this.$emit('made')
        },
        beforeDestroy () {
          this.$emit('clean')
        }
      })
      return new Vue({
        template: `
          <div>
            <mod-holder :key="mod.id"></mod-holder>
          </div>
        `,
        el: document.createElement('div'),
        data: global
      })
    }
  }
  g.getID = getID
  g.ExecEnv = ExecEnv
}())
