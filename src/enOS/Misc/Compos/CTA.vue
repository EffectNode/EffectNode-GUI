<template>
  <div class="sys-constraint">
    <hr>
    <div @click="goLogin" class="cta">Get Started to Remix and Code Visual Effects</div>
    <br />
    <a href="https://docs.effectnode.com/guide" target="_blank"><div class="cta cta2">Video Guide & Documentation Site</div></a>
    <hr>
  </div>
</template>

<script>
export default {
  methods: {
    goLogin () {
      window.location.assign('/profile')
    }
  }
}
</script>

<style scoped>
.cta{
  margin: 0px auto;
  max-width: 600px;
  width: 100%;
  height: 70px;
  line-height: 70px;
  border: white dotted 1px;
  text-align: center;
  color: white;
  background: black;
  cursor: pointer;
}

a,
a:visited,
a:active{
  text-decoration: none;
  color: white;
}

.cta{
  font-size: 13px;
}
@media screen and (min-width: 414px) {
  .cta{
    font-size: 15px;
  }
}
@media screen and (min-width: 767px) {
  .cta{
    font-size: 24px;
  }
}
@media screen and (min-width: 959px) {
  .cta{
    font-size: 24px;
  }
}

.cta2{
  transform: scale(0.8)
}
</style>
