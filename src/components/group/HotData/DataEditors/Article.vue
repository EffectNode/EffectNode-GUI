<template>
<div class="full" ref="full">
  <div class="row" v-if="entryRT && entryRT.data.inited">
    <div class="col-vs">
      Markdown Article
      <ACE
        v-model="entryRT.data.markdown"
        :readOnly="false"
        :filepath="'@/fun.md'"
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
import marked from 'marked'
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
      this.entryRT.data.html = marked(v)
    },
    initData () {
      if (!this.entryRT.data.inited) {
        this.entryRT.data.inited = true
        this.entryRT.data.markdown =
`EffectNode.com
========================
EffectNode is very good for developers to make marketing campaign websites with 3D visual effects in shorter period of time.

1. Hot Data Injection per Keystoke....

2. Keystroke hot data is around 50x faster than save and reload to see updates in webpage.

3. Comes with 3D-Components Files, build 3D Visual Effect Faster and Easier.

4. Support realtime comiplation for Shader Codes for 3D Components.

5. Time Machine Auto backup.

6. Time Machine Instant Restore to view all chagnes that travels through time.

7.

`
        this.entryRT.data.html = ``
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
