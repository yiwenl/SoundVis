// SceneSound.js

var GL = bongiovi.GL;
var random = function(min, max) { return min + Math.random() * (max - min);	}

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var ViewCopy = bongiovi.ViewCopy;
var ViewCircles = require("./ViewCircles.js");

function SceneSound() {
	this.frequencies = [];
	this._initSound();
	this.colors = [ 
						[0.9098039215686274,0.8352941176470589,0.7176470588235294],
						[0.054901960784313725,0.1411764705882353,0.18823529411764706],
						[0.9882352941176471,0.22745098039215686,0.3176470588235294],
						[0.9607843137254902,0.7019607843137254,0.28627450980392155],
						[0.9098039215686274,0.8352941176470589,0.7254901960784313]
						];

	window.addEventListener("keydown", this._onKeyDown.bind(this));
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
	this._vCircles = new ViewCircles(this.colors);
};


p.render = function() {
	this._getSoundData();

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	this._vCircles.render();
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
		// this._onMouseDown(null, true, soundOffset);
		if(this._vCircles) this._vCircles.addWave(soundOffset);
	}
	this.soundOffset += ( 0 - this.soundOffset ) * .01;
	this.preSoundOffset -= .03;
	if(this.preSoundOffset < 0 ) this.preSoundOffset = 0;
};


p._onKeyDown = function(e) {
	console.log(e.keyCode);

	if(e.keyCode == 67) {
		this.getColor();
	}
};


p.getColor = function() {
	ColourLovers.getRandomPalette(this, this._onColor.bind(this));
};

p._onColor = function(color) {

	var getHex = function(str) {
		var r = parseInt(str.substring(1, 3), 16)/255;
		var g = parseInt(str.substring(3, 5), 16)/255;
		var b = parseInt(str.substring(5, 7), 16)/255;

		return [r, g, b];
	}

	for(var i=0; i<color.colors.length; i++) {
		this.colors[i] = getHex(color.colors[i]);
	}

	if(this._vCircles) this._vCircles.setColor(this.colors);
};


module.exports = SceneSound;