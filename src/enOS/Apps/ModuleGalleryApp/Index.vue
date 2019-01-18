<template>
  <div class="full quotes-app" >
    <TitleBar :portal="portal" @click="$emit('activated')" :uiAPI="uiAPI">
      Module Gallery
    </TitleBar>
    <div class="content-div" @click="$emit('activated')">
      <input placeholder="Search" type="text" v-model="searchTerm" @keyup.enter="load">
      <span class="linker" @click="load()">Load</span>
      <span class="linker" v-if="skip >= 100" @click="skip -= 100; load()">Back</span>
      <span class="linker" @click="skip += 100; load()">Next Page</span>
      <ul>
        <li :key="mm._id" v-for="mm in mods">
          <span class="linker" @click="clone(mm)">{{ mm.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import TitleBar from '../TitleBar/Index.vue'
// import Dimension from './Dimension/Index.vue'

export default {
  props: {
    uiAPI: {},
    portal: {}
  },
  components: {
    TitleBar
    // Dimension
  },
  data () {
    return {
      mods: [],
      searchTerm: '',
      skip: 0
    }
  },
  watch: {
    searchTerm () {
      this.skip = 0
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    clone () {
      window.alert('still making clone feature')
    },
    load () {
      this.uiAPI.RT.en.emit('load-module-gallery', { search: this.searchTerm, skip: this.skip, limit: 100 }, (resp) => {
        this.mods = resp.modules
      })
    }
  }
}
</script>

<style scoped>
@import url(../../jot.css);

.quotes-app{
  background: white;
  /* background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%); */
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  color: black;

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

.linker{
  text-decoration: underline;
  cursor: pointer;
}
</style>
