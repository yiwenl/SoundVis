precision mediump float;

varying vec3 vColor;
varying vec3 vNormal;
uniform vec3 lightPos;
varying vec3 vVertex;

void main(void) {
    gl_FragColor = vec4(vColor, 1.0);
    // gl_FragColor.rgb = (vNormal * 1.0) * .5;

    vec3 dirToLight = lightPos - vVertex;
    float lambertFactor = max(dot(normalize(dirToLight), vNormal), 0.0);

    const vec3 ambient = vec3(.25);
    const vec3 lightColor = vec3(1.0);
    const float lightWeight = .75;
    vec3 color = ambient + lambertFactor * lightColor * lightWeight;

    gl_FragColor.rgb = color;
}