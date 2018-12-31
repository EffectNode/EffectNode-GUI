<template>
  <div class="marginer">
    <div class="adders" v-if="currentMod">
      <div v-if="currentMod.meta.length > 0">
        <button @click="addRange()">Add value slider</button>
        <button @click="addColor()">Add color picker</button>
        <span v-if="currentMod.meta.length === 1">
          <button @click="removeMeta(currentMod.meta[0])">Reset</button>
        </span>
      </div>
    </div>
    <div>
      <div :key="m.id + 'color'" v-for="(m, mi) in currentMod.meta">
        <div v-if="m.type === 'color'">
          <button @click="removeMeta(m)">x</button>
          <span>{{ m.type }}</span>
          <input v-model="m.label" @input="saveMeta(m, mi)" style="width: 100px;" />
          <input type="color" v-model="m.value" @input="saveMeta(m, mi)"  />
          <input type="text" v-model="m.value" @input="saveMeta(m, mi)" style="width: 45px;" />
        </div>
        <div v-if="m.type === 'range'">
          <button @click="removeMeta(m)">x</button>
          <span>{{ m.type }}</span>
          <input v-model="m.label" @input="saveMeta(m, mi)" style="width: 100px;" />
          <input type="range" v-model="m.value" :step="m.step" :min="m.min" :max="m.max" @input="saveMeta(m, mi)"  />
          <input type="number" v-model="m.value" :step="m.step" :min="m.min" :max="m.max" @input="saveMeta(m, mi)" style="width: 45px;" />
          <input type="text" v-model="m.min" :step="m.step" @input="saveMeta(m, mi)" style="width: 40px;" />
          <input type="text" v-model="m.max" :step="m.step" @input="saveMeta(m, mi)" style="width: 40px;" />
          <input type="number" v-model="m.step" :step="0.00000001" :min="m.min" :max="m.max" @input="saveMeta(m, mi)" style="width: 45px;" />

        </div>
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
    currentMod: {}
  },
  data () {
    return {
      refresher: true
    }
  },
  methods: {
    saveMeta (v, mi) {
      this.$emit('saveMeta', { m: v, mi })
    },
    removeMeta (v) {
      this.refresher = false
      this.$emit('removeMeta', v)
      this.$nextTick(() => {
        this.refresher = true
      })
    },
    addRange (v) {
      this.$emit('addRange', v)
    },
    addColor (v) {
      this.$emit('addColor', v)
    }
  }
}
</script>

<style scoped>
.adders{
  height: 30px;
}
.marginer{
  width: 90%;
  margin: 20px 5%;
}
</style>
