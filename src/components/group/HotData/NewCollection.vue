<template>
<div v-if="root">
  <div class="title add-cursor" @click="showInput = !showInput">
    Create a Collection <img src="./img/circle-add.svg" class="add-icon add-cursor" alt="">
  </div>

   <ul v-if="showInput">
    <li class="font">
      ID:
      <br />
      <input type="text" class="itemID" v-model="newCID">
      <br />
      <span class="is-taken" v-if="checkDuplicated({ cID: newCID })">This ID is taken.</span>
    </li>

    <div class="font">
      <!-- Description:
      <br />
      <textarea class="desc" rows="6" v-model="newDesc"></textarea> -->
      <button @click="addNewCollection">submit</button>
    </div>
  </ul>
  <!-- <pre>{{ root }}</pre> -->
</div>
</template>

<script>
import * as Hot from './HotData.js'
export default {
  props: {
    root: {
    }
  },
  components: {
  },
  data () {
    return {
      showInput: Hot.getCollections({ root: this.root }).length === 0,
      newDesc: '',
      newCID: ''
    }
  },
  methods: {
    checkDuplicated ({ cID }) {
      return !!Hot.getCollectionById({ root: this.root, cID })
    },
    addNewCollection () {
      if (this.checkDuplicated({ cID: this.newCID })) {
        window.alert('id is taken')
        return
      }
      if (!this.newCID) {
        window.alert('require ID')
        return
      }
      var newCollection = Hot.createCollection({ cID: this.newCID, desc: this.newDesc })
      Hot.addCollection({ root: this.root, collection: newCollection })
      this.$emit('send')
      this.showInput = false
      this.newCID = ''
      this.newDesc = ''
    }
  }
}
</script>

<style scoped>
@import url(./Shared.css);
</style>
