<template>
  <div>
    <div class="adders">
      UI Controls
      <button @click="addRange()">Add Range</button>
      <button @click="addTimelineTrack()">Add Timeline</button>
    </div>
    <div v-if="hasTimeTrack">
      <Timeline :meta="currentMod.meta" :win="portal.win">
      </Timeline>
    </div>
    <div v-if="hasRange">
      <div :key="m.id" v-for="(m, mi) in currentMod.meta" v-if="m.type === 'range'">
        <button @click="removeMeta(m)">x</button>
        <span>{{ m.type }}</span>
        <input v-model="m.label" @input="saveMeta(m, mi)" style="width: 100px;" />
        <input type="range" v-model="m.value" :step="m.step" :min="m.min" :max="m.max" @input="saveMeta(m, mi)"  />
        <input type="number" v-model="m.value" :step="m.step" :min="m.min" :max="m.max" @input="saveMeta(m, mi)" style="width: 45px;" />
        <input type="text" v-model="m.min" :step="m.step" @input="saveMeta(m, mi)" style="width: 40px;" />
        <input type="text" v-model="m.max" :step="m.step" @input="saveMeta(m, mi)" style="width: 40px;" />
      </div>
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
    portal: {},
    hasTimeTrack: {},
    hasRange: {},
    currentMod: {}
  },
  methods: {
    saveMeta (v) {
      this.$emit('saveMeta', v)
    },
    removeMeta (v) {
      this.$emit('removeMeta', v)
    },
    addRange (v) {
      this.$emit('addRange', v)
    },
    addTimelineTrack (v) {
      this.$emit('addTimelineTrack', v)
    }
  }
}
</script>

<style scoped>
.adders{
  height: 30px;
}
</style>
