varying vec3 vPos;
uniform float time;

void main () {
  gl_FragColor = vec4(vec3(vPos + 0.5 + abs(sin(time)) * 0.5), 1.0);
}