<template>
  <svg width="64px" height="330px" viewBox="0 0 64 330" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch -->
      <desc>Created with Sketch.</desc>
      <defs>
          <rect :id="'path-1-bobobobobo' + rand" x="0" y="0" width="28" height="204"></rect>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Desktop-HD-Copy-2" transform="translate(-140.000000, -126.000000)">
              <g id="Group-7" transform="translate(140.000000, 126.000000)">
                  <g id="Group-5-Copy-7">
                      <polyline id="Line" stroke="#707070" stroke-linecap="square" transform="translate(37.500000, 262.500000) rotate(-90.000000) translate(-37.500000, -262.500000) " points="-21 284 22.0974188 284 54.2757353 241 96 241"></polyline>
                      <circle id="Node" stroke="#686868" stroke-width="3" transform="translate(58.500000, 324.500000) rotate(-90.000000) translate(-58.500000, -324.500000) " cx="58.5" cy="324.5" r="3.5"></circle>
                      <g id="LabelBox" class="hover" @click="$emit('click')">
                          <use fill="#D8D8D8" fill-rule="evenodd" :xlink:href="'#path-1-bobobobobo' + rand"></use>
                          <rect stroke="#686868" stroke-width="1" x="0.5" y="0.5" width="27" height="203"></rect>
                      </g>
                      <text class="hover" @click="$emit('click')" text-anchor="middle" id="Position" transform="translate(12.500000, 102.000000) rotate(-90.000000) translate(-12.500000, -102.000000) " font-family="Trivial-Light, Trivial" font-size="12" font-weight="300" letter-spacing="1.333334" fill="#121212">
                          <tspan x="10.0" y="107">{{label}}</tspan>
                      </text>
                  </g>
              </g>
          </g>
      </g>
  </svg>
</template>

<script>
export default {
  props: {
    label: {
      default () {
        return 'opacity'
      }
    }
  },
  data () {
    return {
      rand: ('_' + Math.random()).replace(',', ''),
      rand2: ('_' + Math.random()).replace(',', '')
    }
  }
}
</script>

<style scoped>
.hover{
    cursor: pointer;
}
</style>
