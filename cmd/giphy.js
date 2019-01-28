var giphyBundle = require('../libs').giphyExt;

var gph = new giphyBundle({'limit': 30});

var fsAPI = require('../libs').fs;


module.exports.run = function(args, message) {
  // $ giphy search [term]
  // result => 30 résultats with id
  // $ giphy [id]
  // $ giphy random [term]
  // $ giphy trending => 30 résultats avec id
  // $ giphy stickers => 30 résultats avec id
  //
  switch (args[0]) {
   case 'help':
    message.channel.send(cmd_gph);
    break;
    case 'search':
      if(args[1] === undefined) {
        message.channel.send('Veuillez renseigner un terme à votre recherche');
        return false;
      }
      gph.search({query: args[1]}).then((idstr) => {
          gph.render(idstr, message, args);
      })
      break;
      case 'random':
        let queryMethod;
        if(args[1] === undefined) {
          queryMethod = 'auto';
        }
        else {
          queryMethod = args[1]
        }
        gph.random({query: queryMethod}).then((gif) => {
          gph.render(gif, message, args);
        })
        break;
      case 'trending':
        gph.trend().then((gif) => {
            gph.render(gif, message, args);
        })
        break;
      case 'stickers':
        if(args[1] === undefined) {
          message.channel.send('Veuillez renseigner un terme à votre recherche');
          return false;
        }
        gph.stickers({query: args[1]}).then((gif) => {
          gph.render(gif, message, args);
        })
        break;
    default:
      if(args[0] === undefined) {
        message.channel.send('Veuillez renseigner un id du gif animé souhaité');
        return false;
      }
      gph.getMediaById(args[0]).then((gif) => {
          gph.render(gif, message, args);
      })
  }
}

module.exports.help = {
  name: ['giphy', 'gph'],
  subcommands: ['help', 'search', 'random', 'trending', 'stickers'],
  help: './help/gph.txt'
}

var cmd_gph = fsAPI.readFileSync( module.exports.help.help , 'utf-8');
