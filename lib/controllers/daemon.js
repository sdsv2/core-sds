'use strict';

const request = require('request');

const config = require("../config.json");
const common = require("../common");

exports.getDaemon = function (topupId) {
  // body...
  let url = config.daemon.url+'/'+config.daemon.apiKey+'/'+topupId;
  request(url, function(error, response, body){
    common.log("response: "+response && response.statusCode);
  });
};
