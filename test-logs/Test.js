"use strict";

let cont = 1;
var loooooog = function() {
  console.log("MSG Queue type :  ", cont++);
  setTimeout(loooooog, 1000);
};

loooooog();
