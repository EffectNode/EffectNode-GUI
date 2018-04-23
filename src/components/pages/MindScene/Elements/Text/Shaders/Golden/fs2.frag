/*
FFFFFFF  SSSSS
FF      SS
FFFF     SSSSS
FF           SS
FF       SSSSS
*/
// Uniforms //
uniform float time;
// uniform sampler2D uImage1;
uniform sampler2D text;
uniform sampler2D pattern;

// Varyings //
// varying vec3 vPos;
varying vec2 vUv;

// Functions //
void entry_frrCO (vec4 color, float r, float g, float b, float a) {
  gl_FragColor = color + vec4(r, g, b, a);
}

vec4 textureReader_xvHRR () {
  vec4 textColor = texture2D(text, vUv);
  return textColor;
}


// Main function executions //
void main () {

  vec4 textureReader_xvHRR_result = textureReader_xvHRR();
  // entry_frrCO(
  //   textureReader_xvHRR_result,
  //   0.0,
  //   0.0,
  //   0.0,
  //   1.0
  // );

  gl_FragColor = textureReader_xvHRR_result;
}
