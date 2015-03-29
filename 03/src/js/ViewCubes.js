// ViewCubes.js

var GL = bongiovi.GL;
var gl;
var gap = 2;
var size = gap*.5-.0;
var numBlocks = 50;
var MAX_WAVES = 10;
var params = {
	gap:.003,
	generalWaveHeight:.6,
	showFullPerlinColors:false,
	fixCenter:false
}
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewCubes() {
	bongiovi.View.call(this, "assets/shaders/cube.vert", "assets/shaders/cube.frag");
}

var p = ViewCubes.prototype = new bongiovi.View();
p.constructor = ViewCubes;

p._init = function() {
	gl = GL.gl;

	this.positions = [];
	this.normals = [];
	this.coords = [];
	this.indices = [];
	this.waves = [];
	this.index = 0;

	var sx = -gap * numBlocks * .5;
	var sz = -gap * numBlocks * .5;
	var tx, tz, u, v;

	for(var i=0; i<numBlocks; i++) {
		for(var j=0; j<numBlocks; j++) {
			tx = sx + i*gap;
			tz = sz + j*gap;

			u = i/numBlocks;
			v = j/numBlocks;

			this.addCube(tx, tz, u, v);
		}
	}
	

	this.mesh = new bongiovi.Mesh(this.positions.length, this.indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(this.positions);
	this.mesh.bufferTexCoords(this.coords);
	this.mesh.bufferIndices(this.indices);
	this.mesh.bufferData(this.normals, "aNormal", 3);

};

p.addCube = function(x, z, u, v) {
	var positions = this.positions;
	var normals = this.normals;
	var coords = this.coords;
	var indices = this.indices;

	//	FRONT
	positions.push([ size+x, -size,  -size+z]);
	positions.push([-size+x, -size,  -size+z]);
	positions.push([-size+x,  size,  -size+z]);
	positions.push([ size+x,  size,  -size+z]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);

	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 1);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 3);
	this.index ++;

	//	LEFT
	positions.push([-size+x, -size,  -size+z]);
	positions.push([-size+x, -size,   size+z]);
	positions.push([-size+x,  size,   size+z]);
	positions.push([-size+x,  size,  -size+z]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);

	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 1);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 3);
	this.index ++;

	//	RIGHT
	positions.push([ size+x, -size,   size+z]);
	positions.push([ size+x, -size,  -size+z]);
	positions.push([ size+x,  size,  -size+z]);
	positions.push([ size+x,  size,   size+z]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);

	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 1);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 3);
	this.index ++;

	//	BACK
	positions.push([-size+x, -size,   size+z]);
	positions.push([ size+x, -size,   size+z]);
	positions.push([ size+x,  size,   size+z]);
	positions.push([-size+x,  size,   size+z]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);

	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 1);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 3);
	this.index ++;

	//	TOP
	positions.push([ size+x,  size,  -size+z]);
	positions.push([-size+x,  size,  -size+z]);
	positions.push([-size+x,  size,   size+z]);
	positions.push([ size+x,  size,   size+z]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);

	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 1);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 3);
	this.index ++;

	//	BOTTOM
	positions.push([ size+x, -size,   size+z]);
	positions.push([-size+x, -size,   size+z]);
	positions.push([-size+x, -size,  -size+z]);
	positions.push([ size+x, -size,  -size+z]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);
	coords.push([u, v]);

	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 1);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 0);
	indices.push(this.index*4 + 2);
	indices.push(this.index*4 + 3);
	this.index ++;
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

p.render = function() {
	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix);

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

	// texture.bind(0);
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


module.exports = ViewCubes;