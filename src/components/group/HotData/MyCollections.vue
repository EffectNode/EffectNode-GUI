<template>
<div v-if="root">
  <div class="title">
    My Collections
  </div>
  <ul v-if="myCollections">
    <li class="enter-archive" v-if="coll" :key="coll.cID" v-for="(coll) in myCollections">
      <div class="hover-highlight"  @click="enter({ collection: coll })">
        <div class="sub-title">
          {{ coll.cID }}
        </div>
        <div class="item-desc">{{ coll.desc }}</div>
      </div>

      <button class="trash" @click="removeCollection({ collection: coll })">Remove</button>
    </li>
  </ul>
  <div v-if="trashedCollections.length > 0">
    <div class="title">
      Trashed Collections <button @click="emptyCollectionTrash()">Empty</button>
    </div>
    <ul >
      <li class="restore" v-if="coll" :key="coll.cID" v-for="(coll) in trashedCollections">
        <div class="hover-highlight"  @click="restoreCollection({ collection: coll })">
          <div class="sub-title">
            {{ coll.cID }}
          </div>
          <div class="item-desc">{{ coll.desc }}</div>
        </div>
      </li>
    </ul>
  </div>
  <!-- <pre>{{ root }}</pre> -->
</div>
</template>

<script>
import * as Hot from './HotData.js'

export default {
  props: {
    root: {}
  },
  data () {
    return {
      Hot
    }
  },
  methods: {
    emptyCollectionTrash () {
      if (!window.confirm('confirm emty trash?')) {
        return
      }
      if (!window.confirm('reallly confirm delete? this is irreversible')) {
        return
      }
      if (!window.confirm('final confirm....')) {
        return
      }

      Hot.emptyCollectionTrash({ root: this.root })
      this.$emit('send')
    },
    restoreCollection ({ collection }) {
      Hot.restoreCollection({ root: this.root, cID: collection.cID })
      this.$emit('send')
    },
    removeCollection ({ collection }) {
      Hot.removeCollection({ root: this.root, cID: collection.cID })
      this.$emit('send')
    },
    enter ({ collection }) {
      this.$emit('enter-collection', { collection })
      this.$forceUpdate()
    }
  },
  computed: {
    trashedCollections () {
      return Hot.getTrashedCollections({ root: this.root })
    },
    myCollections () {
      return Hot.getCollections({ root: this.root })
    }
  }
}
</script>

<style scoped>
@import url(./Shared.css);

.enter-archive * {
  cursor: url('./img/enter-archive-cursor.svg'), pointer;
}
.restore * {
  cursor: url('./img/restore-cursor.svg'), pointer;
}
.trash {
  cursor: url('./img/trash-cursor.svg'), pointer;
}
</style>
