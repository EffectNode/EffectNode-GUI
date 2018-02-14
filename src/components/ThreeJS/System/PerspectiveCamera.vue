<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: ['fov', 'aspect', 'near', 'far', 'position'],
  data () {
    return {
      camera: null
    }
  },
  created () {
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far)

    if (this.position) {
      this.camera.position.x = this.position.x
      this.camera.position.y = this.position.y
      this.camera.position.z = this.position.z
    }
    this.$emit('camera', this.camera)
  },
  watch: {
    position () {
      if (this.position) {
        this.camera.position.x = this.position.x
        this.camera.position.y = this.position.y
        this.camera.position.z = this.position.z
      }
    },
    aspect () {
      if (this.camera) {
        this.camera.aspect = this.aspect
        this.camera.updateProjectionMatrix()
      }
    }
  }
}
</script>

<style scoped>
.perspective-camera{
  display: none;
}
</style>
