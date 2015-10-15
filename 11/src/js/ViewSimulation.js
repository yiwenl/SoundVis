// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	this.max = 0;
	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, sum, easeSum) {
	if(!this.shader.isReady() ) return;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("range", "uniform1f", params.range);
	this.shader.uniform("radius", "uniform1f", params.radius);
	this.shader.uniform("sum", "uniform1f", sum);
	this.shader.uniform("easeSum", "uniform1f", easeSum);
	this.shader.uniform("mixture", "uniform1f", params.mixture);
	texture.bind(0);

	GL.draw(this.mesh);

	this._count += params.speed;
};

module.exports = ViewSimulation;