// ViewCircles.js

var GL = bongiovi.GL;
var gl;

function ViewCircles() {
	bongiovi.View.call(this, null, bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewCircles.prototype = new bongiovi.View();
p.constructor = ViewCircles;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var numLines = 128;
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

	for(var i=0; i<numLines; i++) {
		for(var j=0; j<numSeg; j++) {
			positions.push(getPosition(j, r));
			positions.push(getPosition(j+1, r));

			coords.push([i, j]);
			coords.push([i, j]);

			indices.push(index);
			index++;
			indices.push(index);
			index++;
		}

		r += 2.5;
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);

	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewCircles;