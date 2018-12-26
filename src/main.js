// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// import VueCodemirror from 'vue-codemirror'

// import 'codemirror/lib/codemirror.css'
// import 'codemirror/keymap/sublime.js'
// import 'codemirror/addon/hint/show-hint.js'
// import 'codemirror/addon/fold/foldcode.js'
// import 'codemirror/addon/fold/foldgutter.js'
// import 'codemirror/addon/fold/brace-fold.js'
// import 'codemirror/theme/monokai.css'

// import '@/enOS/CodeMirror/mirror.css'

Vue.config.productionTip = false
// Vue.use(VueCodemirror)

window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
