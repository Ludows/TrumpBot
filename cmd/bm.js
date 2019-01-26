var discordAPI = require('../libs').Discord;
var bmAPI = require('../libs').bm;
var cronTask = require('../libs').cron;
var fsAPI = require('../libs').fs;


let bm = new bmAPI();

var rule = new cronTask.RecurrenceRule();
  rule.dayOfWeek = [0, 4];
  rule.hour = 10;
  rule.minute = 0;

cronTask.scheduleJob(rule, function(){
  bm.populate();
});


module.exports.run = function(args, message) {
    switch (args[0]) {
      case 'help':
        message.channel.send(cmd_bm);
        break;
      case 'populate':
        bm.populate();
        break;
      case 'random':
        bm.getMedia({random: true}).then(media => {
          bm.giveMedia(media, message, args);
        })
        break;
      default:
        bm.getMedia({random: false}).then(media => {
          console.log('media', media)
          bm.giveMedia(media, message, args);
        })
    }
}

module.exports.help = {
  name: ['bm'],
  subcommands: ['help', 'random'],
  help: './help/bm.txt'
}

var cmd_bm = fsAPI.readFileSync( module.exports.help.help , 'utf-8');
