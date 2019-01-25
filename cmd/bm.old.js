// var feed = require('../require-lib').feed;
var discordAPI = require('../libs').Discord;
var bot = require('../libs').bot;
var tumblrAPI = require('../libs').tumblr;
var fsAPI = require('../libs').fs;
var config = require('../libs').config;
var Helpers = require('../libs').utils;

var helper = new Helpers();

var oauth = {
  consumer_key: config.tumblr_CK,
  consumer_secret: config.tumblr_CS,
  token: config.tumblr_token,
  token_secret: config.tumblr_token_secret
};

var blog = new tumblrAPI.Blog('dites.bonjourmadame.fr', oauth);


// this function send a bm picture to a channel

module.exports.run = function(args, message) {
   sendMadame(args, message);
}

module.exports.help = {
  name: ['bm', 'bonjourmadame'],
  subcommands: ['random', 'help', '@everyone', '@me'],
  help: './help/bm.txt'
}

var cmd_bm = fsAPI.readFileSync( module.exports.help.help , 'utf-8');

// !med bm
// !med bm @identifiant
// !med bm @everyone
// !med bm @me
// !med bm random
// !med bm random @identifiant
// !med bm random @me



function sendMadame(args, message) {
  var content;

  if(args[0] != undefined && !args[0].startsWith('@', 1) && helper.isSubcommand(args[0], module.exports.help.subcommands) === false) {
    message.reply('toi je vais envoyer les commandes boloss...');
    message.channel.send(cmd_bm);
    return;
  }

  switch (args[0]) {
    case 'random':
      // statements_1
      blog.posts({limit: 50}, function(error, response) {
      // console.log(response.posts)
      content = response.posts
      getEmbedforBm(args, message, content);
      })
      break;
      case 'help':
        message.reply('les commandes bonjourmadame rien que pour toi');
        message.author.send(cmd_bm);
        break;

    default:
        blog.posts({limit: 1}, function(error, response) {
        // console.log(response.posts)
        content = response.posts
        // console.log('contents', content)
        getEmbedforBm(args, message, content);
        })
      break;
   }
}

function getEmbedforBm(args, message, response) {
  let index = 0;
console.log('launched')

  if (response != undefined && response.length > 1) {
        index = Math.floor(Math.random() * (response.length - 1));
    }

    const embed = new discordAPI.RichEmbed()
    .setTitle(response[index].summary)
    .setImage(response[index].photos[0].alt_sizes[0].url)
    .setURL(response[index].post_url)

     var instances_dependencies = {
      message : message,
   		discord : discordAPI,
   		args : args,
      embed: embed
     }
     helper.sender(instances_dependencies);


    // if(args[0] != undefined && args[0].startsWith('@', 1)) {
    //     var formatId = args[0].substring(2, args[0].length - 1);
    //       message.guild.members.get(formatId).send({embed});
    //       message.reply('Cela a bien été envoyé !');
    //   }
    //   else if(args[1] != undefined && args[1].startsWith("@", 1)) {
    //     var formatId = args[1].substring(2, args[1].length - 1);
    //       message.guild.members.get(formatId).send({embed});
    //       message.reply('Cela a bien été envoyé !');
    //
    //   } else if(args[0] != undefined && args[0] === '@everyone') {
    //     let allMembers = message.guild.members;
    //
    //     allMembers.forEach(function(element, index) {
    //       // console.log('element', element);
    //       if(element.user.bot === false) {
    //         element.user.send({embed});
    //       }
    //
    //     })
    //     message.reply('Cela a bien été envoyé à tous les membres !');
    //   }
    //   else if(args[1] != undefined && args[1] === '@everyone') {
    //     let allMembers = message.guild.members;
    //
    //     allMembers.forEach(function(element, index) {
    //       // console.log('element', element);
    //       if(element.user.bot === false) {
    //         element.user.send({embed});
    //       }
    //
    //     })
    //     message.reply('Cela a bien été envoyé à tous les membres !');
    //   }
    //   else {
    //     message.channel.send({embed});
    //   }
}
