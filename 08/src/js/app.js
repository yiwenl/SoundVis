// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat = require("dat-gui");

window.params = {
	decrease:.15,
	decreaseMultiply:.007,
	minThreshold:4.5,
	minGap:300
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
		this.gui.add(params, "decrease", 0, .2).step(.001);
		this.gui.add(params, "decreaseMultiply", 0, .01).step(.0001);
		this.gui.add(params, "minThreshold", .1, 10).step(.01);
		this.gui.add(params, "minGap", 100, 5000);

		// for(var i=0; i<64; i++) {
		// 	params["f"+i] = 0;
		// 	this.gui.add(params, "f"+i, 0, 255).listen();
		// }

	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();