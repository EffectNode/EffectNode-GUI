<template>
  <Screen v-if="ready" class="over-hidden">
    <Portals>
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
      ready: false
    }
  },
  mounted () {
    Services.init().then((api) => {
      Vue.prototype.$server = api
      this.ready = true
    })
  },
  methods: {

  }
}
</script>

<style scoped>
@import url(./jot.css);
.over-hidden{
  overflow: hidden;
}
</style>
