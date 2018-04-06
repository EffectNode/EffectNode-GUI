import * as ENdb from './ENdb.js'

// import * as _ from 'lodash'

export const VERTEX_SHADER = 'vertexShader'
export const FRAGMENT_SHADER = 'fragmentShader'

export const makeRoot = () => {
  return {
    state: false,
    backups: []
  }
}

export const makeID = () => {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export const makeInput = () => {
  return {
    type: 'input',
    uid: makeID()
  }
}

export const makeOutput = () => {
  return {
    type: 'output',
    uid: makeID()
  }
}

const tokenFunctions = require('glsl-token-functions')
const toString = require('glsl-token-string')
const tokenize = require('glsl-tokenizer')
const ParseTokens = require('glsl-parser/direct')

export const getFnInfo = ({ src, nid }) => {
  const tokens = tokenize(src)
  ParseTokens(tokens)

  const functions = tokenFunctions(tokens)
  const fn0 = functions[0]

  function getArgsStr (fn) {
    return toString(tokens.slice(fn.args[0], fn.args[1]))
  }

  function getOuter (fn) {
    return toString(tokens.slice(fn.outer[0], fn.outer[1]))
  }

  function getArgsList (argsStr) {
    let ans = argsStr.replace('(', '')
    ans = ans.replace(')', '')
    let arr = ans.split(',').map((v, i) => {
      let trimmed = v.trim()
      let info = trimmed.split(' ')
      if (info.length === 2) {
        return {
          index: i,
          nid,
          direction: 'in',
          type: info[0], // arg type
          name: info[1] // arg name
        }
      } else if (info.length === 3) {
        return {
          index: i,
          nid,
          direction: info[0], // inout / in / out
          type: info[1], // args type
          name: info[2] // arg name
        }
      }
    })
    return arr
  }
  let argsStr = getArgsStr(fn0)
  // console.log(argsStr)

  let argsList = getArgsList(argsStr)
  // console.table(argsList)

  let newName = fn0.name + '_' + nid
  let outerSrc = getOuter(fn0).replace(fn0.name, newName)
  // console.log(outerSrc)

  let fnOutputType = fn0.type
  // console.log(fnOutputType)

  return {
    argsStr,
    argsList,
    fnName: fn0.name,
    fnNewName: newName,
    src,
    compiledSrc: outerSrc,
    fnOutputType
  }
}

export const makePos = () => {
  return {
    x: 0.0,
    y: 0.0,
    z: 0.0
  }
}

export const makeNode = ({ src, oldNode, shaderType = VERTEX_SHADER, isEntry = false, nodePos = false }) => {
  let nid = makeID()
  if (oldNode) {
    nid = oldNode.nid
  }

  let fnInfo = getFnInfo({ src, nid })
  let {
    // argsStr,
    argsList,
    fnName,
    fnNewName,
    compiledSrc,
    fnOutputType
  } = fnInfo

  console.table([fnInfo])

  var newNode = {}
  newNode.shaderType = shaderType
  newNode.isEntry = fnName === 'entry'
  newNode.nid = nid
  newNode.src = src
  newNode.name = fnName
  newNode.compiledFnName = fnNewName
  newNode.compiledSrc = compiledSrc
  newNode.inputs = false
  newNode.output = {
    nid,
    name: fnName,
    type: fnOutputType
  }
  newNode.pos = nodePos || makePos()

  if (oldNode) {
    newNode.pos = oldNode.pos
  }

  newNode.inputs = argsList.reduce((accu, v) => {
    if (v && v.nid) {
      accu.push({
        ...v
      })
    }
    return accu
  }, [])

  console.table([newNode])

  return newNode
}

export const updateSRC = ({ node, iNode, nodes }) => {
  // let oldNode = nodes[iNode]
  let newNode = makeNode({ src: node.src, oldNode: node })
  nodes[iNode] = newNode
}

export const makeNodeList = () => {
  return [
  ]
}

export const makeState = () => {
  return {
    readOnly: false,
    nodes: [
    ]
  }
}

export const makeTemplateNodes = ({ tid = 'template1' }) => {
  let nl = makeNodeList()
  if (tid === 'template1') {
    nl.push(
      makeNode({
        nodePos: { x: -6.5, y: -8, z: 0 },
        shaderType: VERTEX_SHADER,
        isEntry: true,
        src:
`void entry (float x, float y, float z, float w) {
  gl_Position = vec4(x, y, z, w);
}`
      })
    )
    nl.push(
      makeNode({
        nodePos: { x: 6.5, y: -8, z: 0 },
        shaderType: FRAGMENT_SHADER,
        isEntry: true,
        src:
`void entry (float r, float g, float b, float a) {
  gl_FragColor = vec4(r, g, b, a);
}`
      })
    )
  }
  return nl
}

export const makeTemplate = ({ tid = '1' }) => {
  let template = makeRoot()
  template.state = makeState()
  template.state.nodes = makeTemplateNodes({ tid })
  template.state.connections = []
  template.state.globals = [
    {
      src: `uniform float time;`
    }
  ]
  return template
}

export const hydrate = ({ use }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let template = makeTemplate({ tid: use })

      let root = template

      if (use === 'continue') {
        let dbRoot = ENdb.getRoot()
        if (!dbRoot) {
          ENdb.setRoot(template)
          root = template
        } else {
          root = dbRoot
        }
      }

      resolve(root)
    }, 300)
  })
}

export const saveRoot = ({ root }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      ENdb.setRoot(root)
      resolve()
    }, 100)
  })
}

export const getVertexEntries = ({ nodes }) => {
  return nodes.filter((node) => {
    return node.isEntry && node.shaderType === VERTEX_SHADER
  })
}
export const getFragmentEntries = ({ nodes }) => {
  return nodes.filter((node) => {
    return node.isEntry && node.shaderType === FRAGMENT_SHADER
  })
}

export const getVertexNodes = ({ nodes }) => {
  return nodes.filter((node) => {
    return node.shaderType === VERTEX_SHADER
  })
}

export const getVertexFunctions = ({ nodes }) => {
  return getVertexNodes({ nodes }).reduce((accu, node) => {
    accu += node.compiledSrc + '\n\n'
    return accu
  }, '')
}

export const getVertexGlobals = ({ globals }) => {
  return globals.reduce((accu, globe) => {
    accu += globe.src + '\n'
    return accu
  }, '')
}

export const getEntryExecs = ({ entry, nodes, connections }) => {
  let depCode = ''

  let getConnection = ({ nid, inputIndex }) => {
    return connections.find(iC => iC.input.nid === nid && iC.input.index === inputIndex)
  }

  let getDefualtValue = (type) => {
    if (type === 'float') {
      return 0.0
    }
  }

  let resolveArgs = ({ node }) => {
    return node.inputs.map((input) => {
      let conn = getConnection({ nid: node.nid, inputIndex: input.index })
      if (conn) {
        return input.name
      } else {
        return getDefualtValue(input.type)
      }
    })
  }

  let rootCode = ''
  let rootArgs = resolveArgs({ node: entry })
  rootCode += `${entry.compiledFnName}(${rootArgs});`

  return rootCode + depCode
  //

  // let getVarName = ({ remoteNode, node, inputIndex }) => {
  //   return remoteNode.nid + '_' + node.nid + '_' + inputIndex
  // }

  // let getRemoteConn = ({ nid, inputIndex }) => {
  //   return connections.find((iConn) => {
  //     return iConn.input.nid === nid && iConn.input.index === inputIndex
  //   })
  // }

  // let getNode = ({ node, nid }) => {
  //   return nodes.find(node => node.nid === nid)
  // }

  // let getDefault = ({ type }) => {
  //   if (type === 'float') {
  //     return '0.0'
  //   }
  // }

  // let applyDepsToCaller = ({ node }) => {
  //   let args = ''
  //   node.inputs.forEach((input, key, arr) => {
  //     let remoteConn = getRemoteConn({ node, input, inputIndex: input.index })
  //     if (remoteConn) {
  //       var remoteNode = getRemoteNode({ node, remoteConn })
  //       if (remoteNode) {
  //         args += getVarName({ targeNode: remoteNode, node, inputIndex: input.index })
  //         if (key <= arr.length - 2) {
  //           args += ', '
  //         }
  //       }
  //     } else {
  //       args += getDefault({ type: input.type })
  //       if (key <= arr.length - 2) {
  //         args += ', '
  //       }
  //     }
  //   })
  //   return node.compiledFnName + '(' + args + ')'
  // }

  // let args

  // let bucket = []

  // return JSON.stringify(bucket)
  // let node = entry
  // // let i = 5

  // let getCompute = ({ node, nodes, input, inputIndex, remoteNode }) => {
  //   let execStatement = applyDepsToCaller({ node: remoteNode })
  //   return execStatement
  // }

  // let genDendenciesStatement = ({ node, nodes, input, inputIndex }) => {
  //   let remoteConn = getRemoteConn({ node, input, inputIndex })
  //   if (!remoteConn) {
  //     return ''
  //   } else {
  //     let remoteNode = getRemoteNode({ node, remoteConn })
  //     let argsObj = { node, nodes, input, inputIndex, remoteNode }
  //     return getVar(argsObj) + getCompute(argsObj) + '\n'
  //   }
  // }

  // let buildDepsStatements = ({ node, dependencyStatements = '' }) => {
  //   let remotes = []
  //   node.inputs.forEach((input, inputIndex) => {
  //     dependencyStatements += genDendenciesStatement({ node, nodes, input, inputIndex })

  //     let remoteConn = getRemoteConn({ node, input, inputIndex })
  //     if (remoteConn) {
  //       remotes.push(getRemoteNode({ node, remoteConn }))
  //     }
  //   })
  //   return {
  //     statements: dependencyStatements,
  //     remotes
  //   }
  // }

  // let jumps = []
  // let buildTree = (remotes) => {
  //   jumps = [...jumps, ...remotes]
  //   jumps = _.uniq(jumps)

  //   if (remotes.length > 0) {
  //     remotes.forEach((node) => {
  //       let ans = buildDepsStatements({ node })
  //       buildTree(ans.remotes)
  //     })
  //   }
  // }

  // let { statements, remotes } = buildDepsStatements({ node })
  // let execStatement = applyDepsToCaller({ node })
  // let deps = []

  // buildTree(remotes)

  // console.log(jumps)

  // jumps.forEach((node) => {
  //   let { statements } = buildDepsStatements({ node })
  //   let execStatement = applyDepsToCaller({ node })

  //   deps.push(statements + ' ' + execStatement)
  // })

  // return deps.join('\n') + statements + ' ' + execStatement
}

export const getVertexExecutions = ({ nodes, connections }) => {
  let prefix = `void main (void) {\n`
  let suffix = `\n}`

  let vertexEntries = getVertexEntries({ nodes })
  let vExec = vertexEntries.reduce((accu, node, iNode) => {
    accu += getEntryExecs({ entry: node, nodes, connections })
    return accu
  }, '')

  return prefix + vExec + suffix
}

// lol
export const makeGLSL = ({ root }) => {
  let nodes = root.state.nodes
  let globals = root.state.globals
  let connections = root.state.connections
  // let vertexEntries = getVertexEntries({ nodes })

  let vGlbs = getVertexGlobals({ globals })

  let vFns = getVertexFunctions({ nodes })

  let vExecs = getVertexExecutions({ nodes, connections })

  return {
    vertexShader: `
// Globals //
${vGlbs}
// functions //
${vFns}
// main func executions //
${vExecs}
`,
    fragmentShader: `2`
  }
}
