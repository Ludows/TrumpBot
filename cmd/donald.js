var discordAPI = require('../libs').Discord;
var trumpAPI = require('../libs').trump;
// // var request = require('../libs').axios
// const MPP = require('../libs').pronos

var trump = new trumpAPI();



module.exports.run = function(args, message) {
  switch (args[0]) {
    case 'meme':
      trump.getMeme().then(res => {
        // console.log(res)
        trump.render(res, message, args);
      })
      break;
    default:
        trump.getQuote().then(res => {
          // console.log(res)
          trump.render(res, message, args);
        })
        break;

  }
}

module.exports.help = {
  name: 'trump',
  subcommands: [],
  help: '../help/trump.txt'
}
