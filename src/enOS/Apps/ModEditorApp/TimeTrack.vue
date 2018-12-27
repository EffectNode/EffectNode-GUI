<template>
  <g>
    <rect :fill="ui.fill" :width="ui.w" :height="ui.h" :x="ui.x" :y="ui.y"></rect>
    <text :width="ui.w" :height="ui.h" :x="0" :y="ui.y + 17 / 2">Remove</text>

  </g>
</template>

<script>
export default {
  props: {
    index: {},
    total: {},
    metaItem: {},
    svg: {},
    marginLeft: {}
  },
  data () {
    return {
      ui: {
        w: 500,
        h: 13,
        x: this.marginLeft + 0,
        y: this.index * 13 + 2 * this.index,
        fill: `hsl(${(this.index / this.total * 360).toFixed(0)}, 70%, 70%)`
      }
    }
  },
  methods: {
    hydrate () {

    },
    putback () {

    }
  }
}
</script>

<style>

</style>
