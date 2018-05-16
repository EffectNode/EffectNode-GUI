
// uniform sampler2D posTex;

uniform sampler2D picture;
uniform float opacity;

varying vec2 vUv;

void main() {
    // vec4 posColor = texture2D(posTex, vUv);

    vec4 imgColor = texture2D(picture, vUv);

    vec4 outputColor = imgColor;
    outputColor.a = outputColor.a * opacity;

    // outputColor.xyz *= posColor.xyz;

    gl_FragColor = outputColor;
}
