precision highp float;
uniform float opacity;
varying float vHeightOffset;

const vec2 center = vec2(.5);

void main(void) {
	if(distance(center, gl_PointCoord) > .5) discard;
	float grey = .96;
	float alpha = mix(abs(vHeightOffset), 1.0, .0);
    gl_FragColor = vec4(0.9843, 0.9764, 0.9294, alpha);
    gl_FragColor *= opacity;
}