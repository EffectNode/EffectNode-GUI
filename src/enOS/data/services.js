import * as Portal from './portal.js'
import '../../../static/js/app/Hive.js'
import { RT, TableSync } from './API'

export const HiveData = window.HiveData

export const loadProject = ({ projectID }) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      Portal.init({ projectID, RT, TableSync }),
      HiveData.init({ projectID, RT, TableSync })
    ])
      .then((res) => {
        let $uiAPI = {
          projectID
        }
        $uiAPI.RT = RT
        $uiAPI.TableSync = TableSync

        $uiAPI.portal = res[0]
        $uiAPI.hive = res[1]
        resolve($uiAPI)
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
