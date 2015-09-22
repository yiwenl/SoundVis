// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform float percent;

varying vec2 vTextureCoord;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertex;

float map(float value, float sx, float sy, float tx, float ty) {
	float p = clamp((value - sx) / (sy - sx), 0.0, 1.0);
	return tx + p * (ty - tx);
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float cubicIn(float t) {
  return t * t * t;
}

#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

float sineIn(float t) {
  return sin((t - 1.0) * HALF_PI) + 1.0;
}

float quarticIn(float t) {
  return pow(t, 4.0);
}



vec3 getPosition(vec3 color) {
	float theta = color.z;
	float y = color.y;
	float r = color.x;

	return vec3(cos(theta) * r, y, sin(theta) * r);
}



void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;
	vec3 p0 = texture2D(texture, uv).rgb;
	vec3 p1 = texture2D(textureNext, uv).rgb;

	pos.xyz = getPosition(mix(p0, p1, percent));
	if(p0.y < p1.y) pos.y += 1000.0;
	vec3 N = vec3(pos.x, pos.y*.5, pos.z);
	vNormal = normalize(N);
	pos.y -= 500.0;
	
	vVertex = pos.xyz;


    gl_Position = uPMatrix * (uMVMatrix * vec4(pos, 1.0));
    vTextureCoord = aTextureCoord;

    gl_PointSize = 1.0;
    vColor = vec3(1.0);
}