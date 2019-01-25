var discordAPI = require('../libs').Discord;
var config = require('../libs').config;

var Helpers = require('../libs').utils;
var fsAPI = require('../libs').fs;

var bmAPI = require('../libs').bm;

let bm = new bmAPI();


module.exports.run = function(args, message) {
    bm.populate()
}

module.exports.help = {
  name: ['bm-test', 'bjr-m'],
  subcommands: [],
  help: './help/bm.txt'
}
