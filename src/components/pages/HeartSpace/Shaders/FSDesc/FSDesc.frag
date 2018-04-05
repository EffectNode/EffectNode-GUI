varying vec3 vPos;
uniform float time;

mat3 rotateZ(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

void main () {
  gl_FragColor = vec4(vPos * rotateZ(time) + abs(0.5 + sin(time)), 1.0);
}