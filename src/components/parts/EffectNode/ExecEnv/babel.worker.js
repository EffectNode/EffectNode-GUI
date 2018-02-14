import * as Babel from '@babel/standalone/babel.js'
import * as VueCompo from './vue.processor.js'
import requirejsSrc from './str/requirejs.str.txt'

var uglify = require('uglifyjs-browser')

console.trace = v => console.log(v)

var dynamicSpread = require('babel-plugin-transform-object-rest-spread')
Babel.registerPlugin('transform-object-rest-spread', dynamicSpread)

var umd = require('babel-plugin-transform-es2015-modules-umd')
Babel.registerPlugin('transform-es2015-modules-umd', umd)

var es6 = [
  [ 'transform-object-rest-spread', { 'useBuiltIns': false } ],
  [
    'transform-es2015-modules-umd',
    {
      exactGlobals: true
    }
  ]
]

var compile = ({ path, src }) => {
  return new Promise((resolve, reject) => {
    var output

    try {
      if (path.split('.').pop() === 'js') {
        // js
        output = Babel.transform(src, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        setTimeout(() => {
          resolve({ output })
        }, 10)
      } else if (path.split('.').pop() === 'json') {
        // json
        output = Babel.transform(`export default ${JSON.stringify(JSON.parse(src))};`, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        setTimeout(() => {
          resolve({ output })
        }, 10)
      } else if (path.split('.').pop() === 'html') {
        // dont include html in the js file
        output = ''
        setTimeout(() => {
          resolve({ output })
        }, 10)
      } else if (path.split('.').pop() === 'css') {
        // text
        let css = JSON.stringify(src)
        let code = `
          var css = ${css};
          var head = document.head || document.getElementsByTagName('head')[0];
          var style = document.createElement('style');
          style.type = 'text/css';
          if (style.styleSheet) {
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }
          head.appendChild(style);
        `

        output = Babel.transform(code + `export default ` + css, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        setTimeout(() => {
          resolve({ output })
        }, 10)
      } else if (path.split('.').pop() === 'vue') {
        // vue file

        let info = VueCompo.getCompoInfo(src)
        var scopeID = 'data-s-' + (Math.ceil(Math.random() * 100000)).toString(36)
        let css = JSON.stringify(info.style)
        info.template = info.template.replace('>', `${scopeID}>`)

        /* eslint-disable */

        let code = `
          var css = ${css};
          var head = document.head || document.getElementsByTagName('head')[0];
          var style = document.createElement('style');
          style.type = 'text/css';
          if (style.styleSheet) {
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }

          function addScope (styleElt, scopeName) {

            function process() {

              var sheet = styleElt.sheet;
              var rules = sheet.cssRules;

              for ( var i = 0; i < rules.length; ++i ) {

                var rule = rules[i];
                if ( rule.type !== 1 )
                  continue;

                var scopedSelectors = [];

                rule.selectorText.split(/\s*,\s*/).forEach(function(sel) {

                  scopedSelectors.push(scopeName+' '+sel);
                  var segments = sel.match(/([^ :]+)(.+)?/);
                  scopedSelectors.push(segments[1] + scopeName + (segments[2]||''));
                });

                var scopedRule = scopedSelectors.join(',') + rule.cssText.substr(rule.selectorText.length);
                sheet.deleteRule(i);
                sheet.insertRule(scopedRule, i);
              }
            }

            try {
              // firefox may fail sheet.cssRules with InvalidAccessError
              process();
            } catch (ex) {

              if ( ex instanceof DOMException && ex.code === DOMException.INVALID_ACCESS_ERR ) {

                styleElt.sheet.disabled = true;
                styleElt.addEventListener('load', function onStyleLoaded() {

                  styleElt.removeEventListener('load', onStyleLoaded);

                  // firefox need this timeout otherwise we have to use document.importNode(style, true)
                  setTimeout(function() {

                    process();
                    styleElt.sheet.disabled = false;
                  });
                });
                return;
              }

              throw ex;
            }
          }

          head.appendChild(style);
          if (${info.styleScoped}) {
            addScope(style, '[${scopeID}]');
          }
        `

        /* eslint-enable */

        // inject template property into the export Object
        info.script = info.script.replace('export default {', `export default { \n\ttemplate: ${JSON.stringify(info.template)},`)

        // console.log(info)

        output = Babel.transform(code + info.script, { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        setTimeout(() => {
          resolve({ output })
        }, 10)
      } else {
        // text
        output = Babel.transform(`export default ` + '`' + `${src}` + '`', { presets: ['es2015'], plugins: [...es6], moduleId: path }).code
        setTimeout(() => {
          resolve({ output })
        }, 10)
      }
    } catch (e) {
      console.log(e)
      output = `
        console.log(JSON.parse("${JSON.stringify(e)}"));
      `
      setTimeout(() => {
        resolve({ output })
      }, 10)
    }
  })
}

// default files
var files = [
  {
    path: '@/main.js',
    src: `
      import app from '@/src/app.js'
      import fun from '@/src/fun.js'
      console.log(app())
      console.log(fun())
    `
  },
  {
    path: '@/src/app.vert',
    src: `
      uniform vec2 resolution;
      main () {
      }
    `
  },
  {
    path: '@/src/app.js',
    src: `
      import srcVert from '@/src/app.vert'
      console.log(srcVert);
      const getMessage = () => "Cannot read files. lol";
      export default getMessage;
    `
  },
  {
    path: '@/src/fun.js',
    src: `
      const fun = () => "Hello Fun fun World";
      export default fun;
    `
  }
]

function minify ({ js }) {
  const src = js

  let ast = uglify.parse(src)
  ast.figure_out_scope()
  const compressor = uglify.Compressor()
  ast = ast.transform(compressor)

  ast.figure_out_scope()
  ast.compute_char_frequency()
  ast.mangle_names()

  const minified = ast.print_to_string()
  return minified
}

function integrateIntoHTML (output) {
  // `<script id="scriptme" type="text/template">` + `${output.js}` + '<' + '/' + `script>` +
  var insertion = `<script>
  (function RunRunUnicorn(){
    var app = ${JSON.stringify(output.js)};

    function addBlobScript(js) {
      var url = URL.createObjectURL(new Blob([js], { type: 'script/javascript' }));
      var newJS = document.createElement('script');
      newJS.src = url;
      document.body.appendChild(newJS);
    }
    addBlobScript(app);

  }());
  ` + '<' + '/' + `script>`
  if ((output.html + '').indexOf('</body>') === -1) {
    output.html += insertion
  } else {
    output.html = output.html.replace('</body>', `${insertion}</body>`)
  }
  return output
}

function makeid () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' // 0123456789

  for (var i = 0; i < 24; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

self.onmessage = ({ data }) => {
  files = data.files || files

  Promise.all(files.map((file) => {
    return compile(file)
  })).then((all) => {
    var entry = all.reduce((accu, val, key) => {
      return accu + '\n\n' + val.output
    }, '')
    var rand = makeid()

    var reqJS = minify({ js: requirejsSrc })

    var result = `
(function(){
  ${reqJS}
  function OMG_${rand} () {
    var self = this;
    ${entry}
    requireJSRequire(['@/main.js'], function () {
      setTimeout(() => {
        (window.opener || window.top).postMessage({ type: 'requirejs-ready' }, window.location.origin);
      }, 10);
    });
  }
  new OMG_${rand}();
}());
`
    var output = {
      html: ((files.find(pf => pf.path === '@/index.html') || {}).src) || 'empty html',
      origHtml: ((files.find(pf => pf.path === '@/index.html') || {}).src) || 'empty html',
      js: result
    }

    output = integrateIntoHTML(output)

    postMessage({ ...output })
  })
}
