<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@font-face {
  font-family: 'InterUI';
  src: url('./assets/interui-font/Inter-UI-Regular.woff');
}
@font-face {
  font-family: 'InterUI-Bold';
  src: url('./assets/interui-font/Inter-UI-Bold.woff');
}


@font-face {
  font-family: 'Trivial-Regular, Trivial';
  src: url('./assets/trivial/Trivial-Regular.ttf');
}
@font-face {
  font-family: 'Trivial-Light, Trivial';
  src: url('./assets/trivial/Trivial-Thin.ttf');
}
@font-face {
  font-family: 'Trivial-Bold, Trivial';
  src: url('./assets/trivial/Trivial-Bold.ttf');
}

body {
  font-family: 'InterUI';
}
.fade-enter-active, .fade-leave-active {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  position: fixed;
  top: 0px;
  left: 0px;
  opacity: 0;
}
#app {
  font-family: 'InterUI', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 13px;
  line-height: 1.55;
}
</style>
