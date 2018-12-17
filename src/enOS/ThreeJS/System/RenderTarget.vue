<template>
  <div>
    <slot />
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  props: {
    width: {
      default () {
        return 512
      }
    },
    height: {
      default () {
        return 512
      }
    }
  },
  data () {
    return {
      rtt: false
    }
  },
  watch: {
    width () {
      this.rtt.setSize(this.width, this.height)
    },
    height () {
      this.rtt.setSize(this.width, this.height)
    }
  },
  mounted () {
    this.rtt = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter
    })
    this.$nextTick(() => {
      this.$emit('texture', this.rtt.texture)
      this.rtt.setSize(this.width, this.height)
      this.$emit('rtt', this.rtt)
      this.$parent.$emit('texture', { texture: this.rtt.texture })
    })
  },
  beforeDestroy () {
    this.rtt.dispose()
  }
}
</script>

<style>

</style>
