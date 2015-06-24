// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewNoise = require("./ViewNoise");
var ViewPlane = require("./ViewPlane");
var ViewPost = require("./ViewPost");

function SceneApp() {
	gl = GL.gl;
	this.sum = new bongiovi.EaseNumber(0, .15);
	bongiovi.Scene.call(this);

	this._initSound();

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);

	this.camera._rx.value = -.3;
	this.camera._rx.limit(-1, 0);
	this.camera._ry.value = -.3;
	this.camera.radius.value = 250;

	window.addEventListener("resize", this.resize.bind(this));
	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/05.mp3'],
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

	var noiseSize  = 1024;
	this._fboNoise = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboPost  = new bongiovi.FrameBuffer(GL.width, GL.height);
};

p._initViews = function() {
	this._vCopy     = new bongiovi.ViewCopy();
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vNoise    = new ViewNoise();
	this._vPlane 	= new ViewPlane();
	this._vPost 	= new ViewPost();
};

p.render = function() {
	this._getSoundData();
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);

	this._fboNoise.bind();
	GL.clear(0, 0, 0, 0);
	this._vNoise.render(this.sum.value/120, this._textureSpectrum);
	this._fboNoise.unbind();

	// gl.disable(gl.DEPTH_TEST);
	// this._vCopy.render(this._textureSpectrum);
	// gl.enable(gl.DEPTH_TEST);

	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	// this._vAxis.render();
	// this._vDotPlane.render();

	this._fboPost.bind();
	GL.clear(0, 0, 0, 1);
	this._vPlane.render(this._fboNoise.getTexture(), [0, 0]);
	this._vPlane.render(this._fboNoise.getTexture(), [1, 0]);
	this._vPlane.render(this._fboNoise.getTexture(), [1, 1]);
	this._vPlane.render(this._fboNoise.getTexture(), [0, 1]);
	this._fboPost.unbind();

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	this._vPost.render(this._fboPost.getTexture());
};

p.resize = function() {
	var scale = 1.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
	this._fboPost.destroy();
	this._fboPost  = new bongiovi.FrameBuffer(GL.width, GL.height);
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

	var sum = 0;

	for(var i=0; i<f.length; i++) {
		var index = i * 4;
		sum += f[i];
	}


	sum /= f.length;
	sum = Math.min(sum, 120);
	this.sum.value = sum;

	var offset = Math.pow(sum/120, 2.0);

	for(var i=0; i<f.length; i++) {
		var index = i * 4;
		pixels[index  ] = Math.floor(f[i] * offset);
		pixels[index+1] = Math.floor(f[i] * offset);
		pixels[index+2] = Math.floor(f[i] * offset);
		pixels[index+3] = 255;
	}

	this.ctx.putImageData(imgData, 0, 0);
	this._textureSpectrum.updateTexture(this.canvasSpectrum);
};
module.exports = SceneApp;