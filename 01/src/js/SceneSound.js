// SceneSound.js

var GL = bongiovi.GL;

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var ViewCopy = bongiovi.ViewCopy;

function SceneSound() {
	bongiovi.Scene.call(this);

	this.frequencies = [];
	this._initSound();
}

var p = SceneSound.prototype = new bongiovi.Scene();
p.constructor = SceneSound;

p._initSound = function() {
	var that = this;
	this.sound = Sono.load({
	    url: ['assets/audio/japan.mp3'],
	    volume: 0.01,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(64);
	    	sound.play();
	    }
	});
};


p._initTextures = function() {
	this._textureBg = new GLTexture(Model.images.bg);
};


p._initViews = function() {
	this._vCopy = new ViewCopy();
};


p.render = function() {
	this._getSoundData();

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._vCopy.render(this._textureBg);
};


p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	}
};


module.exports = SceneSound;