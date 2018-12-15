<template>
 <div class="statusbar">
    <div class="statusbar-content">
      <div class="left">
        <img class="logo" src="./img/logo.svg"  @click="$emit('mode', 'ProjectLoader')" />
        <span class="brand" @click="$emit('mode', 'ProjectLoader')">Effect Node</span>
        <span class="left-slot">
          <slot name="left"></slot>
        </span>
      </div>
      <div class="right">
        <span class="right-slot">
          <slot name="right"></slot>
        </span>
        <span class="clock">{{ clockWords }}</span>
        <span v-if="FireState.user">{{ FireState.user.displayName }} </span>
        <img v-if="!FireState.user" class="auth" src="./img/user.svg" @click="$emit('userLogin')" />
        <img v-if="FireState.user" class="auth" src="./img/logout.svg" @click="$emit('userLogout')" />
      </div>
    </div>
  </div>
</template>

<script>
import * as Fire from '@/firebase.js'

import moment from 'moment'
export default {
  data () {
    return {
      Fire,
      FireState: Fire.state,
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
.statusbar{
  width: 100%;
}

.statusbar-content{
  width: calc(100% - 8px * 1);
  height: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px;
  padding: 8px;
  font-size: 13px;
  line-height: 15px;
}
.auth{
  margin-left: 5px;
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
  font-weight: bold;
  margin-left: 8px;
  /* font-family: 'InterUI-Bold', 'InterUI', Arial, Helvetica, sans-serif; */
}
.clock{
  margin-right: 8px;
  /* font-family: 'InterUI', Arial, Helvetica, sans-serif; */
}
.left-slot{
  margin-left: 8px;
}
.right-slot{
  margin-right: 8px;
}
</style>
