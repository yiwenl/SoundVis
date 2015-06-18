precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform sampler2D texture;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 position;


vec3 getPosition(vec3 color) {
	float theta = color.x;
	float y = color.y;
	float r = color.z;

	return vec3(cos(theta) * r, y, sin(theta) * r);
}

void main(void) {
	vec2 uv     = vec2(aTextureCoord.x*.5, aTextureCoord.y);
	vec4 color  = texture2D(texture, uv);
	vec4 pos    = vec4(aVertexPosition, 1.0);
	pos.xyz     = getPosition(color.rgb);
	pos.xyz		+= position;
	
	vec4 V      = uPMatrix * uMVMatrix * pos;
	gl_Position = V;
}