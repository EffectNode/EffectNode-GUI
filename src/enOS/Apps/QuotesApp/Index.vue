<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal">
      QuotesApp
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      Lok Lok
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar'
// import nlp from 'compromise'
// import csv from 'csvtojson'

export default {
  props: {
    portal: {}
  },
  components: {
    TitleBar
  },
  data () {
    return {
    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style scoped>
@import url(../../jot.css);

.quotes-app{
  background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%);
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: white;

/* background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% ); */
}

.content-div{
  height: calc(100% - 30px);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}

.quotes-list{
  margin: 20px;
}
</style>
