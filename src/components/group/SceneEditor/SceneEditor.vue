<template>
  <div class="scene-editor">
    <div class="pages-row">
      <div class="page-icon">

      </div>
    </div>
    <div class="editor-row">
      <ul class="editor-tree">
        <TreeItem
          @tooltip="(v) => { $emit('tooltip', v) }"
          @choose-item="logStuff"
          @view-detail="logStuff"
        >
        </TreeItem>
      </ul>
      <div class="editor-preview">
        <Previewer :output="output" />
      </div>
      <div class="editor-options">
      </div>
    </div>

    <!-- Tree Exec, Animation Expresssor -->
    <button @click="() => { $emit('compile') }">compile</button>
  </div>
</template>

<script>
import Previewer from '@/components/parts/EffectNode/Previewer/Previewer.vue'
import TreeItem from '@/components/parts/EffectNode/TreeItem/TreeItem.vue'

export default {
  components: {
    Previewer,
    TreeItem
  },
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
  },
  data () {
    return {
    }
  },
  methods: {
    logStuff (v) {
      console.table([v])
    }
  }
}
</script>

<style scoped>

.editor-tree{
  margin: 0px;
  padding-left: 0px;
  width: 300px;
  /* border: red solid 1px; */
}
.editor-row{
  display: flex;
  justify-content: space-between;
}
.editor-options{
  width: 300px;
  /* border: red solid 1px; */
}
.editor-preview{
  width: calc(100% - 8px * 2 - 300px * 2);
  height: 50vmin;
}


.pages-row{
  width: 100%;
  height: 80px;
}
.page-icon{

}
</style>
