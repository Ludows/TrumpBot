var discordAPI = require('../libs').Discord;
var config = require('../libs').config;

var Helpers = require('../libs').utils;
var fsAPI = require('../libs').fs;

var jdc_wrap = require('../libs').jdc;

var jdc = new jdc_wrap();

module.exports.run = function(args, message) {
  // console.log('jdc appelé')
  switch (args[0]) {
    case 'help':

      break;
    case 'populatePosts':
      jdc.populatePosts()
      break;
    case 'populateTags':
      jdc.populateTags()
      break;
    default:
      console.log('args', args)
      let top;
      if(args.length === 0) {
        top = '';
      }
      else {
        top = args[0];
      }
      jdc.getMedia({topic : top}).then(result => {
        jdc.giveMedia(result, message, args);
      })
  }

}

module.exports.help = {
  name: ['jdc', 'joieducode'],
  subcommands: [],
  help: './help/jdc.txt'
}
