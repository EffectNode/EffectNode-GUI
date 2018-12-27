import Babel from '@babel/standalone'
import axios from 'axios'
export function transform (src) {
  return new Promise((resolve, reject) => {
    try {
      let code = Babel.transform(src, {
        presets: ['es2015', 'stage-3', 'minify']
      }).code
      resolve(code)
    } catch (ex) {
      console.log(ex)
      reject(new Error(ex))
    }
  })
}

export const fromDocToHTMLProd = async ({ Doc }) => {
  let resp = await Promise.all([
    axios.get('/static/js/app/ExecEnv.js'),
    axios.get('/static/js/app/vue@2.5.21.min.js'),
    axios.get('/static/js/app/template.html')
  ])

  Doc = JSON.stringify(Doc)
  let execResp = resp[0].data
  let vueResp = resp[1].data
  let htmlResp = resp[2].data
  let r = (Math.random() * 1024 * 1024 * 1024).toFixed(0)
  let injectClassName = `_inject_${r}`
  let style = `
    html, body, .${injectClassName}, .full {
      width: 100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
    }
  `
  let runnerCode = `
    let injectClassName = '.${injectClassName}';
    let Doc = ${Doc};
    // console.log(window.ExecEnv)
    let uiAPI = {
      hive: {
        Doc
      }
    }
    window.ExecEnv.init(uiAPI).then((uiAPI) => {
      let dom = document.querySelector(injectClassName)
      dom.appendChild(uiAPI.execEnv.Sys.$el)
      window.addEventListener('message', (evt) => {
        if (evt.data && evt.data.type === 'send-module-meta') {
          let module = evt.data.module
          let meta = evt.data.meta
          let idx = evt.data.idx

          let oldMod = Doc.root.modules.find(m => m.id === module.id)
          oldMod.meta[idx] = meta
        }
      }, false)
    })
  `

  htmlResp = htmlResp.replace('<!--=*+BODY_HTML+*=-->', `<div class="${injectClassName}"></div>`)
  htmlResp = htmlResp.replace('/*STYLE_HEAD*/', style)
  htmlResp = htmlResp.replace('/*SCRIPT_HEAD*/', `${vueResp}\n${execResp}`)
  htmlResp = htmlResp.replace('/*SCRIPT_BODY*/', `${runnerCode}`)

  // console.log(execResp, vueResp, htmlResp)

  return htmlResp
}

export const makeHTMLLink = ({ HTML }) => {
  let blob = new Blob([HTML], { type: 'text/html' })
  let link = URL.createObjectURL(blob)
  return link
}
