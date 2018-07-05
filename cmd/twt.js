var twitterAPI = require('../libs').twt
var config = require('../libs').config
var Helpers = require('../libs').utils;
var fsAPI = require('../libs').fs;


var helper = new Helpers();


var opts_twt = {
  consumer_key: config.twt_CK,
  consumer_secret: config.twt_CS,
  access_token_key: config.twt_AT,
  access_token_secret: config.twt_ATS
}

var cliTwt = new twitterAPI(opts_twt);

module.exports.run = function(args, message) {

    var a = module.exports.help.subcommands;

  	if(helper.isSubcommand(args[0], a) === false) {
    	message.reply('Bravo ! t\'a toujours rien compris ! Allez la doc !');
    	message.channel.send(cmd_twt);
    	return;
  	}

	switch(args[0]) {
	  case 'search':
        message.reply('Je potasse le sujet ! Cela arrivera prochainement ! ;)');
      break;
      case 'last':
        getLastPostByUser(args[1], message, args);
      break;
      case 'random':
        getRandPostByUser(args[1], message, args);
      break;
      case 'help':
        message.reply('Rien que pour toi, les commandes twt ! Amuses toi !');
        message.author.send(cmd_twt);
      break;
      default:

      break;
	}
}

module.exports.help = {
  name: 'twt',
  subcommands: ['search', 'last', 'help', 'random', '@me', '@everyone'],
  help: './help/twt.txt'
}

var cmd_twt = fsAPI.readFileSync( module.exports.help.help , 'utf-8');


function getLastPostByUser(query, message, args) {
	if(!query) {
		message.reply('Veuillez faire une recherche like this : !med twt last [query].');
		return;
	}

	var params = {screen_name: query, count: 100};
	cliTwt.get('statuses/user_timeline', params, function(error, tweets, response) {

	var all_tweets = tweets;
	for (var i = 0; i < all_tweets.length; i++) {
		if(all_tweets[i].in_reply_to_status_id === null && all_tweets[i].in_reply_to_status_id_str === null && all_tweets[i].in_reply_to_user_id === null && all_tweets[i].in_reply_to_user_id_str === null && all_tweets[i].in_reply_to_screen_name === null && all_tweets[i].retweeted_status === undefined) {


	      var instances_dependencies = {
		    message : message,
		    args : args,
		    embed : 'https://twitter.com/'+ all_tweets[i].user.screen_name +'/status/'+all_tweets[i].id_str+'',
		  }
		  helper.sender(instances_dependencies);
			return;
		}
	}
});

}

function getRandPostByUser(query, message, args) {
	if(!query) {
		message.reply('Veuillez faire une recherche like this : !med twt random [query].');
		return;
	}

	var params = {screen_name: query, count: 100};
	cliTwt.get('statuses/user_timeline', params, function(error, tweets, response) {

	var all_tweets = tweets;
	var all_posted_tweet_by_user = new Array();
	let index;
	for (var i = 0; i < all_tweets.length; i++) {

		if(all_tweets[i].in_reply_to_status_id === null && all_tweets[i].in_reply_to_status_id_str === null && all_tweets[i].in_reply_to_user_id === null && all_tweets[i].in_reply_to_user_id_str === null && all_tweets[i].in_reply_to_screen_name === null && all_tweets[i].retweeted_status === undefined) {

			all_posted_tweet_by_user.push(all_tweets[i]);
		}
	}
	index = Math.floor(Math.random() * (all_posted_tweet_by_user.length - 1));

	  var instances_dependencies = {
	    message : message,
	    args : args,
	    embed : 'https://twitter.com/'+ all_posted_tweet_by_user[index].user.screen_name +'/status/'+all_posted_tweet_by_user[index].id_str,
	  }
	  helper.sender(instances_dependencies);

});

}
