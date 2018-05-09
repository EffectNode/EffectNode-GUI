uniform float time;
uniform vec2 mouse;
uniform sampler2D resTex;

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
  diff = diff * strength * -2.0;

  return diff;
}


vec3 resDiff (in vec3 lastPos, in vec3 mousePos) {
  vec3 diff = lastPos - mousePos;
  diff = normalize(diff) * -1.0;
  return diff;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 lastVel = texture2D(velTex, uv);
    vec4 lastPos = texture2D(posTex, uv);
    vec4 lastRes = texture2D(resTex, uv);

    vec3 diff = getDiff(lastPos.xyz, vec3(mouse, 0.1));
    lastVel.xyz += diff * 15.0;
    gl_FragColor = lastVel;

    // if (mouse.x < 0.0) {
    //     gl_FragColor = lastRes;
    // } else {
    //     vec3 diff = getDiff(lastPos.xyz, vec3(mouse, 0.1));
    //     lastVel.xyz += diff * 15.0;
    //     gl_FragColor = lastVel;
    //     // vec3 diff = resDiff( lastPos.xyz, vec3(lastRes) );
    //     // lastVel.xyz += diff;
    // }

}
