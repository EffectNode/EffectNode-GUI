<template>
<div class="full" ref="full" :class="{ 'vertical': vertical }">
  <div class="row" v-if="entry.data.inited">
    <div class="col">
      <ACE
        v-model="entry.data.vertexShader"
        :readOnly="false"
        :filepath="'@/fun.vert'"
        @close="() => {}"
        @open="() => { }"
        @save="() => { $emit('send') }"
        @input="(v) => { entry.data.vertexShader = v; $emit('send') }"
        theme="chrome"
        width="100%"
        :height="height + 'px'"
      />
    </div>
    <div class="col">
      <ACE
        v-model="entry.data.fragmentShader"
        :readOnly="false"
        :filepath="'@/fun.frag'"
        @close="() => {}"
        @open="() => { }"
        @save="() => { $emit('send') }"
        @input="(v) => { entry.data.fragmentShader = v; $emit('send') }"
        theme="chrome"
        width="100%"
        :height="height + 'px'"
      />
    </div>
  </div>
</div>
</template>

<script>
import ACE from '@/components/parts/EffectNode/ACE/ACE.vue'
export default {
  props: {
    root: {},
    collection: {},
    entry: {}
  },
  components: {
    ACE
  },
  data () {
    return {
      vertical: true,
      height: window.innerHeight
    }
  },
  mounted () {
    this.makeHeight()
    window.addEventListener('resize', this.makeHeight.bind(this), false)
    this.initData()
  },
  methods: {
    makeHeight () {
      this.height = this.$refs['full'].getBoundingClientRect().height
      if (this.vertical) {
        this.height = this.$refs['full'].getBoundingClientRect().height / 2
      }
    },
    initData () {
      if (!this.entry.data.inited) {
        this.entry.data.inited = true
        this.entry.data.vertexShader = `void main ( void ) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`
        this.entry.data.fragmentShader = `void main () {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}`
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped>
.full{
  height: calc(100vh - 150px);
  width: calc(100% - 390px);
  max-width: 1200px;
}
.row{
  width: 100%;
  display: flex;
}
.col {
  width: 50%;
}

.vertical .row{
  flex-direction: column;
}
.vertical .col{
  width: 100%;
  height: 50%;
  margin-bottom: 8px;
}
</style>
