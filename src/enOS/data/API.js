import axios from 'axios'
import io from 'socket.io-client'
// import uuid from 'uuid'
import NProgress from 'nprogress'
import './nprogress.css'
import { EventEmitter } from 'events'

NProgress.configure({
  minimum: 0.08,
  easing: 'ease',
  positionUsing: '',
  speed: 200,
  trickle: true,
  trickleRate: 0.015,
  trickleSpeed: 350,
  showSpinner: false,
  barSelector: '[role="bar"]',
  spinnerSelector: '[role="spinner"]',
  parent: 'body',
  template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
})

var baseURL = 'http://localhost:3003/'

// console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://effectnode-heroku.herokuapp.com/'
} else if (window.location.host.indexOf('192') !== -1) {
  baseURL = 'http://' + window.location.hostname + ':3003/'
}

export const PROXY_URL = baseURL + 'yo/proxy'

var iAXIOS = axios.create({
  withCredentials: true,
  baseURL,
  headers: {
    'X-Widget-Origin': window.location.origin
  }
})

iAXIOS.interceptors.request.use((config) => {
  // Do something before request is sent
  NProgress.start()
  return config
}, (error) => {
  NProgress.done()
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
iAXIOS.interceptors.response.use((response) => {
  NProgress.done()
  // Do something with response data
  return response
}, (error) => {
  NProgress.done()
  // Do something with response error
  return Promise.reject(error)
})

// RT....

export const RT = {
  makeSocket: (path, name) => {
    // return io(`${baseURL}/${path}`, { transports: ['websocket'] })
    let socket = io(`${baseURL}${path}`, { transports: ['websocket'] })
    window.addEventListener('focus', () => {
      socket.connect()
    })
    RT.all.push(socket)
    RT[name] = socket
    return socket
  },
  all: []
}

export function refresh () {
  RT.all.forEach(async s => {
    s.disconnect()
    setTimeout(() => {
      s.connect()
    }, 100)
  })
}

function prepSocket () {
  try {
    RT.makeSocket('effect-node', 'en')
  } catch (e) {
    setTimeout(() => {
      prepSocket()
    }, 1000 * 10)
  }
}
prepSocket()

export const LoginStatus = {
  get myID () {
    return this.myself && this.myself._id
  },
  myself: false,
  isLoggedIn: false,
  async check () {
    try {
      let resp = await myself()
      LoginStatus.myself = resp.data
      LoginStatus.isLoggedIn = true
    } catch (e) {
      console.log(e)
      LoginStatus.myself = false
      LoginStatus.isLoggedIn = false
    }
    return LoginStatus.isLoggedIn
  }
}

export const myself = () => {
  return iAXIOS.get('/myself')
    .then((resp) => {
      refresh()
      LoginStatus.myself = resp.data
      return resp
    })
}

export const register = (data) => {
  return iAXIOS.post('/register', data)
}

export const login = (data) => {
  return iAXIOS.post('/login', data)
    .then(() => {
      return LoginStatus.check()
        .then(() => {
          return LoginStatus.myself
        })
    })
}

export const logout = (data) => {
  LoginStatus.myself = false
  LoginStatus.isLoggedIn = false
  return iAXIOS.post('/logout', data)
}

export const sync = ({ userID }) => {
  RT.en.emit('sync', { userID })
}

// export const getMyProjects = async () => {
//   let data = await listProjects({ userID: LoginStatus.myself._id })
//   return data
// }
// export const loadProject = ({ projectID }) => {

// }

export class TableSync extends EventEmitter {
  constructor ({ socket = RT.en, namespace, getArray, $forceUpdate = () => {} }) {
    super()
    this.socket = socket
    this.namespace = namespace
    this.getArray = getArray
    this.$forceUpdate = $forceUpdate
    this.sync()
  }
  add ({ data }) {
    this.doRemote({ data: data, method: 'add' })
  }
  remove ({ data }) {
    this.doRemote({ data: data, method: 'remove' })
  }
  update ({ data }) {
    this.doRemote({ data: data, method: 'update' })
  }
  load ({ data }) {
    this.doRemote({ data: data, method: 'load' })
  }
  sync () {
    this._onLoad()
    this._onAdd()
    this._onRemove()
    this._onUpdate()
  }
  _onLoad () {
    this.onLocal({
      handler: ({ results }) => {
        let arr = this.getArray()
        let idList = arr.map(e => e._id)
        results.forEach((item) => {
          if (!idList.includes(item._id)) {
            arr.push(item)
          } else {
            // let idx = idList.indexOf(item._id)
            // arr[idx] = item
          }
        })
      },
      method: 'load'
    })
  }
  _onAdd () {
    this.onLocal({
      handler: ({ results }) => {
        this.getArray().push(results)
      },
      method: 'add'
    })
  }
  _onRemove () {
    this.onLocal({
      handler: ({ results }) => {
        let item = results
        let arr = this.getArray()
        let idx = arr.findIndex(a => a._id === item._id)
        arr.splice(idx, 1)
      },
      method: 'remove'
    })
  }
  _onUpdate () {
    this.onLocal({
      handler: ({ results, socketID }) => {
        if (this.socket.id === socketID) {
          console.log('dont update myself again after delay', this.socket.id === socketID)
          return
        }
        let newItem = results
        let arr = this.getArray()
        let idx = arr.findIndex(a => a._id === newItem._id)
        Object.keys(newItem).forEach((keyname) => {
          let oldItem = arr[idx]
          let isScalar = typeof oldItem[keyname] !== 'object'
          if (isScalar) {
            oldItem[keyname] = newItem[keyname]
          } else {
            if (newItem[keyname] instanceof Array) {
              newItem[keyname].forEach((newSubItem, ii) => {
                oldItem[keyname][ii] = newSubItem[ii]
              })
            } else {
              for (var subKeyname in newItem[keyname]) {
                oldItem[subKeyname] = newItem[subKeyname]
              }
            }
          }
        })
        // this.$forceUpdate()
      },
      method: 'update'
    })
  }
  doRemote ({ data, method }) {
    this.socket.emit(`${this.namespace}::up::${method}`, data)
    console.log(`${this.namespace}::up::${method}`, data)
  }
  onLocal ({ handler, method }) {
    this.socket.on(`${this.namespace}::dn::${method}`, (data, fn) => {
      handler(data, fn)
      console.log(`${this.namespace}::dn::${method}`, data)
    })
  }
}
