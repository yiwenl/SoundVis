// ViewFloor.js

var GL = bongiovi.GL;
var gl;

function ViewFloor() {
	bongiovi.View.call(this, null, bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewFloor.prototype = new bongiovi.View();
p.constructor = ViewFloor;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = [0, 1, 2, 0, 2, 3]; 
	var size = 500;
	var y = -500.0;
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

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	if(texture) {
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);	
	}

	this.shader.uniform("color", "uniform3fv", [.25, .25, .23]);
	this.shader.uniform("opacity", "uniform1f", 1.0);
	
	GL.draw(this.mesh);
};

module.exports = ViewFloor;