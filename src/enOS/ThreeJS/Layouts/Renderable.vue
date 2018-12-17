<template>
  <div>
    <!--
      px
      py
      pz

      sx
      sy
      sz

      rx
      ry
      rz
      -->

    <Object3D
      :sx="4"
      :sy="4"
      :sz="4"
      @attach="(v) => { $parent.$emit('add', v) }"
      @detach="(v) => { $parent.$emit('remove', v) }"
    >
      <Points>
        <BoxBufferGeometry :num="128" />
        <ShaderMaterial :vs="simple.vs" :fs="simple.fs" :uniforms="animatable" />
      </Points>
    </Object3D>
  </div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
import * as THREE from 'three'

export default {
  components: {
    ...Bundle
  },
  data () {
    return {
      THREE,
      simple: {
        vs: `
varying vec3 vPos;
uniform float time;

mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
    );
}

mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
}

mat3 rotateZ(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

void main (void) {
  vec3 newPos = position;
  newPos = rotateZ(time + newPos.z * 1.5) * newPos;

  // newPos.z *= sin(newPos.z + time);

  newPos = rotateX(3.14159265 * 0.5) * newPos;

  vPos = position;

  vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
  gl_PointSize = 1.0;
}
        `,
        fs: `
varying vec3 vPos;
uniform float time;

void main () {
  gl_FragColor = vec4(vec3(1.0), 1.0);
}
        `
      },
      animatable: {
        time: { value: 0 }
      }
    }
  },
  methods: {
    animate () {
      let time = window.performance.now() * 0.001
      this.animatable.time.value = time
    },
    looper () {
      var self = this
      let rAFID = this
      function loop () {
        rAFID = window.requestAnimationFrame(loop)
        self.animate()
      }
      rAFID = window.requestAnimationFrame(loop)
      self.clean = () => {
        window.cancelAnimationFrame(rAFID)
      }
    }
  },
  mounted () {
    this.looper()
  },
  beforeDestroy () {
    this.clean()
  }
}
</script>

<style>

</style>
