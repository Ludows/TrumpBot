var discordAPI = require('../libs').Discord;
var giphyAPI = require('../libs').giphy;


module.exports.run = function(args, message) {

}

module.exports.help = {
  name: 'giphy',
  subcommands: [],
  help: '../help/giphy.txt'
}

exports.sendGif = function(keyword, message) {
    if (!keyword) {
      message.reply('Tu fais gaffe a ce que tu fais gros ? ex : !med [keyword]');
    }
    let minimum = 1;

    giphyAPI.random({tag:keyword, limit: minimum}).then(function(res) {

    const embed = new discordAPI.RichEmbed()
    .setImage(res.data.image_original_url)
    .setURL(res.data.url)

    message.channel.send({embed});
    });
}

exports.searchGiphy = function(keyword, limit, message) {

   if (!keyword) {
     message.reply('Tu dois rechercher quelquechose mon petit gars. ex : !med giphy search patates');
   }

   let minimum = 1;
   if (limit) {
     minimum = limit
   }

   giphyAPI.search({q:keyword, limit: minimum}).then(function(res) {

    const embed = new discordAPI.RichEmbed()
    .setTitle(res.data[minimum - 1].title)
    .setImage(res.data[minimum - 1].images.original_still.url)
    .setURL(res.data[minimum - 1].url)

    message.channel.send({embed});
   });
}

exports.randomGiphy = function(keyword, limit, message) {

   if (!keyword) {
     message.reply('Tu dois rechercher quelquechose mon petit gars. ex : !med giphy random patates');
   }

   let minimum = 1;
   if (limit) {
     minimum = limit
   }

   giphyAPI.random({tag:keyword, limit: limit}).then(function(res) {

    // console.log('res', res)
    const embed = new discordAPI.RichEmbed()
    .setTitle('Random Image :)')
    .setImage(res.data.image_original_url)
    .setURL(res.data.url)

    message.channel.send({embed});
    });
}
