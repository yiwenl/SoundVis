// app.js
require("./libs/bongiovi-min.js");

Model = {};
Model.params = {
	numParticles:64
};

(function() {

	var SceneSound = require("./SceneSound");

	Main = function() {
		document.addEventListener("DOMContentLoaded", this._init.bind(this));
	}

	var p = Main.prototype;

	p._init = function() {
		bongiovi.SimpleImageLoader.load([
			"assets/images/gold.jpg",
			"assets/images/sky.jpg",
			"assets/images/hdr.jpg"
			],this, this._onImageLoaded);
	};

	p._onImageLoaded = function(img) {
		Model.images = img;
		console.log("Images Loaded : ", Model.images);

		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.canvas.className = "main-canvas";
		bongiovi.GL.init(this.canvas);
		this.resize();

		this._scene = new SceneSound();
		bongiovi.Scheduler.addEF(this, this._loop);

		window.addEventListener("resize", this.resize.bind(this));
	};

	p._loop = function() {
		TWEEN.update();
		this._scene.loop();
	};


	p.resize = function(e) {
		bongiovi.GL.setSize(window.innerWidth, window.innerHeight);
		if(this._scene) this._scene.camera.resize(bongiovi.GL.aspectRatio);
	};
})();

new Main();