uniform sampler2D posTex;
uniform sampler2D velTex;

uniform float pointSize;

varying vec4 parVel;
varying vec2 vUv;

void main() {
    vec4 pos = texture2D(posTex, uv);
    vec4 vel = texture2D(velTex, uv);

    vec4 mvPosition = modelViewMatrix * vec4( pos.xyz, 1.0 );
    vec4 outputPos = projectionMatrix * mvPosition;

    vUv = uv;
    parVel = vel;
    gl_Position = outputPos;
    gl_PointSize = pointSize * 1.0;
}


