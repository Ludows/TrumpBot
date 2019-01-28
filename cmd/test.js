var giphyBundle = require('../libs').giphyExt;

var gph = new giphyBundle();

module.exports.run = function(args, message) {
  // $ giphy search [term]
  // result => 30 résultats with id
  // $ giphy [id]
  // $ giphy random
  // $ giphy trending => 30 résultats avec id
  // $ giphy stickers => 30 résultats avec id
  //
  switch (args[0]) {
    case 'search':
      if(args[1] === undefined) {
        message.channel.send('Veuillez renseigner un term à votre recherche');
        return false;
      }
      gph.search({query: args[1]}).then((gif) => {

      })
      break;
      case 'random':
        gph.random({query: args[1]}).then((gif) => {

        })
        break;
      case 'trending':
        gph.trend().then((gif) => {

        })
        break;
      case 'stickers':
        gph.stickers({query: args[1]}).then((gif) => {

        })
        break;
    default:

  }
}

module.exports.help = {
  name: ['g-test'],
  subcommands: [],
  help: ''
}
