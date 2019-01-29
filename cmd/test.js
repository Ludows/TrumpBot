let tenorAPI = require('../libs').tenorModule;
let config = require('../libs').config;

let tnr = new tenorAPI({key: config.tenor, limit: 30})

module.exports.run = function(args, message) {
  switch (args[0]) {
   case 'help':
    // message.channel.send(cmd_gph);
    break;
    case 'suggestions':
      if(args[1] === undefined) {
        message.channel.send('Veuillez renseigner une suggestion à votre recherche');
        return false;
      }
      tnr.suggestions({query: args[1]}).then((str) => {
          tnr.render(str, message, args);
      })
      break;
    case 'search':
      if(args[1] === undefined) {
        message.channel.send('Veuillez renseigner un terme à votre recherche');
        return false;
      }
      tnr.search({query: args[1]}).then((idstr) => {
          tnr.render(idstr, message, args);
      })
      break;
      case 'random':
        let queryMethod;
        if(args[1] === undefined) {
          message.channel.send('Veuillez renseigner un terme à votre recherche');
          return false;
        }
        tnr.random({query: args[1]}).then((gif) => {
          tnr.render(gif, message, args);
        })
        break;
      case 'trending':
        tnr.trend().then((gif) => {
            tnr.render(gif, message, args);
        })
        break;

    default:
      if(args[0] === undefined) {
        message.channel.send('Veuillez renseigner un id du gif animé souhaité');
        return false;
      }
      tnr.getMediaById(args[0]).then((gif) => {
          tnr.render(gif, message, args);
      })
  }
}

module.exports.help = {
  name: ['tnr'],
  subcommands: [],
  help: './help/tnr.txt'
}
