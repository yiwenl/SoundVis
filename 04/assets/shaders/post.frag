precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureBg;


#define BlendScreenf(base, blend) 		(1.0 - ((1.0 - base) * (1.0 - blend)))
#define BlendScreen(base, blend) 		Blend(base, blend, BlendScreenf)
#define Blend(base, blend, funcf) 		vec3(funcf(base.r, blend.r), funcf(base.g, blend.g), funcf(base.b, blend.b))


void main(void) {
    vec4 color = texture2D(texture, vTextureCoord);
    vec4 colorBg = texture2D(textureBg, vTextureCoord);

    colorBg.rgb = BlendScreen(color.rgb, colorBg.rgb);
    // colorBg.rgb = screen(color.rgb, colorBg.rgb);
    gl_FragColor = colorBg;
}