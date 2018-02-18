<template>
  <div class="statusbar-wrapper">
    <div class="statusbar">
      <div class="statusbar-blur">
        <div class="statusbar-image"></div>
      </div>
      <div class="statusbar-content-layer">
        <div class="statusbar-content">
          <div class="left">
            <img class="logo" src="./img/logo.svg" />
            <span class="brand">Effect Node</span>
            <span class="left-slot">
              <slot name="left"></slot>
            </span>
          </div>
          <div class="right">
            <span class="right-slot">
              <slot name="right"></slot>
            </span>
            <span class="clock">{{ clockWords }}</span>
            <img class="logo" src="./img/user.svg" @click="$emit('user-profile-click')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      timer: 0,
      clock: new Date()
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.clock = new Date()
    }, 100)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  computed: {
    clockWords () {
      // return moment(this.clock).format('h:mm:ss a')
      return moment(this.clock).format('h:mm a')
    }
  }
}
</script>

<style scoped>
.statusbar-wrapper{
  height: 24px;
}
.statusbar{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 76px;
}

@keyframes hue-runner {
  0% {
    filter: hue-rotate(0deg) contrast(1.0);
  }
  100% {
    filter: hue-rotate(360deg) contrast(2.0);
  }
}

.statusbar:hover .statusbar-image{
  /* animation: hue-runner 3s ease-in-out 0s infinite alternate; */
}
.statusbar-image{
  animation: hue-runner 3s ease-in-out 0s infinite alternate;
  position: absolute;
  top: calc(-25px / 2.0);
  left: 0px;
  width: 100%;
  height: 25px;
  background-image: url('./img/wally2.jpg');
  background-repeat: repeat;
  /* background-size: cover; */
}
.statusbar-blur{
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 76px;
  filter: blur(25px);
}
.statusbar-content-layer{
  z-index: 100;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
.statusbar-content{
  width: calc(100% - 8px * 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px;
  font-size: 13px;
  line-height: 15px;
}
.logo{
  /* margin: 8px; */
}
.left, .right {
  display: flex;
  align-items: center;
}
.right{
  justify-content: flex-end;
  margin-right: 8px;
}
.brand{
  margin-left: 8px;
  font-family: 'InterUI-Bold', 'InterUI', Arial, Helvetica, sans-serif;
}
.clock{
  margin-right: 8px;
  font-family: 'InterUI', Arial, Helvetica, sans-serif;
}
.left-slot{
  margin-left: 8px;
}
.right-slot{
  margin-right: 8px;
}
</style>
