// SceneSound.js

var GL = bongiovi.GL;
var random = function(min, max) { return min + Math.random() * (max - min);	}

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var ViewCopy = bongiovi.ViewCopy;

function SceneSound() {
	this.frequencies = [];
	this._initSound();
	bongiovi.Scene.call(this);
}

var p = SceneSound.prototype = new bongiovi.Scene();
p.constructor = SceneSound;

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/03.mp3'],
	    volume: 0.0,
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
};


p.render = function() {
	this._getSoundData();

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
	}
	this.soundOffset += ( 0 - this.soundOffset ) * .01;
	this.preSoundOffset -= .03;
	if(this.preSoundOffset < 0 ) this.preSoundOffset = 0;
};

module.exports = SceneSound;