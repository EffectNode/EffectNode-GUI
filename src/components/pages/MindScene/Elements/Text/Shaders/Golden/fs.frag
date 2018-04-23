// varying vec3 vPos;
varying vec2 vUv;

uniform float time;
uniform sampler2D text;
uniform sampler2D pattern;

void main () {
  vec4 textColor = texture2D(text, vUv);

  vec2 swifting = vUv;
  swifting.x = swifting.x + time * 0.3;
  swifting.x = fract(swifting.x);

  swifting.y = swifting.y + time * 0.3;
  swifting.y = fract(swifting.y);
  vec4 pattern = texture2D(pattern, swifting);

  gl_FragColor = vec4(vec3((1.0 - textColor) * pattern), textColor.a * 1.0);
}

