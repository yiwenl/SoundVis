precision mediump float;

varying vec4 vColor;
varying float vOpacity;

void main(void) {
    gl_FragColor = vColor;
    gl_FragColor *= vOpacity;
}