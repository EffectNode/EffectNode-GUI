<template>
  <div class="div">
    <div class="taskbar">
      <div class="taskbar-content">

        <div class="taskbar-icon home" @click="startMenu = true">
          Open App
        </div>
        <div class="taskbar-icon button3d" v-if="uiAPI.portal.meta.space3DMode && uiAPI.portal.portals.length > 0" @click="toggle3DSpace">
          2D 🦄
        </div>
        <div class="taskbar-icon button3d" v-if="!uiAPI.portal.meta.space3DMode && uiAPI.portal.portals.length > 0" @click="toggle3DSpace">
          3D 🌈
        </div>
        <div
        class="taskbar-icon win" :key="ipk"
        :class="{ 'is-on': ip.win.minimised }"
        v-for="(ip, ipk) in uiAPI.portal.portals.slice().sort((a, b) => { return new Date(a.date) - new Date(b.date) })"

          @touchstart="$emit('activated', { portal: ip })"
          @click="$emit('activated', { portal: ip })"
        >
          {{ ip.name || ip.app }}
        </div>
      </div>
    </div>
    <div class="start-menu-overlay" v-show="startMenu" @click="startMenu = false"></div>
    <div class="start-menu" v-show="startMenu">
      <div class="start-title-bar">Lok Lok App Store</div>
      <div class="start-content-div">
        <div class="start-content-div-margin">
          <!-- <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ type: 'quotes' })">
            Quotes
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ type: 'animation' })">
            Roll
          </div> -->
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, type: 'dimensional' })">
            Space & Dimension
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, type: 'particle-sea' })">
            Sea & 彩雲追月
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, type: 'volumetric' })">
            Volumetric Rendering
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, type: 'connector' })">
            Connectors
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, type: 'exec-env' })">
            ExecEnv
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    uiAPI: {}
  },
  mounted () {
    this.$forceUpdate()
  },
  watch: {
    startMenu () {
      this.$emit('opened', this.startMenu)
    }
  },
  data () {
    return {
      startMenu: false,
      toggle3D: false
    }
  },
  methods: {
    closeMenu () {
      this.startMenu = false
    },
    toggle3DSpace () {
      this.uiAPI.portal.meta.space3DMode = !this.uiAPI.portal.meta.space3DMode
    },
    goHome () {
      window.location.href = '/'
    },
    goSRN () {
      window.location.href = 'https://srn.net'
    }
  }
}
</script>

<style scoped>
.taskbar{
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;

  background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.0784313725490196), rgba(255, 255, 255, 0.5215686274509804));
}

.taskbar-content{
  /* max-width: 960px; */
  margin-bottom: 10px;
  margin-left: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.taskbar-icon{
  display: inline-block;
  /* height: calc(90px - 10px * 2);
  width: calc(90px - 10px * 2); */
  /* border: rgb(248, 194, 194) solid 1px; */
  padding: 10px;
  border-radius: 10px;
  margin: 0px 8px;
  margin-top: 10px;

  /* box-shadow: 0px 0px 50px 0px rgba(255, 255, 255, 0.623); */
  font-size: 13px;
  text-align: center;
  /* line-height: calc(90px - 10px * 2); */
  background-image: linear-gradient(9deg, #efd5ff 0%, #515ada 100%);
  color: white;
  background-size: 200% 200%;
  background-position: left bottom;
  transition: background-position 0.3s;
}
.app-icon{
  display: inline-block;
  /* height: calc(90px - 10px * 2);
  width: calc(90px - 10px * 2); */
  /* border: rgb(248, 194, 194) solid 1px; */
  padding: 15px;
  border-radius: 10px;
  margin: 8px;

  /* box-shadow: 0px 0px 50px 0px rgba(255, 255, 255, 0.623); */
  font-size: 13px;
  text-align: center;
  /* line-height: calc(90px - 10px * 2); */
  background-image: linear-gradient(9deg, #efd5ff 0%, #515ada 100%);
  color: rgb(85, 85, 85);
  background-size: 200% 200%;
  background-position: left bottom;
  transition: background-position 0.3s;
}

.adder{
  background-size: 200% 200%;
  background-image: linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%);
}
.button3d{
  background-color: #8EC5FC;
  background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
}
.home{
  background-color: #8EC5FC;
  background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
}

.taskbar-icon:hover,
.taskbar-icon.adder:hover {
  background-position: right top;
  cursor: pointer;
}

.brand{
  cursor: pointer;

  position: absolute;

  bottom: 50px;
  right: 20px;

}
.logo{
  display: inline-block;
  width: 130px;
  height: 35px;
  background-size: contain;
  background-image: url(https://www.wonglok.com/_acs/www.wonglok.com/images/header-logo.png);
}

.start-menu{
  position: absolute;
  bottom: 90px;
  left: 10px;
  width: 400px;
  height: 70%;
  background-color: #f7f7f7;
  box-shadow: 0px 0px 50px 0px #bdbdbd;
  border-radius: 18px;
}
.start-menu-overlay{
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.336);
}

.start-title-bar{
  border-radius: 18px 18px 0px 0px;
  background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);
  height: 60px;
  line-height: 60px;
  font-size: 19px;
  text-align: center;
  font-family: Raleway, sans-serif;
  color: #4a4a4a;
  font-weight: bold;
}

.start-content-div{
  height: calc(100% - 60px);
}

.start-content-div-margin{
  margin: 20px;
}

.is-on{
  position: relative;
}
.is-on::after{
  content: '';
  position: absolute;
  bottom: -22px;
  left: calc(50% - 20px / 2);
  width: 20px;
  height: 20px;
  background-color: rgb(36, 49, 228);
  box-shadow: 0px 0px 30px 0px rgb(53, 215, 255);
  border-radius: 50%;
  z-index: 1000000;
  animation: bg-color 1s ease 0s infinite alternate both;
}

@keyframes bg-color {
  0% {
    background-color: hsl(241, 100%, 50%);
  }
  100% {
    background-color: rgba(0, 217, 255, 0.986);
  }
}

</style>
