<template>
<div>
  <div class="title">
     <span class="link"  @click="$emit('home')">Home</span>
     <span class="" v-if="collection && !entry">
        / <input type="text" class="cID editable" v-model="cID" @input="updateCID" />
     </span>

     <span class="" v-if="entry">
        / <span class="link" @click="$emit('enter-collection', { collection })">{{cID}}</span>
        / <input type="text" class="eID editable" v-model="eID" @input="updateEID" />
      </span>

     <br />
     <span class="alert" v-if="checkDuplicatedCID({ cID })">CollectionID "{{ cID }}" is taken.</span>
     <span class="alert" v-if="cID === ''">Collection ID Cannot be empty.</span>

     <span class="alert" v-if="checkDuplicatedEID({ eID })">EntryID "{{ eID }}" is taken.</span>
     <span class="alert" v-if="eID === ''">Entry ID Cannot be empty.</span>
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
    },
    entry: {
      default () {
        return false
      }
    }
  },
  data () {
    let data = {
      cID: this.collection.cID,
      eID: ''
    }
    if (this.entry) {
      data = {
        ...data,
        eID: this.entry.eID
      }
    }
    return data
  },
  watch: {
    root () {
      this.cID = this.collection.cID
      this.eID = this.entry.eID
    },
    collection () {
      this.cID = this.collection.cID
      this.eID = this.entry.eID
    },
    entry () {
      this.cID = this.collection.cID
      this.eID = this.entry.eID
    }
  },
  mounted () {
    this.cID = this.collection.cID
    this.eID = this.entry.eID
  },
  methods: {
    checkDuplicatedEID ({ eID }) {
      return !!Hot.getEntryBycIDeID({ root: this.root, cID: this.cID, eID }) && this.eID !== this.entry.eID
    },
    checkDuplicatedCID ({ cID }) {
      return !!Hot.getCollectionById({ root: this.root, cID: cID }) && this.cID !== this.collection.cID
    },
    updateCID () {
      if (!this.cID) {
        return
      }
      if (this.checkDuplicatedCID({ cID: this.cID })) {
        return
      }
      this.collection.cID = this.cID
      Hot.renameAllEntries({ root: this.root, cID: this.cID })
      this.$emit('send')
    },
    updateEID () {
      if (!this.eID) {
        return
      }
      if (this.checkDuplicatedEID({ eID: this.eID })) {
        return
      }
      this.entry.eID = this.eID
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
  /* padding:5px; */
  border: 0px solid #ccc;
  /* border-bottom: 4px solid #939393; */
  -webkit-border-radius: 0px;
  border-radius: 0px;
  font-size: 30px;

  font-family: 'Inconsolata-Bold', Arial, Helvetica, sans-serif;
  font-size: 40px;
  color: #939393;
  letter-spacing: -1.00001px;
  text-decoration: underline;
}

.eID{
  width: 300px;
  /* padding:5px; */
  border: 0px solid #ccc;
  /* border-bottom: 4px solid #939393; */
  -webkit-border-radius: 0px;
  border-radius: 0px;
  font-size: 30px;

  font-family: 'Inconsolata-Bold', Arial, Helvetica, sans-serif;
  font-size: 40px;
  color: #939393;
  letter-spacing: -1.00001px;
  text-decoration: underline;
}

.eID:focus,
.cID:focus{
  outline: none;
}

.alert{
  font-size: 12px;
  color: red;
}
</style>
