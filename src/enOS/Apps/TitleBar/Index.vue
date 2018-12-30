<template>
  <div class="title" :class="{ inactive: !portal.win.active }" ref="title">
    <div ref="dragger" class="dragger touch-drag">
    </div>
    <div ref="slot" class="slot touch-drag"><slot></slot></div>

    <div class="minify" @click="hide"></div>
    <div class="close" @click="close"></div>
  </div>
</template>

<script>
export default {
  props: {
    uiAPI: {},
    portal: {}
  },
  mounted () {
    this.$parent.$emit('activated')
    let dragger = this.$refs.dragger
    dragger.addEventListener('touchstart', (evt) => {
      evt.preventDefault()
    })
    dragger.addEventListener('touchmove', (evt) => {
      evt.preventDefault()
    })
    let slot = this.$refs.slot
    slot.addEventListener('touchstart', (evt) => {
      // evt.preventDefault()
    })
    slot.addEventListener('touchmove', (evt) => {
      evt.preventDefault()
    })
  },
  methods: {
    close () {
      this.uiAPI.portal.removeWindow(this.portal)
    },
    hide () {
      this.uiAPI.portal.hideWindow(this.portal)
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
  background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgb(230, 167, 255) 0%, rgb(186, 227, 255) 90.1% );
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
.touch-drag{
  touch-action: manipulation;
}
.dragger{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.drag.inactive{
  background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgb(49, 49, 49) 0%, rgb(216, 216, 216) 90.1% );
}
.title-words{
  display: inline;
}
.slot{
  display: inline-block;
  z-index: 1;
  color: black;
  /* transform: perspective(100px) translateZ(3px); */
}
</style>
