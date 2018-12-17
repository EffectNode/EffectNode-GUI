<template>
<div class="texture-loader"><slot></slot></div>
</template>

<script>
import * as THREE from 'three'
var Parser = require('expr-eval').Parser

/* eslint-disable */
// import 'imports-loader?THREE=three!./TextureLoader.js'
// import 'imports-loader?THREE=three!three/examples/js/loaders/SVGLoader.js'
// import 'imports-loader?THREE=three!three/examples/js/renderers/SVGRenderer.js'
/* eslint-enable */

export default {
  props: {
    data: {},
    fs: {},
    page: {}
    // src: { default () { return require('../textures/tiger.svg') } },
    // material: {
    //   default () {
    //     return false
    //   }
    // }
  },
  data () {
    return {
      textureRTT: false,
      image: false,
      texture: false,
      geometry: false,
      material: false,
      mesh: false,
      base3D: false,
      obj3D: false,
      size: false,
      resizer () {},
      updatepos () {},
      updateSize () {},
      Parser,
      THREE,
      isActive: true,
      clean () {},
      loader: new THREE.ImageLoader()
    }
  },
  created () {
    this.base3D = this.makeObject3D()
    if (this.data.base && this.data.base.scale) {
      this.base3D.scale.copy(this.data.base.scale)
    }
    if (this.data.base && this.data.base.position) {
      this.base3D.position.copy(this.data.base.position)
    }
    this.$on('add', (v) => {
      this.base3D.add(v)
    })
    this.$on('remove', (v) => {
      this.base3D.remove(v)
    })
    this.$on('textureRTT', (v) => {
      this.textureRTT = v
      if (this.material) {
        this.material.map = v
        this.material.needsUpdate = true
      }
    })
  },
  watch: {
    fs () {
      this.resizer()
    }
  },
  mounted () {
    // this.loadImage()
    // window.addEventListener('resize', () => {
    //   if (this.isActive) {
    //     this.loadImage()
    //   }
    // }, false)

    this.onMount()
  },
  methods: {
    // 1. load image
    // 2. prepare texture
    // 3. prepare geometry
    // 4. prepare mesh
    // 5. prepare object position

    // on resize screen
    // 1. prep geo
    // 2. prep object position
    loadImage ({ src }) {
      return new Promise((resolve, reject) => {
        this.loader.load(src, resolve)
      })
    },
    prepareTexture ({ image }) {
      return new Promise((resolve, reject) => {
        var zoom = window.innerWidth / image.width
        var dpi = window.devicePixelRatio < 2.0 ? 2.0 : window.devicePixelRatio * zoom
        var canvas = document.createElement('canvas')

        canvas.width = image.width * dpi
        canvas.height = image.height * dpi

        var ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        let map = new THREE.CanvasTexture(canvas)
        map.needsUpdate = true

        resolve(map)
      })
    },
    prepareGeo ({ size }) {
      var nx = 30
      var ny = 30

      let geometry = new THREE.PlaneBufferGeometry(size.width, size.height, nx, ny)
      return geometry
    },
    prepareMaterial ({ texture }) {
      return new Promise((resolve, reject) => {
        let material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        })
        resolve(material)
      })
    },
    prepareMesh ({ geometry, material }) {
      return new Promise((resolve, reject) => {
        let mesh = new THREE.Mesh(geometry, material)
        resolve(mesh)
      })
    },
    evalSize ({ formulas, info }) {
      return {
        width: Parser.evaluate(formulas.width, info),
        height: Parser.evaluate(formulas.height, info)
      }
    },
    evalPosition ({ formulas, info }) {
      return {
        x: Parser.evaluate(formulas.x, info),
        y: Parser.evaluate(formulas.y, info),
        z: Parser.evaluate(formulas.z, info)
      }
    },
    makeObject3D () {
      return new THREE.Object3D()
    },
    setObject3D ({ obj3D, position }) {
      obj3D.position.x = position.x
      obj3D.position.y = position.y
      obj3D.position.z = position.z
      return obj3D
    },
    async onMount () {
      let image = this.image = await this.loadImage({ src: this.data.src })
      let texture = this.texture = this.textureRTT || await this.prepareTexture({ image })
      let size = this.size = await this.evalSize({
        formulas: this.data.formulas,
        info: {
          base: this.data.base || { width: 1, height: 1, aspect: 1 },
          fsw: this.fs.width,
          fsh: this.fs.height,
          fsa: this.fs.aspect,
          ia: this.image.width / this.image.height
        }
      })
      let geometry = this.geometry = await this.prepareGeo({ image, size })
      let material = this.material = await this.prepareMaterial({ texture })
      let mesh = this.mesh = await this.prepareMesh({ geometry, material })
      let obj3D = this.obj3D = this.makeObject3D()
      obj3D.add(mesh)
      this.base3D.add(obj3D)

      this.updatePos = () => {
        let position = this.evalPosition({
          formulas: this.data.formulas,
          info: {
            fsw: this.fs.width,
            fsh: this.fs.height,
            fsa: this.fs.aspect,
            ia: this.image.width / this.image.height,

            szw: this.size.width,
            szh: this.size.height,
            sza: this.size.width / this.size.height,
            ...this.page.state.layout
          }
        })
        // console.log(this.page.state.layout)

        this.setObject3D({
          obj3D: this.obj3D,
          position
        })
        this.page.register(this)
      }

      this.updateSize = () => {
        let size = this.size = this.evalSize({
          formulas: this.data.formulas,
          info: {
            fsw: this.fs.width,
            fsh: this.fs.height,
            fsa: this.fs.aspect,
            ia: this.image.width / this.image.height
          }
        })

        let geometry = this.geometry = this.prepareGeo({ image, size })
        this.mesh.geometry = geometry
        this.page.register(this)
      }

      this.resizer = () => {
        try {
          this.mesh.visible = false
          this.updatePos()
          this.updateSize()
          this.mesh.visible = true
        } catch (e) {
          this.mesh.visible = false
          console.log(e)
          setTimeout(() => {
            this.resizer()
          }, 100)
        }
      }

      this.updateTexutre = () => {
        this.material.map = this.texture
        this.material.needsUpdate = true
      }

      this.resizer()
      window.addEventListener('resize', this.resizer, false)

      this.$parent.$emit('add', this.base3D)
      if (this.clean) {
        this.clean()
      }
      this.clean = () => {
        window.removeEventListener('resize', this.resizer)
        this.$parent.$emit('remove', this.base3D)
      }
      this.$emit('element', this)
      this.$emit('resizer', this.resizer)
      this.page.register(this)
    }
  },
  beforeDestroy () {
    this.isActive = false
    this.clean()
  }
}
</script>

<style scoped>
</style>
