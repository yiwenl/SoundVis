// ViewSphere.js

var GL = bongiovi.GL;
var gl;

function ViewSphere() {
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get("simpleColorFrag"));
	bongiovi.View.call(this, bongiovi.ShaderLibs.get("generalVert"), bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createSphere(5, 12);
};

p.render = function(pos) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);
	this.shader.uniform("color", "uniform3fv", [1, 1, .96]);
	this.shader.uniform("position", "uniform3fv", pos);
	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;