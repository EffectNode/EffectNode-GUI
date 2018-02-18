<template>
  <div :style="{height: height ? px(height) : '100%',width: width ? px(width) : '100%'}">
  </div>
</template>

<script>
var ace = require('brace')
// npm install --save vue2-ace-editor
require(['emmet/emmet'], function (data) {
  window.emmet = data.emmet
})

/*
<ACE
  v-if="currentFile"
  @save="() => {}"
  :path="currentFile.path"
  v-model="currentFile.src"
  @input="() => { isDirty = true; }"
  theme="chrome"
  width="100%"
  :height="'1024'"
>
</ACE>
*/

export default {
  template: '',
  props: {
    value: {},
    filepath: {
      type: String,
      default: 'lol.js'
    },
    theme: String,
    height: true,
    width: true
  },
  data () {
    return {
      editor: null,
      contentBackup: ''
    }
  },
  methods: {
    px (n) {
      if (/^\d*$/.test(n)) {
        return n + 'px'
      }
      return n
    },
    getLangFromPath (path) {
      var ans = 'html'
      try {
        var ext = path.split('.').pop()

        if (ext === 'js') {
          ans = 'javascript'
        }
        if (ext === 'vue') {
          ans = 'html'
        }
        if (ext === 'html') {
          ans = 'html'
        }
        if (ext === 'css') {
          ans = 'css'
        }
        if (ext === 'vert') {
          ans = 'glsl'
        }
        if (ext === 'frag') {
          ans = 'glsl'
        }
      } catch (e) {
        console.log(e)
      }

      return ans
    },
    setup () {
      var vm = this
      var theme = this.theme || 'chrome'

      require('brace/ext/emmet')

      var editor = vm.editor = ace.edit(this.$el)

      var commands = [
        {
          name: 'open-files',
          bindKey: {win: 'Ctrl-O', mac: 'Command-O'},
          exec: (editor) => {
            // var val = editor.getValue()
            this.$emit('open')
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'save',
          bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
          exec: (editor) => {
            var val = editor.getValue()
            this.$emit('save', val)
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'multicursor',
          bindKey: {win: 'Ctrl-D', mac: 'Command-D'},
          exec: (editor) => {
            editor.selectMore(1)
          },
          // multiSelectAction: 'forEach',
          scrollIntoView: 'cursor',
          readOnly: true // false if this command should not apply in readOnly mode
        }
      ]
      if (Array.isArray(commands)) {
        commands.forEach((command) => {
          vm.editor.commands.addCommand(command)
        })
      }

      // this.$emit('init', editor)

      require('brace/mode/html')
      require('brace/mode/javascript')
      require('brace/mode/css')
      require('brace/mode/glsl')
      // require('brace/mode/sass')
      require('brace/theme/chrome')
      require('brace/ext/searchbox')

      editor.$blockScrolling = Infinity
      editor.setOption('enableEmmet', true)
      editor.getSession().setMode('ace/mode/' + this.getLangFromPath(this.filepath))
      editor.setTheme('ace/theme/' + theme)
      editor.session.setValue(this.value, 1)
      editor.session.setOptions({ tabSize: 2, useSoftTabs: true })
      editor.session.setOption('useWorker', false)

      editor.on('change', function () {
        var content = editor.getValue()
        vm.$emit('input', content)
        vm.contentBackup = content
      })
    }
  },
  watch: {
    value (val) {
      if (this.contentBackup !== val) {
        this.editor.setValue(val, 1)
      }
    },
    filepath () {
      this.editor.getSession().setMode('ace/mode/' + this.getLangFromPath(this.filepath))
    }
  },
  mounted () {
    this.setup()
  }
}
</script>

<style>

</style>
