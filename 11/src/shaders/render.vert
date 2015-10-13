// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform sampler2D textureGold;
uniform float percent;
uniform float range;
uniform float time;
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vOpacity;

vec3 getPosition(vec3 value) {
	vec3 pos;

	pos.x = cos(value.x) * value.z;
	pos.z = sin(value.x) * value.z;
	pos.y = value.y;

	return pos;
}

void main(void) {
	vec3 pos      = aVertexPosition;
	vec2 uv       = aTextureCoord * .5;
	vec2 uvGold   = aTextureCoord + vec2(time, .0);
	if(uvGold.x > 1.0) uvGold.x -= 1.0;
	vec2 uvExtra  = uv + vec2(.5);
	vec3 curr     = getPosition(texture2D(texture, uv).rgb);
	vec3 next     = getPosition(texture2D(textureNext, uv).rgb);
	vec3 extra     = getPosition(texture2D(textureNext, uvExtra).rgb);
	if(next.y < curr.y-range) next.y += range * 2.0;
	pos 		  = mix(curr, next, percent);

	gl_Position   = uPMatrix * uMVMatrix * vec4(pos+vec3(0.0, 150.0, 0.0), 1.0);
	vTextureCoord = aTextureCoord;
	
	gl_PointSize  = .5 + extra.r * 1.5;


	float opacity = 1.0;
	const float fadeRange = 50.0;
	if(pos.y > range - fadeRange) opacity = clamp((range - pos.y) / fadeRange, 0.0, 1.0);
	vec3 colorGold = texture2D(textureGold, uvGold).rgb;
    vColor = vec4(colorGold, 1.0);
    vOpacity = opacity;
    // vColor = vec4(.1);
}