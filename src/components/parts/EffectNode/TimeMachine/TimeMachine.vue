<template>
  <div class="time-machine">
    <input v-show="false" ref="time-machine-loader" type="file" @input="loadTimeMachine" />
    <button @click="restoreTimeMachine">Restore Time Machine</button>
    <button @click="backupTimeMachine">Backup Time Machine</button>
    <input type='range' v-model="timetravel" @change="travel" :min="0" :max="backups.length - 1" v-if="backups.length > 0" />
    <button @click="clickSnapShot">Snapshot</button>
  </div>
</template>

<script>
export default {
  props: {
    rootDoc: {
      default () {
        return {
          now: {},
          backups: []
        }
      }
    }
  },
  data () {
    return {
      timetravel: (this.rootDoc.backups).length - 1
    }
  },
  watch: {
    rootDoc () {
      this.timetravel = (this.rootDoc.backups).length - 1
    },
    timetravel (newTime, oldTime) {
      if (oldTime === (this.rootDoc.backups.length - 1)) {
        this.takeSnapshot()
      }
    }
  },
  computed: {
    backups: {
      get () {
        return this.rootDoc.backups
      },
      set (v) {
        this.rootDoc.backups = v
      }
    }
  },
  methods: {
    loadTimeMachine () {

    },
    restoreTimeMachine () {

    },
    backupTimeMachine () {

    },
    clickSnapShot () {
      this.takeSnapshot()
      this.$nextTick(() => {
        this.timetravel = this.rootDoc.backups.length - 1
      })
    },
    takeSnapshot () {
      this.rootDoc.backups.push(JSON.stringify(this.rootDoc.now))
    },
    travel () {
      var backupStr = this.backups[this.timetravel]
      if (backupStr) {
        this.$nextTick(() => {
          this.$emit('travel', JSON.parse(backupStr))
        })
      }
    }
  }
}
</script>

<style scoped>
.time-machine{
  display: inline-block;
}
</style>
