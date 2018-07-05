// this function send a bm picture to a channel
// const vueify = require('vueify').compiler
var discordAPI = require('../libs').Discord;
var dealabsAPI = require('../libs').dealReader
var Helpers = require('../libs').utils;
var fsAPI = require('../libs').fs;



var dealabs = new dealabsAPI();

var helper = new Helpers();



module.exports.run = function(args, message) {
  var a = module.exports.help.subcommands;

  if(helper.isSubcommand(args[0], a) === false) {
    message.reply('Bravo ! t\'a toujours rien compris ! Allez la doc !');
    message.channel.send(cmd_dlbs);
    return;
  }

  switch(args[0]) {
    case 'search':
        dealabs.fetch({query:args[0], results: 100}).then(function(datas) {
          // console.log('datas ?', datas);
          var arrayofDeals = dealabs.formatDeals(datas)
          var results = dealabs.search(args[1], {arraytoSearch: arrayofDeals})
          getRichEmbed(args, results, message);
        });
      break;
    // case 'see':
    //      message.reply('Désolé je potasse sur le sujet. Ca sera good prochainement !');
    //      // message.reply('les commandes dealabs rien que pour toi mon grand !');
    //      // message.author.send(cmd_dlbs);
    //      break;
    case 'help':
         message.reply('les commandes dealabs rien que pour toi mon grand !');
         message.author.send(cmd_dlbs);
         break;
      default:
        dealabs.fetch({query:args[0], results: 20}).then(function(datas) {
          var arrayofDeals = dealabs.formatDeals(datas)
          getRichEmbed(args, arrayofDeals, message);
        });

      break;
  }
}

module.exports.help = {
  name: ['dlbs', 'dealabs'],
  subcommands: ['search',
                'newcodepromo',
                'hotcodepromo',
                'commentcodepromo',
                'hotfree',
                'newfree',
                'commentfree',
                'hotgoodplans',
                'newgoodplans',
                'commentgoodplans',
                'hotalldeals',
                'newalldeals',
                'commentalldeals',
                '@everyone',
                'help',
                '@me'],
  help: './help/dlbs.txt'
}

var cmd_dlbs = fsAPI.readFileSync( module.exports.help.help , 'utf-8');



function getRichEmbed(args, array, message) {


  var instances_dependencies = {
    message : message,
    discord : discordAPI,
    args : args,
  }
  switch(args[0]) {
    case 'search':
      var tpl = array;
      instances_dependencies.embed = tpl

      break;
    default:
       const embed = new discordAPI.RichEmbed()
       let index = 0;

        if (args.includes('random')) {

            index = Math.floor(Math.random() * (array.length - 1));
             console.log('index', index)
        }


        embed.setTitle(array[index].title)
        embed.setURL(array[index].link)
        embed.setImage(array[index].img)
        if (array[index].price) {
          embed.addField('Prix après Réduction :', array[index].price)
        }
        if(array[index].realprice) {
          embed.addField('Prix réel :', array[index].realprice)
        }
        if (array[index].reduction) {
          embed.addField('Réduction :', array[index].reduction)
        }
        embed.setColor(0x00AE86)
        embed.setFooter(array[index].user , array[index].avatar)

        instances_dependencies.embed = embed
      break;
  }



  // @todo gérer si user est mentionné
  // message.channel.send({embed});


  helper.sender(instances_dependencies);

}
