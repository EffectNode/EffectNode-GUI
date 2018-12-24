<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      {{ portal.win.name }}
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <div ref="mounter" class="full">

      </div>
      <!--
      <h1>Inputs</h1>
      <pre>{{ connectedInputs }}</pre>
      <h2>Outpus</h2>
      <pre>{{ connectedOutputs }}</pre> -->
      <!--
      {{ modules }}
      {{ connectors }}
      {{ pairs }}
      -->

      <!-- Lok Lok -->
      <!-- <SVGArea v-if="portal && ready" :Doc="Doc" :connectors="connectors" :modules="modules" :Data="Data" :root="root" :win="portal.win" /> -->
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar'
// import SVGArea from '../../SVGArea/Index.vue'
// import nlp from 'compromise'
// import csv from 'csvtojson'

export default {
  components: {
    TitleBar// ,
    // SVGArea
  },
  props: {
    uiAPI: {},
    portal: {}
  },
  created () {
    // this.$on('resize', ({ portal }) => {
    //   this.portal = portal
    // })
  },
  data () {
    return {
      Doc: false,
      Data: false,
      root: false,
      ready: false
      // portal: false
    }
  },
  methods: {
    init () {
      let { Doc, Data } = this.uiAPI.hive
      this.Doc = Doc
      this.Data = Data
      this.root = Doc.root
      this.ready = true

      // console.log('OMG', )

      this.$refs.mounter.appendChild(this.uiAPI.execEnv.Sys.$el)

      // return Hive.get({ doc: 'happy' }).then(({ Data, Doc }) => {
      //   this.Doc = Doc
      //   this.Data = Data
      //   this.root = Doc.root
      //   this.ready = true
      // })
    }
  },
  computed: {
    connectedInputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'input'
      })
    },
    connectedOutputs () {
      return this.connectors.filter((c) => {
        return c.socket.to && c.type === 'output'
      })
    },
    connectors () {
      if (this.root) {
        // let modIDs = this.root.modules.map(m => m.id)
        return this.root.connectors
        // .filter(c => {
        //   return modIDs.includes(c.mod.from) || modIDs.includes(c.mod.to)
        // })
      } else {
        return []
      }
    },
    modules () {
      if (this.root) {
        return this.root.modules
      } else {
        return []
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
@import url(../../jot.css);

.quotes-app{
  /* background: linear-gradient(90deg, #eef3ff 0%, #8aa3d4 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: black;
  background-image: radial-gradient( circle farthest-corner at 100% 100%, rgb(193, 234, 255) 0%, rgb(255, 255, 255) 90.1% );
/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  height: calc(100% - 30px);
  overflow: auto;
  /* -webkit-overflow-scrolling: touch;
  overflow: auto; */
}

.quotes-list{
  margin: 20px;
}
</style>
