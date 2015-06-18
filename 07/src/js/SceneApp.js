// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");

function SceneApp() {
	gl = GL.gl;
	this.sum = 0;
	this._initSound();
	bongiovi.Scene.call(this);
}


var p = SceneApp.prototype = new bongiovi.Scene();


p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/03.mp3'],
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
	var pars = {minFilter:gl.NEAREST, magFilter:gl.NEAREST};
	this._fboCurrent = new bongiovi.FrameBuffer(params.numParticles * 2, params.numParticles, pars);
	this._fboTarget  = new bongiovi.FrameBuffer(params.numParticles * 2, params.numParticles, pars);

};

p._initViews = function() {
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vAxis = new bongiovi.ViewAxis(2);
	this._vSave = new ViewSave(params.numParticles);
	this._vRender = new ViewRender(params.numParticles);
	this._vCopy = new bongiovi.ViewCopy();
	this._vSim = new ViewSimulation();


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
	this._vSim.render(this._fboCurrent.getTexture());
	this._fboTarget.unbind();
	this._vCopy.render(this._fboTarget.getTexture());

	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	GL.setViewport(0, 0, GL.width, GL.height);
	this._vDotPlane.render();
	this._vAxis.render();
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
	this.sum = Math.min(sum, 120) / 120;
};

p.resize = function() {
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;