#include <common>

uniform sampler2D positionInfo;
uniform sampler2D velocityInfo;

varying vec4 particleVel;


// #define M_PI 3.1415926535897932384626433832795

// float atan2(in float y, in float x) {
// 	bool xgty = (abs(x) > abs(y));
// 	return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
// }

// vec3 fromBall(float r, float az, float el) {
// 	return vec3(
//     r * cos(el) * cos(az),
//     r * cos(el) * sin(az),
//     r * sin(el)
//   );
// }

// void toBall(vec3 pos, out float az, out float el) {
// 	az = atan2(pos.y, pos.x);
// 	el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
// }

void main() {
  vec2 cellSize = vec2( 1.0 / WIDTH, 1.0 / WIDTH );
  #include <uv_vertex>

  // vec3 objectNormal = vec3(
  //   ( texture2D( fireworkPosition, uv + vec2( - cellSize.x, 0 ) ).x - texture2D( fireworkPosition, uv + vec2( cellSize.x, 0 ) ).x ) * WIDTH / BOUNDS,
  //   ( texture2D( fireworkPosition, uv + vec2( 0, - cellSize.y ) ).x - texture2D( fireworkPosition, uv + vec2( 0, cellSize.y ) ).x ) * WIDTH / BOUNDS,
  //   1.0 );

  vec3 objectNormal = vec3(1.0);

  vec4 fireworkCoord = texture2D( positionInfo, uv );
  particleVel = texture2D( velocityInfo, uv );

  vec3 transformed = vec3( fireworkCoord.x, fireworkCoord.y, fireworkCoord.z );

  gl_PointSize = 1.0;

  // float az = 0.0;
  // float el = 0.0;
  // vec3 noiser = transformed;
  // toBall(noiser, az, el);
  // vec3 newPos = fromBall(70.0, az, el);

  vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;

  gl_Position = outputPos;

}