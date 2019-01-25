// var config = require('../require-lib').config
var discordAPI = require('../libs').Discord;
var tumblrAPI = require('../libs').tumblr;
var config = require('../libs').config;

var Helpers = require('../libs').utils;
var fsAPI = require('../libs').fs;

var helper = new Helpers();

var oauth = {
  consumer_key: config.tumblr_CK,
  consumer_secret: config.tumblr_CS,
  token: config.tumblr_token,
  token_secret: config.tumblr_token_secret
};

var blog = new tumblrAPI.Blog('lesjoiesducode.fr', oauth);

// console.log('blog', blog)


// !med jdc last @identifiant
// !med jdc rand @identifiant
// !med jdc lastrage @identifiant
// !med jdc rage @identifiant
// !med jdc lastwin @identifiant
// !med jdc win @identifiant
// !med jdc lastfail @identifiant
// !med jdc lastwtf @identifiant
// !med jdc wtf @identifiant
// !med jdc laststagiaire @identifiant
// !med jdc stagiaire @identifiant
// !med jdc lastclient @identifiant
// !med jdc client @identifiant
// !med jdc commercial @identifiant
// !med jdc lastcommercial @identifiant
// !med jdc lastchef @identifiant
// !med jdc chef @identifiant

module.exports.run = function(args, message) {
  getjdc(args, message);
}

module.exports.help = {
  name: ['jdc', 'joieducode'],
  subcommands: ['last',
                'rand',
                'lastrage',
                'rage',
                'lastwin',
                'win',
                'lastfail',
                'fail',
                'lastwtf',
                'wtf',
                'laststagiaire',
                'stagiaire',
                'lastclient',
                'client',
                'lastcommercial',
                'commercial',
                'lastchef',
                'chef',
                'help',
                'search',
                '@me',
                '@everyone'],
  help: './help/jdc.txt'
}

var cmd_jdc = fsAPI.readFileSync( module.exports.help.help , 'utf-8');


function getjdc(args, message) {
	var content;
	switch (args[0]) {
   	// case 'last':
   	// 	// statements_1
   	// 	blog.text({limit: 1}, function(error, response) {
		// 	console.log(response)
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
    //
   	// 	break;
   	// case 'rand':
   	// 	// statements_1
   	// 	blog.text({limit: 50}, function(error, response) {
		// 	// console.log(response.posts)
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'lastrage':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag: 'rage'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'rage':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag: 'rage'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'lastwin':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag: 'win'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'win':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag: 'win'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'lastfail':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag: 'fail'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'fail':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag: 'fail'}, function(error, response) {
		// 	// console.log(response.posts)
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'lastwtf':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag: 'wtf'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'wtf':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag: 'wtf'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'laststagiaire':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag: 'stagiaire'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'stagiaire':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag: 'stagiaire'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'lastclient':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag: 'client'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'client':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag: 'client'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'lastcommercial':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag: 'commercial'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'commercial':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag : 'commercial'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'lastchef':
   	// 	// statements_1
   	// 	blog.text({limit: 1, tag : 'chef'}, function(error, response) {
		// 	// console.log(response)
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
   	// case 'chef':
   	// 	// statements_1
   	// 	blog.text({limit: 50, tag : 'chef'}, function(error, response) {
		// 	content = response.posts
		// 	getRichEmbedforjdc(args, message, content);
   	// 	})
   	// 	break;
    // case 'help':
    //   message.reply('les commandes jdc rien que pour toi :)');
    //   message.author.send(cmd_jdc);
    // break;
   	default:
   	    //ici prévoir un get list des subcommands de jdc @todo
   		// statements_def
   		// blog.text({limit: 50, tag : args[1]}, function(error, response) {
			// // console.log(response.posts)
			// content = response.posts
			// getRichEmbedforjdc(args, message, content);
   		// })
   		break;
   }







}


function getRichEmbedforjdc(args, message, array) {
	let index = 0;

  console.log('array', array)


	if (array != undefined && array.length > 1) {
        index = Math.floor(Math.random() * (array.length - 1));
    }

    var re = /<img[^>]+src="(https*:\/\/[^">]+)"/g;
    console.log('re', re)
    var results = re.exec(array[index].body);

    const embed = new discordAPI.RichEmbed()
    .setTitle(array[index].title)
    .setImage(results[1])
    .setURL(array[index].short_url)

    var instances_dependencies = {
      message : message,
      discord : discordAPI,
      args : args,
      embed: embed
    }
    helper.sender(instances_dependencies);


}
