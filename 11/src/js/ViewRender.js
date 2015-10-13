// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRender() {
	this.time = 0;
	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([0, 0, 0]);

			ux = i/numParticles;
			uy = j/numParticles;
			coords.push([ux, uy]);
			indices.push(count);
			count ++;

		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, textureNext, percent, textureGold) {
	this.time += .01;
	if(this.time > 1.0) this.time = 0.0;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);
	this.shader.uniform("textureGold", "uniform1i", 2);
	textureGold.bind(2);
	this.shader.uniform("percent", "uniform1f", percent);
	this.shader.uniform("range", "uniform1f", params.range);
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewRender;