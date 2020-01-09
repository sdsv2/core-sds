"use strict";

const config = require("../config.json");
const common = require("../common");

const modelMember = require("../models/member");

let saldo = async function(req, res, next){
  await modelMember.saldo(req, function(err, data){
    if(err){
      res.json({
        status: 500,
        message: data
      });
      return;
    }else{
      res.json({
        status: 200,
        message: data
      });
      return;
    }
  });
}

let gantiPin = async function(req, res, next){
  await modelMember.gantiPin(req, function(err, data){
    if(err){
      res.json({
        status: 500,
        message: data
      });
      return;
    }else{
      res.json({
        status: 200,
        message: data
      });
      return;
    }
  });
}

exports.saldo = saldo;
exports.gantiPin = gantiPin;
