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
  newNode.isEntry = isEntry
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

  newNode.inputs = argsList.map((v) => {
    return {
      ...v
    }
  })

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
  return template
}

export const hydrate = ({ use }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let template = makeTemplate({ tid: use })

      let root = template

      if (use === 'session') {
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

export const makeGLSL = ({ root }) => {

}
