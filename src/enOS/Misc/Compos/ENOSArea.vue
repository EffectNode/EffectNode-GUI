<template>
  <div class="hello">
    <enos v-if="myApps" :single="true" :effectnode="true" :apps="myApps"></enos>
  </div>
</template>

<script>
import ENOSCompos from 'enos'

console.log(ENOSCompos)

export default {
  components: {
    ...ENOSCompos
  },
  data () {
    return {
      myApps: false
    }
  },
  mounted () {
    this.myApps = [
      // {
      //   windowTitle: 'Sample',
      //   compoName: 'samsam',
      //   App: require('./Apps/samsam.vue').default
      // }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  height: calc(100vmin - 57px);
}

</style>
