// ViewDof.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewDof() {
	bongiovi.View.call(this, null, glslify("../shaders/dof.frag"));
}

var p = ViewDof.prototype = new bongiovi.View();
p.constructor = ViewDof;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureDepth, delta) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureDepth", "uniform1i", 1);
	this.shader.uniform("focalDistance", "uniform1f", 0.4);
	this.shader.uniform("aperture", "uniform1f", .005);
	this.shader.uniform("delta", "uniform2fv", delta);
	texture.bind(0);
	textureDepth.bind(1);
	GL.draw(this.mesh);
};

module.exports = ViewDof;