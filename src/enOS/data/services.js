import * as Portal from './portal.js'
import '../../../static/js/app/Hive.js'
import * as API from './API'

export const HiveData = window.HiveData

export const loadProject = ({ projectID, userID }) => {
  return new Promise((resolve, reject) => {
    let $uiAPI = {
      projectID,
      userID,
      RT: API.RT,
      TableSync: API.TableSync
    }
    Promise.all([
      Portal.init($uiAPI),
      HiveData.init($uiAPI)
    ])
      .then((res) => {
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
