// import * as API from './API'
export function getID () {
  return '_' + (Math.random() * 100000000).toFixed(0)
}

export const AppList = () => {
  return [
    {
      tags: [],
      windowTitle: 'Quotes',
      compoName: 'QuotesApp',
      App: require('@/enOS/Apps/QuotesApp/Index.vue').default,
      typeCode: 'quotes'
    },
    {
      tags: [],
      windowTitle: 'Animation',
      compoName: 'AnimationApp',
      App: require('@/enOS/Apps/AnimationApp/Index.vue').default,
      typeCode: 'animation'
    },
    {
      startMenu: true,
      tags: ['demo'],
      windowTitle: 'Dimensional',
      compoName: 'DimensionalApp',
      App: require('@/enOS/Apps/DimensionalApp/Index.vue').default,
      typeCode: 'dimensional'
    },
    {
      startMenu: true,
      tags: ['demo'],
      windowTitle: 'ParticleSea',
      compoName: 'ParticleSeaApp',
      App: require('@/enOS/Apps/ParticleSeaApp/Index.vue').default,
      typeCode: 'particle-sea'
    },
    {
      startMenu: true,
      tags: ['demo'],
      windowTitle: 'Volumetric',
      compoName: 'VolumetricApp',
      App: require('@/enOS/Apps/VolumetricApp/Index.vue').default,
      typeCode: 'volumetric'
    },
    {
      startMenu: true,
      tags: ['effect'],
      windowTitle: 'Visual Effect Flow Editor',
      compoName: 'ConnectorApp',
      App: require('@/enOS/Apps/ConnectorApp/Index.vue').default,
      typeCode: 'connector'
    },
    {
      startMenu: true,
      tags: ['effect'],
      windowTitle: 'Preview Window',
      compoName: 'ExecEnvApp',
      App: require('@/enOS/Apps/ExecEnvApp/Index.vue').default,
      typeCode: 'exec-env'
    },
    {
      tags: [],
      windowTitle: 'ModEditor',
      compoName: 'ModEditorApp',
      App: require('@/enOS/Apps/ModEditorApp/Index.vue').default,
      typeCode: 'mod-editor'
    },
    {
      startMenu: true,
      tags: [],
      windowTitle: 'Help',
      compoName: 'HelpApp',
      App: require('@/enOS/Apps/HelpApp/Index.vue').default,
      typeCode: 'docs'
    },
    {
      startMenu: true,
      tags: ['effect'],
      windowTitle: 'Module Gallery',
      compoName: 'ModuleGalleryApp',
      App: require('@/enOS/Apps/ModuleGalleryApp/Index.vue').default,
      typeCode: 'mod-gallery'
    },
    {
      startMenu: true,
      tags: ['effect'],
      windowTitle: 'Note App',
      compoName: 'NoteApp',
      App: require('@/enOS/Apps/NoteApp/NoteApp.vue').default,
      typeCode: 'note'
    }
  ]
}

export const Apps = () => AppList().reduce((c, ii) => {
  c[ii.compoName] = ii.App
  return c
}, {})

export const TypeFilter = (type) => {
  return (AppList().find(tc => tc.typeCode === type) || {}).compoName
}

export const StartMenu = () => {
  return AppList().slice().filter(a => a.startMenu)
}

var temp = {
  x: 30,
  y: 30
}

export function square (api, currentWin) {
  let avg = 360
  currentWin.win.width = avg
  currentWin.win.height = avg + 30
  currentWin.win.minimised = true
  setTimeout(() => {
    currentWin.win.minimised = false
  }, 100)
}

export function organise (api) {
  if (window.innerWidth <= 769) {
    let w = window.innerWidth - 40
    let h = 350
    api.portals.forEach((ip, idx) => {
      ip.win.x = 20
      ip.win.y = 20
      ip.win.width = w
      ip.win.height = h
      if (idx === 0) {
        ip.win.minimised = true
        setTimeout(() => {
          ip.win.minimised = false
        }, 100 * idx)
      } else {
        ip.win.minimised = true
      }
    })
  } else {
    let w = window.innerWidth - 40
    let h = window.innerHeight - 70 - 30
    api.portals.forEach((ip, idx) => {
      ip.win.x = 30 * (idx + 1)
      ip.win.y = 30 * (idx + 1)
      ip.win.width = w > 600 ? 600 : w
      ip.win.height = h > 500 ? 500 : h
      setTimeout(() => {
        ip.win.minimised = true
      }, 10)
    })
    let connectorApp = api.portals.find(a => a.app === 'ConnectorApp')
    if (connectorApp) {
      connectorApp.win.x = 20
      connectorApp.win.y = 20
      connectorApp.win.minimised = true
      setTimeout(() => {
        connectorApp.win.minimised = false
      }, 10)
    }
    let previewApp = api.portals.find(a => a.app === 'ExecEnvApp')
    if (previewApp) {
      previewApp.win.width = 400
      previewApp.win.height = 300
      previewApp.win.x = window.innerWidth - previewApp.win.width - 20
      previewApp.win.y = 20
      previewApp.win.minimised = true
      setTimeout(() => {
        previewApp.win.minimised = false
      }, 10)
    }
  }
  temp.x = 30
  temp.y = 30
}

export function makeWin (id, appName) {
  let w = window.innerWidth - 40
  let h = window.innerHeight - 70 - 30
  let win = {
    name: appName,
    width: w > 600 ? 600 : w,
    height: h > 500 ? 500 : h,
    x: 20 + temp.x,
    y: 20 + temp.y,
    z: 100000,
    active: true,
    minimised: false,
    space3D: false
  }

  temp.x += 30
  temp.y += 30

  temp.x %= 210
  temp.y %= 210

  if (window.innerWidth < 500) {
    win.width = window.innerWidth - win.x * 2.0
    temp.x = 0
    temp.y = 0
  }

  return win
}

export function makePortal ({ type, appName = 'App', data = {} }) {
  let id = getID()
  let win = makeWin(id, appName)
  let app = 'QuotesApp'

  // if (type === 'animation') {
  //   app = 'AnimationApp'
  // } else if (type === 'quotes') {
  //   app = 'QuotesApp'
  // } else if (type === 'dimensional') {
  //   app = 'DimensionalApp'
  // } else if (type === 'particle-sea') {
  //   app = 'ParticleSeaApp'
  // } else if (type === 'volumetric') {
  //   app = 'VolumetricApp'
  // } else if (type === 'connector') {
  //   app = 'ConnectorApp'
  // } else if (type === 'exec-env') {
  //   app = 'ExecEnvApp'
  // } else if (type === 'mod-editor') {
  //   app = 'ModEditorApp'
  // } else if (type === 'docs') {
  //   app = 'HelpApp'
  // }

  app = TypeFilter(type) || app

  return {
    id,
    app,
    date: Date.now(),
    win,
    data
  }
}

export function makeSample (api) {
  // api.portals.push(
  //   makePortal({ type: 'connector', data: {} })
  // )
  // api.portals.push(
  //   makePortal({ type: 'exec-env', data: {} })
  // )
  api.addWindow({ data: {}, appName: 'Visual Effect Flow Editor', type: 'connector' })
  api.addWindow({ data: {}, appName: 'Documentation', type: 'docs' })
  api.addWindow({ data: {}, appName: 'Preview Window', type: 'exec-env' })
  api.organise()
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
  // let idx = api.portals.findIndex(p => p.id === current.id)
  // api.portals.splice(idx, 1)
  // api.portals.push(current)
  makeZList(api)
}

export function makeZList (api) {
  api.portals.slice().sort((a, b) => {
    if (a.win.active) {
      return 1
    } else {
      return -1
    }
  }).forEach((i, ii) => {
    i.win.z = ii
  })
}
export function isIn3D (api) {
  let firstPortal = api.portals[0]
  if (firstPortal) {
    return firstPortal.win.space3D
  } else {
    return false
  }
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

export function init ({ projectID }) {
  var mod = {}
  mod.projectID = projectID
  mod.meta = {}
  mod.portals = []
  mod.makeSample = () => {
    makeSample(mod)
  }
  mod.isIn3D = () => {
    return isIn3D(mod)
  }
  mod.addWindow = (arg) => {
    addWindow(mod, arg)
  }
  mod.fixOverflow = () => {
    fixOverflow(mod)
  }
  mod.enableSpace3D = () => {
    enableSpace3D(mod)
  }
  mod.disableSpace3D = () => {
    disableSpace3D(mod)
  }
  mod.makeZList = () => {
    makeZList(mod)
  }
  mod.sortWinZ = (current) => {
    sortWinZ(mod, current)
  }
  mod.removeWindow = (current) => {
    removeWindow(mod, current)
  }
  mod.hideWindow = (current) => {
    hideWindow(mod, current)
  }
  mod.activate = (current) => {
    activate(mod, current)
  }
  mod.square = (current) => {
    square(mod, current)
  }
  mod.organise = () => {
    organise(mod)
  }
  mod.startMenuItems = StartMenu()

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mod)
    }, 10)
  })
}
