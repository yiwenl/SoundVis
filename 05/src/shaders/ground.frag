precision highp float;
varying vec2 vTextureCoord;

const vec2 center = vec2(.5);

const float RADIUS = .01;
const float RANGE = .3;
const float PI = 3.141592657;

uniform float range;
uniform float alpha;

void main(void) {
	float d = distance(center, vTextureCoord);
	float grey = .96;
	float _RANGE = range + RANGE;

	if(d > RADIUS + _RANGE) {
		grey = 0.0;
	} else if(d > RADIUS) {
		float p = (d - RADIUS) / _RANGE;
		// p = cos(PI * p);
		p = 1.0-sin(PI * p * .5);
		grey *= pow(p, 3.0);
	}

    gl_FragColor = vec4(grey, grey, grey*.8, grey*alpha);
}