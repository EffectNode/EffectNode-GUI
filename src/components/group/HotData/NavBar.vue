<template>
<div>
  <div class="title">
     <span class="link"  @click="$emit('home')">← Home</span> /
     <span class=""><input type="text" class="cID editable" v-model="cID" @input="update" /></span>
     <br />
     <span class="alert" v-if="checkDuplicated({ cID })">"{{ cID }}" is taken.</span>
     <span class="alert" v-if="cID === ''">ID Cannot be empty.</span>
  </div>
</div>
</template>

<script>
import * as Hot from './HotData.js'
export default {
  props: {
    root: {
    },
    collection: {
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      cID: this.collection.cID
    }
  },
  mounted () {
  },
  methods: {
    checkDuplicated ({ cID }) {
      return !!Hot.getCollectionById({ root: this.root, cID: cID }) && this.cID !== this.collection.cID
    },
    update () {
      if (!this.cID) {
        return
      }
      if (this.checkDuplicated({ cID: this.cID })) {
        return
      }
      this.collection.cID = this.cID
      this.$emit('send')
    }
  }
}
</script>

<style scoped>
@import url(./Shared.css);
.link:hover{
  cursor: pointer;
  text-decoration: underline;
}

.cID{
  width: 300px;
  padding:5px;
  border: 0px solid #ccc;
  /* border-bottom: 4px solid #939393; */
  -webkit-border-radius: 0px;
  border-radius: 0px;
  font-size: 30px;

  font-family: 'InterUI-Bold', Arial, Helvetica, sans-serif;
  font-size: 40px;
  color: #939393;
  letter-spacing: 0;
  text-decoration: underline;
}
.cID:focus{
  outline: none;
}

.alert{
  font-size: 12px;
  color: red;
}
</style>
