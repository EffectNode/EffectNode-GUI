<template>
  <div>
    <div class="adders" v-if="currentMod">
      <div v-if="currentMod.meta.length > 0">
        <span class="linker" @click="addTimelineTrack()">Add TimeTrack</span>
        <span v-if="currentMod.meta.length === 1">
          <span class="linker" @click="removeMeta(currentMod.meta[0])">Reset</span>
        </span>
        <span v-if="currentMod.meta.length >= 1">
          Total Length: <input type="text" :value="currentMod.meta[0].value.totalTime" @input="updateTime" />
          <span class="linker" @click="removeAll">Remove all</span>
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
</style>
