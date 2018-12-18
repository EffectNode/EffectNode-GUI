<template>
  <Screen class="over-hidden">
    <Portals v-if="ready" :uiAPI="uiAPI">
    </Portals>
  </Screen>
</template>

<script>
import * as Services from '@/enOS/data/services.js'
import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'web-animations-js'
import Screen from '@/enOS/Screen'
import Portals from '@/enOS/Portals'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

export default {
  components: {
    Screen,
    Portals
  },
  data () {
    return {
      ready: false,
      uiAPI: false
    }
  },
  mounted () {
    this.loadProject({ projectID: '123' })
  },
  methods: {
    loadProject ({ projectID }) {
      Services.init({ projectID }).then((api) => {
        this.uiAPI = api
        this.ready = true
      })
    }
  }
}
</script>

<style scoped>
@import url(./jot.css);
.over-hidden{
  overflow: hidden;
}
</style>
