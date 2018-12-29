<template>
  <div>
    <div class="adders" v-if="currentMod">
      <div v-if="currentMod.meta.length > 0">
        <button @click="addTimelineTrack()">Add TimeTrack</button>
        <span v-if="currentMod.meta.length === 1">
          <button @click="removeMeta(currentMod.meta[0])">Reset</button>
        </span>
        <span v-if="currentMod.meta.length >= 1">
          Total Length: <input type="text" :value="currentMod.meta[0].value.totalTime" @input="updateTime" />
          <button @click="resetAll">reset all</button>
        </span>
      </div>
    </div>
    <div>
      <Timeline v-if="currentMod" :currentMod="currentMod" :saveMeta="saveMeta" :outputs="outputs" @saveModule="saveModule" @removeMeta="removeMeta" :refresher="refresher" :meta="currentMod.meta" :win="portal.win">
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
      refresher: true
    }
  },
  methods: {
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
    resetAll () {
      if (window.prompt('reset all? type reset to confirm.') === 'reset') {
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
.adders{
  height: 30px;
}
</style>
