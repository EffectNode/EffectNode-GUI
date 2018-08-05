<template>
  <div v-if="tooltip" class="tool-tip" ref="tool-tip" :style="tooltipCSS">
    <span v-if="tooltip.name">
      {{ tooltip.name }}
    </span>
    <div v-if="tooltip.qr">
      <a :href="tooltip.qr" target="_blank">
        <VueQrcode :value="tooltip.qr" :options="{ size: 250 }" />
      </a>
    </div>
  </div>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode'

export default {
  components: {
    VueQrcode
  },
  props: {
    tooltip: {
      default () {
        return false
      }
    }
  },
  data () {
    return {
      page: {
        x: 0,
        y: 0
      }
    }
  },
  mounted () {
    // tooltip
    window.addEventListener('mousemove', (evt) => {
      this.page.x = evt.pageX
      this.page.y = evt.pageY
    }, false)
  },
  methods: {

  },
  computed: {
    tooltipCSS () {
      var reverseX = (this.tooltip && this.tooltip.reverseX) ? this.tooltip.reverseX : 0
      return {
        position: 'fixed',
        top: '0px',
        left: '0px',
        zIndex: 300,
        backgroundColor: 'white',
        padding: '10px',
        transform: `translate3d(${(this.page.x + 20 + reverseX)}px,${(this.page.y + 20)}px,30px)`,
        color: 'black',
        border: '#939393 solid 1px'
      }
    }
  }
}
</script>

<style>

</style>
