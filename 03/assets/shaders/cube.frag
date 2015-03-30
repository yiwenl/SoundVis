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
const float lightBlueAmount = .5;

const vec3 lightPosYellow = vec3(-1.0, 0.0, -1.0);
const vec3 lightColorYellow = vec3(.95, .95, grey);
const float lightYellowAmount = .5;


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
	vec3 color = ambientColor;

	vec3 relatePos = vVertexPosition - lightPosition;

	// vec3 lightDirNorm = normalize(lightDirection);
	float dist = length(relatePos);
	dist = clamp(dist, 0.0, lightRadius);
	float attenuation = sin((1.0 - dist / lightRadius) * PI * .5);
	float lightAmount = max(0.0, dot(normalize(relatePos), vNormal));
	color += lightColor * lightAmount * lightWeight * attenuation;

	//	DIRECTIONAL LIGHTS
	float lightWeightBlue = max(0.0, dot(normalize(lightPosBlue), vLightNormal));
	color += lightWeightBlue * lightBlueAmount * lightColorBlue;

	float lightWeightYellow = max(0.0, dot(normalize(lightPosYellow), vLightNormal));
	color += lightWeightYellow * lightYellowAmount * lightColorYellow;

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vLightNormal*.5 + .5, 1.0);
}