<template>
  <div class="time-machine">
    <input v-show="false" ref="time-machine-loader" type="file" @change="loadTimeMachine" />
    <button @click="format">Rest All</button>

    <button @click="restoreTimeMachine">Restore Time Machine</button>
    <button @click="backupTimeMachine">Backup Time Machine</button>
    <input type='range' v-model="timetravel" @change="travel" :min="0" :max="backups.length - 1" v-if="backups.length > 0" />
    <button @click="clickSnapShot">Take Snapshot</button>
    <select @input="travel" v-model="timetravel">
      <option :key="backup.date" :value="iBackup" v-for="(backup, iBackup) in backups">{{ backup.date }}</option>
    </select>
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
    format () {
      if (window.confirm('format?') && window.confirm('are you sure?')) {
        this.$emit('load-root', require('./samples/animation.json'))
      }
    },
    loadTimeMachine (evt) {
      var file = evt.target.files[0]
      var reader = new FileReader()
      reader.onload = () => {
        try {
          this.$emit('load-root', JSON.parse(reader.result))
        } catch (e) {
          console.log('file reader error')
        }
      }
      reader.readAsText(file)
    },
    restoreTimeMachine () {
      if (this.$refs['time-machine-loader']) {
        this.$refs['time-machine-loader'].click()
      }
    },
    backupTimeMachine () {
      this.takeSnapshot()
      this.$nextTick(() => {
        this.timetravel = this.rootDoc.backups.length - 1

        var json = JSON.stringify(this.rootDoc)
        var url = URL.createObjectURL(new Blob([json]), { type: 'application/json' })
        var anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'time-machine-backup@' + new Date() + '.json'
        anchor.click()
      })
    },
    clickSnapShot () {
      this.takeSnapshot()
      this.$nextTick(() => {
        this.timetravel = this.rootDoc.backups.length - 1
      })
    },
    takeSnapshot () {
      this.rootDoc.now.date = new Date().toString()
      this.rootDoc.backups.push(JSON.parse(JSON.stringify(this.rootDoc.now)))
    },
    travel () {
      var backup = this.backups[this.timetravel]
      if (backup) {
        this.$nextTick(() => {
          this.$emit('travel', backup)
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
