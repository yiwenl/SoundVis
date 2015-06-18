// ViewSave.js


var GL = bongiovi.GL;
var gl;
var random = function(min, max) {	return min + Math.random() * (max - min); };
var glslify = require("glslify");

function ViewSave(mNumParticles) {
	this._numParticles = mNumParticles;
	this._totalParticles = this._numParticles * this._numParticles;
	console.log("Total Particles = ", this._totalParticles);
	bongiovi.View.call(this, glslify("../shaders/save.vert"), glslify("../shaders/save.frag"));
}

var p = ViewSave.prototype = new bongiovi.View();
p.constructor = ViewSave;


p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;

	//	x : THETA, y : y, z: RADIUS
	var x, y, z, u, v, range = 100;
	for( var i=0; i<this._totalParticles; i++) {
		x = random(0, Math.PI * 2);
		y = random(0, range);
		z = random(5, 100);

		u = (i % this._numParticles) / this._numParticles;
		u -= .5;
		u *= 2.0;
		u += 1.0/this._numParticles;
		u = u * .5 - .5;

		v = Math.floor(i / this._numParticles) / this._numParticles;
		v = (v -.5) * 2.0;

		positions.push([x, y, z]);
		coords.push([u, v]);
		indices.push(index);

		index++;
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	if(!this.shader.isReady()) return;
	this.shader.bind();
	GL.draw(this.mesh);
};

module.exports = ViewSave;