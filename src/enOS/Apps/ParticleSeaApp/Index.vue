<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal"  @click="$emit('activated')" :uiAPI="uiAPI">
      Particle Sea
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <ParticleSea ref="dimesnion"></ParticleSea>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar'
import ParticleSea from './ParticleSea/Index.vue'

export default {
  props: {
    uiAPI: {},
    portal: {}
  },
  components: {
    TitleBar,
    ParticleSea
  },
  data () {
    return {
    }
  },
  watch: {
  },
  mounted () {

  },
  methods: {

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
  position: relative;
}

.quotes-list{
  margin: 20px;
}
</style>
