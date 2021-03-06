// ViewDots.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	};

function ViewDots() {
	this.opacity = .8;
	bongiovi.View.call(this, glslify("../shaders/circleDots.vert"), glslify("../shaders/circleDots.frag"));
}

var p = ViewDots.prototype = new bongiovi.View();
p.constructor = ViewDots;


p._init = function() {
	this.count    = 0;
	gl            = GL.gl;
	var positions = [];
	var coords    = [];
	var indices   = []; 
	var extra     = [];
	var numLines  = 80;
	var numSeg    = 128;
	var r         = 50;
	var index     = 0;
	var range     = 2.0;
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
				extra.push([random(1, 3), random(1, 5)]);
				coords.push([j/numSeg, 1.0-i/numSeg]);
				indices.push(index);
				index++;	
			}
		}

		r += 1 * this.interval;
	}
	
	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(extra, "aExtra", 2);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);

	this.shader.uniform("count", "uniform1f", this.count);
	// this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", this.opacity);
	GL.draw(this.mesh);

	this.count += .0001;
};

module.exports = ViewDots;