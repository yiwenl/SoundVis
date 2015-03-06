// SceneSound.js

var GL = bongiovi.GL;
var random = function(min, max) { return min + Math.random() * (max - min);	}

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var FrameBuffer = bongiovi.FrameBuffer;
var ViewCopy = bongiovi.ViewCopy;
var ViewSave = require("./ViewSave.js");
var ViewRender = require("./ViewRender.js");

function SceneSound() {
	this._initParticles();
	this.frequencies = [];
	this._initSound();

	bongiovi.Scene.call(this);
}

var p = SceneSound.prototype = new bongiovi.Scene();
p.constructor = SceneSound;

p._initSound = function() {
	var that = this;
	this.sound = Sono.load({
	    url: ['assets/audio/japan.mp3'],
	    volume: 0.0,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(64);
	    	sound.play();
	    }
	});
};


p._initParticles = function() {
	var total = Model.params.numParticles * Model.params.numParticles;
	console.log("Total amount of particeles : ", total);

	this._particles = [];
	var i =0;
	var range = 300;

	while(i++ < total) {
		var p = [ random(-range, range), random(-range, range), random(-range, range)];
		this._particles.push(p);
	}
};


p._initTextures = function() {
	this._textureBg = new GLTexture(Model.images.bg);
};


p._initViews = function() {
	this._vCopy   = new ViewCopy();
	this._vSave   = new ViewSave(this._particles);
	this._vRender = new ViewRender(this._particles);

	this._hasSaved = false;
	this._fbo = new FrameBuffer(Model.params.numParticles, Model.params.numParticles, {minFilter:GL.gl.NEAREST, magFilter:GL.gl.NEAREST});
};


p.render = function() {
	this._getSoundData();

	if(!this._hasSaved) {
		if(this._vSave.shader.isReady()) {
			GL.setMatrices(this.cameraOtho);
			GL.rotate(this.rotationFront);
			console.debug("Saving Particles data to Image");
			GL.setViewport(0, 0, this._fbo.width, this._fbo.height);
			
			this._fbo.bind();
			GL.clear(0, 0, 0, 0);
			this._vSave.render();
			this._fbo.unbind();
			GL.setViewport(0, 0, GL.canvas.width, GL.canvas.height);
			this._hasSaved = true;
		}
	}

	// GL.setMatrices(this.cameraOtho);
	// GL.rotate(this.rotationFront);
	// this._vCopy.render(this._fbo.getTexture() ) ;
	if(!this._hasSaved) return;

	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	// GL.enableAdditiveBlending();
	GL.gl.disable(GL.gl.DEPTH_TEST);
	this._vRender.render(this._fbo.getTexture() );
};


p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	}
};


module.exports = SceneSound;