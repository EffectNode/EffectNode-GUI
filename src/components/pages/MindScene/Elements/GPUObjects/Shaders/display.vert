uniform sampler2D posTex;
uniform float pointSize;

varying vec2 vUv;

void main() {
    vec4 pos = texture2D(posTex, uv);

    vec4 mvPosition = modelViewMatrix * vec4( pos.xyz, 1.0 );
    vec4 outputPos = projectionMatrix * mvPosition;

    vUv = uv;
    gl_Position = outputPos;
    gl_PointSize = pointSize * 1.0;
}
