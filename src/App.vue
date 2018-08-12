<template>
  <div id="app">
    <!-- <transition name="fade"> -->
      <router-view></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
// import * as Fire from '@/firebase.js'

export default {
  name: 'app',
  mounted () {
    // Fire.state.$forceUpdate = () => {
    //   this.$forceUpdate()
    // }
  }
}
</script>

<style>
@import url(./normalise.css);
@import url(./skeleton.css);

@font-face {
  font-family: 'InterUI';
  src: url('./assets/interui-font/Inter-UI-Regular.woff');
}
@font-face {
  font-family: 'InterUI-Bold';
  src: url('./assets/interui-font/Inter-UI-Bold.woff');
}

@font-face {
  font-family: 'Inconsolata';
  font-style: normal;
  font-weight: 400;
  src: local('Inconsolata Regular'), local('Inconsolata-Regular'), url('./assets/Inconsolata/Inconsolata-Regular.ttf') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Inconsolata-Bold';
  font-style: normal;
  font-weight: 400;
  src: local('Inconsolata Regular'), local('Inconsolata-Regular'), url('./assets/Inconsolata/Inconsolata-Bold.ttf') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/*
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
*/

/* @font-face {
    font-family: 'Trivial';
    src: local('Trivial Bold'), local('Trivial-Bold'),
        url('./assets/trivial-wf/Trivial-Bold.woff2') format('woff2'),
        url('./assets/trivial-wf/Trivial-Bold.woff') format('woff'),
        url('./assets/trivial-wf/Trivial-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
}

@font-face {
    font-family: 'Trivial';
    src: local('Trivial Regular'), local('Trivial-Regular'),
        url('./assets/trivial-wf/Trivial-Regular.woff2') format('woff2'),
        url('./assets/trivial-wf/Trivial-Regular.woff') format('woff'),
        url('./assets/trivial-wf/Trivial-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'Trivial';
    src: local('Trivial Thin'), local('Trivial-Thin'),
        url('./assets/trivial-wf/Trivial-Thin.woff2') format('woff2'),
        url('./assets/trivial-wf/Trivial-Thin.woff') format('woff'),
        url('./assets/trivial-wf/Trivial-Thin.ttf') format('truetype');
    font-weight: 100;
    font-style: normal;
}

@font-face {
    font-family: 'Trivial';
    src: local('Trivial Heavy'), local('Trivial-Heavy'),
        url('./assets/trivial-wf/Trivial-Heavy.woff2') format('woff2'),
        url('./assets/trivial-wf/Trivial-Heavy.woff') format('woff'),
        url('./assets/trivial-wf/Trivial-Heavy.ttf') format('truetype');
    font-weight: 900;
    font-style: normal;
}

@font-face {
    font-family: 'Trivial';
    src: local('Trivial Light'), local('Trivial-Light'),
        url('./assets/trivial-wf/Trivial-Light.woff2') format('woff2'),
        url('./assets/trivial-wf/Trivial-Light.woff') format('woff'),
        url('./assets/trivial-wf/Trivial-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
}

@font-face {
    font-family: 'Trivial';
    src: local('Trivial ExtraLight'), local('Trivial-ExtraLight'),
        url('./assets/trivial-wf/Trivial-ExtraLight.woff2') format('woff2'),
        url('./assets/trivial-wf/Trivial-ExtraLight.woff') format('woff'),
        url('./assets/trivial-wf/Trivial-ExtraLight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
}

@font-face {
    font-family: 'Trivial';
    src: local('Trivial UltraLight'), local('Trivial-UltraLight'),
        url('./assets/trivial-wf/Trivial-UltraLight.woff2') format('woff2'),
        url('./assets/trivial-wf/Trivial-UltraLight.woff') format('woff'),
        url('./assets/trivial-wf/Trivial-UltraLight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
} */

.enforce-chi{
  font-family: system-ui, -apple-system, BlinkMacSystemFont, '.SFNSText-Regular', sans-serif !important;
}

body {
  font-family: 'Inconsolata';
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
  font-family: 'Inconsolata', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 13px;
  line-height: 1.55;
}
</style>
