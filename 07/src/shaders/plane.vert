// plane.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform sampler2D texture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec2 uv;

varying vec2 vTextureCoord;
varying vec3 vColor;


//float n = 5.0;
//float f = 800.0;
	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
    vec3 pos = aVertexPosition;

    vec2 finalUV = aTextureCoord * .5 + uv * .5;
    vec4 color = texture2D(texture, finalUV);
    pos.y += color.r * 20.0;
    pos.x += (uv.x - .5) * 200.0;
    pos.z += (uv.y - .5) * 200.0;

    vec4 V = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    gl_Position = V;

    float depth = 1.0-getDepth(V.z / V.w, 5.0, 800.0);

    vTextureCoord = aTextureCoord;
    depth = mix(color.r * depth, 1.0, .0);
    vColor = vec3(depth);
}
