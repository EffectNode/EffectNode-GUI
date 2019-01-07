<template>
  <div>
    <SharedTitle>
      <div slot="left">
        <a href="/"><img class="logo" src="../img/en.svg" alt=""></a>
      </div>
      <div slot="center">
        Effect Node
      </div>
      <div slot="right">
        <a v-if="!myself" href="/auth" class="login">Login / Signup</a>
        <a v-if="myself" href="/profile" class="login">My Home</a>
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

</style>
