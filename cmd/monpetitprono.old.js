var discordAPI = require('../libs').Discord;
// var request = require('../libs').axios
const MPP = require('../libs').pronos

let prono = new MPP();
let keys = '';
let getAuth = prono.getAuth().then(res => {
  console.log('getAuth', res)
  keys = res;
});


module.exports.run = function(args, message) {
  switch (args[0]) {
    case 'classement':
    if(keys != '') {
      prono.getClassement(keys).then(classement => {
        // console.log('classement', classement)
        prono.renderClassement(classement, message, args);
      })
    }
    else {
      message.reply('2 secondes le classement arrive ;)');
    }

    break;
    case 'next-match':
      prono.getAllMatches(keys).then(res => {
        // prono.render(res, message, args);
        prono.filterMatchsToCome(res).then(matchs => {
          prono.render(matchs, message, args);
        })
      }).catch(error => {
        console.log(error)
      })

      break;
    case 'match-to-come':
      prono.getAllMatches(keys).then(res => {
        // console.log(res)
        prono.filterMatchsToCome(res).then(matchs => {
          prono.render(matchs, message, args);
        })
      }).catch(error => {
        console.log(error)
      })

      break;
    case 'match-to-past':
      prono.getAllMatches(keys).then(res => {
        // console.log(res)
        prono.filterMatchsToPast(res).then(matchs => {
          prono.render(matchs, message, args);
        })
      }).catch(error => {
        console.log(error)
      })

      break;
    default:
        // message.reply('Coming soon...');
        break;

  }
}

module.exports.help = {
  name: 'monpetitprono',
  subcommands: [],
  help: '../help/monpetitprono.txt'
}
