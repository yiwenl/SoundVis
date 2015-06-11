precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float count;
uniform sampler2D texture;

varying vec2 vTextureCoord;
varying float vHeightOffset;

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

const float PI = 3.141592657;
const vec3 YAXIS = vec3(0.0, 1.0, 0.0);

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
	mat4 rot = rotationMatrix(YAXIS, -count*PI*2.0);
	pos = (rot * vec4(pos, 1.0)).xyz;
	pos.y += height * 50.0 * heightOffset;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vHeightOffset = heightOffset*height;

    gl_PointSize = 1.0 + 3.0 * rand(uv);
}