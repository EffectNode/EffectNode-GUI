// import * as idb from 'idb-keyval'
// const Nodes = new idb.Store('EffectNode-LocalStorage', 'Nodes')

export const setNodes = (v) => {
  return window.sessionStorage.setItem('all-nodes-effect-node-db', JSON.stringify(v))
}
export const getNodes = () => {
  return JSON.parse(window.sessionStorage.getItem('all-nodes-effect-node-db'))
}

export const addNode = (v) => {
  let allNodes = getNodes()
  allNodes.push(v)
  setNodes(allNodes)
}

export const removeNode = (v) => {
  let allNodes = getNodes()
  allNodes.splice(allNodes.findIndex(n => n.nid === v.nid), 1)
  setNodes(allNodes)
}
