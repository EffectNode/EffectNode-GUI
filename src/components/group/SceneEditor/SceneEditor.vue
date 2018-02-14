<template>
  <div>
    Scene Editor
    <button @click="() => { $emit('compile') }">compile</button>
  </div>
</template>

<script>
export default {
  props: {
    doc: {
    },
    output: {
      default () {
        return {
          js: '',
          html: 'Loading....'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
