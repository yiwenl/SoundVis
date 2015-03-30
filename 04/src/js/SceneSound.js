// SceneSound.js

var GL = bongiovi.GL;
var random = function(min, max) { return min + Math.random() * (max - min);	}
var SIZE = 512 * 2;

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var ViewCopy = bongiovi.ViewCopy;
var ViewSpectrum = require("./ViewSpectrum");
var ViewPost = require("./ViewPost");

function SceneSound() {
	this.frequencies = [];
	this._initSound();
	this._initCanvas();
	this._theta = 0;
	bongiovi.Scene.call(this);

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);

	// this.camera._rx.value = Math.PI * .3;
	// this.camera._ry.value = -Math.PI * .4 + Math.PI * .5;
}

var p = SceneSound.prototype = new bongiovi.Scene();
p.constructor = SceneSound;

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/01.mp3'],
	    volume: 1.0,
	    loop: false,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded", sound.data.duration);
	    	that.analyser = sound.effect.analyser(SIZE);
	    	sound.play();
	    }
	});
};


p._initViews = function() {
	this._vCopy = new bongiovi.ViewCopy();
	this._vSpectrum = new ViewSpectrum();
	this._vPost = new ViewPost();
};


p._initTextures = function() {
	this._textureBg = new bongiovi.GLTexture(Model.images.floorBlue);
	this._textureSpectrum = new bongiovi.GLTexture(this._canvasSpectrum, null, {minFilter:GL.gl.NEAREST, magFilter:GL.gl.NEAREST});

	this._fbo = new bongiovi.FrameBuffer(GL.width, GL.height);
};


p._initCanvas = function() {
	this._canvasSpectrum = document.createElement("canvas");
	
	this._canvasSpectrum.width = this._canvasSpectrum.height = SIZE;
	this._canvasSpectrum.className = "canvas-spectrum";
	this._canvasSpectrum.style.position = "absolute";
	// document.body.appendChild(this._canvasSpectrum);

	this._canvasSave = document.createElement("canvas");
	this._canvasSave.width = this._canvasSave.height = SIZE;

	this._ctx = this._canvasSave.getContext("2d");
	this._ctxSpectrum = this._canvasSpectrum.getContext("2d");
};


p.render = function() {
	this._getSoundData();
	if(this.frequencies.length == 0) return;
	if(this._theta == 0) {
		var totalFrames = this.sound.data.duration * 60 + 60;
		this._thetaIncr = Math.PI * 2.0 / totalFrames;
		console.log(this._thetaIncr, this.frequencies.length);
	}
	this._theta -= this._thetaIncr;

	this._ctx.save();
	this._ctx.translate(SIZE/2, SIZE/2);
	this._ctx.rotate(this._theta);
	var grey;
	var gold = [.93, .768, .439];
	for(var i=0; i<this.frequencies.length; i++) {
		var grey = this.frequencies[i];
		this._ctx.fillStyle = "rgba("+Math.floor(grey*gold[0]*1.5)+", "+Math.floor(grey*gold[1]*1.5)+", "+Math.floor(grey*gold[2]*1.5)+", " + grey/255 + ")";
		this._ctx.fillRect(i, 0, 1, 1);
	}

	this._ctx.restore();


	this._ctxSpectrum.clearRect(0, 0, this._canvasSpectrum.width, this._canvasSpectrum.height);
	this._ctxSpectrum.save();
	this._ctxSpectrum.translate(SIZE/2, SIZE/2);
	this._ctxSpectrum.rotate(-this._theta);
	this._ctxSpectrum.translate(-SIZE/2, -SIZE/2);
	this._ctxSpectrum.drawImage(this._canvasSave, 0, 0);
	this._ctxSpectrum.restore();

	this._ctxSpectrum.save();
	this._ctxSpectrum.translate(SIZE/2, SIZE/2);
	var fillStr = "rgba(" + Math.floor(gold[0] * 255) + "," + Math.floor(gold[0] * 255) + "," + Math.floor(gold[0] * 255) + ", 1.0)";
	// console.log(this.frequencies.length);
	for(var i=0; i<this.frequencies.length; i++) {
		this._ctxSpectrum.fillStyle = "rgb(" + Math.floor(gold[0] * this.frequencies[i]) + "," + Math.floor(gold[1] * this.frequencies[i]) + "," + Math.floor(gold[2] * this.frequencies[i]) + ")";
		var height = this.frequencies[i]/255;
		if(i == 510) console.log(height);
		this._ctxSpectrum.fillRect(i, -3, 1, -height * 20);
	}
	this._ctxSpectrum.restore();

	
	this._textureSpectrum.updateTexture(this._canvasSpectrum);

	
	GL.setViewport(0, 0, this._fbo.width, this._fbo.height);
	this._fbo.bind();
	GL.clear(0, 0, 0, 0);
	this._vSpectrum.render(this._textureSpectrum);
	this._fbo.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	// this._vCopy.render(this._fbo.getTexture() );
	this._vPost.render(this._fbo.getTexture(), this._textureBg );
};


p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	}

	var soundOffset = 0;
	if(this.analyser) {
		var f = this.analyser.getFrequencies();
		for(var i=0; i<f.length; i++) {
			soundOffset += f[i];	
		}
		soundOffset /= ( f.length * 100);
	}

	var beatThreshold = .45;
	if(soundOffset - this.preSoundOffset > beatThreshold) {
		this.preSoundOffset = soundOffset;
		this.soundOffset = soundOffset;
		// this.addWave(soundOffset);
	}
	this.soundOffset += ( 0 - this.soundOffset ) * .01;
	this.preSoundOffset -= .03;
	if(this.preSoundOffset < 0 ) this.preSoundOffset = 0;
};


p.resize = function() {
	this._fbo = new bongiovi.FrameBuffer(GL.width, GL.height);
	this.camera.resize(GL.aspectRatio);
};


module.exports = SceneSound;