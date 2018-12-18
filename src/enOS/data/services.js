import * as Portal from './portal.js'

export const Ser = {}

export const loadProject = ({ projectID }) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      Portal.makeEngine({ projectID })
    ])
      .then((res) => {
        Ser.portal = res[0]
        resolve(Ser)
      })
      .catch((e) => {
        console.trace(e)
        console.log(e)
        reject(e)
      })
  })
}

export const init = ({ projectID }) => {
  return loadProject({ projectID })
}
