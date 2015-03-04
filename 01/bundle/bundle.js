(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// app.js

var Test = require("./Test.js");
var Clazz = require("./Clazz.js");
var Scheduler = require("./bongiovi/Scheduler.js");

var scheduler = new Scheduler().init();

var c = new Clazz("wen");
var c1 = new Clazz("bongiovi");

c.log();

var count = 0;

var efIndex = scheduler.addEF(this, loop, []);


function loop() {
	console.log("Count : ", count);
	if(count ++ > 50) scheduler.removeEF(efIndex);
}
},{"./Clazz.js":2,"./Test.js":3,"./bongiovi/Scheduler.js":4}],2:[function(require,module,exports){
// Clazz.js

module.exports = function Clazz(name) {

	this.name = name;
	this.number = 0;

	var p = Clazz.prototype;

	p.log = function() {
		console.log("La Classe !", this.name, this.number);
	};


	p.add = function(value) {
		this.number += value;
	};

	return this;
};
},{}],3:[function(require,module,exports){
// Test.js

module.exports = function Test() {
	var name = "bongiovi";

	var hello = function() {
		console.log('Hello', name);
		return this;
	}

	return Object.freeze({
		hello:hello
	});
}


},{}],4:[function(require,module,exports){
// Scheduler.js
module.exports = function Scheduler() {
	if(window.requestAnimFrame == undefined) {
		window.requestAnimFrame = (function(){
	        return  window.requestAnimationFrame       || 
	        window.webkitRequestAnimationFrame || 
	        window.mozRequestAnimationFrame    || 
	        window.oRequestAnimationFrame      || 
	        window.msRequestAnimationFrame     || 
	        function( callback ){
	        window.setTimeout(callback, 1000 / 60);
	        };
	    })();
	}

	var p = Scheduler.prototype;
	

	p.init = function() {
		this.FRAMERATE = 60;
		this._delayTasks = [];
		this._nextTasks = [];
		this._deferTasks = [];
		this._highTasks = [];
		this._usurpTask = [];
		this._enterframeTasks = [];
		this._idTable = 0;

		requestAnimFrame( this._loop.bind(this) );
		return this;	
	};


	p._loop = function() {
		requestAnimFrame( this._loop.bind(this) );
		this._process();
	}


	p._process = function() {
		for ( var i=0; i<this._enterframeTasks.length; i++) {
			var task = this._enterframeTasks[i];
			if(task != null && task != undefined) {
				task.func.apply(task.scope, task.params);
			}
		}
		
		while ( this._highTasks.length > 0) {
			var t = this._highTasks.pop();
			t.func.call(t.scope, t.params);
		}
		

		var startTime = new Date().getTime();

		for ( var i=0; i<this._delayTasks.length; i++) {
			var t = this._delayTasks[i];
			if(startTime-t.time > t.delay) {
				t.func.call(t.scope, t.params);
				this._delayTasks.splice(i, 1);
			}
		}

		startTime = new Date().getTime();
		var interval = 1000 / this.FRAMERATE;
		while(this._deferTasks.length > 0) {
			var task = this._deferTasks.shift();
			var current = new Date().getTime();
			if(current - startTime < interval ) {
				task.func.apply(task.scope, task.params);
			} else {
				this._deferTasks.unshift(task);
				break;
			}
		}


		startTime = new Date().getTime();
		var interval = 1000 / this.FRAMERATE;
		while(this._usurpTask.length > 0) {
			var task = this._usurpTask.shift();
			var current = new Date().getTime();
			if(current - startTime < interval ) {
				task.func.apply(task.scope, task.params);
			} else {
				// this._usurpTask.unshift(task);
				break;
			}
		}



		this._highTasks = this._highTasks.concat(this._nextTasks);
		this._nextTasks = [];
		this._usurpTask = [];
	}


	p.addEF = function(scope, func, params) {
		var id = this._idTable;
		this._enterframeTasks[id] = {scope:scope, func:func, params:params};
		this._idTable ++;
		return id;
	}


	p.removeEF = function(id) {
		if(this._enterframeTasks[id] != undefined) {
			this._enterframeTasks[id] = null
		}
		return -1;
	}


	p.delay = function(scope, func, params, delay) {
		var time = new Date().getTime();
		var t = {scope:scope, func:func, params:params, delay:delay, time:time};
		this._delayTasks.push(t);
	}


	p.defer = function(scope, func, params) {
		var t = {scope:scope, func:func, params:params};
		this._deferTasks.push(t);
	}


	p.next = function(scope, func, params) {
		var t = {scope:scope, func:func, params:params};
		this._nextTasks.push(t);
	}


	p.usurp = function(scope, func, params) {
		var t = {scope:scope, func:func, params:params};
		this._usurpTask.push(t);
	}

	return this;
}
},{}]},{},[1]);
