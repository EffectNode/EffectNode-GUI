#include <common>

uniform vec2 mousePos;

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
// float az = 0.0;
// float el = 0.0;
// vec3 noiser = vec3(lastVel);
// toBall(noiser, az, el);
// lastVel.xyz = fromBall(1.0, az, el);

void main()	{
  vec2 cellSize = 1.0 / resolution.xy;
  vec2 uv = gl_FragCoord.xy * cellSize;

  vec4 lastVel = texture2D( velocityInfo, uv );
  vec4 lastPos = texture2D( positionInfo, uv );

  float noisiness = 9.0;

  float az = 0.0;
  float el = 0.0;

  vec3 noiser = vec3(lastPos) + cnoise(vec2(lastVel * noisiness)) * noisiness * 0.5;
  toBall(noiser, az, el);
  if (rand(lastVel.xy) > 0.33333) {
    lastPos.xyz = fromBall(75.0, az, el);
  } else {
    lastPos.xyz += fromBall(-6.0, az, el);
  }

  lastPos.xyz += lastVel.xyz * noisiness;
  gl_FragColor = lastPos;
}
