// ViewGround.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewGround() {
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get("simpleColorFrag"));
	bongiovi.View.call(this, null, glslify("../shaders/ground.frag"));
}

var p = ViewGround.prototype = new bongiovi.View();
p.constructor = ViewGround;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = [0, 1, 2, 0, 2, 3]; 

	var size = 200;
	var y = -10;
	positions.push([-size, y,  size]);
	positions.push([ size, y,  size]);
	positions.push([ size, y, -size]);
	positions.push([-size, y, -size]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(sum) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);

	this.shader.uniform("color", "uniform3fv", [0, 0, 0]);
	this.shader.uniform("alpha", "uniform1f", sum * .075);
	this.shader.uniform("range", "uniform1f", sum * .3);
	GL.draw(this.mesh);
};

module.exports = ViewGround;