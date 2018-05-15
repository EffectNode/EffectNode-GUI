#include <common>

//  Classic Perlin 3D Noise
//  by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
      vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

#define M_PI 3.1415926535897932384626433832795
float atan2(in float y, in float x) {
  bool xgty = (abs(x) > abs(y));
  return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
}

vec3 fromBall(float r, float az, float el) {
  return vec3(
    r * cos(el) * cos(az),
    r * cos(el) * sin(az),
    r * sin(el)
  );
}
void toBall(vec3 pos, out float az, out float el) {
  az = atan2(pos.y, pos.x);
  el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
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

uniform float time;
uniform sampler2D startTexture;
uniform sampler2D indexerTexture;
uniform sampler2D simTexture;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 indexer = texture2D(indexerTexture, uv);
  vec4 startPos = texture2D(startTexture, uv);
  vec4 simVal = texture2D(simTexture, uv);

  float i = indexer.x;
  float e = indexer.y;

  float k = 3.0; // winder;

  float x = cnoise(vec2(time + startPos.xx + .1)) * rand(startPos.xx + .0) * 3.5 + 17.0 * (sin(PI2 * e * k) * cos(PI2 * e * k) * 1.0);
  float y = cnoise(vec2(time + startPos.yy + .2)) * rand(startPos.yy + .1) * 3.5 + 17.0 * (sin(PI2 * e * k) * sin(PI2 * e * k) * 1.0 - 0.5);
  float z = cnoise(vec2(time + startPos.zz + .3)) * rand(startPos.zz + .2) * 3.5 + 17.0 * (e * 2.0 - 1.0);

  vec4 pt = vec4(x, y, z, 1.0);

  pt.xyz = rotateX(PI * 0.5) * pt.xyz;

  vec3 updatedPos = vec3(pt);
  updatedPos = updatedPos * rotateY(time * 1.5);

  updatedPos += vec3(simVal) * 0.01;

  // updatedPos += ballify(updatedPos + updatedPos * cnoise(updatedPos.xy), 0.1);

  gl_FragColor = vec4(updatedPos, 1.0);
}

