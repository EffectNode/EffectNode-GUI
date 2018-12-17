import '../../../static/js/app/Hive.js'

export const Data = window.HiveData

export const init = Data.init

var Doc = false

init().then((v) => {
  Data.makein4out4Mod({ Doc: v.Doc })
  Data.makein4out4Mod({ Doc: v.Doc })
  Doc = v.Doc
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
