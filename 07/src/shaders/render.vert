precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform sampler2D texture;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 position;

varying float alpha;
const float PI = 3.141592657;

vec3 getPosition(vec3 color) {
	float theta = color.x;
	float y = color.y;
	float r = color.z;

	return vec3(cos(theta) * r, y, sin(theta) * r);
}

void main(void) {
	vec2 uv      = vec2(aTextureCoord.x*.5, aTextureCoord.y*.5);
	vec2 uvExtra = vec2(aTextureCoord.x*.5, aTextureCoord.y*.5+.5);
	vec4 color   = texture2D(texture, uv);
	vec4 extra   = texture2D(texture, uvExtra);
	vec4 pos     = vec4(aVertexPosition, 1.0);
	pos.xyz      = getPosition(color.rgb);
	pos.xyz      += position;
	
	vec4 V       = uPMatrix * uMVMatrix * pos;
	gl_Position  = V;

	gl_PointSize = extra.x + (sin(extra.y)+1.0) * .5;
	// float a = (sin(extra.y)+1.0) * .5;

	float a = 0.0;
	float dt = abs(extra.y - PI/2.0);
	const float shineRange = .1;
	if( dt < shineRange) {
		a = cos(dt/shineRange*PI * .5);
	}
	alpha = 1.0;
	gl_PointSize = a * 1.5 + extra.z;
}