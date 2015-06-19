// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	gl = GL.gl;
	this.count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));

	new TangledShader(gl, this.shader.fragmentShader, this._onShaderUpdate.bind(this));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p._onShaderUpdate = function(shader) {
	this.shader.clearUniforms();
	this.shader.attachShaderProgram();
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);

	this.count += .01;
};

module.exports = ViewSimulation;