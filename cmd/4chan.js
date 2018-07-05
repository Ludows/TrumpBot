var chanAPI = require('../libs').chan;

var Helpers = require('../libs').utils;


var chan = new chanAPI({
	endpoint: 'https://a.4cdn.org/'
})

var helper = new Helpers();

module.exports.run = function(args, message) {
	switch (args[0]) {
		case 'boards':
			// statements_1
			chan.get_boards().then(function(x) {
				console.log(x)
			})
			break;
		default:
			chan.get_image(args[0]).then(function(x) {
				console.log(x)

				var instances_dependencies = {
	       	message : message,
	    		args : args,
	       	embed: x
	      }
	      helper.sender(instances_dependencies);
			})
			// statements_def
			break;
	}
}

module.exports.help = {
  name: '4chan',
  subcommands: ['boards'],
  help: './help/4chan.txt'
}
