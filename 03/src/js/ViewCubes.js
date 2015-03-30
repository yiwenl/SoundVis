// ViewCubes.js

var GL = bongiovi.GL;
var gl;
var gap = 2;
var size = gap*.5-.0;
var numBlocks = 50;

var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewCubes(x, y, w, h, total) {
	this._x = x;
	this._y = y;
	this._w = w;
	this._h = h;
	this._total = total;
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

	for(var x = this._x; x< (this._x + this._w) ; x+=gap) {
		for(var z = this._y; z<(this._y + this._h); z+=gap) {
			u = x / this._total + .5;
			v = z / this._total + .5;

			this.addCube(x, z, u, v);
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

	// //	BOTTOM
	// positions.push([ size+x, -size,   size+z]);
	// positions.push([-size+x, -size,   size+z]);
	// positions.push([-size+x, -size,  -size+z]);
	// positions.push([ size+x, -size,  -size+z]);

	// normals.push([0, -1, 0]);
	// normals.push([0, -1, 0]);
	// normals.push([0, -1, 0]);
	// normals.push([0, -1, 0]);

	// coords.push([u, v]);
	// coords.push([u, v]);
	// coords.push([u, v]);
	// coords.push([u, v]);

	// indices.push(this.index*4 + 0);
	// indices.push(this.index*4 + 1);
	// indices.push(this.index*4 + 2);
	// indices.push(this.index*4 + 0);
	// indices.push(this.index*4 + 2);
	// indices.push(this.index*4 + 3);
	// this.index ++;
};


p.render = function(waves) {

	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix);

	for(var i=0; i<waves.length; i++) {
		var wave = waves[i];
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




module.exports = ViewCubes;