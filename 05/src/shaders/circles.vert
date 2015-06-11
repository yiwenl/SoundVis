precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float count;
uniform sampler2D texture;

varying vec2 vTextureCoord;
varying float vHeightOffset;

const float PI = 3.141592657;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
	vec2 uv = aTextureCoord;
	uv.x -= count;
	uv.x = mod(uv.x, 1.0);
	if(uv.x > .5) uv.x = 1.0 - uv.x;
	// uv.x *= .65;
	// float heightOffset = sin(uv.y*PI*.5);
	float heightOffset = uv.y;

	heightOffset = pow(heightOffset, 4.0) + .1;


	// uv.y = mod(uv.y, 1.0);
	// if(uv.x < 0.0) uv.x += 1.0;
	float height = texture2D(texture, uv).r * 1.5;
	vec3 pos = aVertexPosition;
	pos.y += height * 50.0 * heightOffset;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vHeightOffset = heightOffset*height;

    gl_PointSize = 1.0 + 3.0 * rand(uv);
}