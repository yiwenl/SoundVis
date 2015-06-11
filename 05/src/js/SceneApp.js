// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewCircles = require("./ViewCircles");

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
	    url: ['assets/audio/01.mp3'],
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
	this.canvasSpectrum = document.createElement("canvas");
	this.canvasSpectrum.width = this.canvasSpectrum.height = 256;

	document.body.appendChild(this.canvasSpectrum);
	this.ctx = this.canvasSpectrum.getContext("2d");

	this._textureSpectrum = new bongiovi.GLTexture(this.canvasSpectrum);
};

p._initViews = function() {
	console.log('Init Views');
	this._vCircles = new ViewCircles();
};

p.render = function() {
	this._getSoundData();

	this._vCircles.render();
};


p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	} else {
		return;
	}


	var f = this.analyser.getFrequencies();
	// console.log(f.length);
	//	update texture here

	this.ctx.drawImage(this.canvasSpectrum, 0, 1);
	var imgData = this.ctx.getImageData(0, 0, this.canvasSpectrum.width, this.canvasSpectrum.height);
	var pixels = imgData.data;
	// console.log(pixels.length);

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

module.exports = SceneApp;