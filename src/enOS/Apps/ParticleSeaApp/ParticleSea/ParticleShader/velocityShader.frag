#include <common>

uniform vec2 mousePos;

float constrain(float val, float min, float max) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

vec3 getDiff (in vec3 lastPos, in vec3 mousePos) {
  vec3 diff = lastPos.xyz / 33.3 - mousePos;
  float distance = constrain(length(diff), 5.0, 100.0);
  float strength = 0.35 / (distance * distance);

  diff = normalize(diff);
  // delta
  diff = diff * strength * -2.0;
  // diff = diff * strength * (-20.83) * (1.0 / delta) * 0.0183;

  return diff;
}


void main()	{
  vec2 cellSize = 1.0 / resolution.xy;
  vec2 uv = gl_FragCoord.xy * cellSize;

  vec4 lastPos = texture2D( positionInfo, uv );
  vec4 lastVel = texture2D( velocityInfo, uv );


  vec3 diff = getDiff( lastPos.xyz, vec3(mousePos, 0.1) );

  lastVel.xyz += diff;

  gl_FragColor = lastVel;
}
