<template>
  <div>
    <div class="adders" v-if="currentMod">
      <div v-if="currentMod.meta.length > 0">
        <span class="linker" @click="addTimelineTrack()">Add TimeTrack</span>
        <span v-if="currentMod.meta.length === 1">
          <span class="linker" @click="removeMeta(currentMod.meta[0])">Reset</span>
        </span>
        <span class="linker" @click="timeMode = 'listen'">Play</span>
        <span v-if="currentMod.meta.length >= 1">
          <span class="linker" @click="removeAll">Remove all</span>
          Total Length: <input class="values" type="text" :value="currentMod.meta[0].value.totalTime" @input="updateTime" />
          Zoom: <input class="values" type="text" v-model="baseWidth" @input="updateZoom" />
          Auto play:<input v-model="autoRestorePlay" type="checkbox" />
        </span>
      </div>
    </div>
    <div>
      <Timeline v-if="currentMod && refresher" :baseWidth="baseWidth" @timeMode="(v) => { timeMode = v }" :timeMode="timeMode" :currentMod="currentMod" :saveMeta="saveMeta" :outputs="outputs" @saveModule="saveModule" @removeMeta="removeMeta" :refresher="refresher" :meta="currentMod.meta" :win="portal.win">
      </Timeline>
    </div>
  </div>
</template>

<script>
import Timeline from './Timeline'

export default {
  components: {
    Timeline
  },
  props: {
    outputs: {},
    portal: {},
    currentMod: {}
  },
  data () {
    return {
      autoRestorePlay: true,
      baseWidth: 400,
      timeMode: 'listen',
      refresher: true
    }
  },
  mounted () {
    window[this.currentMod.id + '-timeMode'] = this.timeMode
  },
  beforeDestroy () {
    window[this.currentMod.id + '-timeMode'] = this.timeMode = 'listen'
  },
  watch: {
    active () {
      if (this.active === false && this.autoRestorePlay) {
        window[this.currentMod.id + '-timeMode'] = this.timeMode = 'listen'
      }
    },
    timeMode () {
      window[this.currentMod.id + '-timeMode'] = this.timeMode
    }
  },
  computed: {
    active () {
      if (this.portal && this.portal.win) {
        console.log(this.portal.win.active)
        return this.portal.win.active
      } else {
        return false
      }
    }
  },
  methods: {
    updateZoom () {
      this.refresher = false
      this.$nextTick(() => {
        this.refresher = true
      })
    },
    updateTime (evt) {
      let val = evt.target.value

      this.currentMod.meta.forEach((m) => {
        m.value.totalTime = val
      })

      this.refresher = false
      this.$nextTick(() => {
        this.refresher = true
      })
    },
    removeAll () {
      if (window.prompt('reset all? type remove-all to confirm.') === 'remove-all') {
        this.currentMod.meta = []
        this.saveModule()
      }
    },
    saveModule () {
      this.$emit('saveModule')
    },
    saveMeta ({ v, mi }) {
      this.$emit('saveMeta', { v, mi })
    },
    removeMeta (v) {
      this.refresher = false
      this.$emit('removeMeta', v)
      this.$nextTick(() => {
        this.refresher = true
      })
    },
    addTimelineTrack (v) {
      this.refresher = false
      this.$emit('addTimelineTrack', v)
      this.$nextTick(() => {
        this.refresher = true
      })
    }
  }
}
</script>

<style scoped>
.linker{
  text-decoration: underline;
  cursor: pointer;
  margin-left: 5px;
}
.adders{
  height: 30px;
}
.values{
  width: 50px;
}
</style>
