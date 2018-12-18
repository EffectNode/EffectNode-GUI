import '../../../static/js/app/Hive.js'

export const Data = window.HiveData

export const init = window.HiveData.init

var Doc = false

init({ projectID: '123' })
  .then((v) => {
    Data.makein4out4Mod({ Doc: v.Doc })
    Data.makein4out4Mod({ Doc: v.Doc })
    Doc = v.Doc
    return v
  })
  .then((v) => {
    console.log(v)
  })

export const get = () => {
  return new Promise((resolve, reject) => {
    function loop () {
      if (Doc === false) {
        setTimeout(loop, 100)
      } else {
        resolve({ Doc, Data })
      }
    }
    setTimeout(loop, 100)
  })
}
