// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewCircles = require("./ViewCircles");
var ViewDots = require("./ViewDots");

function SceneApp() {
	gl = GL.gl;

	this._initSound();
	bongiovi.Scene.call(this);
}


var p = SceneApp.prototype = new bongiovi.Scene();


p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/02.mp3'],
	    volume: 1.0,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(256);
	    	sound.play();
	    }
	});
};

p._initTextures = function() {
	this.canvasSpectrum           = document.createElement("canvas");
	this.canvasSpectrum.width     = this.canvasSpectrum.height = 128;
	this.canvasSpectrum.className = "Spectrum-canvas";
	this.ctx                      = this.canvasSpectrum.getContext("2d");
	this.ctx.clearRect(0, 0, this.canvasSpectrum.width, this.canvasSpectrum.height);

	this._textureSpectrum = new bongiovi.GLTexture(this.canvasSpectrum);
};

p._initViews = function() {
	this._vCircles = new ViewCircles(1, .75);
	this._vCirclesThick = new ViewCircles(4, 1);
	this._vDots = new ViewDots();
};

p.render = function() {
	this._getSoundData();
	GL.clear(13/255, 15/255, 20/255, 1);

	gl.lineWidth(1.0);
	this._vCircles.render(this._textureSpectrum);
	gl.lineWidth(2.0);
	this._vCirclesThick.render(this._textureSpectrum);
	this._vDots.render(this._textureSpectrum);
};


p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	} else {
		return;
	}
	var f = this.analyser.getFrequencies();

	this.ctx.drawImage(this.canvasSpectrum, 0, 1);
	var imgData = this.ctx.getImageData(0, 0, this.canvasSpectrum.width, this.canvasSpectrum.height);
	var pixels = imgData.data;

	// console.log(f.length);

	for(var i=0; i<f.length; i++) {
		var index = i * 4;
		pixels[index  ] = f[i];
		pixels[index+1] = f[i];
		pixels[index+2] = f[i];
		pixels[index+3] = 255;
	}


	this.ctx.putImageData(imgData, 0, 0);

	this._textureSpectrum.updateTexture(this.canvasSpectrum);
};

p.resize = function() {
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;