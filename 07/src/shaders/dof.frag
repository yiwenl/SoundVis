// dof.frag

// blur.frag

precision highp float;

uniform sampler2D texture;
uniform sampler2D textureDepth;
varying vec2 vTextureCoord;
uniform vec2 delta;
uniform float focalDistance;
uniform float aperture;

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

float sampleBias( vec2 uv ) {
	float depthColor = texture2D( textureDepth, uv ).r;
	return abs(getDepth(depthColor, 5.0, 800.0) - focalDistance);
}

void main(void) {

	vec4 sum = vec4( 0. );
	float bias = sampleBias( vTextureCoord );

	sum += texture2D( texture, ( vTextureCoord - bias * delta * 4. ) ) * 0.051;
	sum += texture2D( texture, ( vTextureCoord - bias * delta * 3. ) ) * 0.0918;
	sum += texture2D( texture, ( vTextureCoord - bias * delta * 2. ) ) * 0.12245;
	sum += texture2D( texture, ( vTextureCoord - bias * delta * 1. ) ) * 0.1531;
	sum += texture2D( texture, ( vTextureCoord + bias * delta * 0. ) ) * 0.1633;
	sum += texture2D( texture, ( vTextureCoord + bias * delta * 1. ) ) * 0.1531;
	sum += texture2D( texture, ( vTextureCoord + bias * delta * 2. ) ) * 0.12245;
	sum += texture2D( texture, ( vTextureCoord + bias * delta * 3. ) ) * 0.0918;
	sum += texture2D( texture, ( vTextureCoord + bias * delta * 4. ) ) * 0.051;

	gl_FragColor = sum;

	// gl_FragColor = vec4(bias);

}