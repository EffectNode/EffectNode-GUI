<template>
  <div class="myhome">
    <HomeTitle></HomeTitle>
    <NavMenu :mode="mode" @mode="(v) => { mode = v }"></NavMenu>
    <MyProjects v-if="mode === 'myprojects'"></MyProjects>
    <NewProjects v-if="mode === 'newprojects'"></NewProjects>
    <MyHomeFooter></MyHomeFooter>
  </div>
</template>

<script>
import HomeTitle from './Compos/HomeTitle.vue'
import MyProjects from './Compos/MyProjects.vue'
import NewProjects from './Compos/NewProjects.vue'
import NavMenu from './Compos/NavMenu.vue'
import MyHomeFooter from './Compos/MyHomeFooter.vue'

export default {
  components: {
    HomeTitle,
    MyProjects,
    MyHomeFooter,
    NewProjects,
    NavMenu
  },
  data () {
    return {
      mode: 'myprojects'
    }
  }
}
</script>

<style>
  .myhome .sys-constraint {
    width: calc(100% - 15px * 2);
    margin: 0px auto;
  }
  @media screen and (min-width: 413px) {
    .myhome .sys-constraint {
      width: calc(100% - 15px * 2);
    }
  }
  @media screen and (min-width: 767px) {
    .myhome .sys-constraint {
      width: calc(700px);
    }
  }
  @media screen and (min-width: 959px) {
    .myhome .sys-constraint {
      width: calc(850px);
    }
  }
  @media screen and (min-width: 1440px) {
    .myhome .sys-constraint {
      width: calc(1200px);
    }
  }
</style>

<style scoped>

</style>
