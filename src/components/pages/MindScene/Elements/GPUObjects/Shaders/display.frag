varying vec2 vUv;
uniform sampler2D picture;
uniform float opacity;

void main() {
    vec4 imgColor = texture2D(picture, vUv);
    imgColor.a = imgColor.a * opacity;

    vec4 outputColor = imgColor;
    gl_FragColor = outputColor;
}
