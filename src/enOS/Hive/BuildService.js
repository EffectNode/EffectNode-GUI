import Babel from '@babel/standalone'

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
