<template>
<div>
  <div class="two-sides">
    <button @click="close()">Close</button>
    <button @click="removeText({ info }); $emit('pulse-remove', info); $emit('pulse-backup', info); ">
      Remove Text
    </button>
  </div>
  <textarea ref="ta" autofocus="true" @input="$emit('pulse-update', info)" class="ta" :placeholder="'Please enter some text here....'" v-model="info.text" id="" cols="30" rows="10"></textarea>
  <br />
  Word Box Width<input type="range" @input="$emit('pulse-update', info)" v-model="info.width" :min="100" :max="1000" :step="1">
  <br />
  <label for="">
    Transparent Background
    <input type="checkbox" v-model="info.transparent">
  </label>

</div>
</template>

<script>
export default {
  props: {
    root: {},
    current: {},
    info: {}
  },
  methods: {
    removeText ({ info }) {
      this.root.state.words.forEach((word, key) => {
        if (word.id === info.id) {
          this.root.state.words.splice(key, 1)
          this.current.data = false
          this.current.mesh = false

          this.root.state.restore = this.root.state.restore || []
          this.root.state.restore.push(word)
        }
      })
      this.$emit('pulse-remove', this.info)
    },
    close () {
      this.current.data = false
      this.current.mesh = false
    }
  }
}
</script>

<style scoped>
.ta{
  font-size: 17px;
  width: 100%;
}

.two-sides{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
