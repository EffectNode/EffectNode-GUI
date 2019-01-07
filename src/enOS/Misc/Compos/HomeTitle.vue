<template>
  <div>
    <SharedTitle>
      <div slot="left">
        <a href="/"><img class="logo" src="../img/en.svg" alt=""></a>
      </div>
      <div slot="center">
        My Home
      </div>
      <div slot="right">
        Logout
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
    }
  }
}
</script>

<style scoped>
.logo{
  height: 28px;
}
</style>
