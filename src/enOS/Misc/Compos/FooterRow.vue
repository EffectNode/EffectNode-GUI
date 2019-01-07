<template>
  <div class="footer">
    <div class="sys-constraint content">

      <h1>
        Thank you for visiting.
      </h1>

      <h2>
        SiteMap
      </h2>
      <ul>
        <li><a class="linker" href="/">Home</a></li>
        <li><a class="linker" href="/auth">Login / Register</a></li>
        <li><a class="linker" href="/profile">My Profile</a></li>
      </ul>

    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.footer{
  margin-top: 100px;
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
