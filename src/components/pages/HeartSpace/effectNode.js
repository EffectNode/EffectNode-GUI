export const makeRoot = () => {
  return {
    state: false
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
          i,
          nid,
          direction: 'in',
          type: info[0],
          name: info[1]
        }
      } else if (info.length === 3) {
        return {
          i,
          nid,
          direction: info[0],
          type: info[1],
          name: info[2]
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

export const makeNode = ({ src, oldNode }) => {
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

  var newNode = {
    isMain: fnName === 'main',
    nid,
    src,
    name: fnName,
    compiledFnName: fnNewName,
    compiledSrc: compiledSrc,
    inputs: false,
    output: false,
    from: [],
    to: [],
    pos: makePos()
  }

  if (oldNode) {
    newNode.from = oldNode.from
    newNode.to = oldNode.to
    newNode.pos = oldNode.pos
  }

  newNode.outputs = {
    nid,
    name: fnName,
    type: fnOutputType
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

export const hydrate = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let root = makeRoot()
      root.state = makeState()
      root.state.nodes = makeNodeList()

      root.state.nodes.push(
        makeNode({
          src:
`vec4 loklok (vec4 inV4, float inV1, float inV2) {
  gl_FragColor = vec4(1);
}`
        })
      )

      root.state.nodes.push(
        makeNode({
          src:
`vec4 main (vec4 inV4, float inV1, float inV2) {
  gl_FragColor = vec4(1);
}`
        })
      )

      root.state.nodes.push(
        makeNode({
          src:
`vec4 main (vec4 inV4, float inV1, float inV2) {
  gl_FragColor = vec4(1);
}`
        })
      )

      resolve(root)
    }, 750)
  })
}

export const loadNode = ({ shader }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let node = JSON.parse()
      resolve(node)
    }, 100)
  })
}

export const saveNode = ({ node }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 100)
  })
}
