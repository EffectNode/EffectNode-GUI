<template>
  <div class="full">

    <Renderer
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
      123
    </Renderer>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="{ x: 0, y: 0, z: 10 }"
      @camera="(v) => { camera = v }"
    />

    <Scene @scene="(v) => { scene = v }">
      <Object3D pz="10">
        <PointLight />
      </Object3D>

      <Object3D pz="0">
        <Points>
          <SphereBufferGeometry />
          <ShaderMaterial :vs="simpleVS" :fs="simpleFS" :uniforms="animatable" />
        </Points>
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
import simpleVS from '@/components/Shaders/Simple/vs.vert'
import simpleFS from '@/components/Shaders/Simple/fs.frag'

export default {
  components: {
    ...Bundle
  },
  computed: {
  },
  methods: {
    renderWebGL () {
      this.animatable.time.value = window.performance.now() * 0.001

      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  data () {
    return {
      animatable: {
        time: { value: 0 }
      },
      simpleVS,
      simpleFS,
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      },
      renderer: false,
      scene: false,
      camera: false
    }
  },
  created () {

  },
  mounted () {
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
