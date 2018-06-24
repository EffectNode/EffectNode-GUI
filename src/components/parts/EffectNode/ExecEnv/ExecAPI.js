/*
"@babel/standalone": "^7.0.0-beta.32",
"@tweenjs/tween.js": "^17.2.0",
"babel-plugin-minify-constant-folding": "^0.3.0",
"babel-plugin-syntax-dynamic-import": "^6.18.0",
"babel-plugin-transform-es2015-modules-umd": "^6.24.1",
"babel-plugin-transform-object-rest-spread": "^6.26.0",
"babel-preset-minify": "^0.3.0",
"babel-standalone": "^6.26.0",
*/

import WorkWorkWork from './babel.worker.js'
var worker = new WorkWorkWork()

function makeEventBus () {
  var evts = {}
  var api = {}
  api.on = (name, func) => {
    if (!evts[name]) {
      evts[name] = []
    }
    evts[name].push(func)
  }
  api.once = (name, func) => {
    var newFn = (args) => {
      func(args)
      api.off(newFn)
    }
    api.on(name, newFn)
  }
  api.off = (name, func) => {
    if (!evts[name]) {
      evts[name] = []
    }
    var idx = evts[name].indexOf(func)
    evts[name].splice(idx, 1)
  }
  api.trigger = (name, args) => {
    if (!evts[name]) {
      evts[name] = []
    }
    for (var i = 0; i < evts[name].length; i++) {
      evts[name][i].call({}, args)
    }
  }
  return api
}

var buzz = makeEventBus()

var onMessage = (evt) => {
  buzz.trigger('worker', evt)
  /* eslint-disable */
  // eval(evt.data.data)
  /* eslint-enable */
  // console.log(evt)
}

worker.onmessage = onMessage

// auto clean memory pool
setInterval(() => {
  if (worker) {
    worker.terminate()
    worker = new WorkWorkWork()
    worker.onmessage = onMessage
  }
}, 60 * 1000)
// 60 seconds clean mempool

export default {
  compile ({ files, deps, minify }) {
    worker.postMessage({ files, deps, minify })
  },
  setUp ({ onWorkerDone }) {
    buzz.on('worker', onWorkerDone)
    return () => {
      buzz.off('worker', onWorkerDone)
    }
  }
}
