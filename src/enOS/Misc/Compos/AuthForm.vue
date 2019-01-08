<template>
  <div class="auth-form">

    <div class="form-area">
      <div class="scene scene--card">
        <div class="card" :class="{ 'is-flipped': flip }">
          <div class="card__face card__face--front">

            <div class="auth-inner-form">
              <div class="title">Login</div>
              <input class="texter-input" type="text" v-model="auth.username" />
              <input class="texter-input" type="password" v-model="auth.password">
              <span class="button-submit" @click="login">Login</span>


              <div class="switcher" @click="flip = !flip">Switch to Sign up</div>

            </div>

          </div>
          <div class="card__face card__face--back">
            <div class="auth-inner-form">
              <div class="title">Sign up</div>
              <input class="texter-input" type="text" v-model="auth.username" />
              <input class="texter-input" type="password" v-model="auth.password">
              <span class="button-submit" @click="register">Sign up</span>

              <div class="switcher" @click="flip = !flip">Switch to Login</div>
            </div>

          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import * as API from '@/enOS/data/API'

export default {
  data () {
    return {
      flip: false,
      auth: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async register () {
      await API.register(this.auth)
      if (this.$route.query && this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push('/profile')
      }
    },
    async login () {
      await API.login(this.auth)
      if (this.$route.query && this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push('/profile')
      }
    }
  }
}
</script>

<style scoped>
.auth-form{
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%);
}

.form-area{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.scene {
  width: 40%;
  height: 40%;
  min-width: 350px;
  min-height: 250px;
  perspective: 600px;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.75s;
}

.card.is-flipped {
  transform: rotateY(-180deg);
}

.card__face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  box-shadow: 0px 0px 30px 0px #cccccc;
}

.card__face--front {
  background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);
}

.card__face--back {
  background: linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%);
  transform:  rotateY(180deg) translateZ(1px);
}

.auth-inner-form {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  color: white;
}

.switcher{
  position: absolute;
  bottom: 0px;
  right: 15px;
  color: white;
  text-shadow: 0px 0px 22px rgb(39, 39, 39);
}

.texter-input{
  width: calc(100% - 10px * 2);
  border: none;
  outline: none;
  appearance: none;
  border-bottom: rgb(255, 255, 255) solid 1px;
  border-radius: 0px;
  font-size: 25px;
  color: black;
  background: white;
  margin-bottom: 30px;
  border-radius: 10px;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
}

.button-submit{
  width: 100%;
  border: none;
  outline: none;
  border-bottom: rgb(255, 255, 255) solid 1px;
  border-radius: 0px;
  font-size: 20px;
  color: white;
  margin-bottom: 30px;
  cursor: pointer;
}

.title{
  display: block;
  font-size: 30px;
  text-align: center;
  margin-bottom: 20px;
}
.switcher{
  text-decoration: underline;
  cursor: pointer;
  display: block;
  margin-bottom: 20px;
}
</style>
