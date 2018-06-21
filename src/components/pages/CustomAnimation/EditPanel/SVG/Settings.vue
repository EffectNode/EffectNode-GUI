<template>

  <svg width="215px" height="65px" viewBox="0 0 215 65" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch -->
      <desc>Created with Sketch.</desc>
      <defs>
          <rect id="path-1 + rand2" x="69" y="0" width="146" height="20"></rect>
          <circle id="path-2 + rand" cx="4" cy="61" r="4"></circle>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Desktop-HD-Copy-2" transform="translate(-613.000000, -929.000000)">
              <g id="Group-13-Copy" transform="translate(613.000000, 929.000000)">
                  <g id="box" class="hover" @click="$emit('click')" >
                      <use fill="#ECE5D3" fill-rule="evenodd" xlink:href="#path-1 + rand2"></use>
                      <rect stroke="#E0BBA1" stroke-width="1" x="69.5" y="0.5" width="145" height="19"></rect>
                  </g>
                  <polyline id="node-line" stroke="#E0BBA1" stroke-linecap="square" transform="translate(38.500000, 35.500000) scale(-1, -1) translate(-38.500000, -35.500000) " points="8 61 30.4695944 61 47.2463235 10 69 10"></polyline>
                  <g id="Node-uniform">
                      <use fill="#E5D8B5" fill-rule="evenodd" xlink:href="#path-2 + rand"></use>
                      <circle stroke="#B93705" stroke-width="1" cx="4" cy="61" r="3.5"></circle>
                  </g>
                  <text class="hover" @click="$emit('click')"  x="143.5" y="14" text-anchor="middle" id="text" font-family="Trivial-Light, Trivial" font-size="12" font-weight="300" letter-spacing="1.333334" fill="#000000">
                      <tspan>{{ label }}</tspan>
                  </text>

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

<style scpoed>
.hover{
    cursor: pointer;
}
</style>