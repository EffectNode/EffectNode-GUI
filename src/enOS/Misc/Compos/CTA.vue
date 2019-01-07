<template>
  <div class="sys-constraint">
    <hr>
    <div @click="gogo" class="cta">Get Started to Remix and Code Visual Effects</div>
    <hr>
  </div>
</template>

<script>
export default {
  methods: {
    gogo () {
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
</style>
