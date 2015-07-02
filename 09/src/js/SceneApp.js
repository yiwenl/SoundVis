// SceneApp.js

var GL = bongiovi.GL, gl;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewLine = require("./ViewLine");

function SceneApp() {
	gl = GL.gl;
	this.sum = 0;
	this.easeSum = new bongiovi.EaseNumber(0, .25);
	this._initSound();
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value = -.3;
	this.camera._ry.value = -.1;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/Oscillate.mp3'],
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
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vLine = new ViewLine();

	var numLines = 20;
	this._lines = [];
	var timeOffset = 15;
	var gap = 10.0;

	for(var i=0; i<numLines; i++) {
		var z = (-numLines/2 + i) * gap;
		var l = new ViewLine(i*timeOffset, z, i);
		this._lines.push(l);
	}
};

p.render = function() {
	this._getSoundData();
	
	// this._vLine.freq.value = this.sum*.1 + .01;
	this._vAxis.render();
	this._vDotPlane.render();
	// this._vLine.render();

	for(var i=0; i<this._lines.length; i++) {
		// this._lines[i].speed.value = this.sum * 30.0 + 1.0;
		// this._lines[i].waveHeight.value = this.sum * 50.0 + 10.0;
		this._lines[i].freq.value = this.easeSum.value * .001 + .01;
		this._lines[i].speed.value = this.easeSum.value * 30.0 + 1.0;
		this._lines[i].waveHeight.value = this.sum * .2 + 20.0;
		this._lines[i].render();
	}
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
		var index = i * 4;
		sum += f[i];
	}

	sum /= f.length;
	var threshold = 10;
	var maxSpeed = 2.0;

	if(sum > threshold) {
		this.sum += sum * 1.5;
		this.easeSum.value = Math.min(this.sum, maxSpeed) * .1;
	} else {
		this.easeSum.value = 0;
	}

	this.sum -= this.sum * .1;
	if(this.sum < 0) this.sum = 0;
};

p.resize = function() {
	var scale = 2.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>