// ViewSpectrum.js

var GL = bongiovi.GL;
var gl;

function ViewSpectrum() {
	bongiovi.View.call(this);
}

var p = ViewSpectrum.prototype = new bongiovi.View();
p.constructor = ViewSpectrum;


p._init = function() {
	var size = 300;
	this.mesh = bongiovi.MeshUtils.createPlane(size, size, 1);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewSpectrum;