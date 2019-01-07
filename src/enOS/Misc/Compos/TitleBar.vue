<template>
  <div class="titlebar">
    <div class="maxi sys-constraint">
      <div class="logo">
        <img src="../img/en.svg" alt="Effect Node Logo">
      </div>
      <div class="title">
        <div class="brand-name">Effect Node</div>
      </div>
      <div class="right-icon">
        <div class="login">Login / Signup</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.titlebar{
  background-image: linear-gradient(0deg, rgba(220, 220, 220, 0.5607843137254902), white);
  height: 57px;
}
.maxi{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 57px;
}
.logo{
  width: 141px;
  display: flex;
  justify-items: center;
}
.logo img{
  height: 28px;
}
.title{
  width: 150px;
  display: flex;
  justify-items: center;
}
.brand-name{
  font-size: 18px;
  line-height: 28px;
}
.right-icon{
  width: 141px;
  display: flex;
  justify-items: flex-end;
  align-items: center;
}

.login{
  text-align: right;
  line-height: 28px;
  width: 100%;

  cursor: pointer;
}

.login:hover{
  text-decoration: underline;
}

@media screen and (min-width: 500px) {
  .brand-name{
    font-size: 23px;
  }
  .login{
    font-size: 17px;
  }
}

</style>
