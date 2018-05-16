uniform sampler2D posTex;
uniform float pointSize;
uniform sampler2D indexerTexture;

varying vec2 vUv;

uniform float time;

void main() {
    vec4 info = texture2D(indexerTexture, uv);

    vec4 pos = texture2D(posTex, uv);

    vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);
    vec4 outputPos = projectionMatrix * mvPosition;

    // outputPos.y = outputPos.y + sin(outputPos.y + time * 50.0) * sin(outputPos.y + time * 50.0);
    // outputPos.x = outputPos.x + cos(outputPos.x + time * 50.0) * sin(outputPos.x + time * 50.0);

    vUv = uv;

    gl_Position = outputPos;
    gl_PointSize = pointSize;
}
