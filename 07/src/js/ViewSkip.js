// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	gl = GL.gl;
	this.count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/skip.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, soundOffset) {
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("soundOffset", "uniform1f", soundOffset);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);

	this.count += .01;
};

module.exports = ViewSimulation;