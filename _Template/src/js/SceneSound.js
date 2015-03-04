// SceneSound.js

var GL = bongiovi.GL;

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var ViewCopy = bongiovi.ViewCopy;

function SceneSound() {
	bongiovi.Scene.call(this);
}

var p = SceneSound.prototype = new bongiovi.Scene();
p.constructor = SceneSound;


p._initTextures = function() {
	this._textureBg = new GLTexture(Model.images.bg);
};


p._initViews = function() {
	this._vCopy = new ViewCopy();
};


p.render = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._vCopy.render(this._textureBg);
};


module.exports = SceneSound;