<template>
  <div class="time-machine">
    <input v-show="false" ref="time-machine-loader" type="file" @change="loadTimeMachine" />
    <button @click="format">Rest All</button>

    <button @click="restoreTimeMachine">Restore All Snapshot</button>
    <button @click="backupTimeMachine">Backup All Snapshot</button>
    <input type='range' v-model="timetravel" @change="() => {}" :min="0" :max="backups.length - 1" v-if="backups.length > 0" />
    <button @click="clickSnapShot">Take 1 Snapshot</button>
    <select @input="() => {}" v-model="timetravel">
      <option :key="backup.date" :value="iBackup" v-for="(backup, iBackup) in backups">{{ fromNow(backup.date) }}</option>
    </select>
  </div>
</template>

<script>
import moment from 'moment'
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
      timetravel: 0 // this.rootDoc.backups.length - 1
    }
  },
  watch: {
    timetravel (newVal, oldVal) {
      this.travel({ takeSnapshot: oldVal === 0 })
    },
    rootDoc () {
      this.timetravel = 0 // this.rootDoc.backups.length - 1
    }
  },
  computed: {
    // timetravel: {
    //   get () {
    //     return this.rootDoc.timetravel || 0
    //   },
    //   set (v) {
    //     this.rootDoc.timetravel = v
    //   }
    // },
    backups: {
      get () {
        return this.rootDoc.backups.sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
        })
      },
      set (v) {
        this.rootDoc.backups = v
      }
    }
  },
  mounted () {
    // make the moments from now (how long ago) live.
    setInterval(() => {
      this.$forceUpdate()
    }, 1000 * 60)
  },
  methods: {
    fromNow (date) {
      return moment(new Date(date)).fromNow() + ' ' + moment(new Date(date)).format('MMM Do YYYY, h:mm:ss a')
    },
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
        this.timetravel = 0 // this.rootDoc.backups.length - 1

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
        this.timetravel = 0 // this.rootDoc.backups.length - 1
        this.$emit('compile')
      })
    },
    takeSnapshot () {
      this.rootDoc.now.date = new Date().toString()
      this.rootDoc.backups.unshift(JSON.parse(JSON.stringify(this.rootDoc.now)))
      this.$nextTick(() => {
        this.$emit('just-save')
      })
    },
    travel ({ takeSnapshot }) {
      if (takeSnapshot) {
        this.takeSnapshot()
      }
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
