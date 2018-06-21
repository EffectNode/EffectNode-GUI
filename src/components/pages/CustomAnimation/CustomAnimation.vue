<template>
<div class="full">
  <div class="horizontal">
    <div class="ca-editor">
      <CAEditor class="full" :object="editingObj" />
    </div>
    <div class="ca-viewer">
      <CAViewer class="full" :object="editingObj" />
    </div>
  </div>
</div>
</template>

<script>
import * as CA from './CA.js'
import CAViewer from './CAViewer.vue'
import CAEditor from './CAEditor.vue'
export default {
  components: {
    CAEditor,
    CAViewer
  },
  data () {
    return {
      CA,
      root: CA.makeRoot()
    }
  },
  computed: {
    editingObj () {
      return CA.getObjectByIndex(this.root, 0)
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
  position: relative;
}

.horizontal{
  width: 100%;
  display: flex;
}

.ca-viewer{
  position: fixed;
  bottom: 50px;
  right: 0px;

  width: 300px;
  height: 300px;
}

.ca-editor{
  width: 100%;
}

</style>
