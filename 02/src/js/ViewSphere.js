// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var MAX_WAVES = 10;
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewSphere() {
	this.waves = [];
	bongiovi.View.call(this, "assets/shaders/sphere.vert", "assets/shaders/sphere.frag");
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;

p._init = function() {
	gl = GL.gl;
	
	var positions = [];
	var coords = [];
	var indices = [];
	var numSeg = 100;
	var index = 0;

	for(var i=0; i<numSeg; i++) {
		for( var j=0; j<numSeg; j++) {
			positions.push([i, j+1, numSeg]);
			positions.push([i+1, j+1, numSeg]);
			positions.push([i+1, j, numSeg]);
			positions.push([i, j, numSeg]);

			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);
			index ++;
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.addWave = function(volume) {
	var x, y;
	y = Math.random();
	var aspectRatio = GL.aspectRatio;
	x = random(-aspectRatio/2, 1+aspectRatio/2);

	var wave = new Wave().start(x, y);
	wave.waveLength.duration *= (.5 + volume * .5);
	this.waves.push(wave);

	if(this.waves.length > MAX_WAVES) this.waves.shift();
};

p.render = function(texture, exportNormal) {
	if(!this.mesh) return;

	this.shader.bind();
	this.shader.uniform("size", "uniform1f", 100);
	this.shader.uniform("exportNormal", "uniform1f", exportNormal ? 1.0 : .0);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix);

	for(var i=0; i<MAX_WAVES; i++) {
		var wave = this.waves[i];
		if( wave == undefined) {
			this.shader.uniform("waveFront"+i, "uniform1f", -5);
			this.shader.uniform("waveHeight"+i, "uniform1f", 0);
		} else {
			this.shader.uniform("waveFront"+i, "uniform1f", wave.waveFront);
			this.shader.uniform("waveHeight"+i, "uniform1f", wave.waveHeight);
		}
	}
	GL.draw(this.mesh);
};

(function() {
	var random = function(min, max) { return min + Math.random() * (max - min);	}

	Wave = function() {
		this.center = [.5, .5];
		this.waveFront = .0;
		this.duration = random(13000, 5000);
		this.waveLength = random(.1, .25);
		this.waveHeight = random(1, 3) * 2;
		this.tween;
	}

	var p = Wave.prototype;

	p.start = function(x, y) {
		this.center = [x, y];
		this.tween = new TWEEN.Tween(this).to({"waveFront":1, "waveHeight":0}, this.duration).easing(TWEEN.Easing.Cubic.Out).start();
		return this;
	};
})();

module.exports = ViewSphere;