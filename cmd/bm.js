// var feed = require('../require-lib').feed;
var discordAPI = require('../libs').Discord;
var bot = require('../libs').bot;
var fsAPI = require('../libs').fs;
var config = require('../libs').config;
var Helpers = require('../libs').utils;
var decoder = require('../libs').HTMLDecoderEncoder;


var helper = new Helpers();

var wpAPI = require('../libs').WP;




var wp = new wpAPI({
    endpoint: 'http://www.bonjourmadame.fr/wp-json'
});




// this function send a bm picture to a channel

module.exports.run = function(args, message) {
  switch (args[0]) {
    case 'help':
      message.channel.send(cmd_bm);
      break;
    case 'random':
      message.channel.send('In Work !');
      break;
    default:
    wp.posts().perPage(1).then(function(post) {

        // console.log('post', post)
        // src=['|"][^'|"]*?['|"]
        var re = /src=['|"][^'|"]*?['|"]/gi;
        var src = post[0].content.rendered.match(re);
        var format_src = src[0].split('"');

        const embed = new discordAPI.RichEmbed()

        embed.setTitle(decoder.decode(post[0].title.rendered))
        embed.setURL(post[0].link)
        embed.setImage(format_src[1])

        var instances_dependencies = {
            message : message,
            discord : discordAPI,
            args : args,
            embed: embed
        }
        helper.sender(instances_dependencies);

    })
    break;
  }


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
