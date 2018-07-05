var fs = require('./libs').fs;
var bot = require('./libs').bot;
var DiscordAPI = require('./libs').Discord;
bot.commands = new DiscordAPI.Collection();

fs.readdir('./cmd/', function(err, files) {
	if(err) {console.log('erreur')}
		// console.log('files', files)
	let allFiles = new Array();
	files.forEach(function(file) {
		var content = file.split('.').shift();
		allFiles.push(content)
	})

	// console.log('allFiles', allFiles)
	if(allFiles.length <= 0) {
		console.log('Pas de commandes trouvées.');
		return;
	}

	allFiles.forEach(function(collection, i) {
		let prop = require('./cmd/'+ collection +'');
		console.log(collection + ' est chargé');
		// console.log('typeof', typeof prop.help.name)
		if (typeof prop.help.name === 'object') {
			prop.help.name.forEach(function(n) {
				bot.commands.set(n, prop);
			})
		}
		else {
			bot.commands.set(prop.help.name, prop);
		}

	})
	// console.log('commands registered', bot.commands)
})
