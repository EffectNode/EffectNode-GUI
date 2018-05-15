
#include <common>

void main() {
  vec2 uv = (gl_FragCoord.xy / resolution.xy);

  float x = rand(uv + .1) * 2.0 - 1.0;
  x *= 10.0;
  float y = rand(uv + .2) * 2.0 - 1.0;
  y *= 10.0;
  float z = rand(uv + .3) * 2.0 - 1.0;
  z *= 10.0;

  gl_FragColor = vec4(
    x,
    y,
    z,
    1.0
  );
}
