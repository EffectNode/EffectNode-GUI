import * as ENdb from './ENdb.js'

// import * as _ from 'lodash'

export const VERTEX_SHADER = 'vertexShader'
export const FRAGMENT_SHADER = 'fragmentShader'

export const makeRoot = () => {
  return {
    editor: 0.1,
    state: false, // for GUI data
    variations: []
  }
}

export const makeVariation = ({ root }) => {
  root.variations.push(cloneState({ state: root.state }))
}

export const cloneState = ({ state }) => {
  return {
    date: new Date(),
    stateJSON: JSON.stringify(state)
  }
}

export const loadVariationJSON = ({ root, index }) => {
  let variations = root.variations
  let archiveInfo = variations[index]
  let archiveInfoJSON = archiveInfo.stateJSON
  return (archiveInfoJSON)
}

export const loadVariation = ({ root, index }) => {
  return JSON.parse(loadVariationJSON({ root, index }))
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
  newNode.isEntry = fnName.indexOf('entry') === 0
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

    newNode.output = oldNode.output
    newNode.output.type = fnOutputType
    newNode.output.name = fnName
    newNode.output.nid = nid
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
  let newNode = makeNode({ src: node.src, oldNode: node, shaderType: node.shaderType || FRAGMENT_SHADER })
  nodes[iNode] = newNode
}

export const makeNodeList = () => {
  return [
  ]
}

export const makeState = () => {
  return {
  }
}

export const makeTemplateNodes = ({ tid = 'template1' }) => {
  let nl = makeNodeList()
  if (tid === 'template1') {
    nl.push(
      makeNode({
        nodePos: { x: -8.0, y: -15.0, z: 0 },
        shaderType: VERTEX_SHADER,
        isEntry: true,
        src:
`void entry (vec3 pos, float x, float y, float z, float w) {
  vec4 newPosition = vec4(vec3(position) + vec3(pos) + vec3(x, y, z), w);
  vec4 mvPosition = modelViewMatrix * newPosition;
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
  gl_PointSize = 3.0;
  vPos = position;
}`
      })
    )
    nl.push(
      makeNode({
        nodePos: { x: 8.0, y: -15.0, z: 0 },
        shaderType: FRAGMENT_SHADER,
        isEntry: true,
        src:
`void entry (vec4 color, float r, float g, float b, float a) {
  gl_FragColor = color + vec4(r, g, b, a);
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
  template.state.uniforms = [
    {
      src: `uniform float time;`
    }
  ]
  template.state.varyings = [
    {
      src: `varying vec3 vPos;`
    }
  ]

  if (tid === 'template2') {
    template = require('./Demos/Demo1.json')
    template.state.varyings = template.state.varyings || []
  }

  if (tid === 'template3') {
    template = require('./Demos/Demo2.json')
    template.state.varyings = template.state.varyings || []
  }

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

export const exportRoot = ({ root }) => {
  return new Promise((resolve, reject) => {
    var href = document.createElement('a')
    href.download = 'EffectNode.com.json'
    href.href = URL.createObjectURL(new Blob([JSON.stringify(root, null, '\t')]))
    href.click()
    resolve()
  })
}

export const readTextFile = ({ file }) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsText(file)
  })
}

export const JSON2OBJ = (json) => {
  return new Promise((resolve, reject) => {
    try {
      let obj = JSON.parse(json)
      resolve(obj)
    } catch (e) {
      reject(e)
    }
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

export const getFragmentNodes = ({ nodes }) => {
  return nodes.filter((node) => {
    return node.shaderType === FRAGMENT_SHADER
  })
}

export const getVertexFunctions = ({ nodes }) => {
  return getVertexNodes({ nodes }).reduce((accu, node) => {
    accu += node.compiledSrc + '\n\n'
    return accu
  }, '')
}

export const getFragmentFunctions = ({ nodes }) => {
  return getFragmentNodes({ nodes }).reduce((accu, node) => {
    accu += node.compiledSrc + '\n\n'
    return accu
  }, '')
}

export const getUniforms = ({ uniforms }) => {
  return uniforms.reduce((accu, uniform) => {
    accu += uniform.src + '\n'
    return accu
  }, '')
}

export const getVaryings = ({ varyings }) => {
  return varyings.reduce((accu, varying) => {
    accu += varying.src + '\n'
    return accu
  }, '')
}

export const getEntryExecs = ({ entry, nodes, connections }) => {
  let getConnection = ({ nid, inputIndex }) => {
    return connections.find(iC => iC.input.nid === nid && iC.input.index === inputIndex)
  }

  let getDefualtValue = ({ type, name }) => {
    if (type === 'float' && name === 'w') {
      return '1.0'
    } else if (type === 'float' && name === 'a') {
      return '1.0'
    } else if (type === 'float' && name === 'r') {
      return '0.0'
    } else if (type === 'float' && name === 'g') {
      return '0.0'
    } else if (type === 'float' && name === 'b') {
      return '0.0'
    } else if (type === 'float') {
      return '0.0'
    } else if (type === 'vec4') {
      return 'vec4(0.0)'
    } else if (type === 'vec3') {
      return 'vec3(0.0)'
    } else if (type === 'vec2') {
      return 'vec2(0.0)'
    } else if (type === 'mat2') {
      return 'mat2(1.0)'
    } else if (type === 'mat3') {
      return 'mat3(1.0)'
    } else if (type === 'mat4') {
      return 'mat4(1.0)'
    } else if (type === 'bool') {
      return 'false'
    }
  }

  let getNodeInfo = ({ nid }) => {
    return nodes.find(n => n.nid === nid)
  }

  let getComputedVariable = ({ conn }) => {
    let info = getNodeInfo({ nid: conn.output.nid })
    return `${info.compiledFnName}_result`
  }

  let resolveArgs = ({ node }) => {
    // get all input
    return node.inputs.map((input) => {
      // if there is connection
      let conn = getConnection({ nid: node.nid, inputIndex: input.index })
      if (conn) {
        // return computed varaible
        return getComputedVariable({ conn })
      } else {
        // return default value
        return getDefualtValue(input)
      }
    })
      // calcualate stuff
      .reduce((accu, item, key, arr) => {
        accu += '\n    '
        accu += item
        if (key <= arr.length - 2) {
          accu += ','
        }
        if (key === arr.length - 1) {
          accu += '\n  '
        }
        return accu
      }, '')
  }
  let getAllDepsOf = ({ node, connection }) => {
    // get all related connections
    return connections.filter((conn) => {
      return conn.input.nid === node.nid
    })
      // get node info of remote node
      .map((conn) => {
        return getNodeInfo({ nid: conn.output.nid })
      })
      // make unique
      .reduce((accu, node, key, arr) => {
        let idx = accu.findIndex(nd => nd.nid === node.nid)
        if (idx === -1) {
          accu.push(node)
        }
        return accu
      }, [])
  }
  var _ = require('lodash')

  let concatStr = (input) => {
    return input.reduce((accu, item) => {
      accu += item
      return accu
    }, '')
  }

  let convertDepIntoCalc = (input) => {
    return _.uniq(input.reduce((accu, node, key, arr) => {
      accu.push(`  ${node.output.type} ${node.compiledFnName}_result = ${node.compiledFnName}(${resolveArgs({ node })});\n`)
      return accu
    }, []))
  }

  let rootArgs = resolveArgs({ node: entry })
  let rootCode = `  ${entry.compiledFnName}(${rootArgs});`

  let cachedComps = ''
  let cachedCompsArr = []
  function recursive (entry) {
    let nodeDeps = getAllDepsOf({ node: entry, connections })
    let calcs = convertDepIntoCalc(nodeDeps)
    cachedCompsArr = _.uniq([
      ...cachedCompsArr,
      ...calcs
    ])
    nodeDeps.forEach(recursive)
  }
  recursive(entry)

  cachedComps = concatStr(cachedCompsArr.slice().reverse())

  // cachedComps = _.uniq(cachedComps.split(';')).join(';')

  return cachedComps + rootCode
}

export const getVertexExecutions = ({ nodes, connections }) => {
  let prefix = `void main (void) {\n`
  let suffix = `\n}`

  let vertexEntries = getVertexEntries({ nodes })
  let vExec = vertexEntries.reduce((accu, node, iNode) => {
    accu += getEntryExecs({ entry: node, nodes, connections }) + '\n'
    return accu
  }, '')

  return prefix + vExec + suffix
}

export const getFragmentExecutions = ({ nodes, connections }) => {
  let prefix = `void main (void) {\n`
  let suffix = `\n}`

  let fragmentEntries = getFragmentEntries({ nodes })
  let fExec = fragmentEntries.reduce((accu, node, iNode) => {
    accu += getEntryExecs({ entry: node, nodes, connections })
    return accu
  }, '')

  return prefix + fExec + suffix
}

// lol
export const makeGLSL = ({ root }) => {
  let nodes = root.state.nodes
  let uniforms = root.state.uniforms || []
  let varyings = root.state.varyings || []
  let connections = root.state.connections || []
  // let vertexEntries = getVertexEntries({ nodes })

  let Unis = getUniforms({ uniforms })
  let Vars = getVaryings({ varyings })

  let vFns = getVertexFunctions({ nodes })
  let vExecs = getVertexExecutions({ nodes, connections })

  let fFns = getFragmentFunctions({ nodes })
  let fExecs = getFragmentExecutions({ nodes, connections })

  return {
    vertexShader: `
/*
VV     VV  SSSSS
VV     VV SS
 VV   VV   SSSSS
  VV VV        SS
   VVV     SSSSS
*/
// Uniforms //
${Unis}
// Varyings //
${Vars}
// Functions //
${vFns}
// Main function executions //
${vExecs}
`,
    fragmentShader: `
/*
FFFFFFF  SSSSS
FF      SS
FFFF     SSSSS
FF           SS
FF       SSSSS
*/
// Varyings //
${Vars}
// Uniforms //
${Unis}
// Functions //
${fFns}
// Main function executions //
${fExecs}
    `
  }
}
