// post.frag

precision highp float;

uniform float bgl_RenderedTextureWidth; //scene sampler width
uniform float bgl_RenderedTextureHeight; //scene sampler height
const float permTexUnit = 1.0/128.0;		// Perm texture texel-size
const float permTexUnitHalf = 0.5/128.0;	// Half perm texture texel-size

float width = bgl_RenderedTextureWidth;
float height = bgl_RenderedTextureHeight;

const float grainamount = 0.05; //grain amount
bool colored = false; //colored noise?
float coloramount = 0.6;
float grainsize = 1.6; //grain particle size (1.5 - 2.5)
float lumamount = 1.0; //

uniform float timer;
uniform float showDepth;
uniform float depthContrast;
uniform float contrastMidPoint;
uniform float depthOffset;
uniform sampler2D texture;
uniform sampler2D textureBlur;
uniform sampler2D textureDepth;
varying vec2 vTextureCoord;

vec4 rnm(in vec2 tc) 
{
    float noise =  sin(dot(tc + vec2(timer,timer),vec2(12.9898,78.233))) * 43758.5453;

	float noiseR =  fract(noise)*2.0-1.0;
	float noiseG =  fract(noise*1.2154)*2.0-1.0; 
	float noiseB =  fract(noise*1.3453)*2.0-1.0;
	float noiseA =  fract(noise*1.3647)*2.0-1.0;
	
	return vec4(noiseR,noiseG,noiseB,noiseA);
}

float fade(in float t) {
	return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float pnoise3D(in vec3 p)
{
	vec3 pi = permTexUnit*floor(p)+permTexUnitHalf; // Integer part, scaled so +1 moves permTexUnit texel
	// and offset 1/2 texel to sample texel centers
	vec3 pf = fract(p);     // Fractional part for interpolation

	// Noise contributions from (x=0, y=0), z=0 and z=1
	float perm00 = rnm(pi.xy).a ;
	vec3  grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;
	float n000 = dot(grad000, pf);
	vec3  grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
	float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));

	// Noise contributions from (x=0, y=1), z=0 and z=1
	float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a ;
	vec3  grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;
	float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));
	vec3  grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
	float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));

	// Noise contributions from (x=1, y=0), z=0 and z=1
	float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a ;
	vec3  grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;
	float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));
	vec3  grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
	float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));

	// Noise contributions from (x=1, y=1), z=0 and z=1
	float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a ;
	vec3  grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;
	float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));
	vec3  grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;
	float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));

	// Blend contributions along x
	vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));

	// Blend contributions along y
	vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));

	// Blend contributions along z
	float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));

	// We're done, return the final noise value.
	return n_xyz;
}

float contrast(float value, float scale, float midPoint) {
	float nv = midPoint + (value - midPoint) * scale;
	nv = max(min(nv, 1.0), 0.0);
	return nv;
}

float contrast(float value, float scale) {
	return contrast(value, scale, .5);
}

//2d coordinate orientation thing
vec2 coordRot(in vec2 tc, in float angle)
{
	float aspect = width/height;
	float rotX = ((tc.x*2.0-1.0)*aspect*cos(angle)) - ((tc.y*2.0-1.0)*sin(angle));
	float rotY = ((tc.y*2.0-1.0)*cos(angle)) + ((tc.x*2.0-1.0)*aspect*sin(angle));
	rotX = ((rotX/aspect)*0.5+0.5);
	rotY = rotY*0.5+0.5;
	return vec2(rotX,rotY);
}

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

float getDepth(in vec2 uv) {
	float d = texture2D(textureDepth, uv).r;
	return getDepth(d, 5.0, 500.0);
}

const float PI = 3.141592657;
float getNormalizeDepth(float value, float midPoint) {
	float newValue;
	if(value < midPoint) {
	  newValue = 1.0 - cos(value/midPoint*PI*.5);
	} else {
	  newValue = 1.0 - sin( (value-midPoint) / (1.0 - midPoint) * PI * .5);
	  // newValue = 0.0;
	}

	return 1.0-newValue+depthOffset;
}

void main(void) {

	vec4 color = texture2D(texture, vTextureCoord);
	float d = getDepth(vTextureCoord);
	d = getNormalizeDepth(d, contrastMidPoint);
	d = contrast(d, (depthContrast+1.0), .5);

	vec4 colorBlur = texture2D(textureBlur, vTextureCoord);
	color.rgb = mix(color.rgb, colorBlur.rgb, d);


	const vec4 DARK = vec4(.01, .01, .01, 1.0);
	const vec4 BRIGHT = vec4(1.0, 1.0, .95, 1.0);
	color = mix(DARK, BRIGHT, color.r);

	vec2 texCoord = vTextureCoord;
	vec3 rotOffset = vec3(1.425,3.892,5.835); //rotation offset values	
	vec2 rotCoordsR = coordRot(texCoord, timer + rotOffset.x);
	vec3 noise = vec3(pnoise3D(vec3(rotCoordsR*vec2(width/grainsize,height/grainsize),0.0)));
	vec3 col = color.rgb;

	//noisiness response curve based on scene luminance
	vec3 lumcoeff = vec3(0.299,0.587,0.114);
	float luminance = mix(0.0,dot(col, lumcoeff),lumamount);
	float lum = smoothstep(0.2,0.0,luminance);
	lum += luminance;
	
	
	noise = mix(noise,vec3(0.0),pow(lum,4.0));
	col = col+noise*grainamount;

	gl_FragColor = vec4(col, 1.0);
	if(showDepth > .0) gl_FragColor = vec4(vec3(d), 1.0);
	// gl_FragColor.rgb = colorBlur.rgb;
}