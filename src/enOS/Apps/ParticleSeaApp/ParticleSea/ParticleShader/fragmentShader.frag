
#include <common>

varying vec4 particleVel;

void main() {

  vec4 rainbow = particleVel;

  vec4 outputColor = vec4(
  	rainbow.x + 0.6,
  	(rainbow.y * rainbow.x) + 0.6,
  	rainbow.y + 0.6,
  	0.2
  );

  gl_FragColor = outputColor;

  // gl_FragColor = vec4( vec3(0.0,0.0,1.0) , 0.5);
}
