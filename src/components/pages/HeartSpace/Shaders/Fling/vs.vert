varying vec3 vPos;
uniform float time;

void main (void) {
  vPos = position;
  vPos.x = vPos.x + sin(vPos.x + time);
  vPos.y = vPos.y + cos(vPos.y + time);
  vPos.z = vPos.z + tan(vPos.z + time);

  vec4 mvPosition = modelViewMatrix * vec4(vPos, 1.0);
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
  gl_PointSize = 1.0;
}
