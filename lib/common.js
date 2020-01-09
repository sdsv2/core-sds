'use strict';

const date = require('date-and-time');
let currentNow; let currentDate; let currentDateId;
let log = function(dataLog, dataLog2){
  let now = new Date();
  console.log('[',date.format(now, 'YYYY-MM-DD HH:mm:ss'),']', '[Info]', dataLog, dataLog2 ? dataLog2: '');

  currentNow = date.format(now, 'YYYY-MM-DD HH:mm:ss');
  currentDate = date.format(now, 'YYYY-MM-DD');
  currentDateId = date.format(now, 'DD-MM-YYYY');
}

let year = function(){
  let now = new Date();
  return date.format(now, 'YYYY');
}

let month = function(){
  let now = new Date();
  return date.format(now, 'MM');
}

exports.log = log;
exports.now = currentNow;
exports.date = currentDate;
exports.year = year;
exports.month = month;
