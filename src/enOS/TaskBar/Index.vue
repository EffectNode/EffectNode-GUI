<template>
  <div class="div">
    <div class="taskbar" :class="{ disconnected: isDisconnected }">
      <div class="taskbar-content">
        <div class="taskbar-icon disconnected" v-if="isDisconnected">
          Offline
        </div>
        <div class="taskbar-icon home" @click="goMenu()">
          Home
        </div>
        <div class="taskbar-icon home" @click="startMenu = true">
          Open App
        </div>
        <div class="taskbar-icon button3d" v-if="toggle3D && uiAPI.portal.portals.length > 0" @click="toggle3DSpace">
          2D 🦄
        </div>
        <div class="taskbar-icon button3d" v-if="!toggle3D && uiAPI.portal.portals.length > 0" @click="toggle3DSpace">
          3D 🌈
        </div>
        <div class="taskbar-icon button3d" v-if="uiAPI.portal.portals.length > 0" @click="oragnise">
          🎩 Organise
        </div>
        <div
        class="taskbar-icon win" :key="ip._id"
        :class="{ 'is-on': ip.win.minimised }"
        v-for="(ip) in uiAPI.portal.portals
          .slice()
          .sort((a, b) => {
            let da = Date.parse(a.date)
            let db = Date.parse(b.date)
            if (da > db) {
              return -1
            } else if (da === db) {
              return 0
            } {
              return 1
            }
          })"

          @touchstart="$emit('activated', { portal: ip })"
          @click="$emit('activated', { portal: ip })"
        >
          {{ ip.win.name || ip.app }}
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

          <!-- <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: 'Visual Effect Flow Editor', type: 'connector' })">
            Visual Effect Flow Editor
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: 'Preview Window', type: 'exec-env' })">
            Preview Window
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: 'Documentation', type: 'docs' })">
            Documentation
          </div> -->

          <div :key="smii + smi.compoName" v-for="(smi, smii) in startMenuItems.filter(a => a.tags.includes('effect'))" class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: smi.windowTitle, type: smi.typeCode })">
            {{ smi.windowTitle }}
          </div>
          <hr />
          <div :key="smii + smi.compoName" v-for="(smi, smii) in startMenuItems.filter(a => a.tags.includes('demo'))" class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: smi.windowTitle, type: smi.typeCode })">
            {{ smi.windowTitle }}
          </div>
          <!-- <hr />

          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: 'Space & Dimension', type: 'dimensional' })">
            Space & Dimension
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: 'Particle Sea & 彩雲追月', type: 'particle-sea' })">
            Particle Sea & 彩雲追月
          </div>
          <div class="app-icon adder" @click="closeMenu(); uiAPI.portal.addWindow({ data: {}, appName: 'Volumetric Rendering', type: 'volumetric' })">
            Volumetric Rendering
          </div> -->
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
    },
    toggle3D () {
      if (this.toggle3D) {
        this.uiAPI.portal.enableSpace3D()
      } else {
        this.uiAPI.portal.disableSpace3D()
      }
    }
  },
  computed: {
    isDisconnected () {
      return this.uiAPI.RT.en.disconnected
    }
  },
  data () {
    return {
      startMenuItems: this.uiAPI.portal.startMenuItems,
      startMenu: false,
      toggle3D: false
    }
  },
  methods: {
    goMenu () {
      window.location.assign('/profile')
    },
    oragnise () {
      this.uiAPI.portal.organise()
    },
    closeMenu () {
      this.startMenu = false
    },
    toggle3DSpace () {
      this.toggle3D = !this.toggle3D
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
.taskbar.disconnected{
  background-image: linear-gradient(0deg, rgba(255, 101, 101, 0.87), rgb(255, 197, 211));
}


hr{
  margin-top: 1rem;
  margin-bottom: 1rem;
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

.taskbar-icon.disconnected{
  background-color: rgb(252, 142, 142);
  background-image: linear-gradient(62deg, rgb(252, 142, 142) 0%, rgb(252, 229, 195) 100%);
}
.app-icon{
  display: inline-block;
  /* height: calc(90px - 10px * 2);
  width: calc(90px - 10px * 2); */
  /* border: rgb(248, 194, 194) solid 1px; */
  padding: 13px;
  border-radius: 10px;
  margin: 4px;
  width: 80px;

  /* box-shadow: 0px 0px 50px 0px rgba(255, 255, 255, 0.623); */
  font-size: 12px;
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
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  text-align: center;
  font-family: Inconsolata, monospace;
  color: #4a4a4a;
  /* font-weight: bold; */
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
