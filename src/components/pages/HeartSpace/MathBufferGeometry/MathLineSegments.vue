<template>
<div>

</div>
</template>

<script>
import * as THREE from 'three'
var Parser = require('expr-eval').Parser

export default {
  props: {
    attributes: {
      default () {
        return [
          {
            name: 'position',
            src: 'attribute vec3 position;',
            settings: [
              { k: 'i', v: 0 },
              { k: 'n', v: 10000 },
              { k: 'ii', v: 0 },
              { k: 'nn', v: 1 },
              { k: 'pi2', v: Math.PI * 2 },
              { k: 'scale', v: 20 },
              { k: 'k', v: 0.3 },
              { k: 'r', v: 30 }
            ],
            equations: [
              { k: 'x1', v: 'r * cos(k * pi2 * i / n * scale) * cos(pi2 * i / n * scale)' },
              { k: 'y1', v: 'r * cos(k * pi2 * i / n * scale) * sin(pi2 * i / n * scale)' },
              { k: 'z1', v: '0' },

              { k: 'x2', v: '1.5 * r * cos(k * pi2 * i / n * scale) * cos(pi2 * i / n * scale)' },
              { k: 'y2', v: '1.5 * r * cos(k * pi2 * i / n * scale) * sin(pi2 * i / n * scale)' },
              { k: 'z2', v: '0' }
            ],
            group: 3,
            dynamic: false
          }
        ]
      }
    }
  },
  watch: {
    // attributes (newAttr, oldAttr) {
    //   if (JSON.stringify(newAttr) !== JSON.stringify(oldAttr)) {
    //     clearTimeout(this.refreshTimer)
    //     this.refreshTimer = setTimeout(() => {
    //       this.makeGeo()
    //     }, 500)
    //   }
    // },
    attrJSON (newAttr, oldAttr) {
      if (JSON.stringify(newAttr) !== JSON.stringify(oldAttr)) {
        clearTimeout(this.refreshTimer)
        this.refreshTimer = setTimeout(() => {
          this.makeGeo()
        }, 1000)
      }
    }
  },
  computed: {
    attrJSON () {
      return JSON.stringify(this.attributes)
    }
  },
  data () {
    return {
      refreshTimer: 0
    }
  },
  mounted () {
    this.makeGeo()
  },
  methods: {
    makeArray ({ equations, settings }) {
      settings = settings.reduce((accu, setting) => {
        accu[setting.k] = Number(setting.v)
        return accu
      }, {
        i: 0,
        n: 10000,
        e: 0,

        ii: 0,
        nn: 1,
        ee: 0
      })

      equations = equations.reduce((accu, equation) => {
        accu[equation.k] = equation.v
        return accu
      }, {})

      let array = []
      let n = settings.n
      let nn = settings.nn
      if (settings.nn >= 1) {
        for (let i = settings.i; i < n; i++) {
          for (let ii = settings.ii; ii < nn; ii++) {
            settings.i = i
            settings.e = i / n
            settings.ii = ii
            settings.ee = ii / nn

            Object.keys(equations).forEach((key) => {
              let val = Parser.evaluate(equations[key], settings)
              array.push(val)
            })

            // let x1 = Parser.evaluate(equations.x1, settings)
            // let y1 = Parser.evaluate(equations.y1, settings)
            // let z1 = Parser.evaluate(equations.z1, settings)

            // let x2 = Parser.evaluate(equations.x2, settings)
            // let y2 = Parser.evaluate(equations.y2, settings)
            // let z2 = Parser.evaluate(equations.z2, settings)

            // array.push(x1, y1, z1)
            // array.push(x2, y2, z2)
          }
        }
      } else {
        for (let i = settings.i; i < n; i++) {
          settings.i = i
          settings.e = i / n

          Object.keys(equations).forEach((key) => {
            let val = Parser.evaluate(equations[key], settings)
            array.push(val)
          })

          // let x1 = Parser.evaluate(equations.x1, settings)
          // let y1 = Parser.evaluate(equations.y1, settings)
          // let z1 = Parser.evaluate(equations.z1, settings)

          // let x2 = Parser.evaluate(equations.x2, settings)
          // let y2 = Parser.evaluate(equations.y2, settings)
          // let z2 = Parser.evaluate(equations.z2, settings)

          // array.push(x1, y1, z1)
          // array.push(x2, y2, z2)
        }
      }
      return array
    },
    makeGeo () {
      // points
      let geometry = new THREE.BufferGeometry()
      let attributes = this.attributes
      attributes.forEach((attr) => {
        let { name, group, dynamic } = attr
        let array = this.makeArray({ ...attr })
        geometry.addAttribute(name, new THREE.Float32BufferAttribute(array, group).setDynamic(dynamic))
      })

      this.$parent.$emit('geometry', geometry)
    }
  }
}
</script>

<style>

</style>