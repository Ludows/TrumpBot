var config = require('../libs').config
var discordAPI = require('../libs').Discord;
var jQueryAPI = require('../libs').jDoc;
var fsAPI = require('../libs').fs;

var Helpers = require('../libs').utils;

var jq = new jQueryAPI();
var helper = new Helpers();

var obj;
jq.fetch().then(x => obj = x)

// !med jq @method

module.exports.run = function(args, message) {


  var a = module.exports.help.subcommands;


  // console.log('subcommand ?', helper.isSubcommand(args[0], a))
  // console.log('is crypto ?',  helper.isCrypto(args[0], cryptos))
  if(helper.isSubcommand(args[0], a) === false && helper.isjQueryMethod(args[0], obj) === false ) {
     message.reply('Bravo ! t\'a toujours rien compris ! Allez la doc !');
     message.channel.send(cmd_jdoc);
     return;
  }
 switch(args[0]) {
   case 'search':
    searchData(args, message);
     break;
   case 'help':
    message.reply('les commandes '+ module.exports.help.name +' rien que pour toi mon grand !');
    message.author.send(cmd_jdoc);
     break;
   default:
      runData(args, message);
       break;
 }
}

module.exports.help = {
  name: 'jdoc',
  subcommands: ['search','help', '@me', '@everyone'],
  help: './help/jdoc.txt'
}

var cmd_jdoc = fsAPI.readFileSync( module.exports.help.help , 'utf-8');


function searchData(args, message) {
  jq.global(args[1].toLowerCase()).then(function(results) {
    if(results.length === 0) {
      message.reply('la méthode '+ args[1] +' demandée n\'existe pas ');
    }
    else {
      var tpl = 'Search for '+ args[1] +' :\n\n';
      results.forEach(function(res) {
        tpl += config.prefix + ' ' + module.exports.help.name + ' ' + res.slug +'\n'
      })

      var instances_dependencies = {
        message : message,
        discord : discordAPI,
        args : args,
        embed: tpl // can be a string or object
      }
      helper.sender(instances_dependencies);
    }

  });
}

function runData(args, message) {
  console.log('running...')
  jq.bySlug(args[0]).then(function(results) {
    let embed = new discordAPI.RichEmbed()
    .setTitle(results[0].text)
    .setDescription(results[0].description)
    .setURL(results[0].link);

    var instances_dependencies = {
      message : message,
      discord : discordAPI,
      args : args,
      embed: embed
    }
    helper.sender(instances_dependencies);
  });
}
