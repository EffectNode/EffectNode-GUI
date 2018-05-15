varying vec2 vUv;
uniform sampler2D picture;
uniform float opacity;

void main() {
    vec4 imgColor = texture2D(picture, vUv);

    vec4 outputColor = imgColor;
    outputColor.a = outputColor.a * opacity;

    gl_FragColor = outputColor;
}
