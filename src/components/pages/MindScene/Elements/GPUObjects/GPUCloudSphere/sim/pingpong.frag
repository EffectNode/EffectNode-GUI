#include <common>
precision highp sampler2D;

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

vec3 ballify (vec3 pos, float r) {
  float az = atan2(pos.y, pos.x);
  float el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
  return vec3(
    r * cos(el) * cos(az),
    r * cos(el) * sin(az),
    r * sin(el)
  );
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

// float Gravity(float z) {
//   float G, eZ;
//   const float ER = 6378150.0;
//   const float ER2 = 6378150.0 * 6378150.0;
//   eZ = ER + z;
//   G = 9.81 * ER2 / (eZ * eZ);
//   return G;
// }

float constrain(float val, float min, float max) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

vec3 getDiff (vec3 lastPos, vec3 mouse) {
  vec3 diff = lastPos.xyz - mouse;
  float distance = constrain(length(diff), 1.0, 5.0);
  float strength = 1.0 / (distance * distance);

  diff = normalize(diff);
  diff = diff * strength * -1.0;


  return diff;
}

vec3 resDiff (in vec3 lastPos, in vec3 mouse) {
  vec3 diff = lastPos - mouse;
  diff = normalize(diff) * -1.0;
  return diff;
}

float MATH_EQ = 1.0;

uniform float time;
uniform sampler2D lastTexture;
uniform sampler2D indexerTexture;

uniform vec3 mouse;
uniform float tapCount;

void main() {
  MATH_EQ = mod(tapCount, 12.0);

  // Enforce edit
  // MATH_EQ = 12.0;

  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 indexer = texture2D(indexerTexture, uv);
  vec4 lastPos = texture2D(lastTexture, uv);

  float i = indexer.x;
  float e = indexer.y;
  float u = indexer.z;

  vec3 nextPos = vec3(lastPos);

  if (MATH_EQ == 0.0) {
    float k = 1.0 + time;
    k = 1.0 + mod(k, 5.0);

    float x = 0.5 - sin(e * M_PI * 2.0 * k) * sin(e * M_PI * 2.0 * k);
    float y = sin(e * M_PI * 2.0 * k) * cos(e * M_PI * 2.0 * k);
    float z = sin(i / u * M_PI * 2.0) * 2.0;


    vec3 ball1 = ballify(vec3(x, y, z), 1.0);

    nextPos = ballify(ball1 + nextPos, 17.0);
    nextPos += getDiff(nextPos, mouse * 18.0) * 50.0;
  } else if (MATH_EQ == 1.0) {
    float x = 0.5 - rand(uv + .1);
    float y = 0.5 - rand(uv + .2);
    float z = 0.5 - rand(uv + .3);

    vec3 ball1 = ballify(vec3(x, y, z), 1.0);

    nextPos = ballify(ball1 + nextPos, 17.0);
    nextPos += getDiff(nextPos, mouse * 17.0) * 50.0;
  } else if (MATH_EQ == 2.0) {
    float k = 2.5 - mouse.y * 1.5; // winder;

    vec3 startPos = vec3(
      rand(uv + .1) * 4.0,
      rand(uv + .2) * 4.0,
      rand(uv + .3) * 4.0
    );

    float x = cnoise(vec2(time + startPos.xx + .1)) * rand(startPos.xx + .0) * 3.5 + 17.0 * (sin(PI2 * e * k) * cos(PI2 * e * k) * 1.0);
    float y = cnoise(vec2(time + startPos.yy + .2)) * rand(startPos.yy + .1) * 3.5 + 17.0 * (sin(PI2 * e * k) * sin(PI2 * e * k) * 1.0 - 0.5);
    float z = cnoise(vec2(time + startPos.zz + .3)) * rand(startPos.zz + .2) * 3.5 + 17.0 * (e * 2.0 - 1.0);
    vec3 pt = rotateX(PI * 0.5) * vec3(x, y, z);

    vec3 updatedPos = vec3(pt);
    nextPos = updatedPos * rotateY(time * 1.5);

  } else if (MATH_EQ == 3.0) {

    float t = M_PI * 2.0 * e * 20.0;

    float x = 17.0 * sin(8.0 * t / 5.0) * cos(t);
    float y = 17.0 * sin(8.0 * t / 5.0) * sin(t);
    float z = rand(uv) * 1.5;

    vec3 pt = vec3(x, y, z);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 4.0) {

    float addon = time;
    float t = M_PI * 2.0 * e * 1.0;
    float t2 = M_PI * 2.0 * e * 2.0;
    float sinTheta = sin(2.5 * t + addon);
    float sinTheta2 = sinTheta * sinTheta;
    float cosTheta = cos(2.5 * t + addon);
    float cosTheta4 = cosTheta * cosTheta * cosTheta * cosTheta;
    float r1 = 0.5 - rand(uv);

    float x = 17.0 * (sinTheta2 + cosTheta4) * cos(t);
    float y = 17.0 * (sinTheta2 + cosTheta4) * sin(t);
    float z = r1 * 7.0;

    vec3 pt = vec3(x, y, z);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 5.0) {

    float t = M_PI * 2.0 * e * 1.0;

    float r1 = rand(uv);
    float x = 10.0 * cos(t) - 3.5 * cos(18.0 * t / 2.0);
    float y = 10.0 * sin(t) - 3.5 * sin(18.0 * t / 2.0);
    float z = r1 * 3.0;

    vec3 pt = vec3(x, y, z);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 6.0) {

    float t = M_PI * 2.0 * e * 1.0;

    float r1 = rand(uv);
    float x = 17.0 * cos(t + 0.5 * sin(50.0 * t));
    float y = 17.0 * sin(t + 0.5 * cos(50.0 * t));
    float z = r1 * 2.0;

    vec3 pt = vec3(x, y, z);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 7.0) {

    float t = M_PI * 2.0 * e;

    float r1 = rand(uv);
    float x = 40.0 * sin(3.5 * t) / (4.0 + t * t);
    float y = 40.0 * cos(3.5 * t) / (4.0 + t * t);
    float z = r1 * 1.0;

    vec3 pt = vec3(x, y, z);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 8.0) {

    float t = M_PI * 2.0 * e;

    float r1 = rand(uv);
    float x = 15.0 * cos(5.0 * t);
    float y = 15.0 * sin(3.0 * t);
    float z = r1 * 1.0;

    vec3 pt = vec3(x, y, z);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 9.0) {

    float t = M_PI * 2.0 * e;

    float x = 0.5 - fract(i / u);
    float y = 0.5 - e;
    float z = 0.0;

    vec3 pt = vec3(x * 1.3, y * -1.3, z) * 14.0;
    // pt = ballify(pt, 14.0);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 10.0) {

    float t = M_PI * 2.0 * e;

    float r1 = rand(uv + .1);
    float r2 = rand(uv + .2);
    float r3 = rand(uv + .3);

    float lx = lastPos.x;
    float ly = lastPos.y;
    float lz = lastPos.z;

    float x = 0.5 - fract(i / u);
    float y = 0.5 - e;
    float z = 0.0;

    x *= 1.4;
    y *= 1.4;

    x = x + sin(t + time * 25.0) * 0.04;
    y = y + cos(t + time * 25.0) * 0.04;
    z = z + sin(t + time * 25.0) * 0.04;

    x += sin(lx) * 0.0;

    vec3 pt = vec3(x, y, z) * 15.0;

    // pt = ballify(pt, 14.0);
    nextPos.xyz = rotateZ(time) * rotateY(mouse.x) * rotateX(-mouse.y) * pt;
  } else if (MATH_EQ == 11.0) {
    float x = (0.5 - rand(uv + .1)) * 17.0;
    float y = (0.5 - rand(uv + .2)) * 17.0;
    float z = (0.5 - rand(uv + .3)) * 17.0;

    float nx = nextPos.x;
    float ny = nextPos.y;
    float nz = nextPos.z;

    float roller = M_PI * 2.0 * e + time + nz * 0.3 * sin(ny * 0.5 * nx * 0.5 + 30.0 * fract(time));


    x = 0.1 * x * sin(roller) * sin(roller);
    y = 0.1 * y * cos(roller) * cos(roller);
    z = 0.1 * z * sin(roller) * cos(roller);

    nextPos.xyz = vec3(nx + x, ny + y, nz + z);
    nextPos += getDiff(nextPos, mouse * 30.0) * 50.0;
    nextPos = ballify(nextPos, 17.0);
  } else {
    float x = (0.5 - rand(uv + .1)) * 17.0;
    float y = (0.5 - rand(uv + .2)) * 17.0;
    float z = (0.5 - rand(uv + .3)) * 17.0;

    nextPos.xyz = vec3(x,y,z);
  }

  gl_FragColor = vec4(nextPos, 1.0);
}