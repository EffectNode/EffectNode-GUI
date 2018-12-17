export function getID () {
  return '_' + (Math.random() * 100000000).toFixed(0)
}

var temp = {
  x: 0,
  y: 0
}

export function makeWin () {
  let win = {
    name: 'App',
    width: 500,
    height: 350,
    x: 30 + temp.x,
    y: 30 + temp.y,
    z: 100000,
    active: true,
    minimised: false,
    space3D: false
  }

  temp.x += 30
  temp.y += 30

  temp.x %= 180
  temp.y %= 180

  if (window.innerWidth < 500) {
    win.width = window.innerWidth - win.x * 2.0
    temp.x = 0
    temp.y = 0
  }

  return win
}

export function makePortal ({ type, data }) {
  let id = getID()
  let win = makeWin(id)
  let app = 'QuotesApp'
  if (type === 'animation') {
    app = 'AnimationApp'
  } else if (type === 'quotes') {
    app = 'QuotesApp'
  } else if (type === 'dimensional') {
    app = 'DimensionalApp'
  } else if (type === 'particle-sea') {
    app = 'ParticleSeaApp'
  } else if (type === 'volumetric') {
    app = 'VolumetricApp'
  } else if (type === 'connector') {
    app = 'ConnectorApp'
  }

  return {
    id,
    app,
    date: Date.now(),
    win,
    data
  }
}

export function makeSample (api) {
  api.portals.push(
    makePortal({ type: 'connector' })
  )
}

export function addWindow (api, args) {
  let newWin = makePortal(args)
  api.portals.push(
    newWin
  )
  sortWinZ(api, newWin)
}

export function hideWindow (api, current) {
  current.win.minimised = true
  makeZList(api)
}

export function removeWindow (api, current) {
  let idx = api.portals.findIndex(e => e.id === current.id)
  api.portals.splice(idx, 1)
}

export function fixOverflow (api) {
  let go = api.portals.reduce((c, p) => {
    let isOutView = p.win.x >= window.innerWidth || p.win.y >= window.innerHeight
    if (isOutView) {
      c = true
    }
    return c
  }, false)
  if (go) {
    api.portals.forEach((p, i) => {
      p.win.x = 50 + i * 50
      p.win.y = 50 + i * 50
      p.win.z = 10 + i
    })
  }
}

export function sortWinZ (api, current) {
  let idx = api.portals.findIndex(p => p.id === current.id)
  api.portals.splice(idx, 1)
  api.portals.push(current)
  makeZList(api)
}

export function makeZList (api) {
  api.portals.filter(e => !e.win.minimised).forEach((i, ii) => {
    i.win.z = ii
  })
}

export function enableSpace3D (api) {
  api.portals.forEach((i, ii) => {
    i.win.space3D = true
  })
}
export function disableSpace3D (api) {
  api.portals.forEach((i, ii) => {
    i.win.space3D = false
  })
}

export function activate (api, current) {
  api.portals.forEach(i => {
    i.win.active = false
  })
  current.win.active = true
  current.win.minimised = false
  sortWinZ(api, current)
}

export function makeEngine () {
  var api = {}
  api.meta = {}
  api.portals = []
  api.meta.space3DMode = false
  api.makeSample = () => {
    makeSample(api)
  }
  api.addWindow = (arg) => {
    addWindow(api, arg)
  }
  api.fixOverflow = () => {
    fixOverflow(api)
  }
  api.enableSpace3D = () => {
    enableSpace3D(api)
  }
  api.disableSpace3D = () => {
    disableSpace3D(api)
  }
  api.makeZList = () => {
    makeZList(api)
  }
  api.sortWinZ = (current) => {
    sortWinZ(api, current)
  }
  api.removeWindow = (current) => {
    removeWindow(api, current)
  }
  api.hideWindow = (current) => {
    hideWindow(api, current)
  }
  api.activate = (current) => {
    activate(api, current)
  }
  api.load = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 10)
    })
  }
  return api
}
