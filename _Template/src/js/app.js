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
			"assets/images/bg.jpg"
			],this, this._onImageLoaded);
	};

	p._onImageLoaded = function(img) {
		Model.images = img;
		console.log("Images Loaded : ", Model.images);

		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.canvas.className = "main-canvas";
		bongiovi.GL.init(this.canvas);

		this.miniCanvas = document.createElement("canvas");
		this.miniCanvas.className = "mini-canvas";
		this.miniCtx = this.miniCanvas.getContext("2d");
		document.body.appendChild(this.miniCanvas);
		this.resize();

		this._scene = new SceneSound();
		bongiovi.Scheduler.addEF(this, this._loop);

		window.addEventListener("resize", this.resize.bind(this));
	};

	p._loop = function() {
		TWEEN.update();
		this._scene.loop();

		this.miniCtx.clearRect(0, 0, this.miniCanvas.width, this.miniCanvas.height);
		// this.miniCtx.fillStyle = "#f00";
		// this.miniCtx.fillRect(0, 0, this.miniCanvas.width, this.miniCanvas.height);
		this.miniCtx.drawImage( bongiovi.GL.canvas, 0, 0, bongiovi.GL.canvas.width, bongiovi.GL.canvas.height, 0, 0, this.miniCanvas.width, this.miniCanvas.height);
	};


	p.resize = function(e) {
		bongiovi.GL.setSize(window.innerWidth, window.innerHeight * .5);
		bongiovi.GL.canvas.style.marginTop = window.innerHeight * .25 + "px";

		var width = 50;
		var height = width / bongiovi.GL.aspectRatio;
		console.log(width, height);

		this.miniCanvas.width = width;
		this.miniCanvas.height = height;
	};
})();

new Main();