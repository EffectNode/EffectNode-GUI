<template>
  <div class="unified">
    <div class="layer">
      <VisualForOOBE>
      </VisualForOOBE>
    </div>
    <div class="layer">
      <AuthForm></AuthForm>
    </div>
  </div>
  <!-- <div class="left-right">
    <div class="left">
      <AuthForm></AuthForm>
    </div>
    <div class="right">
      <VisualForOOBE>
      </VisualForOOBE>
    </div>
  </div> -->
</template>

<script>
import AuthForm from './Compos/AuthForm.vue'
import VisualForOOBE from './Compos/VisualForOOBE.vue'
export default {
  components: {
    AuthForm,
    VisualForOOBE
  }
}
</script>

<style scoped>
.unified{
  width: 100%;
  height: 100%;
  position: relative;
}
.layer{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.left-right{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: space-between;
  flex-direction: column;
}
.left, .right{
  width: 100%;
  height: 50%;
}
.left{
  /* background: linear-gradient(0deg, #c7f8cf 0%, #bbd2fa 100%); */
}
.right{
  /* background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%); */
}

@media screen and (min-width: 767px) {
  .left-right{
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
  .left, .right {
    width: 50%;
    height: 100%;
  }
}
</style>
