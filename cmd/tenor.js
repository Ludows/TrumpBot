var request = require('../libs').axios
var config = require('../libs').config
var discordAPI = require('../libs').Discord;


//!med tenorsearch
//!med tenortrend
//!med tenorcat
//!med tenorrand

module.exports.run = function(args, message) {
   let lmt = 50;
   let index;
   var url;
   console.log('tenor args', args);

   switch (args[0]) {
     case 'help':
    		// statements_1
    		break;
   	case 'search':
   		// statements_1
   		url = "https://api.tenor.com/v1/search_suggestions?q=" + args[1] + "&key=" +
            config.tenor + "&limit=" + lmt+ "";
   		break;
   	case 'trending':
   		// statements_1
   		url = "https://api.tenor.com/v1/trending?&key=" +
            config.tenor + "";
   		break;
   	case 'random':
   		// statements_1
   		url = "https://api.tenor.com/v1/random?q=" + args[1] + "&key=" +
            config.tenor + "&limit=" + lmt+ "";
   		break;
   	default:
   	    url = "https://api.tenor.com/v1/search?q="+ args[0] +"&key="+ config.tenor +"&limit="+ lmt +"";
   		// statements_def
   		break;
   }

   console.log('url ? ', url)





   request.get(url, { responseType: 'json' }).then(function (response) {

    // console.log('response ?', response.data)

    var allDatas;



    switch (args[0]) {
   	case 'search':
   		// statements_1
   		allDatas = response.data.results;
   		  getTenorRichEmbed(args, message, allDatas);
   		break;
   	case 'categories':
   		// statements_1
   		allDatas = response.data.tags;
   		index = Math.floor(Math.random() * (allDatas.length - 1));
   		  getTenorRichEmbed(args, message, allDatas[index]);
   		break;
   	default:
   		allDatas = response.data.results;
   		index = Math.floor(Math.random() * (allDatas.length - 1));
   	       getTenorRichEmbed(args, message, allDatas[index]);

   		// statements_def
   		break;
   }

  })
}

module.exports.help = {
  name: 'tenor',
  subcommands: [],
  help : './help/tenor.txt'
}



function getTenorRichEmbed(args, message, allDatas) {

 const embed = new discordAPI.RichEmbed()

 switch (args[0]) {
 	case 'search':
   		// statements_1
   		var data = formatSearchResults(allDatas);
   		var allLines = 'Search Result :\n\n';
   		data.forEach(function(element) {

   			allLines += config.prefix + ' tenor ' + element + '\n';

   		})

   		embed.setDescription(allLines);


   		break;
   	case 'categories':
   		// statements_1
   		if(allDatas.name) {
   			embed.setTitle(allDatas.name)
   			// .setURL(allDatas.path)
   		}
    	embed.setImage(allDatas.image)

   		break;
   	case 'trend':
   	case 'random':
   		// statements_1
   		if(allDatas.title) {
   			embed.setTitle(allDatas.title)
   			.setURL(allDatas.itemurl)
   		}
    	embed.setImage(allDatas.media[0].gif.url)
   		break;
   	default:
   		embed.setImage(allDatas.media[0].gif.url)
   		// statements_def
   		break;
 }



    if(args[1] != undefined && args[1].startsWith('@', 1)) {
      var formatId = args[1].substring(2, args[1].length - 1);
			  message.guild.members.get(formatId).send({embed});
        message.reply('Cela a bien été envoyé !');
    }
    else if(args[2] != undefined && args[2].startsWith("@", 1)) {
			var formatId = args[2].substring(2, args[2].length - 1);
			  message.guild.members.get(formatId).send({embed});
        message.reply('Cela a bien été envoyé !');

		} else if(args[2] != undefined && args[2] === '@everyone') {
			let allMembers = message.guild.members;

			allMembers.forEach(function(element, index) {
				// console.log('element', element);
				if(element.user.bot === false) {
					element.user.send({embed});
				}

			})
      message.reply('Cela a bien été envoyé à tous les membres !');
		}
		else {
			message.channel.send({embed});
		}


}

function formatSearchResults(array) {
	let formatedDatas = new Array();
	array.forEach(function(element) {
		if(element.indexOf(' ') > -1) {
			formatedDatas.push(element.replace(/ /g, '-'));
		}
		else {
			formatedDatas.push(element.replace(/-/g, ' '));
		}
	})
	console.log('formatSearchResults', formatedDatas)

	return formatedDatas;

}
