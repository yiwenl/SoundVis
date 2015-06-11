// ViewDots.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	};

function ViewDots() {
	this.opacity = .8;
	bongiovi.View.call(this, glslify("../shaders/circles.vert"), glslify("../shaders/circles.frag"));
}

var p = ViewDots.prototype = new bongiovi.View();
p.constructor = ViewDots;


p._init = function() {
	this.count = 0;
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var numLines = 80;
	var numSeg = 128;
	var r = 50;
	var index = 0;
	var range = 1.5;
	this.interval = 1;

	function getPosition(i, radius) {
		var theta = i/numSeg * Math.PI * 2.0;
		var x = Math.cos(theta) * radius;
		var z = Math.sin(theta) * radius;
		var pos = [x, 0, z];

		return pos;
	}

	for(var i=0; i<numLines; i+=this.interval) {
		for(var j=0; j<numSeg; j++) {
			if(Math.random() > .5) {
				var pos = getPosition(j, r);
				pos[0] += random(range, -range);
				pos[2] += random(range, -range);
				positions.push(pos);
				coords.push([j/numSeg, 1.0-i/numSeg]);
				indices.push(index);
				index++;	
			}
		}

		r += 1 * this.interval;
	}
	console.log(positions.length);
	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);

	this.shader.uniform("count", "uniform1f", this.count);
	// this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	GL.draw(this.mesh);

	this.count += .0002;
};

module.exports = ViewDots;