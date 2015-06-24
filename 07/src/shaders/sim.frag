precision highp float;

uniform sampler2D texture;
uniform float time;
uniform float numParticles;
uniform float soundOffset;
varying vec2 vTextureCoord;


const float PI = 3.14;
const float PI_2 = 3.14*2.00;


vec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }
vec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }

float snoise(vec3 v){
	const vec2 C = vec2(1.00/6.00, 1.00/3.00) ;
	const vec4 D = vec4(0.00, 0.50, 1.00, 2.00);
	
	vec3 i = floor(v + dot(v, C.yyy) );
	vec3 x0 = v - i + dot(i, C.xxx) ;
	
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.00 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );
	
	vec3 x1 = x0 - i1 + 1.00 * C.xxx;
	vec3 x2 = x0 - i2 + 2.00 * C.xxx;
	vec3 x3 = x0 - 1. + 3.00 * C.xxx;
	
	i = mod(i, 289.00 );
	vec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));
	
	float n_ = 1.00/7.00;
	vec3 ns = n_ * D.wyz - D.xzx;
	
	vec4 j = p - 49.00 * floor(p * ns.z *ns.z);
	
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.00 * x_ );
	
	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.00 - abs(x) - abs(y);
	
	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );
	
	vec4 s0 = floor(b0)*2.00 + 1.00;
	vec4 s1 = floor(b1)*2.00 + 1.00;
	vec4 sh = -step(h, vec4(0.00));
	
	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
	
	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);
	
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	
	vec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);
	m = m * m;
	return 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
	return snoise(vec3(x, y, z));
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 getPosition(vec3 color) {
	float theta = color.x;
	float y = color.y;
	float r = color.z;

	return vec3(cos(theta) * r, y, sin(theta) * r);
}

const float posOffset = 0.01;
const float MAX_ROTATION_SPEED = 0.03;
const float MAX_RISING_SPEED = 0.30;
const float MAX_HEIGHT = 400.00;
const float MAX_RADIUS = 150.0;


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
		if(pos.z <0.0) {
			pos.z = 0.0;
		}
		gl_FragColor = vec4(pos, 1.00);
	} else {
		vec2 uvPos = vTextureCoord - vec2(0.50, 0.00);
		vec3 colorPos = texture2D(texture, uvPos).rgb;
		vec3 pos = getPosition(colorPos);
		vec3 vel = texture2D(texture, vTextureCoord).rgb;
		float ax = snoise(pos.x * posOffset + time, pos.y * posOffset + time, pos.z * posOffset + time) + 0.50;
		vel.x += ax * pow(0.1, 4.00);
		if(vel.x > MAX_ROTATION_SPEED) vel.x = MAX_ROTATION_SPEED;
		if(vel.x < 0.00) vel.x = 0.00;

		float ay = snoise(pos.y * posOffset + time, pos.z * posOffset + time, pos.x * posOffset + time) + 0.4;
		vel.y += ay * pow(0.10, 1.00);
		if(vel.y > MAX_RISING_SPEED) vel.y = MAX_RISING_SPEED;
		if(vel.y < 0.00) vel.y -= vel.y * .2;

		float az = snoise(pos.z * posOffset + time, pos.x * posOffset + time, pos.y * posOffset + time) + 0.5;
		vel.z += az * pow(.1, 3.00);
		float mRadius = 1.0 - pos.y/MAX_HEIGHT;
		mRadius = tan(mRadius * PI * .5 * .5);
		float rx = snoise(pos.y * posOffset, time*10.0, time*2.0) + 0.49;
		mRadius = (.02 + mRadius * .98) + rx * 70.0 * (mRadius * .25 + .75);
		if(pos.z > mRadius) {
			vel.z -= (pos.z - mRadius) * pow(.1, 3.5);
		} else if(pos.z <= 0.0) {
			vel.z = (rand(vTextureCoord * time)+1.0) * .001;
		}

		vel.y *= .98;

		vec3 newPos = getPosition(pos + vel);
		if(newPos.y >= MAX_HEIGHT) {
			vel *= 0.0;
		}
	
		gl_FragColor = vec4(vel, 1.00);
	} 
}