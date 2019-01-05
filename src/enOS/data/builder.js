// import Babel from '@babel/standalone'
// // import axios from 'axios'
// export function transform (src) {
//   return new Promise((resolve, reject) => {
//     try {
//       let code = Babel.transform(src, {
//         presets: ['es2015', 'stage-3', 'minify']
//       }).code
//       resolve(code)
//     } catch (ex) {
//       console.log(ex)
//       reject(new Error(ex))
//     }
//   })
// }

/* eslint-disable */
let loadNewCache = async () => await {
  'https://cdn.jsdelivr.net/npm/whammy@0.0.1/whammy.min.js': await import('raw-loader!../../../static/js/lib/encoder/whammy.js'),
  'https://threejs.org/build/three.min.js': await import('raw-loader!../../../static/js/lib/ThreeJS/three.min.js'),
  'https://threejs.org/examples/js/controls/OrbitControls.js': await import('raw-loader!../../../static/js/lib/ThreeJS/examples/js/controls/OrbitControls.js'),
  'https://threejs.org/examples/js/postprocessing/EffectComposer.js': await import('raw-loader!../../../static/js/lib/ThreeJS/examples/js/postprocessing/EffectComposer.js'),
  'https://threejs.org/examples/js/postprocessing/RenderPass.js': await import('raw-loader!../../../static/js/lib/ThreeJS/examples/js/postprocessing/RenderPass.js'),
  'https://threejs.org/examples/js/postprocessing/ShaderPass.js': await import('raw-loader!../../../static/js/lib/ThreeJS/examples/js/postprocessing/ShaderPass.js'),
  'https://threejs.org/examples/js/shaders/CopyShader.js': await import('raw-loader!../../../static/js/lib/ThreeJS/examples/js/shaders/CopyShader.js'),
  'https://threejs.org/examples/js/shaders/LuminosityHighPassShader.js': await import('raw-loader!../../../static/js/lib/ThreeJS/examples/js/shaders/LuminosityHighPassShader.js'),
  'https://threejs.org/examples/js/postprocessing/UnrealBloomPass.js': await import('raw-loader!../../../static/js/lib/ThreeJS/examples/js/postprocessing/UnrealBloomPass.js')
}
/* eslint-enable */
let jsCahce = {}
loadNewCache().then((newCahce) => {
  jsCahce = newCahce
})

export const fromDocToHTMLProd = async ({ Doc }) => {
  // let resp = await Promise.all([

  //   // axios.get('/static/js/app/ExecEnv.js'),
  //   // axios.get('/static/js/app/vue@2.5.21.min.js'),
  //   // axios.get('/static/js/app/template.html')
  // ])
  /* eslint-disable */
  let resp = []
  resp[0] = require('raw-loader!../../../static/js/app/ExecEnv.js')
  resp[1] = require('raw-loader!../../../static/js/app/vue@2.5.21.min.js')
  resp[2] = require('raw-loader!../../../static/js/app/template.html')
  /*
  'https://threejs.org/examples/js/controls/OrbitControls.js',

  'https://threejs.org/examples/js/postprocessing/EffectComposer.js',
  'https://threejs.org/examples/js/postprocessing/RenderPass.js',
  'https://threejs.org/examples/js/postprocessing/ShaderPass.js',
  'https://threejs.org/examples/js/shaders/CopyShader.js',
  'https://threejs.org/examples/js/shaders/LuminosityHighPassShader.js',
  'https://threejs.org/examples/js/postprocessing/UnrealBloomPass.js'
  */
  /* eslint-enable */

  let globalCache = `
    window.EFFECT_NODE_HAS_URL = ${JSON.stringify(Object.keys(jsCahce))};
  `

  Object.keys(jsCahce).forEach((url) => {
    globalCache += `
      ${jsCahce[url]}
    `
  })

  Doc = JSON.stringify(Doc)
  // console.log(resp[0])
  let execResp = resp[0] + ';'
  let vueResp = resp[1]
  let htmlResp = resp[2]
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
    (function () {
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
        window.addEventListener('resize', () => {
          window.dispatchEvent(new CustomEvent('resize-dev', { detail: { width: window.innerWidth, height: window.innerHeight } }))
        })
        window.addEventListener('message', (evt) => {
          if (evt.data && evt.data.type === 'resize') {
            window.dispatchEvent(new CustomEvent('resize-dev', { detail: { width: evt.data.width, height: evt.data.height } }))
          }

          if (evt.data && evt.data.type === 'send-module-meta') {
            let module = evt.data.module
            let meta = evt.data.meta

            let oldMod = Doc.root.modules.find(m => m.id === module.id)
            if (oldMod) {
              let oldIDX = oldMod.meta.findIndex(m => m.id === meta.id)
              if (oldMod.meta[oldIDX]) {
                oldMod.meta[oldIDX] = meta
              }
            }
          }
        }, false)
      })
    }());
  `

  htmlResp = htmlResp.replace('<!--=*+BODY_HTML+*=-->', `<div class="${injectClassName}"></div>`)
  htmlResp = htmlResp.replace('/*STYLE_HEAD*/', style)
  htmlResp = htmlResp.replace('/*VENDORS_HEAD*/', ``)
  htmlResp = htmlResp.replace('/*SCRIPT_HEAD*/', `window.global = window;\n${globalCache}\n${vueResp}\n${execResp}`)
  htmlResp = htmlResp.replace('/*SCRIPT_BODY*/', `${runnerCode}`)

  // console.log(execResp, vueResp, htmlResp)

  return htmlResp
}

export const makeHTMLLink = ({ HTML }) => {
  let blob = new Blob([HTML], { type: 'text/html' })
  let link = URL.createObjectURL(blob)
  return link
}
