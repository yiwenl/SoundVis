// ViewCircles.js

var GL = bongiovi.GL;
var gl;
var MAX_WAVES = 10;
var params = {
	gap:.003,
	generalWaveHeight:.6,
	showFullPerlinColors:false,
	fixCenter:false
}

var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewCircles(mColors) {
	this._colors = mColors;
	this.waves = [];
	bongiovi.View.call(this, null, "assets/shaders/ripple.frag");
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get("simpleColorFrag"));
}

var p = ViewCircles.prototype = new bongiovi.View();
p.constructor = ViewCircles;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
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

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.count * .01);
	this.shader.uniform("aspectRatio", "uniform1f", 1.0);
	this.shader.uniform("generalWaveHeight", "uniform1f", params.generalWaveHeight);
	this.shader.uniform("showFullPerlinColors", "uniform1f", params.showFullPerlinColors ? 1.0 : 0.0);
	for(var i=0; i<MAX_WAVES; i++) {
		var wave = this.waves[i];
		if( wave == undefined) {
			this.shader.uniform("waveCenter"+i, "uniform2fv", [.5, .5]);
			this.shader.uniform("waveFront"+i, "uniform1f", -1);
			this.shader.uniform("waveLength"+i, "uniform1f", 0);
		} else {
			this.shader.uniform("waveCenter"+i, "uniform2fv", wave.center);
			this.shader.uniform("waveFront"+i, "uniform1f", wave.waveFront);
			this.shader.uniform("waveLength"+i, "uniform1f", wave.waveLength);
		}
	}

	for(var i=0; i<this._colors.length; i++) {
		this.shader.uniform("color"+i, "uniform3fv", this._colors[i]);
	}
	GL.draw(this.mesh);
};

p.setColor = function(mColors) {	this._colors = mColors;	};


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

module.exports = ViewCircles;