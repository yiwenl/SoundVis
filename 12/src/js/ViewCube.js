// ViewCube.js


var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewCube() {
	var fs = bongiovi.ShaderLibs.get('copyWithNormals');
	console.log(fs);
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, bongiovi.ShaderLibs.get('copyWithNormals'), bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewCube.prototype = new bongiovi.View();
p.constructor = ViewCube;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	console.log(bongiovi.MeshUtils.createCube);
	this.mesh = bongiovi.MeshUtils.createCube(100, 100, 100, true);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", [1, 1, .95]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewCube;