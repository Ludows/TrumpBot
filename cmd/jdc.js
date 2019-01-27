var discordAPI = require('../libs').Discord;
var config = require('../libs').config;

var Helpers = require('../libs').utils;
var fsAPI = require('../libs').fs;
var cronTask = require('../libs').cron;



var jdc_wrap = require('../libs').jdc;

var jdc = new jdc_wrap();

var rule = new cronTask.RecurrenceRule();
  rule.dayOfWeek = [0, 4];
  rule.hour = 9;
  rule.minute = 30;

cronTask.scheduleJob(rule, function(){
  jdc.populatePosts();
});

module.exports.run = function(args, message) {
  // console.log('jdc appelé')
  switch (args[0]) {
    case 'help':
      message.channel.send(cmd_jdc);
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

var cmd_jdc = fsAPI.readFileSync( module.exports.help.help , 'utf-8');
