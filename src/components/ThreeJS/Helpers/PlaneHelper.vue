<template>
<div></div>
</template>

<script>
import * as THREE from 'three'

export default {
  props: {
    x: {
      default: 1
    },
    y: {
      default: 0
    },
    z: {
      default: 0
    },
    colorAxis: {
      default: 0x111111
    },
    colorGrid: {
      default: 0xbababa
    }
  },
  methods: {
    setup () {
      if (this.clean) {
        this.clean()
      }
      var helper = new THREE.GridHelper(200, 10, new THREE.Color(this.colorAxis), new THREE.Color(this.colorGrid))
      this.$parent.$emit('add', helper)
      this.clean = () => {
        this.$parent.$emit('remove', helper)
      }
    }
  },
  mounted () {
    this.setup()
  },
  watch: {
    colorAxis () {
      this.setup()
    },
    colorGrid () {
      this.setup()
    }
  }
}
</script>

<style>

</style>
