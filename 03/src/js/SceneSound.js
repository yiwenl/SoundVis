// SceneSound.js

var GL = bongiovi.GL;
var random = function(min, max) { return min + Math.random() * (max - min);	}

var MAX_WAVES = 10;
var params = {
	gap:.003,
	generalWaveHeight:.6,
	showFullPerlinColors:false,
	fixCenter:false
}

//	IMPORTS
var GLTexture = bongiovi.GLTexture;
var ViewCopy = bongiovi.ViewCopy;
var ViewCircles = require("./ViewCircles.js");
var ViewCubes = require("./ViewCubes.js");

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
	this.waves = [];
	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	this.camera.rx.value = -.3;
	this.camera.ry.value = -.3;
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
	// this._vCubes = new ViewCubes(0, 0, 40, 40, 40);
	this._cubes = [];

	var num = 4;
	var gap = 2;
	var numInBlock = 50;

	console.log("Total Blocks : ", (num*num*numInBlock));

	var sx = - num * numInBlock * gap * .5;
	var sy = - num * numInBlock * gap * .5;
	var w = numInBlock * gap;
	var h = numInBlock * gap;
	var tx, ty;
	var total = num * numInBlock * gap;

	for(var i=0; i<num; i++) {
		for(var j=0; j<num; j++) {
			tx = sx + i * w;
			ty = sy + j * h;

			var view = new ViewCubes(tx, ty, w, h, total);
			view.setColor(this.colors);
			this._cubes.push(view);
		}
	}
	// this._vCubes.setColor(this.colors);
};

p._initTextures = function() {
	var gl = GL.gl;
	this._fbo = new bongiovi.FrameBuffer(50, 50, {minFilter:gl.NEAREST, magFilter:gl.NEAREST});
};


p.render = function() {
	this._getSoundData();
	// this._vCubes.render();
	for(var i=0; i<this._cubes.length; i++) {
		this._cubes[i].render(this.waves);
	}
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
		this.addWave(soundOffset);
	}
	this.soundOffset += ( 0 - this.soundOffset ) * .01;
	this.preSoundOffset -= .03;
	if(this.preSoundOffset < 0 ) this.preSoundOffset = 0;
};


p.addWave = function(volume) {
	var x, y;
	y = Math.random();
	var aspectRatio = GL.aspectRatio;
	x = random(-aspectRatio/2, 1+aspectRatio/2);

	if(params.fixCenter) x = y = .5;

	var wave = new Wave().start(x, y);
	wave.waveLength.duration *= (.5 + volume * .5);
	this.waves.push(wave);

	if(this.waves.length > MAX_WAVES) this.waves.shift();
};

p._onKeyDown = function(e) {
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

	// if(this._vCircles) this._vCircles.setColor(this.colors);
	// if(this._vCubes) this._vCubes.setColor(this.colors);

	this.colors = shuffle(this.colors);
	for(var i=0; i<this._cubes.length; i++) {
		this._cubes[i].setColor(this.colors);
	}
};

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

(function() {
	var random = function(min, max) { return min + Math.random() * (max - min);	}

	Wave = function() {
		this.center = [.5, .5];
		this.waveFront = .0;
		this.duration = random(5000, 13000);
		this.waveLength = random(.1, .25);
		this.tween;
	}

	var p = Wave.prototype;

	p.start = function(x, y) {
		this.center = [x, y];
		this.tween = new TWEEN.Tween(this).to({"waveFront":2.5}, this.duration).easing(TWEEN.Easing.Cubic.Out).start();
		return this;
	};
})();


module.exports = SceneSound;