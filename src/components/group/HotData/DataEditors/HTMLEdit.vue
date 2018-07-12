<template>
<div class="full" ref="full">
  <div class="row" v-if="entryRT && entryRT.data.inited">
    <div class="col-vs">
      HTML, Try a Stle Tag 😎
      <ACE
        v-model="entryRT.data.html"
        :readOnly="false"
        :filepath="'@/fun.html'"
        @close="() => {}"
        @open="() => { }"
        @save="() => { $emit('send') }"
        @input="(v) => { entryRT.data.markdown = v; saveHTML(v); $emit('send');  }"
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
import * as Hot from '../HotData.js'
export default {
  props: {
    root: {},
    cID: {},
    eID: {}
  },
  components: {
    ACE
  },
  data () {
    return {
      Hot,
      entryRT: false,
      height: window.innerHeight
    }
  },
  watch: {
    root () {
      // realtime = RT
      this.entryRT = Hot.getEntryBycIDeID({ root: this.root, cID: this.cID, eID: this.eID })
    }
  },
  mounted () {
    this.entryRT = Hot.getEntryBycIDeID({ root: this.root, cID: this.cID, eID: this.eID })
    this.makeHeight()
    window.addEventListener('resize', this.makeHeight.bind(this), false)
    this.initData()
  },
  methods: {
    makeHeight () {
      if (!this.$refs['full']) {
        return
      }
      this.height = this.$refs['full'].getBoundingClientRect().height
    },
    saveHTML (v) {
      this.entryRT.data.html = v
    },
    initData () {
      if (!this.entryRT.data.inited) {
        this.entryRT.data.inited = true
        this.entryRT.data.html = `
<style>
h1 {
  text-decoration: underline;
}
</style>
`
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped>
@import url(../Shared.css);

.full{
  height: calc(100vh - 250px);
  width: calc(100% - 390px);
  max-width: 1200px;
}
.row{
  width: 100%;
  display: flex;
  flex-direction: column;
}

.col-vs,
.col-fs{
  width: 100%;
  height: 100%;
}

</style>
