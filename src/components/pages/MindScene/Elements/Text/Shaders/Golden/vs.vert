// varying vec3 vPos;
uniform float time;
varying vec2 vUv;
void main (void) {
  // vPos = position;
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
  gl_PointSize = 1.0;
}