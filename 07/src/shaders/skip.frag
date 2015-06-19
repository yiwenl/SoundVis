precision highp float;

uniform sampler2D texture;
varying vec2 vTextureCoord;

const float MAX_HEIGHT = 400.00;

void main(void) {
	if(vTextureCoord.x < 0.50) {
		vec2 uvVel = vTextureCoord + vec2(0.50, 0.00);
		vec3 vel = texture2D(texture, uvVel).rgb;
		vec3 pos = texture2D(texture, vTextureCoord).rgb;
		pos += vel;
		if(pos.y > MAX_HEIGHT) {
			pos.y -= MAX_HEIGHT;
		}
		gl_FragColor = vec4(pos, 1.00);
	} else {
		vec3 vel = texture2D(texture, vTextureCoord).rgb;
		gl_FragColor = vec4(vel, 1.00);
	} 
}