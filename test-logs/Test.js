"use strict";
var logsIO = require('./Test-logs-1/logs')
var jsdiff = require('diff')
var appRoot = require('app-root-path') 



/*
let cont = 1;
var loooooog = function() {

  console.log("document --> " , loooooog.name)
  console.log("MSG Logs Kibana -->  :  ", cont++ , " - dirname --> " , __dirname , " - filename --> " , __filename.slice(__dirname.length + 1));
  logsIO.logsInfo();

  setTimeout(loooooog, 1000);
};

loooooog();
*/



var oldConsole = console.log
console.log = function() { 
  let file = (new Error()).stack.match(/(\/+\w+)+\.\w+/g)[1] 

  console.info("file --> " , file)

  let diff = jsdiff.diffChars(file , appRoot.path)
  
  let pr =   (new Error()).stack.match(/(\/+\w+)+\.\w+/g)[1];
  console.info("pr --> " , pr)
  var nombre = "[File: " + diff[1].value + "] " + "[FunctionName: " + (new Error()).stack.match(/at (\S+)/g)[1].slice(3) + "] ";

  Array.prototype.unshift.call(arguments, nombre)
  
  oldConsole.apply(this, arguments)
}

function testFuncinos() {
  console.log( "prueba" );
  testFuncDos()
}


function testFuncDos() {
  console.info( "probando debug" );
  logsIO.logsInfo();

}

testFuncinos();