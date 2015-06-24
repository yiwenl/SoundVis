// plane.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform sampler2D texture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
varying vec3 vColor;


//float n = 5.0;
//float f = 800.0;
	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
    vec3 pos = aVertexPosition;

    vec4 color = texture2D(texture, aTextureCoord);
    pos.y += color.r * 20.0;

    vec4 V = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    gl_Position = V;

    float depth = 1.0-getDepth(V.z / V.w, 5.0, 800.0);

    vTextureCoord = aTextureCoord;

    vColor = vec3(color.r * depth);
}
