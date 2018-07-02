export const entryTypes = [
  {
    eType: 'effect-node',
    name: 'Effect Nodes',
    desc: 'Drag and Drop Effect Code Remixer'
  },
  {
    eType: 'glsl',
    name: 'Shader Code',
    desc: 'Custom Effect Code GLSL'
  },
  {
    eType: '3d-layout',
    name: '3D Layout',
    desc: 'Helper for making 3D Layout'
  },
  {
    eType: 'article',
    name: 'Article',
    desc: 'Write Article with Markdown Language'
  },
  {
    eType: 'json-data',
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

export const emptyEntryTrash = ({ collection }) => {
  collection.eTrash = []
  return collection.eTrash
}

export const getTrashedCollections = ({ root }) => {
  if (!root.cTrash) {
    root.cTrash = []
  }
  return root.cTrash
}

export const getEntryTrash = ({ root, cID }) => {
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

export const getEntriesOfCollection = ({ root, cID }) => {
  var collection = getCollectionById({ root, cID })
  if (!collection.entries) {
    collection.entries = []
  }
  return collection.entries
}

export const createEntry = ({ cID, eID, note, eType }) => {
  if (!cID) {
    throw new Error('cannot miss cID')
  }
  return {
    eType,
    cID,
    eID,
    note,
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

  let entries = getEntriesOfCollection({ root, cID })
  entries.push(entry)
  return entry
}

export const getEntryBycIDeID = ({ root, cID, eID }) => {
  let collection = getCollectionById({ root, cID }) || { entries: [] }
  return collection.entries.find(e => e.eID === eID)
}

export const removeEntry = ({ root, cID, eID }) => {
  let db = getCollectionById({ root, cID }) || { entries: [] }
  var index = db.entries.findIndex((e) => e.eID === eID)
  if (index > -1) {
    let itemToBeTrashed = db.entries[index]

    let eTrash = getEntryTrash({ root, cID })
    eTrash.push(itemToBeTrashed)
    db.entries.splice(index, 1)
  } else {
    throw new Error('cannot find item')
  }
}

export const restoreEntry = ({ root, cID, eID }) => {
  let eTrash = getEntryTrash({ root, cID })
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

export const renameAllEntries = ({ root, cID }) => {
  let entries = getEntriesOfCollection({ root, cID })
  entries.forEach((entry) => {
    entry.cID = cID
  })
}
