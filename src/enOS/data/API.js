import axios from 'axios'
import io from 'socket.io-client'
// import uuid from 'uuid'
import NProgress from 'nprogress'
import './nprogress.css'

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
  baseURL = 'https://effect-node-cloud.herokuapp.com/'
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

// sockets....

var _sockets = []
var makeSocket = (path) => {
  // return io(`${baseURL}/${path}`, { transports: ['websocket'] })
  let socket = io(`${baseURL}${path}`, { transports: ['websocket'] })
  window.addEventListener('focus', () => {
    socket.connect()
  })
  _sockets.push(socket)
  return socket
}

export const sockets = {
  makeSocket,
  get list () {
    return _sockets
  }
}

function prepSocket () {
  try {
    sockets.effectnode = makeSocket('effectnode')
  } catch (e) {
    setTimeout(() => {
      prepSocket()
    }, 1000 * 10)
  }
}
prepSocket()

export const myself = () => {
  return iAXIOS.get('/myself')
}

export const projectWelcome = () => {
  return iAXIOS.get('/en/project')
}
