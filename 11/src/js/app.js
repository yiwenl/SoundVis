// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat = require("dat-gui");

window.params = {
	skipCount:10,
	range:650,
	radius:700,
	numParticles:400,

	speed:.01,
	mixture:.95,
	threshold:50,
	decreaseRate:.1,
	maxSpeed:5.0,
	debugFbo:false
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var loader = new bongiovi.SimpleImageLoader();
		var assets = ["assets/gold.jpg"];

		loader.load(assets, this, this._onImageLoaded);
		
	}

	var p = App.prototype;

	p._onImageLoaded = function(imgs) {
		window.images = imgs;
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		this.gui = new dat.GUI({width:300});
		this.gui.add(params, "debugFbo");
		this.gui.add(params, "threshold", 0, 100);
		this.gui.add(params, "decreaseRate", 0, .500);
		this.gui.add(params, "maxSpeed", 1, 10.00);
		this.gui.add(params, "speed", 0.01, .05);
		this.gui.add(params, "mixture", 0.0, 1.0);
		// this.gui.add(params, "skipCount", 1, 100.00);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();