function getTagContent (str, start, end) {
  if (str.indexOf(start) === -1) {
    return false
  }
  return str.slice(str.indexOf(start) + start.length, str.indexOf(end))
}

export const getCompoInfo = (compoStr) => {
  var output = {}
  compoStr = compoStr.trim()
  output.template = getTagContent(compoStr, '<template>', '</template>') || ''
  output.script = getTagContent(compoStr, '<script>', '</script>') || ''
  output.style = getTagContent(compoStr, '<style>', '</style>') || getTagContent(compoStr, '<style scoped>', '</style>')

  var scoped = !!getTagContent(compoStr, '<style scoped>', '</style>')
  output.styleScoped = scoped
  return output
}
