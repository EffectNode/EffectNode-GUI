import * as THREE from 'three'
var self = this

onmessage = (evt) => {
  self.sessionStroage = {}
  self.localStorage = {}
  self.indexedDB = {}
  self.console = {}
  self.importScripts = {}

  var formula = evt.data.formula

  /* eslint-disable */
  var runner = new Function('THREE', formula)
  /* eslint-enable */
  var result = runner(THREE)
  // console.log(positions)
  postMessage(result)
}
