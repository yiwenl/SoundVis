// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewSkip = require("./ViewSkip");

function SceneApp() {
	gl = GL.gl;
	this.sum = new bongiovi.EaseNumber(0, 1);
	this._initSound();
	this.count = 0;
	bongiovi.Scene.call(this);

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	this.camera._rx.value = -.35;
	this.camera._ry.value = -.35;
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
	var pars = {minFilter:gl.NEAREST, magFilter:gl.NEAREST};
	this._fboCurrent = new bongiovi.FrameBuffer(params.numParticles * 2, params.numParticles * 2, pars);
	this._fboTarget  = new bongiovi.FrameBuffer(params.numParticles * 2, params.numParticles * 2, pars);

};

p._initViews = function() {
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vAxis = new bongiovi.ViewAxis(2);
	this._vSave = new ViewSave(params.numParticles);
	this._vRender = new ViewRender(params.numParticles);
	this._vCopy = new bongiovi.ViewCopy();
	this._vSim = new ViewSimulation();
	this._vSkip = new ViewSkip();


	this._fboCurrent.bind();
	GL.clear(0, 0, 0, 0);
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();

};

p.render = function() {
	GL.clear(0, 0, 0, 0);
	this._getSoundData();

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._fboTarget.bind();
	GL.clear(0, 0, 0, 0);
	if(this.count++ % 5 == 0) {
		this._vSim.render(this._fboCurrent.getTexture(), this.sum.value);
	} else {
		this._vSkip.render(this._fboCurrent.getTexture(), this.sum.value);
	}
	
	this._fboTarget.unbind();
	// this._vCopy.render(this._fboTarget.getTexture());

	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	GL.setViewport(0, 0, GL.width, GL.height);
	// this._vDotPlane.render();
	// this._vAxis.render();
	this._vRender.render(this._fboCurrent.getTexture());

	this.swap();
};


p.swap = function() {
	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;
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

p.resize = function() {
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;