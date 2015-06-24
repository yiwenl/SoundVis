precision mediump float;
varying vec2 vTextureCoord;

uniform sampler2D texture;

float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / ( sy - sx);
	return tx + p * ( ty - tx);
}


float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7)); 
	return fract(sin(h)*43758.5453123);
}

float noise( in vec2 p ) {
	vec2 i = floor( p );
	vec2 f = fract( p );    
	vec2 u = f*f*(3.0-2.0*f);
	return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
					 hash( i + vec2(1.0,0.0) ), u.x),
				mix( hash( i + vec2(0.0,1.0) ), 
					 hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

const float RX = 1.6;
const float RY = 1.2;
const mat2 rotation = mat2(RX,RY,-RY,RX);
const int NUM_ITER = 10;
const float PI = 3.141592657;
uniform float time;
uniform float soundOffset;

const vec2 center = vec2(.5);


void main(void) {   
	float offset = 5.000 + soundOffset * 2.0;
	vec2 uv = vTextureCoord * (soundOffset + 1.0);
	float grey = 0.0;

	float scale = 0.5;
	for(int i=0; i<NUM_ITER; i++) {
		grey += noise(uv*offset+time) * scale;
		offset *= 1.5 + soundOffset * 1.0;
		scale *= 0.22 * (1.0 + soundOffset * .25);
		uv *= rotation;
	}

	float dist = distance(vTextureCoord, center) - time*.1;
	float waveOffset = (sin(dist * 50.0 + soundOffset * 150.0) + 1.0) * .5;

	grey = (grey + 1.0) * 0.5;
	// grey *= waveOffset*.5 + .5;
	grey *= mix(waveOffset, 1.0, 1.0-soundOffset*.65);

	vec3 color = vec3(grey);

	gl_FragColor = vec4(vec3(grey), 1.0);

}