<template>
  <div class="wrap">
    <h1 class="title">
      Our New Software.
    </h1>
    <a class="link" href="https://iGraph.effectnode.com">
      <img class="big" src="../img/igraph.en.png" alt="iGraph by EffectNode.com">
    </a>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.title{
  margin: 30px;
  font-size: 50px;
}
.big{
  cursor: pointer;
  width: 80%;
}
.link{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
