// ViewRender.js

var GL = bongiovi.GL, gl;
var glslify = require("glslify");

function ViewRender(mNumParticles) {
	gl = GL.gl;
	this._numParticles = mNumParticles;
	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}
 
var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;

p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];

	var total = this._numParticles * this._numParticles;
	var u, v;
	for( var i=0; i<total; i++) {
		positions.push([0, 0, 0]);
		u = (i % this._numParticles) / this._numParticles;
		v = Math.floor(i / this._numParticles) / this._numParticles;
		coords.push([u, v])
		indices.push(i);
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};


p.render = function(mTexture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("position", "uniform3fv", [0, -200, 0]);
	mTexture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewRender;