// ViewPost.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPost() {
	this.count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/post.frag"));
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	var seg = 2;
	this.mesh = bongiovi.MeshUtils.createPlane(seg, seg, 1)
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("timer", "uniform1f", this.count);
	this.shader.uniform("bgl_RenderedTextureWidth", "uniform1f", GL.width);
	this.shader.uniform("bgl_RenderedTextureHeight", "uniform1f", GL.height);
	this.shader.uniform("aspectRatio", "uniform1f", GL.aspectRatio);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);

	this.count += .01;
};

module.exports = ViewPost;