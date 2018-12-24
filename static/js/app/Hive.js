(function () {
  let g = window
  var getID = (prefix = '') => {
    return '_hive_' + prefix + '_' + (1024 * 1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let Data = g.HiveData = {
    init: (api) => {
      return new Promise((resolve, reject) => {
        let Doc = Data.makeDocumentStack()

        Doc.projectID = api.projectID
        Doc.userID = api.userID
        Data.ts = Data.ts || {}
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
      return new Promise((resolve) => {
        Data.RT.en.emit('open-hive', {
          projectID: Doc.projectID
        }, async () => {
          Data.ts.modules.sync()
          Data.ts.connectors.sync()

          console.log({ userID: Doc.userID, projectID: Doc.projectID })
          Data.ts.connectors.hydrate({ userID: Doc.userID, projectID: Doc.projectID })
          Data.ts.modules.hydrate({ userID: Doc.userID, projectID: Doc.projectID })

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
    },
    getModOutputs ({ Doc, modID }) {
      let sockets = Data.getAllSockets({ Doc })
      return sockets.filter(s => s.modID === modID && s.type === 'output')
    },
    async makein4out4Mod ({ Doc }) {
      let mod = await Data.makeModule({ Doc })

      // Data.addModToDoc({ mod, Doc })

      Data.makeSocket({ Doc, type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in1, Doc })

      Data.makeSocket({ Doc, type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in2, Doc })

      Data.makeSocket({ Doc, type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in3, Doc })

      Data.makeSocket({ Doc, type: 'input', modID: mod.id })
      // Data.addSocketToDoc({ socket: in4, Doc })

      Data.makeSocket({ Doc, type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out1, Doc })

      Data.makeSocket({ Doc, type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out2, Doc })

      Data.makeSocket({ Doc, type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: out3, Doc })

      Data.makeSocket({ Doc, type: 'output', modID: mod.id })
      // Data.addSocketToDoc({ socket: ou4, Doc })
    },
    getAllSockets ({ Doc }) {
      return Doc.root.connectors
    },
    getAllModules ({ Doc }) {
      return Doc.root.modules
    },
    getAllModulesOfProject ({ Doc }) {
      return Doc.root.modules
    },
    getAllSocketsOfProject ({ Doc }) {
      return Doc.root.connectors
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
    makeDocumentStack () {
      return {
        root: {
          modules: [],
          connectors: []
        },
        versions: [
          // {
          //   date: new Date(),
          //   root: {}
          // }
        ]
      }
    },
    async makeSocket ({ Doc, type = 'input', modID }) {
      let sID = getID(Doc.projectID + 'socket')
      let data = {
        userID: Doc.userID,
        projectID: Doc.projectID,
        id: sID,
        type,
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
      let resp = await Data.ts.connectors.add(data)
      let obj = resp.data.results
      return obj
    },
    async makeModule ({ Doc }) {
      let modID = getID(Doc.projectID + 'module')
      let data = {
        userID: Doc.userID,
        projectID: Doc.projectID,
        id: modID,
        bg: '',
        name: '',
        pos: {
          x: 100,
          y: 100
        },
        size: {
          w: 200,
          h: 40
        },
        src: ``
      }

      let resp = await Data.ts.modules.add(data)
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
