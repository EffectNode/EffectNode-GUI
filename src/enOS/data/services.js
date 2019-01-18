import * as Portal from './portal.js'
import '../../../static/js/app/Hive.js'
import '../../../static/js/app/ExecEnv.js'
import * as API from './API'

import * as Builder from './builder'

export const HiveData = window.HiveData
export const ExecEnv = window.ExecEnv

export const loadProject = ({ projectID, userID }) => {
  return new Promise((resolve, reject) => {
    let $uiAPI = {
      projectID,
      userID,
      API,
      RT: API.RT,
      TableSync: API.TableSync,
      Builder: Builder
    }
    Promise.all([
      Portal.init($uiAPI),
      HiveData.init($uiAPI)
    ])
      .then((res) => {
        $uiAPI.portal = res[0]
        $uiAPI.hive = res[1]
        // return $uiAPI
        // return ExecEnv.init($uiAPI)
      })
      .then(() => {
        resolve($uiAPI)
      })
      .catch((e) => {
        console.trace(e)
        console.log(e)
        reject(e)
      })
  })
}
