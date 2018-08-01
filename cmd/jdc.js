var discordAPI = require('../libs').Discord;
var config = require('../libs').config;

var Helpers = require('../libs').utils;
var fsAPI = require('../libs').fs;

var jdc_wrap = require('../libs').jdc;

var jdc = new jdc_wrap();

module.exports.run = function(args, message) {
  jdc.getTopic(args[0])
}

module.exports.help = {
  name: ['jdc', 'joieducode'],
  subcommands: [],
  help: './help/jdc.txt'
}
