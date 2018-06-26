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

export const createCollection = ({ cID, name, desc, cType }) => {
  if (!cID) {
    throw new Error('cannot miss cID')
  }
  return {
    cType,
    name,
    cID,
    desc,
    entries: []
  }
}

export const addCollection = ({ root, collection }) => {
  root.dbs = root.dbs || []
  root.dbs.push(collection)
  return root
}

export const getCollectionById = ({ root, cID }) => {
  root.dbs = root.dbs || []
  return root.dbs.find(c => c.cID === cID)
}

export const removeCollection = ({ root, cID }) => {
  root.dbs = root.dbs || []

  var index = root.dbs.findIndex((db) => db.cID === cID)
  if (index > -1) {
    let itemToBeTrashed = root.dbs[index]
    root.dbs.splice(index, 1)
    root.cTrash = root.cTrash || []
    root.cTrash.push(itemToBeTrashed)
  } else {
    throw new Error('cann ot find collection')
  }
}

export const restoreCollection = ({ root, cID }) => {
  root.cTrash = root.cTrash || []
  var itemToBeRestored = root.cTrash.find(t => t.cID === cID)

  if (!itemToBeRestored) {
    throw new Error('cannot find collection')
  }

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
    root.eTrash = root.eTrash || []
    root.eTrash.push(itemToBeTrashed)
    db.entries.splice(index, 1)
  } else {
    throw new Error('cannot find item')
  }
}

export const restoreEntry = ({ root, cID, eID }) => {
  root.eTrash = root.eTrash || []
  var itemToBeRestored = root.eTrash.find(t => t.eID === eID)

  if (!itemToBeRestored) {
    throw new Error('cannot find item')
  }

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
