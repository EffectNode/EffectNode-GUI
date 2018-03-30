<template>
  <li>
    <div
      class="entry"
      :class="{ bold: isFolder }"
      >
      <div class="entry-row">
        <!-- Prefix -->
        <div v-if="!isFolder || isFolder && model.type !== 'Object3D'">
          <div class="icon-wrap">
            <img class="icon" :src="getImg(model.type)" :alt="model.type">
          </div>
        </div>
        <div v-if="isFolder && model.type === 'Object3D'">
          <img
            v-if="open"
            @click="toggle"
            class="icon pointer"
            src="./img/folder-plus.svg"
            :alt="model.type"
            @mouseover="$emit('tooltip', { get name () { return open ? 'Close Folder' : 'Open Folder' } })"
            @mouseout="$emit('tooltip', false)"
          >
          <img
            v-if="!open"
            @click="toggle"
            class="icon
            pointer"
            src="./img/folder-minus.svg"
            :alt="model.type"
            @mouseover="$emit('tooltip', { get name () { return open ? 'Close Folder' : 'Open Folder' } })"
            @mouseout="$emit('tooltip', false)"
          >
        </div>

        <!-- inputs -->
        <div>
          <input
          @click="$emit('choose-item', model)"
          type="text" class="name" v-model="model.name">

          <img
            v-if="canDelete" class="hover-show-inline pointer wiggle-animation"
            @mouseover="$emit('tooltip', { get name () { return 'Remove ' + model.name } })"
            @mouseout="$emit('tooltip', false)"
            @click="remove(model)" src="./img/trash.svg"
          />

          <!-- Add Stuff -->
          <div class="hover-show-inline" v-if="model.type === 'Scene'">
            <img
              class="hover-show-inline pointer adder fade-show-in-animation"
              v-if="isFolder"
              @click="addEnd('folder')" src="./img/folder-plus.svg"
              @mouseover="$emit('tooltip', { name: 'Add Object3D Group' })"
              @mouseout="$emit('tooltip', false)"
            />
          </div>
          <!-- Dot Dot Dot Stuff -->
          <div class="hover-show-inline" v-if="model.type === 'Page'">
            <img
              class="hover-show-inline pointer adder wiggle-animation"
              v-if="isFolder"
              @click="$emit('view-detail', model)" src="./img/dotdotdot.svg"
              @mouseover="$emit('tooltip', { name: 'View Details' })"
              @mouseout="$emit('tooltip', false)"
            />
          </div>

        </div>
      </div>

      <!-- new row -->
      <div class="hover-show-block" v-if="model.type === 'Object3D'">
        <!-- <div class="hover-show-inline-block icon-holder adder">
        </div> -->
        <img
          class="hover-show-inline adder fade-in-right-animation"
          src="./img/arrow-right.svg" alt="add"
        />
        <img
          class="hover-show-inline pointer adder"
          v-if="isFolder"
          @click="addEnd('element')" src="./img/cube3.svg"
          @mouseover="$emit('tooltip', { name: 'Add Custom Element' })"
          @mouseout="$emit('tooltip', false)"
        />
        <img
          class="hover-show-inline pointer adder"
          v-if="isFolder"
          @click="addEnd('text')" src="./img/text.svg"
          @mouseover="$emit('tooltip', { name: 'Add Text' })"
          @mouseout="$emit('tooltip', false)"
        />
        <img
          class="hover-show-inline pointer adder"
          v-if="isFolder"
          @click="addEnd('image')" src="./img/image.svg"
          @mouseover="$emit('tooltip', { name: 'Add Image' })"
          @mouseout="$emit('tooltip', false)"
        />
      </div>
    </div>

    <!-- Child -->
    <ul v-show="open" v-if="isFolder">
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
export default {
  name: 'TreeItem',
  beforeCreate () {
    this.$options.components.TreeItem = require('./TreeItem.vue').default
  },
  props: {
    model: {
      default () {
        return {
          name: 'Home Page',
          type: 'Page',
          system: true,
          children: [
            { name: 'Camera', type: 'Camera', system: true },
            { name: 'Camera Control', type: 'CameraControl', system: true },
            {
              name: 'My Scene',
              type: 'Scene',
              system: true,
              children: [
                {
                  name: 'Object3D Group',
                  type: 'Object3D',
                  children: [
                    { name: 'Custom Element', type: 'Element' },
                    { name: 'Hello', type: 'Text' },
                    { name: 'Sample Image', type: 'Image' }
                  ]
                }
              ]// root
            }
          ]
        }// sample
      }
    }
  },
  data () {
    return {
      open: true
    }
  },
  computed: {
    canDelete () {
      return !this.model.system
    },
    isFolder () {
      return this.model.children
    }
  },
  mounted () {
    // bubbles up event
    this.$on('tooltip', (v) => {
      this.$parent.$emit('tooltip', v)
    })
    this.$on('choose-item', (v) => {
      this.$parent.$emit('choose-item', v)
    })
  },
  methods: {
    remove (model) {
      var parent = this.$parent.model
      if (parent && window.confirm('Delete?')) {
        let children = parent.children
        let index = children.findIndex(p => p === model)
        children.splice(index, 1)
      }
      // console.log(this.$parent.model)
    },
    getImg (type) {
      switch (type) {
        case 'Camera':
          return require('./img/camera.svg')
        case 'CameraControl':
          return require('./img/camera-control.svg')
        case 'Page':
          return require('./img/file.svg')
        case 'Text':
          return require('./img/text.svg')
        case 'Scene':
          return require('./img/sitemap.svg')
        case 'Image':
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
        this.addStart()
        this.open = true
      }
    },
    getItem (type) {
      let item = {}
      switch (type) {
        case 'element':
          item = { name: 'New Element', type: 'Element' }
          break

        case 'folder':
          item = { name: 'Object3D Group', type: 'Object3D', children: [] }
          break

        case 'image':
          item = { name: 'New Image', type: 'Image' }
          break

        case 'text':
          item = { name: 'New Text', type: 'Text' }
          break

        default:
          item = { name: 'New Text (default)', type: 'Text' }
      }
      return item
    },
    addEnd (type) {
      var item = this.getItem(type)
      this.model.children.push(item)
      this.open = true
    },
    addStart (type) {
      var item = this.getItem(type)
      this.model.children.unshift(item)
      this.open = true
    }
  }
}
</script>

<style scoped>
.icon-wrap{
  width: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
  appearance: none;
  border: none;
  outline: none;
  background-color: transparent;
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
.hover-show-block{
  display: none;
}
.hover-show-inline-block{
  display: none;
}
.entry:hover .hover-show-inline{
  display: inline;
}
.entry:hover .hover-show-block{
  display: block;
}
.entry:hover .hover-show-inline-block{
  display: inline-block;
}
.entry-row{
  height: 35px;
  display: flex;
  align-items: center;
}
.icon-holder{
  height: 15px;
  width: 14px;
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translate3d(-50%, 0px, 1px);
  }
  50%  {
    opacity: 1;
    transform: translate3d(0%, 0px, 1px);
  }
  100%{
    opacity: 0;
    transform: translate3d(50%, 0px, 1px);
  }
}


@keyframes fadeShowIn {
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  50%  {
    opacity: 1;
    transform: scale(1.0);
  }
  100%{
    opacity: 0;
    transform: scale(1.3);
  }
}


@keyframes wiggle {
  0% {
    transform: rotate(-13deg);
  }
  50%  {
    transform: rotate(0);
  }
  100%{
    transform: rotate(13deg);
  }
}


.fade-in-right-animation{
  animation: fadeInRight 1.3s ease 0s infinite normal both;
}
.fade-show-in-animation{
  animation: fadeShowIn 0.7s ease 0s infinite normal both;
}
.wiggle-animation{
  animation: wiggle 0.4s ease-in-out 0s infinite alternate both;
}

</style>
