<template>
<div>

  <div class="title">
    My Entries
  </div>
  <div>
    <br />
    Search: <input type="text" v-model="query">
  </div>
  <ul v-if="myEntries">
    <li class="enter-archive" v-if="entry" :key="entry.eID" v-for="(entry) in filterEntries({ query })">
      <div class="hover-highlight"  @click="editEntry({ entry: entry })">
        <div class="sub-title">
          {{ entry.eID }}
        </div>
        <div class="item-desc">({{ entry.eType }})</div>
        <div class="item-desc">{{ entry.note }}</div>
      </div>

      <button class="trash" @click="removeEntry({ entry })">Remove</button>
    </li>
  </ul>

  <div class="title" v-if="myTrash.length > 0">
    Trashed Entries<button @click="emptyEntryTrash">Empty</button>
  </div>

  <ul v-if="myTrash.length > 0">
    <li class="restore" v-if="entry" :key="entry.eID" v-for="(entry) in myTrash">
      <div class="hover-highlight"  @click="restoreTrash({ entry: entry })">
        <div class="sub-title">
          {{ entry.eID }}
        </div>
        <div class="item-desc">({{ entry.eType }})</div>
        <div class="item-desc">{{ entry.note }}</div>
      </div>
    </li>
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
      query: '',
      Hot
    }
  },
  methods: {
    filterEntries () {
      if (this.query) {
        let splitted = this.query.split(' ')
        let src = this.myEntries
        var q = splitted.shift()

        while (q) {
          src = src.filter(
            e =>
              e.note.toUpperCase().indexOf(q.toUpperCase()) !== -1 ||
              e.eType.toUpperCase().indexOf(q.toUpperCase()) !== -1 ||
              e.eID.toUpperCase().indexOf(q.toUpperCase()) !== -1
          )
          q = splitted.shift()
        }

        return src.slice().reverse()
      } else {
        return this.myEntries
      }
    },
    editEntry ({ entry }) {
      this.$emit('edit-entry', { entry })
      this.$forceUpdate()
    },
    restoreTrash ({ entry }) {
      Hot.restoreEntry({ root: this.root, cID: this.cID, eID: entry.eID })
      this.$emit('send')
    },
    removeEntry ({ entry }) {
      Hot.removeEntry({ root: this.root, cID: this.cID, eID: entry.eID })
      this.$emit('send')
    },
    emptyEntryTrash () {
      if (!window.confirm('confirm emty trash?')) {
        return
      }
      if (!window.confirm('reallly confirm delete? this is irreversible')) {
        return
      }
      if (!window.confirm('final confirm....')) {
        return
      }

      Hot.emptyEntryTrash({ collection: this.collection })
      this.$emit('send')
    }
  },
  computed: {
    myEntries () {
      return Hot.getEntriesOfCollection({ root: this.root, cID: this.cID })
    },
    myTrash () {
      return Hot.getEntryTrash({ root: this.root, cID: this.cID })
    }
  }
}
</script>

<style scoped>
@import url(../Shared.css);

</style>
