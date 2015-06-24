// plane.frag

precision highp float;

varying vec3 vColor;

void main(void) {
	vec3 color = vColor;
	color.b *= .95;
	gl_FragColor = vec4(color, 1.0);
}