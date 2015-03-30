precision mediump float;
varying vec3 vNormal;
varying vec3 vLightNormal;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

const vec3 lightPosition = vec3(0.0, -100.0, 0.0);
const float lightRadius = 330.0;
const vec3 lightColor = vec3(1.0);
const vec3 ambientColor = vec3(.3);
const float lightWeight = 1.0;
const float PI = 3.141592653;

const float grey = .85;
const vec3 lightPosBlue = vec3(1.0, 0.0, 1.0);
const vec3 lightColorBlue = vec3(grey, grey, .95);
const float lightBlueAmount = .95;

const vec3 lightPosYellow = vec3(-1.0, 0.0, -1.0);
const vec3 lightColorYellow = vec3(.95, .95, grey);
const float lightYellowAmount = .95;

uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;


float overlay(float base, float blend) {
	float result;
	if (base < 0.5) {
	    result = 2.0 * base * blend;
	} else {
	    result = 1.0 - 2.0 * (1.0 - blend) * (1.0 - base);
	}

	return result;
}


vec3 overlay(vec3 base, vec3 blend) {
	return vec3( overlay(base.r, blend.r), overlay(base.g, blend.g), overlay(base.b, blend.b));
}

void main(void) {
	// vec3 color = ambientColor;
	vec3 color = ambientColor * color3;

	vec3 relatePos = vVertexPosition - lightPosition;

	float dist = length(relatePos);
	dist = clamp(dist, 0.0, lightRadius);
	float attenuation = sin((1.0 - dist / lightRadius) * PI * .5);
	float lightAmount = max(0.0, dot(normalize(relatePos), vNormal));
	// color += lightColor * lightAmount * lightWeight * attenuation;
	color += color0 * lightAmount * lightWeight * attenuation;

	//	DIRECTIONAL LIGHTS
	float lightWeightBlue = max(0.0, dot(normalize(lightPosBlue), vLightNormal));
	// color += lightWeightBlue * lightBlueAmount * lightColorBlue;
	color += lightWeightBlue * lightBlueAmount * color1;

	float lightWeightYellow = max(0.0, dot(normalize(lightPosYellow), vLightNormal));
	// color += lightWeightYellow * lightYellowAmount * lightColorYellow;
	color += lightWeightYellow * lightYellowAmount * color2;

    gl_FragColor = vec4(color, 1.0);
}