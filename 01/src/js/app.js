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