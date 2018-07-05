var axiosAPI = require('../libs').axios;
var Helpers = require('./utils');
var discordAPI = require('../libs').Discord;

var Helper = new Helpers();

class TrumpFact {
	constructor(obj) {
		// this.endpoint = 'https://www.chucknorrisfacts.fr/api/';
		if(arguments[0] && typeof arguments[0] === 'object') {
		 // https://www.chucknorrisfacts.fr/api/get?data=
		 this.endpoint = obj.endpoint;
     this.toSearch = obj.toSearch;
		}
		else {
			this.endpoint = 'https://api.tronalddump.io';
      this.toSearch = '/random/quote';
		}
	}
  async getQuote() {
    let quote_datas = '';
		// console.log()
		this.toSearch = '/random/quote';
    let await_data = await axiosAPI.get(this.endpoint + this.toSearch).then(res => {
      // console.log(res);
      quote_datas = res.data
    })
    return quote_datas;
  }
  async getMeme() {
    let meme_datas = '';
    this.toSearch = '/random/meme'
    let await_data = await axiosAPI.get(this.endpoint + this.toSearch, {
			'accept': 'image/jpeg',
		}).then(res => {
      // console.log(res);
      meme_datas = new Buffer(res.data, 'binary').toString('base64')
			// console.log(meme_datas);

    })
    return meme_datas;
  }
	render(obj, message, args) {
		const embed = new discordAPI.RichEmbed()
		console.log('args');
		if(args.includes('meme')) {
			embed.setImage(obj)
		}
		else {
			embed.addField("Message "+ obj.tags +" ", obj.value);
		}


    var instances_dependencies = {
      message : message,
      discord : discordAPI,
      args : args,
      embed: embed
    }
    Helper.sender(instances_dependencies);
	}


}

// console.log('module ?', module.exports = Facts)

module.exports = TrumpFact;
