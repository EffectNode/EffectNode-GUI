<template>
  <div class="titlebar">
    <div class="maxi sys-constraint">
      <div class="left-side">
        <div class="left-text">
          <slot name="left"></slot>
        </div>
      </div>
      <div class="center">
        <div class="center-text">
          <slot name="center"></slot>
        </div>
      </div>
      <div class="right-side">
        <div class="right-text">
          <slot name="right"></slot>
        </div>
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
.left-side{
  width: 170px;
  display: flex;
  align-items: center;
}
.left-side .left-text{
  height: 28px;
}

.center{
  width: 150px;
  display: flex;
  justify-items: center;
}
.center-text{
  width: 100%;
  text-align: center;
  font-size: 18px;
  line-height: 28px;
}
.right-side{
  width: 170px;
  display: flex;
  justify-items: flex-end;
  align-items: center;
}
.left-text,
.right-text{
  color: black;
  text-align: right;
  line-height: 28px;
  width: 100%;

  cursor: pointer;
}
.left-text{
  text-align: left;
}

.right-text:hover{
  text-decoration: underline;
}

@media screen and (min-width: 500px) {
  .center-text{
    font-size: 23px;
  }
  .left-text,
  .right-text{
    font-size: 17px;
  }
}

</style>
