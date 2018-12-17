(function () {
  let g = window
  var getID = () => {
    return '-' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let Data = g.HiveData = {
    init: () => {
      return new Promise((resolve, reject) => {
        let Doc = Data.makeDocumentStack()
        resolve({ Data, Doc })
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
    makein4out4Mod ({ Doc }) {
      let mod = Data.makeModule()
      Data.addModToDoc({ mod, Doc })

      let in1 = Data.makeSocket({ type: 'input', modID: mod.id })
      Data.addSocketToDoc({ socket: in1, Doc })

      let in2 = Data.makeSocket({ type: 'input', modID: mod.id })
      Data.addSocketToDoc({ socket: in2, Doc })

      let in3 = Data.makeSocket({ type: 'input', modID: mod.id })
      Data.addSocketToDoc({ socket: in3, Doc })

      let in4 = Data.makeSocket({ type: 'input', modID: mod.id })
      Data.addSocketToDoc({ socket: in4, Doc })

      let out1 = Data.makeSocket({ type: 'output', modID: mod.id })
      Data.addSocketToDoc({ socket: out1, Doc })

      let out2 = Data.makeSocket({ type: 'output', modID: mod.id })
      Data.addSocketToDoc({ socket: out2, Doc })

      let out3 = Data.makeSocket({ type: 'output', modID: mod.id })
      Data.addSocketToDoc({ socket: out3, Doc })

      let ou4 = Data.makeSocket({ type: 'output', modID: mod.id })
      Data.addSocketToDoc({ socket: ou4, Doc })
    },
    getAllSockets ({ Doc }) {
      return Doc.root.connectors
    },
    addSocketToDoc ({ socket, Doc }) {
      Doc.root.connectors.push(socket)
    },
    addModToDoc ({ mod, Doc }) {
      Doc.root.modules.push(mod)
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
    makeSocket ({ type = 'input', modID }) {
      let sID = getID()
      return {
        id: sID,
        type,
        modID,
        mod: {
          from: modID,
          to: false
        },
        socket: {
          from: sID,
          to: false
        }
      }
    },
    makeModule () {
      let modID = getID()
      return {
        id: modID,
        pos: {
          x: 100, y: 100
        },
        src: ``
      }
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
