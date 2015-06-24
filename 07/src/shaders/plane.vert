// plane.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform sampler2D texture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
varying vec3 vColor;

void main(void) {
    vec3 pos = aVertexPosition;

    vec4 color = texture2D(texture, aTextureCoord);
    pos.y += color.r * 20.0;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);

    vTextureCoord = aTextureCoord;

    vColor = vec3(color.r);
}
