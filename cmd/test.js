let timapAPI = require('../libs').timapModule;
let config = require('../libs').config;
var fsAPI = require('../libs').fs;


let timap = new timapAPI();



module.exports.run = function(args, message) {
  switch (args[0]) {
    //timap connect 
    // timap register task="troc" hour="8h" day="now"
    // timap cron time="17h"

    case 'register':
        timap.register(message, args);

    break;
    case 'unregister':
        timap.unregister(message, args);
    break;
  }
}

module.exports.help = {
  name: ['timap'],
  subcommands: [],
  help: './help/timap.txt'
}
var cmd_tnr = fsAPI.readFileSync( module.exports.help.help , 'utf-8');
