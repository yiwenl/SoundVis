// sim.frag

precision mediump float;
uniform sampler2D texture;
varying vec2 vTextureCoord;


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

vec3 getPosition(vec3 value) {
	vec3 pos;

	pos.x = cos(value.x) * value.z;
	pos.z = sin(value.x) * value.z;
	pos.y = value.y;

	return pos;
}

const float PI = 3.141592657;
uniform float range;
uniform float radius;
uniform float sum;
uniform float easeSum;
uniform float time;
uniform float mixture;

const float minRadius = 1.0;

float cubicIn(float t) {
  return t * t * t;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

void main(void) {
    if(vTextureCoord.y < .5) {
		if(vTextureCoord.x < .5) {
			vec2 uvVel  = vTextureCoord + vec2(.5, .0);
			vec2 uvLife = vTextureCoord + vec2(.0, .5);
			vec3 pos    = texture2D(texture, vTextureCoord).rgb;
			vec3 vel    = texture2D(texture, uvVel).rgb;
			float life  = texture2D(texture, uvLife).r;
			pos += vel;
			if(pos.x > PI * 2.0) pos.x -= PI * 2.0;
			if(pos.y > range || life < 0.0) {
				pos.y = -range - 10.0;
				float randR = (rand(vec2(time))*.3 + easeSum*.1) * .9;
				pos.z = randR * radius ;
			}
			gl_FragColor = vec4(pos, 1.0);
		} else {
			vec2 uvPos      = vTextureCoord - vec2(.5, .0);
			vec2 uvExtra    = vTextureCoord + vec2(.5, .5);
			vec3 orgPos     = texture2D(texture, uvPos).rgb;
			vec3 vel        = texture2D(texture, vTextureCoord).rgb;
			vec3 extra      = texture2D(texture, uvExtra).rgb;
			vec3 pos        = getPosition(orgPos);
			
			// const float mixture = .9;
			float posOffset = .005 * mix(extra.r, 1.0, mixture);
			float aRotation = .025 * mix(extra.g, 1.0, mixture);
			float aRadius   = .25 * mix(extra.b, 1.0, mixture);
			const float aY  = .5;
			float ax        = (snoise(pos.x * posOffset + time, pos.y * posOffset + time, pos.z * posOffset + time)+.35) * aRotation;
			float ay        = (snoise(pos.y * posOffset + time, pos.z * posOffset + time, pos.x * posOffset + time)+.65) * aY;
			float az        = snoise(pos.z * posOffset + time, pos.x * posOffset + time, pos.y * posOffset + time) * aRadius;

			vel += vec3(ax, ay, az);

			float percentY = 1.0 - (pos.y + range) / range * 2.0;
			percentY = exponentialIn(percentY);
			float maxRadius = radius * mix(percentY, 1.0, .075);
			float f;
			if(orgPos.z < minRadius) {
				float tz = max(orgPos.z, 0.01);
				f = 1.0/(tz/minRadius);
				vel.z += f * .002;
			} else if(orgPos.z > maxRadius) {
				f = orgPos.z - maxRadius;
				vel.z -= f * .002;
			}

			const float maxRotSpeed = .05;
			if(vel.x > maxRotSpeed) {
				float f = vel.x - maxRotSpeed;
				vel.x -= f * .1;
			}

			const float decreaseRate = .945;
			vel *= decreaseRate;

			if(pos.y < -range) {
				float speedOffst = min(1.0, easeSum/8.0);
				vel *= exponentialIn(speedOffst) * 1.0 + .75;
				vel.x *= .1;
			}

			gl_FragColor = vec4(vel, 1.0);	
		}
    } else {
    	if(vTextureCoord.x < .5) {
    		vec2 uvPos = vTextureCoord - vec2(.0, .5);
    		vec2 uvExtra = vTextureCoord + vec2(.5, .0);
    		vec3 life = texture2D(texture, vTextureCoord).rgb;
    		vec3 pos = texture2D(texture, uvPos).rgb;
    		vec3 extra = texture2D(texture, uvExtra).rgb;
    		const float cap = 1450.0;
    		float s = min(sum, cap) / cap;
    		s = exponentialIn(s);

    		if(pos.y < -range) life.x = (1.0-s) * cap * (1.0 + extra.b*2.0) *.1;
    		const float lifeDecrease = 1.0;
    		life -= lifeDecrease;

    		gl_FragColor = vec4(life, 1.0);
		} else {
			gl_FragColor = texture2D(texture, vTextureCoord);		
		}
    	
    }
}