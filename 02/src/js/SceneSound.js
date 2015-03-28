// SceneSound.js

var GL = bongiovi.GL;
var gl;
var random = function(min, max) { return min + Math.random() * (max - min);	}

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var ViewCopy = bongiovi.ViewCopy;
var ViewSphere = require("./ViewSphere");
var ViewPost = require("./ViewPost");

function SceneSound() {
	this.frequencies = [];
	this._initSound();
	bongiovi.Scene.call(this);
	GL.gl.enable(GL.gl.DEPTH_TEST);
	GL.gl.enable(GL.gl.CULL_FACE);
	this.sceneRotation.setCameraPos([0.4946438670158386, 0.357036292552948, 0.7923714518547058, 0]);
}

var p = SceneSound.prototype = new bongiovi.Scene();
p.constructor = SceneSound;

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
	    	that.analyser = sound.effect.analyser(64);
	    	sound.play();
	    }
	});
};


p._initViews = function() {
	this._vCopy   = new ViewCopy();
	this._vSphere = new ViewSphere();
	this._vPost = new ViewPost();
};

p._initTextures = function() {
	this._textureLight = new bongiovi.GLTexture(Model.images.gold);
	this._textureSky = new bongiovi.GLTexture(Model.images.sky);

	this.fboNormal = new bongiovi.FrameBuffer(GL.width, GL.height);
	this.fboLight = new bongiovi.FrameBuffer(GL.width, GL.height);
};


p.render = function() {
	if(gl == undefined) gl = GL.gl;
	this._getSoundData();

	gl.enable(gl.DEPTH_TEST);

	this.fboNormal.bind();
	GL.clear(0, 0, 0, 0);
	this._vSphere.render(this._textureLight, true);
	this.fboNormal.unbind();

	this.fboLight.bind();
	GL.clear(0, 0, 0, 0);
	this._vSphere.render(this._textureLight, false);
	this.fboLight.unbind();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._textureSky);
	// this._vCopy.render(this.fboLight.getTexture());
	// console.log(this.sceneRotation.tempRotation);

	this._vPost.render(this._textureSky, this.fboNormal.getTexture(), this.fboLight.getTexture());
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
		console.debug("Trigger !");
		if(this._vSphere) this._vSphere.addWave(soundOffset);
	}
	this.soundOffset += ( 0 - this.soundOffset ) * .01;
	this.preSoundOffset -= .03;
	if(this.preSoundOffset < 0 ) this.preSoundOffset = 0;
};

module.exports = SceneSound;