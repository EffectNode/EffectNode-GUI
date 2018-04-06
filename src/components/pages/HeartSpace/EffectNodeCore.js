import * as ENdb from './ENdb.js'

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
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
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
  let node = entry
  let bucket = []
  // let i = 5

  // let getArgs = (node) => {
  //   return node.inputs.reduce((accu, input, key, arr) => {
  //     if (key === 0) {
  //       accu += '('
  //     }

  //     accu += getRemoteExec({ input, node, connections })

  //     if (key <= arr.length - 2) {
  //       accu += ','
  //     }

  //     if (key === arr.length - 1) {
  //       accu += ')'
  //     }

  //     return accu
  //   }, '')
  // }

  let getRemoteConn = ({ node, input, inputIndex }) => {
    return connections.find((iConn) => {
      return iConn.input.nid === node.nid && iConn.input.index === inputIndex
    })
  }

  let getVar = ({ node, nodes, input, inputIndex, remoteNode }) => {
    return '  ' + input.type + ' ' + node.nid + '_' + inputIndex
  }

  let genExec = ({ node, nodes, input, inputIndex }) => {
    let remoteConn = getRemoteConn({ node, input, inputIndex })
    if (!remoteConn) {
      return ''
    } else {
      let remoteNode = nodes.find(node => node.nid === remoteConn.output.nid)
      return getVar({ node, nodes, input, inputIndex, remoteNode }) + '\n'
    }
  }

  let run = (node) => {
    node.inputs.forEach((input, inputIndex) => {
      bucket.push(
        genExec({ node, nodes, input, inputIndex })
      )
    })
  }

  run(node)

  return bucket.slice().reverse().join('\n')
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
