<template>
  <li>
    <div
      class="entry"
      :class="{ bold: isFolder }"
      >
      <span v-if="!isFolder || isFolder && model.type !== 'Object3D'">
        <img class="icon" :src="getImg(model.type)" :alt="model.type">
      </span>
      <span v-if="isFolder && model.type === 'Object3D'">
        <img v-if="open" @click="toggle" class="icon pointer" src="./img/folder-plus.svg" :alt="model.type">
        <img v-if="!open" @click="toggle" class="icon pointer" src="./img/folder-minus.svg"  :alt="model.type">
      </span>
      <span>
        <input type="text" class="name" v-model="model.name">
        <img v-if="canDelete" class="hover-show-inline" @click="remove(model)" src="./img/trash.svg" />
      </span>
      <div class="hover-show-block" v-if="model.type === 'Object3D' || model.type === 'Scene'">
        <img
          class="hover-show-inline pointer adder"
          src="./img/add.svg" alt="add"
        />
        <img
          class="hover-show-inline pointer adder"
          v-if="isFolder"
          @click="addChild('element')" src="./img/cube3.svg"
          @mouseover="$emit('tooltip', { name: 'Add 3D Element' })"
          @mouseout="$emit('tooltip', false)"
        />
        <img
          class="hover-show-inline pointer adder"
          v-if="isFolder"
          @click="addChild('text')" src="./img/text.svg"
          @mouseover="$emit('tooltip', { name: 'Add Text' })"
          @mouseout="$emit('tooltip', false)"
        />
        <img
          class="hover-show-inline pointer adder"
          v-if="isFolder"
          @click="addChild('image')" src="./img/image.svg"
          @mouseover="$emit('tooltip', { name: 'Add Picture' })"
          @mouseout="$emit('tooltip', false)"
        />
        <img
          class="hover-show-inline pointer adder"
          v-if="isFolder"
          @click="addChild('folder')" src="./img/folder-plus.svg"
          @mouseover="$emit('tooltip', { name: 'Add Object3D Folder' })"
          @mouseout="$emit('tooltip', false)"
        />

      </div>
    </div>

    <!-- Child -->
    <ul class="ul" v-show="open" v-if="isFolder">
      <TreeItem
        v-for="(model, index) in model.children"
        :key="index"
        :model="model">
      </TreeItem>

    </ul>
  </li>
</template>

<script>
import Vue from 'vue'
var Tree = {
  addText () {

  }
}
export default {
  name: 'TreeItem',
  beforeCreate () {
    this.$options.components.TreeItem = require('./TreeItem.vue').default
  },
  props: {
    model: {
      default () {
        return {
          name: 'My Scene',
          type: 'Scene',

          children: [
            { name: 'Camera', type: 'Camera' },
            { name: 'Camera Control', type: 'CameraControl' },
            { name: 'Hello', type: 'Text' },
            { name: 'Puppy', type: 'Picture' },
            {
              name: 'Object3D Group',
              type: 'Object3D',
              children: [
                { name: 'child folder', type: 'Picture' }
              ]
            }
          ]// root
        }// sample
      }
    }
  },
  data () {
    return {
      Tree,
      open: true
    }
  },
  computed: {
    canDelete () {
      return true
    },
    isFolder () {
      return this.model.children
    }
  },
  mounted () {
    this.$on('tooltip', (v) => {
      this.$parent.$emit('tooltip', v)
    })
  },
  methods: {
    getImg (type) {
      switch (type) {
        case 'Camera':
          return require('./img/camera.svg')
        case 'CameraControl':
          return require('./img/camera-control.svg')
        case 'Text':
          return require('./img/text.svg')
        case 'Scene':
          return require('./img/file.svg')
        case 'Picture':
          return require('./img/image.svg')
        case 'Object3D':
          return require('./img/folder.svg')
        case 'Element':
          return require('./img/cube3.svg')
        default:
          return require('./img/cube3.svg')
      }
    },
    toggle () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType () {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild (type) {
      let item = {}
      switch (type) {
        case 'element':
          item = { name: 'New Element', type: 'Element' }
          break

        case 'folder':
          item = { name: 'Object3D Group', type: 'Object3D', children: [] }
          break

        case 'image':
          item = { name: 'New Image', type: 'Picture' }
          break

        case 'text':
          item = { name: 'New Text', type: 'Text' }
          break

        default:
          item = { name: 'New Text (default)', type: 'Text' }
      }
      this.model.children.unshift(item)
    }
  }
}
</script>

<style scoped>
.icon{
  margin-right: 8px;
}
.pointer {
  cursor: pointer;
}
ul{
  line-height: 2.5;
  padding-left: 25px;
}
li{
   list-style: none;
}
.adder{
  margin-right: 8px;
  /* border: #444 solid 1px; */
}
.name{
  height: 15px;
  appearance: none;
  border: none;
  outline: none;
  background-image: none;
  font-size: 15px;
  margin: 0px;
  padding: 0px;
}
.name:hover{
  text-decoration: underline;
}
.hover-show-inline{
  display: none;
}
.entry:hover .hover-show-inline{
  display: inline;
}
</style>
