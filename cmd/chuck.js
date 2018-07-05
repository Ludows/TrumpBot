var FactsAPI = require('../libs').Facts
var discordAPI = require('../libs').Discord;
var Helpers = require('../libs').utils;
var decoder = require('../libs').HTMLDecoderEncoder;


var helper = new Helpers();


var facts = new FactsAPI({
	endpoint: 'https://www.chucknorrisfacts.fr/api/'
});

module.exports.run = function(args, message) {
  opts = {
  	nb: 1,
  	type: 'txt',
  	tri: 'alea'
  }
  var debug = facts.url(opts).then(function(x) {
  	// console.log(x)
  	var instances_dependencies = {
      message : message,
      discord : discordAPI,
      args : args,
      embed: decoder.decode(x[0].fact)
    }
    helper.sender(instances_dependencies);
  });
  // console.log('debug', debug)
}

module.exports.help = {
  name: 'chuckfacts',
  subcommands: ['help', '@everyone', '@me'],
  help: './help/chuck.txt'
}
