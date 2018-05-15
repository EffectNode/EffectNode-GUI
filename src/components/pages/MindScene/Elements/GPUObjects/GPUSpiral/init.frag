
#include <common>

// #define M_PI 3.1415926535897932384626433832795
// float atan2(in float y, in float x) {
//   bool xgty = (abs(x) > abs(y));
//   return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
// }

// vec3 fromBall(float r, float az, float el) {
//   return vec3(
//     r * cos(el) * cos(az),
//     r * cos(el) * sin(az),
//     r * sin(el)
//   );
// }
// void toBall(vec3 pos, out float az, out float el) {
//   az = atan2(pos.y, pos.x);
//   el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
// }

// vec3 ballify (vec3 pos, float r) {
//   float az = atan2(pos.y, pos.x);
//   float el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
//   return vec3(
//     r * cos(el) * cos(az),
//     r * cos(el) * sin(az),
//     r * sin(el)
//   );
// }


mat3 rotateZ(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
}

mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
    );
}

uniform sampler2D indexerTexture;

void main() {
  vec2 uv = (gl_FragCoord.xy / resolution.xy);
  vec2 suv = uv * 2.0 - 1.0;
  vec2 lsuv = suv * 17.0;

  vec4 indexer = texture2D(indexerTexture, uv);
  float i = indexer.x;
  float e = indexer.y;

  float k = 1.5; // winder;

  float x = rand(uv + .0) * 3.0 + 17.0 * (sin(PI2 * e * k) * cos(PI2 * e * k) * 1.0);
  float y = rand(uv + .1) * 3.0 + 17.0 * (sin(PI2 * e * k) * sin(PI2 * e * k) * 1.0 - 0.5);
  float z = rand(uv + .2) * 3.0 + 17.0 * (e * 2.0 - 1.0);

  vec4 pt = vec4(x, y, z, 1.0);
  pt.xyz = rotateX(PI * 0.5) * pt.xyz;

  // pt.x += pt.x * rand(uv);
  // pt.z += pt.z * rand(uv + .1);
  // pt.z += pt.z * rand(uv + .2);

  gl_FragColor = pt;

  // spiral
  // float x = 17.0 * (cos(PI2 * indexer.y) * sin(PI2 * indexer.y) * 2.0);
  // float y = 17.0 * (sin(PI2 * indexer.y) * sin(PI2 * indexer.y) * 2.0 - 1.0);
  // gl_FragColor = vec4(x, y, 17.0 * indexer.y, 1.0);
}
