'use strict'

const connection = require('../db');
const common = require('../common');

exports.dataMember = async function (req, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let userId = req.params.userId;
    let sql = "SELECT * FROM user WHERE user_id=?";
    connection.query(sql, [userId], function(err, rows, fields){
      if(err){
        common.log("report user "+err);
        throw err;
        return;
      }else{
        if(!rows[0]){
          callback('failed','user tidak ditemukan');
          resolve();
          return;
        }else{
          callback('', rows[0].member_id);
          resolve();
          return;
        }
      }
    });
  });
};

exports.list = async function (member_id, trxDate, callback) {
  // body...
  await new Promise(function(resolve, reject) {
    let sql = "SELECT IFNULL(GROUP_CONCAT(sum_keyword),'tidak ada topup sukses pada tanggal') AS rep_trx FROM (SELECT CONCAT(keyword,' ',SUM(topup_qty)) AS sum_keyword FROM topup INNER JOIN topup_sms USING(topup_id) INNER JOIN stock_ref USING(stock_ref_id) INNER JOIN transaction USING (trans_id) WHERE trans_date=? AND member_id=? AND topup_status='S' GROUP BY stock_ref_id) AS summary";
    connection.query(sql, [trxDate, member_id], function(err, rows, fields){
      if(err){
        common.log("report transaction "+err);
        throw err;
        return;
      }else{
        callback('',rows[0].rep_trx);
        resolve();
        return;
      }
    });
  });
};
