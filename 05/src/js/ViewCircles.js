// ViewCircles.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewCircles(interval, opacity) {
	this.interval = interval == undefined ? 1 : interval;
	this.opacity = opacity;
	// bongiovi.View.call(this, glslify("../shaders/circles.vert"), bongiovi.ShaderLibs.get("simpleColorFrag"));
	bongiovi.View.call(this, glslify("../shaders/circles.vert"), glslify("../shaders/circles.frag"));
}

var p = ViewCircles.prototype = new bongiovi.View();
p.constructor = ViewCircles;


p._init = function() {
	this.count = 0;
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var numLines = 50;
	var numSeg = 128;
	var r = 50;
	var index = 0;


	function getPosition(i, radius) {
		var theta = i/numSeg * Math.PI * 2.0;
		var x = Math.cos(theta) * radius;
		var z = Math.sin(theta) * radius;
		var pos = [x, 0, z];

		return pos;
	}

	for(var i=0; i<numLines; i+=this.interval) {
		for(var j=0; j<numSeg; j++) {
			positions.push(getPosition(j, r));
			positions.push(getPosition(j+1, r));

			coords.push([j/numSeg, 1.0-i/numSeg]);
			coords.push([(j+1)/numSeg, 1.0-i/numSeg]);

			indices.push(index);
			index++;
			indices.push(index);
			index++;
		}

		r += 1.6 * this.interval;
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);

	this.shader.uniform("count", "uniform1f", this.count);
	// this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	GL.draw(this.mesh);

	// this.count += 1/128;
};

module.exports = ViewCircles;