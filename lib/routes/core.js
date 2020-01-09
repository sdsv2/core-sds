"use strict";

const express = require('express');
const router = express.Router();

const saldo = require('./saldo');
const gantiPin = require('./gantiPin');
const topup = require('./topup');
const report = require('./report');

router.use('/saldoMember', saldo);
router.use('/gantiPin', gantiPin);
router.use('/topup', topup);
router.use('/report', report);

module.exports = router;
