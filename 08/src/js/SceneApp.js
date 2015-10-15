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


	//	for beat detection
	this._sumBeat = 0;
	this._maxSumBeat = 0;
	this._hasBeats = false;

	this._canvas = document.createElement("canvas");
	this._canvas.width = 100;
	this._canvas.height = 100;
	this._canvas.style.position = "absolute";
	this._canvas.style.zIndex = 9999;
	document.body.appendChild(this._canvas);
	this._ctx = this._canvas.getContext("2d");

	this._ctx.fillStyle = "#f50";
	this._ctx.fillRect(0, 0, 100, 100);


	this._canvasBar = document.createElement("canvas");
	this._canvasBar.width = 100;
	this._canvasBar.height = window.innerHeight;
	this._canvasBar.style.position = "absolute";
	this._canvasBar.style.zIndex = 9999;
	this._canvasBar.style.left = "100px";
	document.body.appendChild(this._canvasBar);
	this._ctxBar = this._canvasBar.getContext("2d");
	this._ctxBar.fillStyle = "#f00";
	this._ctxBar.fillRect(0, 0, 100, 100);


	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/03.mp3'],
	    // url: ['assets/audio/Oscillate.mp3'],
	    volume: 0.0,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(128);
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
		// this._lines[i].render();
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
		params["f" + i] = f[i];
	}

	sum /= f.length;
	var threshold = 10;
	var maxSpeed = 2.0;


	var sumBeats = 0;
	for(var i=0; i<f.length/2; i++) {
		sumBeats += f[i];
	}

	// console.log(sumBeats);
	sumBeats/= ( f.length/2);
	var DECREASE_RATE = params.decrease;
	var MIN_DIFFERENCE = params.minThreshold;

	
	this._ctxBar.drawImage(this._canvasBar, 0, 1);
	// this._ctxBar.clearRect(0, 0, 100, 1);
	this._ctx.clearRect(0, 0, 100, 100);
	var fillColor = "#f60";
	if(sumBeats - this._sumBeat > MIN_DIFFERENCE && !this._hasBeats) {
		console.debug(this._sumBeat.toFixed(2), sumBeats.toFixed(2), ":" , (sumBeats - this._sumBeat).toFixed(2));
		this._sumBeat = sumBeats;
		this._maxSumBeat = sumBeats;	
		this._ctx.fillStyle = "#F00";
		this._ctx.fillRect(50, 0, 50, 100);
		fillColor = "#f00;";
		this._hasBeats = true;
		var that = this;
		setTimeout(function() {
			that._hasBeats = false;
		}, params.minGap)
	} else {
		console.log(this._sumBeat.toFixed(2), sumBeats.toFixed(2));	
	}
	

	this._sumBeat -= this._sumBeat * params.decreaseMultiply;


	if(this._maxSumBeat > 0.0) {
		this._ctx.fillStyle = "#F60";
		this._ctx.fillRect(0, 0, 50, 100 * this._sumBeat / this._maxSumBeat);	
	}

	// this._ctxBar.fillStyle = fillColor;
	// this._ctxBar.fillRect(0, 0, 100 * this._sumBeat / this._maxSumBeat, 3);

	var imgData = this._ctxBar.getImageData(0, 0, this._canvasBar.width, 1);
	var pixels = imgData.data;
	
	for(var i=0; i<100; i++) {
		var index = i * 4;

		var value = i < 100 * this._sumBeat / this._maxSumBeat ? 255 : 0;
		value = 255 * this._sumBeat / this._maxSumBeat;

		pixels[index  ] = value;
		pixels[index+1] = value;
		pixels[index+2] = value;
		pixels[index+3] = 255;
	}

	this._ctxBar.putImageData(imgData, 0, 0);


	// console.log(this._sumBeat);

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