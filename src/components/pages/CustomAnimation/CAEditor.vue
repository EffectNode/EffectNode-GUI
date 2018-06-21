<template>
<div class="full">

<div class="boxes">
  <div class="row">
    <div class="box-a buffer-geometry" :style="getBuffGeoMinWidth(BAs.length - 1)">
      <BufferAttribute :key="iba" v-for="(ba, iba) in BAs" :label="ba.attribute" class="pos-abs" :style="getBufferAttributeStyle(iba)" />

      <div class="label-buffer-geometry general-font">
        Buffer
        <br />
        Geometry
      </div>

    </div>
    <div class="box-a shader-material">
      <Shader :label="'vertex shader'" class="pos-abs" :style="getShaderStyle(0)" />
      <Shader :label="'fragment'" class="pos-abs" :style="getShaderStyle(1)" />

      <Settings :label="'Transparent'" class="pos-abs" :style="getSettingsStyle(0)" />
      <Settings :label="'Double Side'" class="pos-abs" :style="getSettingsStyle(1)" />
      <Settings :label="'Depth Test'" class="pos-abs" :style="getSettingsStyle(2)" />

      <Uniform :key="iUni" v-for="(unif, iUni) in uniformsInfo" :label="unif.uniform" class="pos-abs" :style="getUniformnsStyle(iUni)" />
      <!-- <Uniform :label="'Opacity'" class="pos-abs" :style="getUniformnsStyle(1)" />
      <Uniform :label="'Mouse'" class="pos-abs" :style="getUniformnsStyle(2)" />
      <Uniform :label="'Texture'" class="pos-abs" :style="getUniformnsStyle(3)" />
      <Uniform :label="'Progress'" class="pos-abs" :style="getUniformnsStyle(4)" /> -->

      <div class="label-shader-material general-font">
        Shader
        <br />
        Material
      </div>
    </div>
  </div>
  <div class="row">
    <div class="box-a draw-type general-font" :style="getDrawTypeMinWidth(BAs.length)">
      <div class="conn-draw-type-buffer-geometry"></div>
      <div class="conn-draw-type-shader-material"></div>

      <div class="label-draw-type general-font">
        Draw Types
        <br />
        Mesh / Points / Line / Line_Segment
      </div>

    </div>
  </div>
</div>


<div class="overlay">

</div>


</div>
</template>

<script>
import * as THREE from 'three'
import GreyConn from './EditPanel/SVG/GreyConn.vue'
import Uniform from './EditPanel/SVG/Uniform.vue'
import Settings from './EditPanel/SVG/Settings.vue'
import * as CA from './CA.js'

export default {
  props: {
    object: {
    }
  },
  components: {
    Shader: GreyConn,
    BufferAttribute: GreyConn,
    Uniform,
    Settings
  },
  data () {
    return {
      THREE,
      CA,
      BAs: []
    }
  },
  mounted () {
    CA.makeBuffGeo({ buffGeo: this.object.buffGeo }).then((data) => {
      this.BAs = data.BAs
    })
  },
  computed: {
    uniformsInfo () {
      return this.object.material.uniformsInfo
    }
  },
  methods: {
    getBufferAttributeStyle (i) {
      return {
        top: '-300px',
        left: `${-64 + 30 + i * 32}` + 'px'
      }
    },
    getShaderStyle (i) {
      return {
        top: '-300px',
        left: `${-64 + 30 + i * 32}` + 'px'
      }
    },
    getSettingsStyle (i) {
      return {
        top: `${-42 + i * 24}px`,
        right: '-200px'
      }
    },
    getUniformnsStyle (i) {
      return {
        bottom: `${-42 + i * 24}px`,
        right: '-200px'
      }
    },
    getBuffGeoMinWidth (i) {
      let v = (50 + i * 32)
      return {
        'width': `${v > 200 ? v : 200}` + 'px'
      }
    },
    getDrawTypeMinWidth (i) {
      let v = (120 + i * 32)
      return {
        'width': `${v > 300 ? v : 300}` + 'px'
      }
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}

.boxes{
  width: 100%;
  height: 100%;
}

.box-a{
  /* Rectangle 12 Copy: */
  background: #ECE5D3;
  border: 1px solid #E0BBA1;
}

.buffer-geometry {
  position: relative;
  margin-top: 310px;
  margin-left: 80px;
  display: inline-block;
  width: 200px;
  height: 315px;
}

.shader-material {
  position: relative;

  margin-top: 310px;
  margin-left: 30px;
  display: inline-block;
  width: 200px;
  height: 315px;
}

.draw-type {
  position: relative;
  width: 300px;
  height: 100px;
  margin-top: 50px;
  margin-left: 40px;
}

.pos-abs{
  position: absolute;
}

.general-font{
  font-family: Trivial-Light, Trivial, Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #000000;
  letter-spacing: 1.33px;
}

.label-buffer-geometry{
  margin-top: 150px;
  margin-left: 20px;
}
.label-shader-material{
  margin-top: 150px;
  margin-left: 20px;
}

.conn-draw-type-buffer-geometry{
  position: absolute;
  background-image: url('./EditPanel/img/left-conn.svg');
  top: -70px;
  left: 30px;
  width: 100px;
  height: 88px;
  background-size: contain;
  background-repeat: no-repeat no-repeat;
}

.conn-draw-type-shader-material{
  position: absolute;
  background-image: url('./EditPanel/img/left-conn.svg');
  top: -70px;
  right: 0px;
  width: 100px;
  height: 88px;
  background-size: contain;
  background-position: 100% 50%;
  background-repeat: no-repeat no-repeat;
}

.label-draw-type{
  margin-top: 20px;
  text-align: center;
}



</style>
