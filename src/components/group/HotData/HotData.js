export const collectionTypes = [
  {
    cType: 'effect-node',
    name: 'Effect Nodes',
    desc: 'Drag and Drop Effect Code Remixer'
  },
  {
    cType: 'glsl',
    name: 'Shader Code',
    desc: 'Custom Effect Code GLSL'
  },
  {
    cType: '3d-layout',
    name: '3D Layout',
    desc: 'Helper for making 3D Layout'
  },
  {
    cType: 'article',
    name: 'Article',
    desc: 'Write Article with Markdown Language'
  },
  {
    cType: 'json-data',
    name: 'Simple Data',
    desc: 'a JSON Store'
  }
]

export const makeID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export const createCollection = ({ cID, desc }) => {
  if (!cID) {
    throw new Error('cannot miss cID')
  }

  return {
    cID,
    desc,
    entries: []
  }
}

export const emptyCollectionTrash = ({ root }) => {
  root.cTrash = []
  return root.cTrash
}

export const getTrashedCollections = ({ root }) => {
  if (!root.cTrash) {
    root.cTrash = []
  }
  return root.cTrash
}

export const getCollectionTrash = ({ root, cID }) => {
  let collection = getCollectionById({ root, cID })
  if (!collection.eTrash) {
    collection.eTrash = []
  }
  collection.eTrash = collection.eTrash
  return collection.eTrash
}

export const fillRoot = ({ root }) => {
  if (!root.dbs) {
    root.dbs = []
  }
  if (!root.cTrash) {
    root.cTrash = []
  }
  return root.dbs
}

export const getCollections = ({ root }) => {
  fillRoot({ root })
  return root.dbs
}

export const addCollection = ({ root, collection }) => {
  fillRoot({ root })
  root.dbs.push(collection)
  return root
}

export const getCollectionById = ({ root, cID }) => {
  fillRoot({ root })
  return root.dbs.find(c => c.cID === cID)
}

export const removeCollection = ({ root, cID }) => {
  fillRoot({ root })
  var index = root.dbs.findIndex((db) => db.cID === cID)
  if (index > -1) {
    let itemToBeTrashed = root.dbs[index]
    root.dbs.splice(index, 1)
    root.cTrash = root.cTrash || []
    root.cTrash.push(itemToBeTrashed)
  } else {
    throw new Error('cannot find collection')
  }
}

export const restoreCollection = ({ root, cID }) => {
  root.cTrash = root.cTrash || []
  var itemToBeRestored = root.cTrash.find(t => t.cID === cID)

  if (!itemToBeRestored) {
    throw new Error('cannot find collection')
  }
  var cleanIndex = root.cTrash.findIndex(ct => ct.cID === cID)
  root.cTrash.splice(cleanIndex, 1)
  addCollection({ root, collection: itemToBeRestored })
  return itemToBeRestored
}

// entry

export const createEntry = ({ cID, eID, desc, eType }) => {
  if (!cID) {
    throw new Error('cannot miss cID')
  }
  return {
    eType,
    cID,
    eID,
    data: {
    }
  }
}

export const addEntry = ({ root, cID, entry }) => {
  if (!entry.eID) {
    throw new Error('needs eID')
  }
  if (!entry.cID) {
    throw new Error('needs cID')
  }

  let db = getCollectionById({ root, cID })
  db.entries.push(entry)
  return entry
}

export const getEntryDirectly = ({ root, cID, eID }) => {
  if (!eID) {
    throw new Error('needs eID')
  }
  let db = getCollectionById({ root, cID }) || { entries: [] }
  return db.entries.find(e => e.eID === eID)
}

export const deletEntry = ({ root, cID, eID }) => {
  let db = getCollectionById({ root, cID }) || { entries: [] }
  var index = db.entries.findIndex((e) => e.eID === eID)
  if (index > -1) {
    let itemToBeTrashed = db.entries[index]

    let eTrash = getCollectionTrash({ root, cID })
    eTrash.push(itemToBeTrashed)
    db.entries.splice(index, 1)
  } else {
    throw new Error('cannot find item')
  }
}

export const restoreEntry = ({ root, cID, eID }) => {
  let eTrash = getCollectionTrash({ root, cID })
  var itemToBeRestored = eTrash.find(t => t.eID === eID)

  if (!itemToBeRestored) {
    throw new Error('cannot find item')
  }

  var restoreIndex = eTrash.findIndex(t => t.eID === eID)
  eTrash.splice(restoreIndex, 1)

  addEntry({ root, cID, entry: itemToBeRestored })
  return itemToBeRestored
}

export const replaceEntry = ({ root, cID, eID, replaceWith }) => {
  let db = getCollectionById({ root, cID }) || { entries: [] }
  var index = db.entries.findIndex((e) => e.eID === eID)
  if (index > -1) {
    db.entries.splice(index, 1, replaceWith)
  } else {
    throw new Error('cannot find item')
  }
}
