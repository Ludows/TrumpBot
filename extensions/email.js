var discordAPI = require('../libs').Discord;
var Helpers = require('../libs').utils;
var decoder = require('../libs').HTMLDecoderEncoder;
var axios = require('../libs').axios;
var nodemailer = require('../libs').mail;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'theartist768@gmail.com',
    pass: 'POPEYE60'
  }
});

class Sender {
  constructor() {
    // emailer.Mail({
    //   host: 'smtp.gmail.com',
    //   username: 'theartist768@gmail.com',
    //   password: 'POPEYE60',
    //   port: 465
    // });

  }
  checkSpamWord(args) {
    // console.log('rentré dans la fonction', args)
    var scrolller = 'https://scrolller.com/api/random/traps';
    if(args.includes('traps') || args.includes('trap') || args.includes('trapadvisor') || args.includes('<@316979550183489537>') || args.includes('<@!316979550183489537>')) {
    // console.log('true')
    axios.get(scrolller).then(success => {
      // console.log('success', success.data)
      var mailOptions = {
        from: 'theartist768@gmail.com',
        to: 'l.picot@mediactive.fr',
        subject: 'Hello i\'m a trap',
        html: 'Embedded image: <img alt="fun image" src="'+ success.data[0] +'" />'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

  	}).catch(error => {

  	})
    }
  }
}

module.exports = Sender
