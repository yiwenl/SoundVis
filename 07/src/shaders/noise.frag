precision mediump float;
varying vec2 vTextureCoord;

uniform sampler2D textureSpectrum;

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
const vec2 rippleCenter = vec2(.5, .5);


void main(void) {   
	float offset = 5.000;
	vec2 uv = vTextureCoord;
	float grey = 0.0;

	float scale = 0.5;
	for(int i=0; i<NUM_ITER; i++) {
		grey += noise(uv*offset+time) * scale;
		offset *= 1.5;
		scale *= 0.52;
		uv *= rotation;
	}

	vec2 rc = rippleCenter + vec2(sin(cos(time)*.5871437+sin(time * .42846531))*.1, cos(sin(time)*.4568751+cos(time * .35871456))*.1);
	float dist = distance(vTextureCoord, rc);
	float sinOffset = pow(soundOffset+.75, 2.0);
	float waveOffset = (sin(dist * sinOffset * 550.0) + 1.0) * .5;

	grey = (grey + 1.0) * 0.5;
	// grey *= waveOffset*.5 + .5;
	grey *= mix(waveOffset, 1.0, 1.0-soundOffset*.65);

	float theta = atan(vTextureCoord.y - center.y, vTextureCoord.x - center.x);
	float maxDist = length(center);

	dist = maxDist-distance(vTextureCoord, center);
	uv = vec2(theta/PI/2.0, dist);
	vec3 colorCircleSpectrum = texture2D(textureSpectrum, uv).rgb * pow(dist/maxDist*3.0, 3.0);
	vec3 color = vec3(grey);
	color *= colorCircleSpectrum;

	gl_FragColor = vec4(color, 1.0);
	// gl_FragColor = texture2D(textureSpectrum, uv);
	// gl_FragColor = vec4(colorCircleSpectrum, 1.0);

}