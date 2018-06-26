<template>
<div>
  <div class="gui-data-title"  @click="toggleView">
    Create a Collection <img src="./img/circle-add.svg" class="add-icon" :class="{ 'close-icon': view }" alt="">
  </div>

  <ul class="adder" v-show="view">
    <li class="gui-data-subtitle list-item" v-show="view" :key="nc.cType" v-for="(nc) in newInfos">
      {{ nc.name }}
      <div class="data-desc">{{ nc.desc }}</div>
    </li>
  </ul>

</div>
</template>

<script>

import * as GUIData from './GUIData.js'
export default {
  props: {
  },
  components: {
  },
  data () {
    return {
      view: false,
      newInfos: GUIData.collectionTypes
    }
  },
  methods: {
    createCollection () {

    },
    toggleView () {
      this.view = !this.view
    }
  }
}
</script>

<style scoped>
.gui-data-title{
  font-family: 'InterUI-Bold', Arial, Helvetica, sans-serif;
  font-size: 40px;
  color: #939393;
  letter-spacing: 0;
}
.gui-data-subtitle{
  /* Effect Nodes: */
  font-family: 'InterUI-Regular', Arial, Helvetica, sans-serif;
  font-size: 30px;
  color: #505050;
  letter-spacing: 0;
}
.data-desc{
  font-family: 'InterUI-Regular', Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #505050;
  letter-spacing: 0;
}
.add-img{
  display: none;
}
.adder *{
  cursor: url('./img/plus-arrow.svg'), pointer;
}
.gui-data-subtitle,
.gui-data-subtitle .data-desc{
  transition: all 1s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
.gui-data-subtitle:hover{
  color: rgb(0, 204, 255);
}
.gui-data-subtitle:hover .data-desc{
  color: rgb(0, 204, 255);
  text-decoration: underline;
}
.add-icon{
  transition: all 0.5s;
}
.add-icon:hover,
.add-icon.close-icon{
  transform: rotate(405deg);
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.rotater{
  width: 200px;
  height: 200px;
}


/* .list-item:nth-child(1) {
  transition-delay: calc(0.15s * 1);
}
.list-item:nth-child(2) {
  transition-delay: calc(0.15s * 2);
}
.list-item:nth-child(3) {
  transition-delay: calc(0.15s * 3);
}
.list-item:nth-child(4) {
  transition-delay: calc(0.15s * 4);
}
.list-item:nth-child(5) {
  transition-delay: calc(0.15s * 5);
}
.list-item:nth-child(6) {
  transition-delay: calc(0.15s * 6);
}
.list-item:nth-child(7) {
  transition-delay: calc(0.15s * 7);
}
.list-item:nth-child(8) {
  transition-delay: calc(0.15s * 8);
}
.list-item:nth-child(9) {
  transition-delay: calc(0.15s * 9);
}
.list-item:nth-child(10) {
  transition-delay: calc(0.15s * 10);
} */
</style>
