// ViewBlur.js


var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBlur() {
	bongiovi.View.call(this, null, glslify("../shaders/blur.frag"));
}

var p = ViewBlur.prototype = new bongiovi.View();
p.constructor = ViewBlur;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, delta) {
	delta = delta == undefined ? [0, 10.0/GL.height] : delta;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("delta", "uniform2fv", delta);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBlur;