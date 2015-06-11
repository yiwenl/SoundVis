precision highp float;
uniform float opacity;
varying float vHeightOffset;

void main(void) {
	float grey = .96;
	float alpha = mix(abs(vHeightOffset), 1.0, .0);
    gl_FragColor = vec4(vec3(grey), alpha);
    gl_FragColor *= opacity;
}