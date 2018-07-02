<template>
<div>
  <div class="title add-cursor" @click="showCreateForm = !showCreateForm">
    Create a new Entry <img src="../img/circle-add.svg" class="add-icon add-cursor" alt="">
  </div>

   <ul v-if="showCreateForm">
    <li class="font">
      ID:
      <br />
      <input type="text" class="itemID" v-model="newEID" @input="() => { isDuplicated = checkDuplicated({ eID: newEID }) }">
      <br />
      <button @click="newEID = Hot.makeID()">Make Random ID</button>
      <br />
      <span class="is-taken" v-if="isDuplicated">This Item ID is taken.</span>
      <br />
    </li>
    <li class="font">
      Item Type:
      <ul class="templateSection">
        <li :key="nc.cType" v-for="(nc) in entryTypes">
          <div class="hover-highlight" :class="{ 'chosen': newEType === nc.eType }" @click="newEType = nc.eType;">
            <div class="sub-title">{{ nc.name }}
            </div>
            <div class="item-desc">{{ nc.desc }}</div>
          </div>
        </li>
      </ul>
    </li>

    <li class="font">
      Note:
      <br />
      <input type="text" class="itemID" v-model="newNote" placeholder="Note for this item">
    </li>

    <div class="font">
      <br />
      <button @click="addNewEntry">Add Item</button>
    </div>
  </ul>
</div>
</template>

<script>
import * as Hot from '../HotData.js'
export default {
  props: {
    root: {},
    cID: {},
    collection: {}
  },
  data () {
    return {
      isDuplicated: false,
      showCreateForm: Hot.getEntriesOfCollection({ root: this.root, cID: this.cID }).length === 0,
      entryTypes: Hot.entryTypes,
      newEType: Hot.entryTypes[0].eType,
      newEID: Hot.makeID(),
      newNote: '',
      Hot
    }
  },
  methods: {
    checkDuplicated ({ eID }) {
      return !!Hot.getEntryBycIDeID({ root: this.root, cID: this.cID, eID })
    },
    addNewEntry () {
      if (this.checkDuplicated({ eID: this.newEID })) {
        this.isDuplicated = true
        window.alert('id is taken')
        return
      }
      if (!this.newEID) {
        window.alert('require ID')
        return
      }
      var newEntry = Hot.createEntry({ cID: this.cID, eID: this.newEID, eType: this.newEType, note: this.newNote })
      Hot.addEntry({ root: this.root, cID: this.cID, entry: newEntry })
      this.$emit('send')
      this.isDuplicated = false
      this.showCreateForm = false
      this.newNote = ''
      this.newEID = Hot.makeID()
    }
  },
  computed: {
  }
}
</script>

<style scoped>
@import url(../Shared.css);

.add-cursor{
  cursor: url('../img/plus-arrow.svg'), pointer;
}

.templateSection *{
  cursor: url('../img/plus-arrow.svg'), pointer;
}

.chosen{
  color: blue;
}

</style>
