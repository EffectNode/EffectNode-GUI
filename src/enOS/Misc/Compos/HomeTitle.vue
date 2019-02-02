<template>
  <div>
    <SharedTitle>
      <div class="middle" slot="left">
        <router-link to="/"><img class="logo" src="../img/en.svg" alt=""></router-link>
        <a href="https://docs.effectnode.com" target="_blank" class="link docs">API & Docs</a>
      </div>
      <div slot="center">
        My Home
      </div>
      <div slot="right">
        <span @click="logout">Logout</span>
      </div>
    </SharedTitle>
  </div>
</template>

<script>
import SharedTitle from './SharedTitle'
import * as API from '@/enOS/data/API'
export default {
  components: {
    SharedTitle
  },
  data () {
    return {
      API
    }
  },
  mounted () {
  },
  methods: {
    logout () {
      API.logout()
      window.location.assign('/')
    }
  }
}
</script>

<style scoped>
.logo{
  height: 28px;
}
.middle{
  display: flex;
  align-items: center;
}

.docs{
  color: black;
  text-align: right;
  line-height: 28px;
  width: 100%;
  cursor: pointer;
}
.link.docs{
  display: inline-block;
  height: 37px;
}
</style>
