"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const config = require('./lib/config.json');
const port = config.core.listen_port;
const common = require('./lib/common');

const core = require('./lib/routes/core');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next){
  common.log(req.method, req.originalUrl);
  next();
});

app.use('/core', core);

app.use(function (req, res, next) {
  res.status(404).json({
    status: 404,
    message: 'Upps.. request service not found!'
  });
});

app.listen(port, () => common.log(`Core SDS listening on port ${port}!`));
