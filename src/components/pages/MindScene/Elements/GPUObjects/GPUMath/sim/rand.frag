
#include <common>

#define M_PI 3.1415926535897932384626433832795
float atan2(in float y, in float x) {
  bool xgty = (abs(x) > abs(y));
  return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
}

vec3 ballify (vec3 pos, float r) {
  float az = atan2(pos.y, pos.x);
  float el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
  return vec3(
    r * cos(el) * cos(az),
    r * cos(el) * sin(az),
    r * sin(el)
  );
}

void main() {
  vec2 uv = (gl_FragCoord.xy / resolution.xy);

  float x = rand(uv + .1) * 2.0 - 1.0;
  x *= 10.0;
  float y = rand(uv + .2) * 2.0 - 1.0;
  y *= 10.0;
  float z = rand(uv + .3) * 2.0 - 1.0;
  z *= 10.0;

  gl_FragColor = vec4(
    ballify(vec3(x, y, z), 20.0),
    // x, y, z,
    1.0
  );
}
