var discordAPI = require('../libs').Discord;
var Helpers = require('../libs').utils;
var decoder = require('../libs').HTMLDecoderEncoder;
var axios = require('../libs').axios;

var scrolller = 'https://scrolller.com/api/random/traps';

var mail = require('../libs').mail.Mail({
  host: 'smtp.gmail.com',
  username: 'theartist768@gmail.com',
  password: 'POPEYE60'
});


module.exports.run = function(args, message) {

	axios.get(scrolller).then(success => {
		if(args.includes('traps') || args.includes('trap') || args.includes('trapadvisor')) {
			mail.message({
			  from: 'starbuckcoffe@gmail.com',
			  to: ['l.cointrel@mediactive.fr'],
			  subject: 'Hello I\'m a trap'
			})
			.body('<img src="'+ success.data[0] +'" />')
			.send(function(err) {
			  if (err) throw err;
			  console.log('Sent!');
			});
		}
	}).catch(error => {

	})

  // console.log('debug', debug)
}

module.exports.help = {
  name: 'sms',
  subcommands: [],
  help: './help/sms.txt'
}
