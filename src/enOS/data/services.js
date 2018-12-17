import * as Portal from './portal.js'

export const Ser = {
  portal: Portal.makeEngine()
}

export const loadAll = () => {
  return new Promise((resolve) => {
    Promise.all([
      Ser.portal.load()
    ])
      .then(() => {
        resolve(Ser)
      })
      .catch((e) => {
        console.trace(e)
        console.log(e)
        resolve(Ser)
      })
  })
}

export const init = () => {
  return loadAll()
}
