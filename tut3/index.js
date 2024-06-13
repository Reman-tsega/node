const logEvents = require("./logEvents");
//  import event emiter  from global lib
const EventEmitter = require("events");

// create class  and exten the event emitter class
class MyEmitter extends EventEmitter {} 


//  initialize the object of the class
const myEmitter = new MyEmitter();
//  listen for the event
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

myEmitter.on("lag",(msg,fileName)=>logEvents(msg,fileName))
//  emit the event

if (new Date().getDay() % 2 !== 0) {
    myEmitter.emit("log", "today is good day\n", "app.txt");
}else{
    myEmitter.emit("lag", "zare litl new meselegn kenu keffe blotal\n", "app.txt");

}
