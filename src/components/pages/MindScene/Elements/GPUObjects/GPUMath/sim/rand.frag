
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

uniform sampler2D indexerTexture;

void main() {
  vec2 uv = (gl_FragCoord.xy / resolution.xy);

  vec4 info = texture2D(indexerTexture, uv);
  float i = info.x;
  float e = info.y;
  float u = info.z;

  // float x = rand(vec2(e) + .1) * 2.0 - 1.0;
  // x *= 10.0;
  // float y = rand(vec2(e) + .2) * 2.0 - 1.0;
  // y *= 10.0;
  // float z = rand(vec2(e) + .3) * 2.0 - 1.0;
  // z *= 10.0;

  float k = 1.0 + 0.0;
  k = 1.0 + mod(k, 5.0);

  float x = 0.5 - sin(e * M_PI * 2.0 * k) * sin(e * M_PI * 2.0 * k);
  float y = sin(e * M_PI * 2.0 * k) * cos(e * M_PI * 2.0 * k);
  float z = sin(i / u * M_PI * 2.0) * 2.0;

  vec3 ball1 = vec3(x, y, z);

  gl_FragColor = vec4(
    // ballify(vec3(x, y, z), 20.0),
    // x, y, z,
    // vec3(0.0),
    ball1,
    1.0
  );
}
