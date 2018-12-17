export default {
  props: {
    toucher: {}
  },
  data () {
    return {
      orbit: false,
      ready: false,
      camera: false,
      scene: false,
      mpos: { x: 0, y: 0, clx: 0, cly: 0 }
    }
  },
  watch: {
    camera () {
      if (this.camera && this.renderer) {
        this.ready = true
      }
    },
    renderer () {
      if (this.camera && this.renderer) {
        this.ready = true
      }
    },
    ready () {
      if (this.ready) {
        this.$emit('setup')
        if (this.setup) {
          this.setup()
        }
      }
    },
    orbit () {
      this.setupOrbit()
    }
  },
  methods: {
    setupOrbit () {
      // if (this.orbit) {
      //   this.orbit.enableDamping = true
      //   this.orbit.domElement.addEventListener('mousemove', (evt) => {
      //     evt.preventDefault()
      //     this.mpos.clx = evt.clientX
      //     this.mpos.cly = evt.clientY
      //     this.mpos.x = (evt.clientX / this.size.width) * 2.0 - 1
      //     this.mpos.y = -(evt.clientY / this.size.width) * 2.0 + 1
      //   }, false)
      //   this.orbit.domElement.addEventListener('touchstart', (evt) => {
      //     this.mpos.clx = evt.touches[0].clientX
      //     this.mpos.cly = evt.touches[0].clientY
      //     if (evt.touches.length === 3) {
      //       this.orbit.enablePan = false
      //     }
      //   }, false)
      //   this.orbit.domElement.addEventListener('touchmove', (evt) => {
      //     evt.preventDefault()
      //     this.mpos.clx = evt.touches[0].clientX
      //     this.mpos.cly = evt.touches[0].clientY

      //     if (evt.touches.length === 3) {
      //       this.mpos.x = (evt.touches[0].clientX / this.size.width) * 2.0 - 1
      //       this.mpos.y = -(evt.touches[0].clientY / this.size.width) * 2.0 + 1
      //     }
      //   }, false)
      //   this.orbit.domElement.addEventListener('touchend', () => {
      //     this.orbit.enablePan = true
      //   })
      // }
    },
    bubbleUp () {
      this.$emit('camera', this.camera)
      this.$emit('scene', this.scene)
    }
  },
  created () {
    this.$on('setup', () => {
      this.bubbleUp()
    })
  },
  activated () {
    this.$emit('setup')
  }
}
