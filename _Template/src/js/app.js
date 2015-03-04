// app.js
require("./libs/bongiovi-min.js");

Model = {};
Model.params = {};

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
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		document.body.appendChild(this.canvas);
		this.canvas.className = "main-canvas";
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneSound();
		bongiovi.Scheduler.addEF(this, this._loop);
		bongiovi.Scheduler.addEF(this, this._loop);
	};

	p._loop = function() {
		this._scene.loop();
	};
})();

new Main();