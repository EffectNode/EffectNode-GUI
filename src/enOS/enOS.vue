<template>
  <Screen class="over-hidden">
    <Portals v-if="uiAPI" :uiAPI="uiAPI">
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
import * as API from '@/enOS/data/API'

Vue.component('vue-draggable-resizable', VueDraggableResizable)

export default {
  components: {
    Screen,
    Portals
  },
  data () {
    return {
      uiAPI: false
    }
  },
  async mounted () {
    if (!this.$route.params.projectID || this.$route.params.projectID === '') {
      this.$router.push('/menu')
      return
    }
    // this.$router.push(`/enOS/${this.$route.params.projectID}`)

    this.startENOS({ _id: this.$route.params.projectID })
    // this.loadProject({ projectSlug: 123 })
  },
  methods: {
    async startENOS ({ _id }) {
      await API.checkLogin()
      Services.loadProject({ projectID: _id, userID: API.myself._id }).then((uiAPI) => {
        this.mode = 'loading'
        this.uiAPI = uiAPI
        this.$nextTick(() => {
          this.mode = 'enOS'
        })
      })
    }
  }
}
</script>

<style>
/*
@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
} */
</style>

<style scoped>
@import url(./jot.css);
.over-hidden{
  overflow: hidden;
}
.avoid-clicks {
  pointer-events: none;
}

.word-lite {
  color: white;
}

</style>
