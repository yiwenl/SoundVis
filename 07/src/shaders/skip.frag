precision highp float;

uniform sampler2D texture;
uniform float soundOffset;
varying vec2 vTextureCoord;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

const float MAX_HEIGHT = 400.00;
const float PI = 3.14;
const float PI_2 = 3.14*2.00;
uniform float time;

void main(void) {
	if(vTextureCoord.x < 0.50) {
		vec2 uvVel = vTextureCoord + vec2(0.50, 0.00);
		vec3 vel = texture2D(texture, uvVel).rgb;
		vec3 pos = texture2D(texture, vTextureCoord).rgb;
		pos += vel;
		if(pos.y > MAX_HEIGHT) {
			float tempo = rand(vec2(soundOffset)) + .5;
			pos.y -= MAX_HEIGHT + tempo * 20.0;
			pos.x = rand(vTextureCoord) * PI * 2.0;
			pos.z = tempo * 100.0;
		}
		gl_FragColor = vec4(pos, 1.00);
	} else {
		vec3 vel = texture2D(texture, vTextureCoord).rgb;
		gl_FragColor = vec4(vel, 1.00);
	} 
}