(function () {
  let g = window
  var getID = () => {
    return '_docs_' + (1024 * 1024 * 1024 * Math.random()).toFixed(0)
  }
  let DocsQuery = {
    download () {
    }
  }
  g.getID = getID
  g.DocsQuery = DocsQuery
}())
