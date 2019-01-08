<template>
  <div class="sys-constraint">
    <div class="title">
      <span class="linker" :class="{ active: mode === 'newprojects' }" @click="$emit('mode', 'newprojects')">Create Project</span>
      <span class="linker" :class="{ active: mode === 'myprojects' }" @click="$emit('mode', 'myprojects')">My Projects</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mode: {}
  }
}
</script>

<style scoped>
.linker{
  cursor: pointer;
  color: grey;
}
.linker.active{
  color: #31b593;
  text-decoration: underline;
}
.title{
  font-size: 30px;
  padding: 20px 0px;
}
</style>
