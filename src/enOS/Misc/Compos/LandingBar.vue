<template>
  <div>
    <SharedTitle>
      <div class="middle" slot="left">
        <router-link to="/"><img class="logo" src="../img/en.svg" alt=""></router-link>
        <router-link to="/blog"  class="link docs">Inventor's Blog</router-link>
      </div>
      <div slot="center">
        Effect Node
      </div>
      <div slot="right">
        <a href="https://docs.effectnode.com" target="_blank" class="login"> Docs </a> &
        <router-link v-if="!myself" to="/auth" class="login">Login / Signup</router-link>
        <router-link v-if="myself" to="/profile" class="login">Profile</router-link>
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
      API,
      myself: false
    }
  },
  mounted () {
    API.checkLogin()
    setInterval(() => {
      this.myself = API.myself
      this.$forceUpdate()
    }, 100)
  },
  methods: {
    logout () {
      API.logout()
    }
  }
}
</script>

<style scoped>
.middle{
  display: flex;
  align-items: center;
}
.logo{
  height: 28px;
}

.login{
  color: black;
  text-align: right;
  line-height: 28px;
  width: 100%;

  cursor: pointer;
}

.login:hover{
  text-decoration: underline;
}

@media screen and (min-width: 500px) {
  .brand-name{
    font-size: 23px;
  }
  .login{
    font-size: 17px;
  }
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
