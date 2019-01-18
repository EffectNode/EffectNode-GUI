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
} else if (window.location.hostname.indexOf('192') !== -1) {
  baseURL = 'http://' + window.location.hostname + ':3003/'
}

export const PROXY_URL = baseURL + 'yo/proxy'

export const StartLoading = () => {
  NProgress.start()
}
export const EndLoading = () => {
  NProgress.done()
}

var makeAxios = () => {
  let config = {
    withCredentials: true,
    headers: {},
    baseURL
  }

  let rememberMe = window.localStorage.getItem('jwt_remember_me')
  if (rememberMe) {
    config.headers = {
      'Authorization': `bearer ${rememberMe}`
    }
  }

  var iAXIOS = axios.create(config)

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

export const makeSocket = (path) => {
  // return io(`${baseURL}/${path}`, { transports: ['websocket'] })
  // let socket = io(`${baseURL}${path}`)
  let rememberMe = window.localStorage.getItem('jwt_remember_me')
  let query = ``
  if (rememberMe) {
    query = `auth_token=${rememberMe}`
  }
  let socket = io(`${baseURL}${path}`, { transports: ['websocket'], query })
  window.addEventListener('focus', () => {
    socket.connect()
  })
  setInterval(() => {
    if (socket.disconnected) {
      socket.connect()
    }
  }, 500)
  return socket
}

export const RT = {
  en: makeSocket('effect-node'),
  shareDB: makeSocket('shareDB')
}

var iAXIOS = makeAxios()

export let myself = false

export let checkLogin = async () => {
  try {
    await getMe()
    return true
  } catch (e) {
    window.localStorage.removeItem('jwt_remember_me')
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
  return iAXIOS.post('/en/register', data)
    .then((resp) => {
      window.localStorage.setItem('jwt_remember_me', resp.data.token)
      iAXIOS = makeAxios()
      RT.en = makeSocket('effect-node')
      return resp
    })
}

export const login = (data) => {
  return iAXIOS.post('/login', data)
    .then((resp) => {
      window.localStorage.setItem('jwt_remember_me', resp.data.token)
      iAXIOS = makeAxios()
      RT.en = makeSocket('effect-node')
      return resp
    })
}

export const logout = (data) => {
  window.localStorage.removeItem('jwt_remember_me')
  return iAXIOS.post('/logout', data)
}

export class TableSync {
  constructor ({ namespace, getArray, $forceUpdate = () => {} }) {
    this.namespace = namespace
    this.getArray = getArray
    this.$forceUpdate = $forceUpdate

    setInterval(() => {
      NProgress.done()
    }, 777)
  }
  get socket () {
    return RT.en || { emit () {}, on () {} }
  }
  add (data) {
    NProgress.start()
    return this.doRemote({ data: data, method: 'add' })
  }
  remove (data) {
    NProgress.start()
    return this.doRemote({ data: data, method: 'remove' })
  }
  update (data) {
    NProgress.start()
    return this.doRemote({ data: data, method: 'update' })
  }
  hydrate (data) {
    NProgress.start()
    return this.doRemote({ data: data, method: 'hydrate' })
  }
  animate (data) {
    return this.doRemote({ data: data, method: 'animate' })
  }
  sync () {
    this._onHydrate()
    this._onAdd()
    this._onRemove()
    this._onUpdate()
    this._onAnimate()
  }
  _onAnimate () {
    this.onLocal({
      handler: ({ results }) => {
        console.log(results)
        let newItem = results
        let arr = this.getArray()
        let idx = arr.findIndex(a => a._id === newItem._id)
        Object.keys(newItem).forEach((keyname) => {
          let oldItem = arr[idx]
          if (newItem && oldItem) {
            oldItem[keyname] = newItem[keyname]
          }
        })
        this.$forceUpdate()
      },
      method: 'animate'
    })
  }
  _onHydrate () {
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
        this.$forceUpdate()
      },
      method: 'hydrate'
    })
  }
  _onAdd () {
    this.onLocal({
      handler: ({ results }) => {
        console.log(results)
        this.getArray().push(results)
        this.$forceUpdate()
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
        this.$forceUpdate()
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
        let oldItem = arr[idx]
        Object.keys(newItem).forEach((keyname) => {
          if (newItem && oldItem) {
            oldItem[keyname] = newItem[keyname]
          }
          // let isScalar = typeof oldItem[keyname] !== 'object'
          // if (isScalar) {
          //   oldItem[keyname] = newItem[keyname]
          // } else {
          //   if (newItem[keyname] instanceof Array) {
          //     newItem[keyname].forEach((newSubItem, ii) => {
          //       oldItem[keyname][ii] = newSubItem[ii]
          //     })
          //   } else {
          //     Object.keys(newItem[keyname]).forEach((subKeyname) => {
          //       oldItem[subKeyname] = newItem[subKeyname]
          //     })
          //   }
          // }
        })
        // this.$forceUpdate()
      },
      method: 'update'
    })
  }
  doRemote ({ data, method }) {
    return new Promise((resolve) => {
      this.socket.emit(`${this.namespace}::up::${method}`, data, (v) => {
        console.log(`${this.namespace}::up::${method}`, data)
        resolve(v)
      })
    })
  }
  onLocal ({ handler, method }) {
    this.socket.on(`${this.namespace}::dn::${method}`, (data, fn) => {
      handler(data, fn)
      console.log(`${this.namespace}::dn::${method}`, data)
    })
  }
}
