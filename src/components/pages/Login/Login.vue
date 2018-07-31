<template>
<div>
  <button @click="loginGoogle">Login Google</button>
  <button @click="loginFacebook">Login Facebook</button>
  <button @click="loginGithub">Login Github</button>
  <button @click="logout">Logout</button>
  <pre>{{ state }}</pre>
</div>
</template>

<script>
import * as Fire from '@/firebase.js'
export default {
  data () {
    return {
      Fire,
      state: Fire.state
    }
  },
  methods: {
    loginGoogle () {
      Fire.loginGoogle().then(() => {
        this.$forceUpdate()
        // this.$router.push('/test')
      }, () => {
      })
    },
    loginFacebook () {
      Fire.loginFacebook().then(() => {
        this.$forceUpdate()
        // this.$router.push('/test')
      }, () => {
      })
    },
    loginGithub () {
      Fire.loginGithub().then(() => {
        this.$forceUpdate()
        // this.$router.push('/test')
      }, () => {
      })
    },
    logout () {
      Fire.logout().then(() => {
        this.$forceUpdate()
        // this.$router.push('/test')
      }, () => {
      })
    }
  },
  mounted () {
    // Fire.state.$forceUpdate = () => {
    //   this.$forceUpdate()
    // }
  }
}
</script>

<style>

</style>
