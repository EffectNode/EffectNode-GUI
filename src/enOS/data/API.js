import axios from 'axios'
import io from 'socket.io-client'
// import uuid from 'uuid'
import NProgress from 'nprogress'
import './nprogress.css'
// import { EventEmitter } from 'events'

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
// debug
// baseURL = `https://effectnode-heroku.herokuapp.com/`

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://effectnode-heroku.herokuapp.com/'
} else if (window.location.host.indexOf('192') !== -1) {
  baseURL = 'http://' + window.location.hostname + ':3003/'
}

export const PROXY_URL = baseURL + 'yo/proxy'

var makeAxios = ({ headers = {} }) => {
  var iAXIOS = axios.create({
    withCredentials: true,
    headers,
    baseURL
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
  return iAXIOS
}

let rememberMe = window.localStorage.getItem('jwt_remember_me')
let axiosConfig = {}
if (rememberMe) {
  axiosConfig.headers = {
    'Authorization': `bearer ${rememberMe}`
  }
}

var iAXIOS = makeAxios(axiosConfig)
// RT....

export const RT = {
  makeSocket: (path, name) => {
    // return io(`${baseURL}/${path}`, { transports: ['websocket'] })
    // let socket = io(`${baseURL}${path}`)
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

function prepSocket () {
  try {
    RT.makeSocket('effect-node', 'en')
  } catch (e) {
    console.log(e)
    setTimeout(() => {
      prepSocket()
    }, 1000 * 10)
  }
}
prepSocket()

export let myself = false

export let checkLogin = async () => {
  try {
    await getMe()
    RT.en.close()
    RT.en.connect()
    return true
  } catch (e) {
    return false
  }
}

export const getMe = () => {
  return iAXIOS.get('/myself')
    .then((resp) => {
      myself = resp.data
      return resp
    })
}

export const register = (data) => {
  return iAXIOS.post('/register', data)
}

export const login = (data) => {
  return iAXIOS.post('/login', data)
    .then((resp) => {
      iAXIOS = makeAxios({
        headers: {
          'Authorization': `bearer ${resp.data.token}`
        }
      })
      window.localStorage.setItem('jwt_remember_me', resp.data.token)
      return resp
    })
}

export const logout = (data) => {
  window.localStorage.removeItem('jwt_remember_me')
  return iAXIOS.post('/logout', data)
}

export class TableSync {
  constructor ({ socket = RT.en, namespace, getArray, $forceUpdate = () => {} }) {
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
      handler: ({ results }) => {
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
