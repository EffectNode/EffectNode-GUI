varying vec3 vPos;
uniform float time;

void main (void) {
  vPos = position;
  // vPos.x = vPos.x + sin(vPos.x + time);
  // vPos.x = vPos.x + cos(vPos.x + time);
  // vPos.z = vPos.z + sin(vPos.z + time);

//   vPos = position * rotateZ(time);

  vec4 mvPosition = modelViewMatrix * vec4(vPos, 1.0);
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
  gl_PointSize = 1.0;
}
