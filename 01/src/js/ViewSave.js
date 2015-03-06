// ViewSave.js

var GL = bongiovi.GL;
var gl;

function ViewSave(mParticles) {
	this._particles = mParticles;
	bongiovi.View.call(this, "assets/shaders/save.vert", "assets/shaders/save.frag");
}

var p = ViewSave.prototype = new bongiovi.View();
p.constructor = ViewSave;


p._init = function() {
	var params = Model.params;
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var tx, ty, x, y, z;
	var offset = 1.0 / params.numParticles;
	console.log(this._particles.length);

	for(var i=0; i<this._particles.length; i++) {
		x = this._particles[i][0];
		y = this._particles[i][1];
		z = this._particles[i][2];

		tx = (i % params.numParticles) / params.numParticles;
		ty = Math.floor(i/params.numParticles)/params.numParticles;
		tx = (tx - .5) * 2.0 + offset;
		ty = (ty - .5) * 2.0 + offset;

		positions.push([x, y, z]);
		coords.push([tx, ty]);
		indices.push(i);
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	GL.draw(this.mesh);
};

module.exports = ViewSave;