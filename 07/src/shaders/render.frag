precision highp float;
varying float alpha;
vec2 center = vec2(.5);

void main(void) {
	if(distance(gl_PointCoord, center) >.5) discard;
	gl_FragColor = vec4(alpha);
}