let timapAPI = require('../libs').timapModule;
let config = require('../libs').config;
var fsAPI = require('../libs').fs;





module.exports.run = function(args, message) {
  switch (args[0]) {
    //timap connect 
    // timap register task="troc" hour="8h" day="now"
    // timap cron time="17h"
  }
}

module.exports.help = {
  name: ['timap'],
  subcommands: [],
  help: './help/timap.txt'
}
var cmd_tnr = fsAPI.readFileSync( module.exports.help.help , 'utf-8');
