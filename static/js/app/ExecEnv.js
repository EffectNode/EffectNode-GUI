(function () {
  let g = window
  var getID = () => {
    return '_exec_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let ExecEnv = {
    init: () => {
      return new Promise((resolve, reject) => {
        let Ram = ExecEnv.makeMindfulUniverse()
        resolve({ ExecEnv, Ram })
      })
    },
    makeDopeFreshness: () => {
      //
    },
    makeMindfulUniverse: () => {
      return {
        instances: []
      }
    }
  }
  g.getID = getID
  g.ExecEnv = ExecEnv
}())
