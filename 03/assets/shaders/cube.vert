precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vLightNormal;

varying vec3 vVertexPosition;

uniform vec2 waveCenter0;
uniform float waveFront0;
uniform float waveLength0;

uniform vec2 waveCenter1;
uniform float waveFront1;
uniform float waveLength1;

uniform vec2 waveCenter2;
uniform float waveFront2;
uniform float waveLength2;

uniform vec2 waveCenter3;
uniform float waveFront3;
uniform float waveLength3;

uniform vec2 waveCenter4;
uniform float waveFront4;
uniform float waveLength4;

uniform vec2 waveCenter5;
uniform float waveFront5;
uniform float waveLength5;

uniform vec2 waveCenter6;
uniform float waveFront6;
uniform float waveLength6;

uniform vec2 waveCenter7;
uniform float waveFront7;
uniform float waveLength7;

uniform vec2 waveCenter8;
uniform float waveFront8;
uniform float waveLength8;

uniform vec2 waveCenter9;
uniform float waveFront9;
uniform float waveLength9;


const float PI      = 3.141592653;
const float generalWaveHeight = 20.0;
varying vec3 vColor;

float getWaveHeight(vec2 uv, vec2 waveCenter, float waveFront, float waveLength) {
    float distToWave = distance(uv, waveCenter);    
    if( abs(distToWave - waveFront) < waveLength) {   return (1.0 - sin(abs(distToWave - waveFront)/waveLength * PI * .5)) * generalWaveHeight; }
    else return 0.0;
}

void main(void) {
	vec3 pos = aVertexPosition;
    vec2 uv = aTextureCoord;
    float waveHeight = 0.0;
    waveHeight += getWaveHeight(uv, waveCenter0, waveFront0, waveLength0);
    waveHeight += getWaveHeight(uv, waveCenter1, waveFront1, waveLength1);
    waveHeight += getWaveHeight(uv, waveCenter2, waveFront2, waveLength2);
    waveHeight += getWaveHeight(uv, waveCenter3, waveFront3, waveLength3);
    waveHeight += getWaveHeight(uv, waveCenter4, waveFront4, waveLength4);
    waveHeight += getWaveHeight(uv, waveCenter5, waveFront5, waveLength5);
    waveHeight += getWaveHeight(uv, waveCenter6, waveFront6, waveLength6);
    waveHeight += getWaveHeight(uv, waveCenter7, waveFront7, waveLength7);
    waveHeight += getWaveHeight(uv, waveCenter8, waveFront8, waveLength8);
    waveHeight += getWaveHeight(uv, waveCenter9, waveFront9, waveLength9);
    pos.y += waveHeight;
    // pos.y -= generalWaveHeight * 5.0;

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);

    vTextureCoord = aTextureCoord;
    vNormal = normalize(aNormal);
    vLightNormal = normalize(normalMatrix * aNormal);
    vVertexPosition = aVertexPosition;
}