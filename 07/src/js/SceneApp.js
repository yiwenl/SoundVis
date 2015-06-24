// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewNoise = require("./ViewNoise");
var ViewPlane = require("./ViewPlane");

function SceneApp() {
	gl = GL.gl;
	this.sum = new bongiovi.EaseNumber(0, .5);
	bongiovi.Scene.call(this);

	this._initSound();

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);

	this.camera._rx.value = -.3;
	this.camera._ry.value = -.3;

	window.addEventListener("resize", this.resize.bind(this));
	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/03.mp3'],
	    volume: 0.002,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(256);
	    	sound.play();
	    }
	});
};

p._initTextures = function() {
	console.log('Init Textures');

	var noiseSize = 1024;
	this._fboNoise = new bongiovi.FrameBuffer(noiseSize, noiseSize);
};

p._initViews = function() {
	this._vCopy     = new bongiovi.ViewCopy();
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vNoise    = new ViewNoise();
	this._vPlane 	= new ViewPlane();
};

p.render = function() {
	this._getSoundData();
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);

	this._fboNoise.bind();
	GL.clear(0, 0, 0, 0);
	this._vNoise.render(this.sum.value/120);
	this._fboNoise.unbind();

	gl.enable(gl.DEPTH_TEST);
	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	this._vAxis.render();
	this._vDotPlane.render();
	this._vPlane.render(this._fboNoise.getTexture());
};

p.resize = function() {
	var scale = 1.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
};


p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	} else {
		return;
	}
	var f = this.analyser.getFrequencies();

	var sum = 0;

	for(var i=0; i<f.length; i++) {
		sum += f[i];
	}


	sum /= f.length;
	this.sum.value = Math.min(sum, 120);
};
module.exports = SceneApp;