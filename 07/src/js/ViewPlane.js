// ViewPlane.js


var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPlane() {
	bongiovi.View.call(this, glslify("../shaders/plane.vert"), glslify("../shaders/plane.frag"));
	// bongiovi.View.call(this);
}

var p = ViewPlane.prototype = new bongiovi.View();
p.constructor = ViewPlane;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var index = 0;
	var num = 128;
	var size = 200;
	var uvGap = 1/num;

	function getPosition(i, j) {
		var px = i/num;
		var pz = j/num;
		var s = -size/2;

		return [s + px * size, 0, s + pz * size];
	}


	for(var j=0; j<num; j++) {
		for(var i=0; i<num; i++) {
			positions.push(getPosition(i, j+1));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i, j));


			coords.push([i/num, j/num+uvGap]);
			coords.push([i/num+uvGap, j/num+uvGap]);
			coords.push([i/num+uvGap, j/num]);
			coords.push([i/num, j/num]);


			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index ++;
		}
	}


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, uv) {
	var skipShader = true;
	if(uv[0] == uv[1]) skipShader = false;
	if(!skipShader) this.shader.bind();
	if(!skipShader) this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("uv", "uniform2fv", uv);
	if(!skipShader) texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewPlane;