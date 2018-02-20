<template>
  <div>
    Scene Editor
    <ul class="obj-tree">
      <TreeItem @tooltip="(v) => { $emit('tooltip', v) }">
      </TreeItem>
    </ul>

    <button @click="() => { $emit('compile') }">compile</button>
    <Previewer :output="output" />
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
      treeStruc: {
        name: 'My Scene',
        children: [
          { name: 'hello' },
          { name: 'wat' },
          {
            name: 'child folder',
            children: [
              {
                name: 'child folder',
                children: [
                  { name: 'hello' },
                  { name: 'wat' }
                ]
              },
              { name: 'hello' },
              { name: 'wat' },
              {
                name: 'child folder',
                children: [
                  { name: 'hello' },
                  { name: 'wat' }
                ]
              }
            ]
          }
        ]
      }

      //
    }
  }
}
</script>

<style scoped>
.obj-tree{
  padding-left: 20px;
  list-style: none;
}
</style>
