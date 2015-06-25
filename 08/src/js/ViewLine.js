// ViewLine.js

var GL = bongiovi.GL;
var gl;

var glslify = require("glslify");

function ViewLine() {
	this.count = 0;
	this.speed = new bongiovi.EaseNumber(1);
	this.freq = new bongiovi.EaseNumber(.01);
	this.waveHeight = new bongiovi.EaseNumber(50);
	bongiovi.View.call(this, glslify("../shaders/line.vert"), bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewLine.prototype = new bongiovi.View();
p.constructor = ViewLine;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	var numSeg = 400;
	var size = 500;
	var sx = -size *.5;

	for(var i=0; i<numSeg; i++) {

		positions.push([sx + i/numSeg*size, 0, 0]);
		coords.push([i/numSeg, 0]);
		indices.push(i);

	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.LINE_STRIP);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("freq", "uniform1f", this.freq.value);
	this.shader.uniform("waveHeight", "uniform1f", this.waveHeight.value);
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);

	this.count += this.speed.value;
	GL.draw(this.mesh);
};

module.exports = ViewLine;