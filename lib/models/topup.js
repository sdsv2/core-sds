'use strict'

const connection = require('../db');
const common = require('../common');

exports.dataChip = async function (rsNumber, callback) {
  // body...
  common.log("data chip for rs number "+rsNumber);
  await new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM rs_chip INNER JOIN outlet ON outlet.outlet_id = rs_chip.outlet_id WHERE rs_number=?";
    connection.query(sql, [rsNumber], function(err, rows, fields){
      if(err){
        common.log("error query "+err);
        throw err;
        return;
      }else{
        if(!rows[0]){
          resolve();
          callback('failed', 'rs chip '+rsNumber+' tidak ditemukan');
          return;
        }else{
          resolve();
          let data = [rows[0].rs_id, rows[0].rs_type_id, rows[0].outlet_type_id, rows[0].outlet_name];
          callback('', data);
          return;
        }
      }
    });
  });
};

exports.stockRef = async function (keyword, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM stock_ref WHERE keyword=?";
    connection.query(sql, [keyword], function(err, rows, fields){
      if(err){
        common.log("error query "+err);
        throw err;
        return;
      }else{
        if(!rows[0]){
          resolve();
          callback('failed', 'keyword '+keyword+' tidak valid');
          return;
        }else{
          common.log("stock ref id "+rows[0].stock_ref_id);
          resolve();
          let data = [rows[0].stock_ref_id, rows[0].ref_type_id];
          callback('', data);
          return;
        }
      }
    });
  });
};

exports.pricing = async function (stock_ref_id, ref_type_id, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM pricing INNER JOIN stock_ref ON stock_ref.stock_ref_id = pricing.stock_ref_id WHERE pricing.stock_ref_id=? AND stock_ref.ref_type_id=?";
    connection.query(sql, [stock_ref_id, ref_type_id], function(err, rows, fields){
      if(err){
        common.log("pricing "+err);
        throw err;
        return;
      }else{
        if(!rows[0]){
          resolve();
          callback('failed','harga tidak tersedia');
          return;
        }else{
          resolve();
          let listData = [rows[0].price, rows[0].nominal];
          callback('', listData);
          return;
        }
      }
    });
  });
};

exports.trxProcess = async function (rs_id, qty, stock_ref_id, sequence, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM topup_sms INNER JOIN topup ON topup.topup_id = topup_sms.topup_id WHERE rs_id=? AND topup_qty=? AND stock_ref_id=? AND sequence=? AND topup_status in('','W','P','S') AND topup_ts >= DATE_SUB(NOW(), INTERVAL 6 HOUR) FOR UPDATE";
    connection.query(sql, [rs_id, qty, stock_ref_id, sequence], function(err, rows, fields){
      if(err){
        common.log("trx process "+err);
        throw err;
        return;
      }else{
        if(!rows[0]){
          resolve();
          callback('','nothing trx process');
          return;
        }else{
          resolve()
          callback('failed','trx under process');
          return;
        }
      }
    });
  });
};

exports.createTopup = async function (stockRefId, rsId, memberId, qty, topupStatus, credit, paymentGateway, sequence, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let sql = "INSERT INTO topup (stock_ref_id, rs_id, member_id, topup_qty, topup_status, topup_ts, credit, payment_gateway) VALUE(?, ?, ?, ?, ?, NOW() + INTERVAL ? SECOND, ?, ?)";
    connection.query(sql, [stockRefId, rsId, memberId, qty, topupStatus, sequence,credit, paymentGateway], function(err, rows, fields){
      if(err){
        common.log("insert topup "+err);
        throw err;
        return;
      }else{
        resolve();
        callback('', rows.insertId);
        return;
      }
    });
  });
};

exports.createTopupSms = async function (topupId, sms_id, sequence, rsNumber, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let sql = "INSERT INTO topup_sms (topup_id, sms_id, sequence, dest_msisdn) VALUE(?, ?, ?, ?)";
    connection.query(sql, [topupId, sms_id, sequence, rsNumber], function(err, rows, fields){
      if(err){
        common.log("insert topup sms "+err);
        throw err;
        return;
      }else{
        resolve();
        callback('','sedang diproses');
        return;
      }
    });
  });
};
