// import * as idb from 'idb-keyval'
// const Root = new idb.Store('EffectNode-LocalStorage', 'Root')

export const setRoot = (v) => {
  return window.sessionStorage.setItem('all-nodes-effect-root-db', JSON.stringify(v))
}
export const getRoot = () => {
  return JSON.parse(window.sessionStorage.getItem('all-nodes-effect-root-db'))
}

// export const addNode = (v) => {
//   let allRoot = getRoot()
//   allRoot.push(v)
//   setRoot(allRoot)
// }

// export const removeNode = (v) => {
//   let allRoot = getRoot()
//   allRoot.splice(allRoot.findIndex(n => n.nid === v.nid), 1)
//   setRoot(allRoot)
// }
