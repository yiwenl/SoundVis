// ViewNoise.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewNoise() {
	this.count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/noise.frag"));
}

var p = ViewNoise.prototype = new bongiovi.View();
p.constructor = ViewNoise;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(soundOffset, textureSpectrum) {
	this.shader.bind();
	this.count += .01;
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("textureSpectrum", "uniform1i", 0);
	this.shader.uniform("soundOffset", "uniform1f", soundOffset);
	textureSpectrum.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNoise;