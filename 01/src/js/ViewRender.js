// ViewRender.js

var GL = bongiovi.GL;
var gl;

function ViewRender(mParticles) {
	this._particles = mParticles;
	bongiovi.View.call(this, "assets/shaders/map.vert", "assets/shaders/map.frag");
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var num = Model.params.numParticles;

	for(var i=0; i<this._particles.length; i++) {
		positions.push([0, 0, 0]);
		var tx = (i % num) / num;
		var ty = Math.floor(i / num) / num;
		coords.push([tx, ty]);
		indices.push(i);
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;
	
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewRender;