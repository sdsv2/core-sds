"use strict";

const config = require("../config.json");
const common = require("../common");

const modelReport = require('../models/report');

exports.listReport = async function (req, res, next) {
  // body...
  let member_id = null;
  await new Promise(function(resolve, reject) {
    modelReport.dataMember(req, function(err, data){
      if(err){
        res.json({
          status: 'failed',
          message: data
        });
        return;
      }else{
        member_id = data;
        resolve();
      }
    });
  });

  await new Promise(function(resolve, reject) {
    let dateTrx = req.params.dateTrx;
    let date = dateTrx.substr(0,2);
    date = String(date).padStart(2, "0");
    let month = dateTrx.substr(2,2);
    month = String(month).padStart(2, "0");
    let year = dateTrx.substr(4,4);
    if(month == "00"){
      month = common.month();
    }
    if(!year){
      year = common.year();
    }else if(year == "00"){
      year = common.year();
    }
    let trxDate = year+'-'+month+'-'+date;
    common.log("trx date "+trxDate);
    modelReport.list(member_id, trxDate, function(err, data){
      res.json({
        status:'success',
        message: data+' '+date+'-'+month+'-'+year
      });
      return;
    });
  });
};
