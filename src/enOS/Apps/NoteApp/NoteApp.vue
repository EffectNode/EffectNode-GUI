<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      NotePad
      <span class="warn" v-if="disconnected">
        Disconnected, reconnecting
      </span>
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <Note ref="note" :uiAPI="uiAPI" :collection="'rich-text-for-projects'" :noteID="uiAPI.projectID"></Note>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar/Index.vue'
import Note from './Note'
export default {
  props: {
    uiAPI: {},
    portal: {}
  },
  components: {
    TitleBar,
    Note
    // Dimension
  },
  data () {
    return {
    }
  },
  computed: {
    disconnected () {
      return this.uiAPI.RT.shareDB.disconnected
    }
  },
  mounted () {
    this.uiAPI.RT.shareDB.emit('up/create-doc-for-project', { projectID: this.uiAPI.projectID }, () => {
      console.log('ready rich text')
    })
  },
  methods: {

  }
}
</script>

<style scoped>
@import url(../../jot.css);

.warn{
  color: red;
}

.quotes-app{
  background: white;
  /* background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: white;

/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  height: calc(100% - 30px);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  position: relative;
}

.quotes-list{
  margin: 20px;
}

.iframe{
  width: 100%;
  height: calc(100%);
}
</style>
