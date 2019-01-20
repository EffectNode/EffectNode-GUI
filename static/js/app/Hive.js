(function () {
  var getID = (prefix) => {
    prefix = prefix || ''
    return '_hive_' + prefix + '_' + (1024 * 1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let DomModule = `/* global env */
/* eslint-disable */
let {
  Signal,
  Resources,
  sockets,
  box,
  IO,
  Input,
  Output,
  OutputAll
} = env
/* esltint-enable */
console.log('Environment is ready for you!::', box.id)

let h = {
  fillBackground: (degree) => {
    let gradBg = ''
    gradBg += 'linear-gradient(45deg, '
    gradBg += '    hsl(' + Math.floor(Math.abs(0.5 - degree) * 360)  + ', 50%, 50%), '
    gradBg += '    hsl(' + Math.floor(Math.abs(1.25 - degree) * 360)  + ', 50%, 50%) '
    gradBg += ')'

    Resources.get('rootDOM')
      .style
      .background = gradBg
  }
}

var i = 0;
Input(0, () => {
  h.fillBackground(i / 100);
  i++
  i = i % 100;
});
`

  let MainLoopModule = `/* global env */
/* eslint-disable */
let {
  Signal,
  Resources,
  sockets,
  box,
  IO,
  Input,
  Output,
  OutputAll
} = env
/* esltint-enable */
console.log('========' + 'box.name' + 'is Ready.  ========')
// sender

let startTime = performance.now();

let rAFID = 0
let event = {}
let rAF = () => {
  rAFID = window.requestAnimationFrame(rAF);

  event.time = performance.now();

  OutputAll(event);
}
rAFID = window.requestAnimationFrame(rAF);

Input('onClock', (evt) => {
  OutputAll(evt);
}, () => {
  // cancenl the loop for the recorder
  cancelAnimationFrame(rAFID);
})

  `

  let Data = window.HiveData = {
    init: (api) => {
      return new Promise((resolve, reject) => {
        let Doc = Data.makeDocumentStack()

        Doc.projectID = api.projectID
        Doc.userID = api.userID
        Data.template = {}
        Data.ts = {}
        Data.TableSync = api.TableSync
        Data.RT = api.RT
        Data.listen({ Data, Doc })

        resolve({ Data, Doc })
      })
    },
    async listen ({ Data, Doc }) {
      let TableSync = Data.TableSync
      Data.ts.modules = new TableSync({ namespace: 'boxes', getArray: () => { return Doc.root.modules } })
      Data.ts.connectors = new TableSync({ namespace: 'connectors', getArray: () => { return Doc.root.connectors } })

      Data.template.modules = new TableSync({ namespace: 'temp-boxes', getArray: () => { return Doc.root.template.modules } })
      Data.template.connectors = new TableSync({ namespace: 'temp-connectors', getArray: () => { return Doc.root.template.connectors } })
      return new Promise((resolve) => {
        Data.RT.en.emit('open-hive', {
          projectID: Doc.projectID
        }, async () => {
          Doc.root.modules = []
          Doc.root.connectors = []
          Data.ts.modules.sync()
          Data.ts.connectors.sync()
          Data.template.connectors.sync()
          Data.template.modules.sync()

          // console.log({ userID: Doc.userID, projectID: Doc.projectID })
          Data.ts.connectors.hydrate({ userID: Doc.userID, projectID: Doc.projectID })
          Data.ts.modules.hydrate({ userID: Doc.userID, projectID: Doc.projectID })

          Data.template.connectors.hydrate({ userID: Doc.userID, projectID: 'template' })
          Data.template.modules.hydrate({ userID: Doc.userID, projectID: 'template' })
          resolve()
        })
      })
    },
    getToSocketByFromID ({ Doc, fromSocketID }) {
      let sockets = Data.getAllSockets({ Doc })
      return sockets.find(s => s.socket.to === fromSocketID)
    },
    getModInputs ({ Doc, modID }) {
      let sockets = Data.getAllSockets({ Doc })
      return sockets.filter(s => s.modID === modID && s.type === 'input')
        .slice()
        .sort((a, b) => { return a.idx - b.idx })
    },
    getModOutputs ({ Doc, modID }) {
      let sockets = Data.getAllSockets({ Doc })
      return sockets.filter(s => s.modID === modID && s.type === 'output')
        .slice()
        .sort((a, b) => { return a.idx - b.idx })
    },
    async makePulseMod ({ Doc }) {
      let mod = await Data.makeModule({
        Doc,
        name: 'Main Loop Module',
        src: MainLoopModule
      })

      // Data.addModToDoc({ mod, Doc })
      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in1, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: in2, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: in3, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: in4, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out1, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out2, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out3, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: ou4, Doc })
      return mod
    },
    idxAccu: 0,
    getIDX () {
      Data.idxAccu++
      return Date.now() + Data.idxAccu
    },
    async makeDomMod ({ Doc }) {
      let mod = await Data.makeModule({
        Doc,
        name: 'DOM Updater Module',
        src: DomModule
      })

      // Data.addModToDoc({ mod, Doc })
      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in1, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in2, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in3, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in4, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out1, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out2, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out3, Doc })

      Data.makeSocket({ Doc, idx: Data.getIDX(), type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: ou4, Doc })
      return mod
    },
    async cloneModule ({ Doc, mod, connectors = Doc.root.connectors, pos = false }) {
      let newMod = await Data.makeModule({
        Doc,
        name: mod.name,
        src: mod.src,
        pos: pos || {
          x: mod.pos.x + 30,
          y: mod.pos.y + 30
        },
        meta: JSON.parse(JSON.stringify(mod.meta || []))
      })

      connectors.filter(c => c.modID === mod.id).sort((a, b) => { return a.idx - b.idx })
        .forEach((e, ii) => {
          Data.makeSocket({ Doc, idx: Data.getIDX(), color: e.color, type: e.type, name: e.name, modID: newMod.id })
        })

      return newMod
    },
    async cloneSubmitModule ({ Doc, mod }) {
      let newMod = await Data.makeModule({
        Service: Data.template,
        Doc,
        oldID: mod._id,
        name: mod.name,
        src: mod.src,
        pos: {
          x: 30,
          y: 30
        },
        isTemplate: true,
        isGallery: false,
        projectID: 'template',
        meta: JSON.parse(JSON.stringify(mod.meta || []))
      })

      Doc.root.connectors.filter(c => c.modID === mod.id).sort((a, b) => { return a.idx - b.idx })
        .forEach((e, ii) => {
          Data.makeSocket({ Service: Data.template, Doc, oldID: mod._id, idx: Data.getIDX(), color: e.color, type: e.type, name: e.name, modID: newMod.id, isTemplate: true, isGallery: false, projectID: 'template' })
        })

      return newMod
    },
    removeTemplateBox ({ mod, inputs, outputs }) {
      Data.template.modules.remove(mod)
      inputs.forEach((input) => {
        Data.template.connectors.remove(input)
      })
      outputs.forEach((output) => {
        Data.template.connectors.remove(output)
      })
    },
    getAllSockets ({ Doc }) {
      return Doc.root.connectors.slice().sort((a, b) => { return a.idx - b.idx })
    },
    getAllModules ({ Doc }) {
      return Doc.root.modules
    },
    getAllModulesOfProject ({ Doc }) {
      return Doc.root.modules
    },
    getAllSocketsOfProject ({ Doc }) {
      return Doc.root.connectors.slice().sort((a, b) => { return a.idx - b.idx })
    },
    addSocketToDoc ({ socket, Doc }) {
      Doc.root.connectors.push(socket)
    },
    getSocketByID ({ id, Doc }) {
      return Doc.root.connectors.find(s => s.socket.from === id)
    },
    addModToDoc ({ mod, Doc }) {
      Doc.root.modules.push(mod)
    },
    getTop ({ Doc, socket }) {
      let box = Doc.root.modules.find(m => m.id === socket.modID)
      let boxW = box.size.w
      // let boxH = box.size.h
      let inputs = Data.getModInputs({ Doc, modID: box.id }) || []
      // let outputs = Data.getModOutputs({ Doc, modID: box.id }) || []
      let inputW = boxW / (inputs.length || 3)
      // let outputW = boxW / (outputs.length || 3)

      return {
        rect: {
          x: box.pos.x + inputs.find(e => e.id === socket.id) * inputW,
          y: box.pos.y - 13,
          w: inputW,
          h: 13
        }
      }
    },
    getBottom ({ Doc, socket }) {
      let box = Doc.root.modules.find(m => m.id === socket.modID)
      let boxW = box.size.w
      let boxH = box.size.h
      // let inputs = Data.getModInputs({ Doc, modID: box.id }) || []
      let outputs = Data.getModOutputs({ Doc, modID: box.id }) || []
      // let inputW = boxW / (inputs.length || 3)
      let outputW = boxW / (outputs.length || 3)

      return {
        rect: {
          x: box.pos.x + outputs.find(e => e.id === socket.id) * outputW,
          y: box.pos.y + boxH - 13 + 13,
          w: outputW,
          h: 13
        }
      }
    },
    removeModToDoc ({ mod, Doc }) {
      let modules = Doc.root.modules
      let idx = modules.findIndex(m => m.id === mod.id)
      modules.splice(idx, 1)
    },
    removeSocketFromMod ({ socket }) {
      // let connectors = Doc.root.connectors
      // let idx = connectors.findIndex(m => m._id === socket._id)
      // connectors.splice(idx, 1)
      return Data.ts.connectors.remove(socket)
    },
    makeDocumentStack () {
      return {
        root: {
          modules: [],
          connectors: [],
          template: {
            modules: [],
            connectors: []
          }
        },
        versions: [
          // {
          //   date: new Date(),
          //   root: {}
          // }
        ]
      }
    },
    async makeSocket ({ Service = Data.ts, Doc, oldID = '', idx = 0, type = 'input', color = '#e4e3e5', name = 'my socket', modID, projectID = Doc.projectID, isTemplate = false, isGallery = false }) {
      let sID = getID(Doc.projectID + 'socket')
      let data = {
        userID: Doc.userID,
        projectID: projectID,
        oldID,
        id: sID,
        isTemplate,
        isGallery,
        type,
        idx,
        name,
        color,
        modID,
        mod: {
          from: modID,
          to: ''
        },
        socket: {
          from: sID,
          to: ''
        }
      }
      let resp = await Service.connectors.add(data)
      let obj = resp.data.results
      return obj
    },
    async makeModule ({ Service = Data.ts, Doc, oldID = '', src = '', name = '', pos, meta, projectID = Doc.projectID, isTemplate = false, isGallery = false }) {
      let modID = getID(Doc.projectID + 'module')
      let data = {
        userID: Doc.userID,
        projectID: projectID,
        id: modID,
        isTemplate,
        isGallery,
        oldID,
        meta: meta || [],
        bg: '',
        name: name,
        pos: pos || {
          x: 100,
          y: 100
        },
        size: {
          w: 200,
          h: 40
        },
        src: src
      }

      let resp = await Service.modules.add(data)
      let obj = resp.data.results
      return obj
    }// ,
    // makeBridge () {
    //   return {
    //     id: getID(),
    //     line: {
    //       running: true,
    //       stroke: `green`
    //     },
    //     a: {
    //       rect: {
    //         x: 50,
    //         y: 50,
    //         w: 25,
    //         h: 10,
    //         stroke: ``,
    //         fill: `lime`
    //       },
    //       marker: {
    //         stroke: ``,
    //         fill: `green`
    //       }
    //     },
    //     b: {
    //       rect: {
    //         x: 200,
    //         y: 100,
    //         w: 25,
    //         h: 10,
    //         stroke: ``,
    //         fill: `lime`
    //       },
    //       marker: {
    //         stroke: ``,
    //         fill: `green`
    //       }
    //     }
    //   }
    // }
  }
}())
