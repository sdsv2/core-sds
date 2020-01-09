'use strict'

const connection = require('../db');
const common = require('../common');

let saldo = function(req, callback){
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM user INNER JOIN member ON member.member_id = user.member_id WHERE user.user_id=?";
    connection.query(sql, [req.params.userId], function(err, rows, fields){
      if(err){
        common.log("query saldo "+err);
        throw err;
        return;
      }else{
        if(!rows[0]){
          callback('failed', 'user tidak terdaftar');
          return;
        }else{
          resolve();
          callback('','saldo anda saat ini sebesar '+rows[0].member_balance+' rupiah');
          return;
        }
      }
    });
  });
}

let gantiPin = function(req, callback){
  return new Promise((resolve, reject) => {
    let sql = "UPDATE user SET pin=? WHERE user_id=?";
    connection.query(sql, [req.params.pinBaru, req.params.userId], function(err, rows, fields){
      if(err){
        common.log("update pin "+err);
        throw err;
        return;
      }else{
        resolve();
        callback('', 'pin anda telah ter-update');
        return;
      }
    });
  });
}

exports.dataMember = async function (memberId, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let sql = "SELECT * FROM member WHERE member_id=?";
    connection.query(sql, [memberId], function(err, rows, fields){
      if(err){
        common.log("data member "+err);
        throw err;
        return;
      }else{
        if(!rows[0]){
          resolve();
          callback('failed','member tidak ditemukan');
          return;
        }else{
          resolve();
          callback('',rows[0].member_name);
          return;
        }
      }
    });
  });
};

exports.saldo = saldo;
exports.gantiPin = gantiPin;
