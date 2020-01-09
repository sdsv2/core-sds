"use strict";

const config = require("../config.json");
const common = require("../common");

const modelTopup = require('../models/topup');
const modelMember = require('../models/member');
const daemon = require('./daemon');

exports.newTopup = async function (req, res, next) {
  // body...
  let smsId = req.params.smsId;
  let memberId = req.params.memberId;
  let keyword = req.params.keyword;
  let qty = req.params.qty;
  let rsNumber = req.params.rsNumber;
  let sequence = req.params.sequence;
  let credit = 0;
  let payment_gateway = 0; //default: nothing payment gateway

  try{
    let outlet_name; let rs_type_id; let outlet_type_id; let rs_id;
    await new Promise(function(resolve, reject) {
      modelTopup.dataChip(rsNumber, function(err, data){
        if(err){
          res.json({
            status: 'failed',
            message: data
          });
          return;
        }else{
          rs_id = data[0];
          rs_type_id = data[1];
          outlet_type_id = data[2];
          outlet_name = data[3];
          resolve();
        }
      });
    });
    common.log("rs id "+rs_id);

    let member_name = null;
    await new Promise(function(resolve, reject) {
      modelMember.dataMember(memberId, function(err,data){
        if(err){
          res.json({
            status: 'failed',
            message: data
          });
          return;
        }else{
          member_name = data;
          resolve();
        }
      });
    });
    common.log("member name "+member_name);

    let reply = 'transfer stock Pulsa Anda ke nomor '+rsNumber+' sebesar';
    let total_price = 0;

    reply = reply+' '+keyword+'=';

    //stock references : dompul, mkios, etc
    let stock_ref_id = null; let ref_type_id = null;
    await new Promise(function(resolve, reject) {
      modelTopup.stockRef(keyword, function(err, data){
        if(err){
          res.json({
            status: 'failed',
            message: data
          });
          return;
        }else{
          stock_ref_id = data[0];
          ref_type_id = data[1];
          resolve();
        }
      });
    });
    common.log("stock ref id "+stock_ref_id);
    common.log("ref type id "+ref_type_id);

    if(!rs_id || ref_type_id == 9){
      res.json({
        status:'failed',
        message: 'nomor rs chip '+rsNumber+' yang anda masukkan salah'
      });
      return;
    }

    //pricing
    let price = 0; let nominal = 0;
    await new Promise(function(resolve, reject) {
      modelTopup.pricing(stock_ref_id, ref_type_id, function(err, data){
        if(err){
          res.json({
            status: 'failed',
            message: data+': '+keyword+'='+qty
          });
          return;
        }else{
          price = data[0];
          nominal = data[1];
          resolve();
        }
      });
    });
    common.log("pricing "+price);
    common.log("nominal "+nominal);

    //quantity
    if(!qty || qty == 0 || qty < 0){
      res.json({
        status: 'failed',
        message: 'qty tidak valid, silahkan ulangi request Anda: '+keyword+'='+qty
      });
      return;
    }
    common.log("qty "+qty);

    //total price
    if(nominal){
      total_price += price * qty;
    }else if(ref_type_id == 9){
      total_price = qty;
    }else{
      total_price += qty * (100 - price)/100;
    }
    reply = reply +''+qty+' ' ;
    common.log("total price "+total_price);

    sequence = sequence ? sequence : 1;

    //cek trx process
    common.log("check trx process");
    await new Promise(function(resolve, reject) {
      modelTopup.trxProcess(rs_id, qty, stock_ref_id, sequence, function(err, data){
        if(err){
          res.json({
            status: 'failed',
            message: 'pengisian '+keyword+' ke '+rsNumber+' sejumlah '+qty+' telah/sedang dilakukan. tunggu dlm 6 jam utk mengulang'
          });
          return;
        }else{
          resolve();
        }
      });
    });

    //insert table topup
    common.log("now record topup");
    let topupId = null;
    await new Promise(function(resolve, reject) {
      modelTopup.createTopup(stock_ref_id, rs_id, memberId, qty, '', credit, payment_gateway, sequence, function(err, data){
        topupId = data;
        resolve();
      });
    });
    common.log("topup Id"+topupId);

    //insert table topup sms
    await new Promise(function(resolve, reject) {
      modelTopup.createTopupSms(topupId, smsId, sequence, rsNumber, function(err, data){
        daemon.getDaemon(topupId);
        reply = reply +' '+data;
        common.log("reply "+reply);
        res.json({
          status: 'succes',
          message: reply
        });
        return;
      });
    });
  }catch(error){
    common.log("error new Topup "+error.message);
    res.json({status: 'failed', message: error.message});
  }
};
