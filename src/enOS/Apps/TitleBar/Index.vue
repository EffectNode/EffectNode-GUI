<template>
  <div class="drag title" :class="{ inactive: !portal.win.active }">
      <slot></slot>
      <div class="minify" @click="hide"></div>
      <div class="close" @click="close"></div>
    </div>
</template>

<script>
export default {
  props: {
    portal: {}
  },
  methods: {
    close () {
      this.$server.portal.removeWindow(this.portal)
    },
    hide () {
      this.$server.portal.hideWindow(this.portal)
    }
  }
}
</script>

<style scoped>
.title{
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 10px 10px 0px 0px;
  cursor: move;
}
.drag{
  background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(149,219,254,1) 0%, rgba(7,134,197,1) 90.1% );
  width: 100%;
  height: 30px;

  line-height: 30px;
  text-align: center;
}
.minify{
  background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgb(179, 254, 149) 0%, rgb(197, 178, 7) 90.1% );
  width: 17px;
  height: 17px;
  border-radius: 50%;
  position: absolute;
  right: 28px;
  top: calc((30px - 17px) / 2);
  cursor: pointer;
}
.close{
  background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgb(207, 90, 236) 0%, rgb(230, 79, 92) 90.1% );
  width: 17px;
  height: 17px;
  border-radius: 50%;
  position: absolute;
  right: 8px;
  top: calc((30px - 17px) / 2);
  cursor: pointer;
}

.drag.inactive{
  opacity: 0.5;
}
</style>
