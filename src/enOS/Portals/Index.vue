<template>
  <div class="full ll-perspective">
    <div tag="div" class="full ll-cam" name="zoomba" :style="getGroupCSS()">
      <vue-draggable-resizable
        :key="ip.id"
        v-show="!ip.win.minimised"
        v-for="(ip) in $server.portal.portals"
        :w="ip.win.width"
        :h="ip.win.height"
        :x="ip.win.x"
        :y="ip.win.y"
        :z="ip.win.z"

        :minh="122"
        :minw="198"

        drag-handle=".drag"
        drag-cancel=".cancel"
        @dragging="(x, y) => {
          onDrag(x, y, ip)
        }"
        @resizing="(x, y, w, h) => {
          onResize(x, y, w, h, ip)
        }"

        :handles="['br']"
        :ref="'portals_' + ip.id"
        :active="true"
        @activated="onActivated(ip)"
        :style="getWindowStyle(ip)"
        >
          <Component
            v-show="!ip.win.minimised"
            :ref="`p-compo-${ip.id}`"
            @mouseenter="() => { ip.win.active = true; }"
            @mouseout="() => { ip.win.active = true; }"
            @activated="onActivated(ip)"
            class="full"
            :is="ip.app"
            :portal="ip"
          ></Component>
      </vue-draggable-resizable>
    </div>

    <TaskBar
      ref="taskbar"
      @activated="(v) => {
        onActivated(v.portal)
      }"
      @opened="(v) => {
        opened = v
      }"
    ></TaskBar>
  </div>
</template>

<script>
import QuotesApp from '@/enOS/Apps/QuotesApp'
import AnimationApp from '@/enOS/Apps/AnimationApp'
import DimensionalApp from '@/enOS/Apps/DimensionalApp'
import ParticleSeaApp from '@/enOS/Apps/ParticleSeaApp'
import VolumetricApp from '@/enOS/Apps/VolumetricApp'
import ConnectorApp from '@/enOS/Apps/ConnectorApp'
import TaskBar from '../TaskBar'

export default {
  components: {
    ParticleSeaApp,
    DimensionalApp,
    AnimationApp,
    QuotesApp,
    TaskBar,
    VolumetricApp,
    ConnectorApp
  },
  created () {
  },
  data () {
    return {
      opened: false,
      resizeTimeout: 0,
      serv: this.$server,
      sct: 0
    }
  },
  mounted () {
    this.loadLS()
    this.loadResizer()
  },
  watch: {
    portalsJSON () {
      this.shouldSave()
    },
    portalLength () {
      this.shouldSave()
      this.loadResizer()
    }
  },
  computed: {
    portalLength () {
      return this.$server.portal.portals.length
    },
    portalsJSON () {
      return JSON.stringify(this.$server.portal.portals)
    }
  },
  methods: {
    getGroupCSS () {
      if (this.opened) {
        return {
          filter: 'blur(20px)'
        }
      } else {
        return {
          filter: 'none'
        }
      }
    },
    loadResizer () {
      this.$nextTick(() => {
        this.$server.portal.portals.forEach((ip) => {
          let e = this.$refs['portals_' + ip.id][0]
          if (e) {
            let br = e.$el.querySelector('.handle.handle-br')
            br.addEventListener('mousedown', () => {
              this.onActivated(ip)
            }, false)
            br.addEventListener('touchstart', () => {
              this.onActivated(ip)
            }, false)
          }
        })
      })
    },
    getWindowStyle (ip) {
      return {
        transition: 'transform 0.5s',
        transform: this.$server.portal.meta.space3DMode ? `rotateX(-30deg) rotateY(30deg)` : ``
      }
    },
    loadLS () {
      let items = window.localStorage.getItem('portals-vessel-script')
      let meta = window.localStorage.getItem('portals-meta-vessel-script')

      try {
        if (items && meta) {
          this.$server.portal.portals = JSON.parse(items)
          this.$server.portal.meta = JSON.parse(meta)
        } else {
          this.$server.portal.makeSample()
        }

        this.$server.portal.fixOverflow()
        this.$server.portal.makeZList()
      } catch (e) {
        console.log('==== Reset ====')
        this.$server.portal.portals = []
        this.$server.portal.makeSample()
        console.log(e)
      }

      // this.$forceUpdate()
    },
    shouldSave () {
      this.$nextTick(() => {
        window.localStorage.setItem('portals-meta-vessel-script', JSON.stringify(this.$server.portal.meta))
        window.localStorage.setItem('portals-vessel-script', JSON.stringify(this.$server.portal.portals))
      })
    },
    onActivated (ip) {
      console.log(ip)
      this.$server.portal.activate(ip)

      this.$forceUpdate()

      // this.shouldSave()
    },
    onResize (x, y, width, height, p) {
      p.win.x = x
      p.win.y = y
      p.win.width = width
      p.win.height = height
      // this.shouldSave()

      let ip = p
      let compo = this.$refs[`p-compo-${ip.id}`]
      if (compo && compo[0]) {
        if (window.innerWidth < 500) {
          clearTimeout(this.resizeTimeout)
          this.resizeTimeout = setTimeout(() => {
            compo[0].$emit('resize', { portal: p })
          }, 60)
        } else {
          compo[0].$emit('resize', { portal: p })
        }
        // compo[0].$emit('resize', { portal: p })
      }
    },
    onDrag (x, y, p) {
      p.win.x = x
      p.win.y = y
      // this.shouldSave()
    }
  }
}
</script>

<style lang="css">
  .handle.handle-br{
    border: none !important;
    /* background: linear-gradient(90deg, #FC466B 0%, cyan 100%) !important; */
    background-image: linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%) !important;
    width: 25px !important;
    height: 25px !important;
    border-radius: 50% !important;
    display: block !important;
    /* bottom: -15px;
    right: -15px; */
    z-index: 1000 !important;
  }
</style>

<style scoped>
@import url(../jot.css);
.zoomba-enter-active, .zoomba-leave-active {
  transition: all 1s;
}
.zoomba-enter, .zoomba-leave-to /* .zoomba-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
</style>
