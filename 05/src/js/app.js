// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat         = require("dat-gui");

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}

		window.addEventListener("resize", this.resize.bind(this));
	}

	var p = App.prototype;

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth * 2;
		this.canvas.height = window.innerHeight * 2;
		this.canvas.className = "Main-canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);
		this.resize();

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});
	};

	p._loop = function() {
		this._scene.loop();
	};

	p.resize = function() {
		bongiovi.GL.setSize(window.innerWidth*2, window.innerHeight*2);
		if(this._scene) this._scene.resize();
	};

})();


new App();