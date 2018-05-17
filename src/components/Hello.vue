<template>
  <div>
    <Header />
    <div class="hello">
      <h1>Welcome to our effect code remxing and creation platform.</h1>

      <img class="lmb-product" src="../assets/product-logo.svg" alt="Effect Node Logo">

      <h3>While you wait for our product, you can experiment our prototype.</h3>

      <a href="./heart-space">Heart Space Prototype</a>
      <br />
      <a href="./mindfulness/scene/demo1">Mindfulness Prototype</a>
      <br />
      <a href="./mindfulness/lighthouse/demo1">Ugly Light House Prototype</a>

      <p>EffectNode.com is made with love in Hong Kong.</p>

      <p>
        <a href="https://www.facebook.com/effectnode"><img src="../assets/icons/fb.svg" alt="Our Facebook"></a>
        <a href="https://twitter.com/effectnode"><img src="../assets/icons/twitter.svg" alt="Our Twitter"></a>
        <a href="https://www.instagram.com/effectnode/"><img src="../assets/icons/instagram.svg" alt="Our Instagram"></a>
      </p>

    </div>
  </div>
</template>

<script>
import Header from './parts/Header/Header.vue'
export default {
  components: {
    Header
  },
  name: 'hello',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hello{
  text-align: center;
}
h1, h2 {
  font-weight: normal;
}
.lmb{
  max-width: 150px;
  max-height: 150px;
}
.lmb-product{
  width: 50vmin;
}


</style>
