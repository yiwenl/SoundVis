precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureBg;


#define BlendScreenf(base, blend) 		(1.0 - ((1.0 - base) * (1.0 - blend)))
#define BlendScreen(base, blend) 		Blend(base, blend, BlendScreenf)
#define Blend(base, blend, funcf) 		vec3(funcf(base.r, blend.r), funcf(base.g, blend.g), funcf(base.b, blend.b))


// const vec3 color0 = vec3(51.0/255.0, 68.0/255.0, 84.0/255.0);
// const vec3 color1 = vec3(31.0/255.0, 41.0/255.0, 50.0/255.0);
// const vec2 center = vec2(.5);


void main(void) {
    vec4 color = texture2D(texture, vTextureCoord);
    vec4 colorBg = texture2D(textureBg, vTextureCoord);
    // float dist = distance(vTextureCoord, center);
    // float offset = clamp(dist / .5, 0.0, 1.0);
    // colorBg.rgb = mix(color0, color1, offset);

    colorBg.rgb = BlendScreen(color.rgb, colorBg.rgb);
    gl_FragColor = colorBg;
}