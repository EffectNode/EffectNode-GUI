<template>
  <div class="footer">
    <div class="sys-constraint content">

      <h1>
        Inventor's Note
      </h1>
      <p>
        Effect Node is a good place to practice and share visual effect coding. All effect examples are based in MIT licnese.
      </p>
      <p>
        Thank you internet for being an awesome place to share and co-author knowledge about technology.
      </p>

      <h1>Our Motto</h1>
      <p>Not so legit, but kinda works.</p>

      <h2>
        SiteMap
      </h2>
      <ul>

        <li><a class="linker" href="/">Home</a></li>
        <li><router-link tag="a" class="linker" to="/blog">Blog</router-link></li>
        <li><a class="linker" href="/auth">Login / Register</a></li>
        <li><a class="linker" href="/profile">My Profile</a></li>
      </ul>

      <h2>
        Social
      </h2>
      <ul>
        <li><a class="linker" href="https://instagram.com/effectnode/">Effect Node IG</a></li>
        <li><a class="linker" href="https://instagram.com/postervideo/">Our inventor, Wong Lok's IG</a></li>
        <li><a class="linker" href="https://www.facebook.com/effectnode/">Effect Node FB</a></li>
      </ul>

      <h1>Contact</h1>
      <p>
        Made with love by <a class="linker" href="https://twitter.com/wonglok831/">@wonglok831</a>.
      </p>

      <h1>Credit</h1>
      <ul>
        <li>
          <a class="linker" target="_blank" href="http://threejs.org">THREE.JS </a>
        </li>
        <li>
          <a class="linker" target="_blank" href="http://vuejs.org">Vue.JS </a>
        </li>
      </ul>

      <h2>Thank you for visiting us!</h2>

      <h2>Open Jar for Donations. ❤️ </h2>
      <p>
        <a class="linker" href="https://paypal.me/wonglok" target="_blank">PayPal.me/wonglok</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.footer{
  margin-top: 75px;
  width: 100%;
  background-color: black;
  color: white;
}
a.linker,
.linker:active,
.linker:hover,
.linker:active,
.linker:visited{
  color: white;
}
.content{
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>
