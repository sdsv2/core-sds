"use strict";

const express = require('express');
const router = express.Router();

const checkAPI = require('../controllers/apiKey');
const member = require('../controllers/member');

//http://localhost:4674/center/messaging/:apiKey?msisdn=..&msg=s.1234&ts=..&smsc=...
router.get('/:apiKey/:userId', [checkAPI.keyCore, member.saldo],function(req, res, next){
  res.json({
    status: 200,
    message: 'Api key Success'
  })
});

module.exports = router;
