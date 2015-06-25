// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat         = require("dat-gui");

window.params = {
	blur:20.0,
	depthContrast:2.0,
	contrastMidPoint:.47,
	depthOffset:.3,
	showDepth:true
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

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
		this.gui.add(params, "blur", 1, 100);
		this.gui.add(params, "depthContrast", 1, 20).step(.1);
		this.gui.add(params, "contrastMidPoint", 0, 1).step(.01);
		this.gui.add(params, "depthOffset", 0, 1).step(.01);
		this.gui.add(params, "showDepth");
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();