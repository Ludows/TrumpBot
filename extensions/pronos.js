var axiosAPI = require('../libs').axios;
var Helpers = require('./utils');
var discordAPI = require('../libs').Discord;
var moment = require('../libs').moment;
var config = require('../libs').config;


var labels_pays = require('../pays.json');

var Helper = new Helpers();

class Prono {
	constructor(obj) {
		// this.endpoint = 'https://www.chucknorrisfacts.fr/api/';
		if(arguments[0] && typeof arguments[0] === 'object') {
		 // https://www.chucknorrisfacts.fr/api/get?data=
		 this.endpoint = obj.endpoint;
     this.connnection = obj.connection;
     this.token = obj.token;
		 this.matches = obj.matches;
		}
		else {
			this.endpoint = 'https://api.monpetitgazon.com/mpp/KDE46ZBD/ranking';
      this.connnection = 'https://api.monpetitgazon.com/user/signIn';
			this.matches = 'https://api.monpetitgazon.com/mpp/forecast';
      this.token = '';
		}
	}
  async getClassement(obj) {
    let classement_datas = '';
    var config = {
      'headers': { 'authorization': obj.token },
      'fromhost': 'mpp',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };
    let await_data = await axiosAPI.get(this.endpoint, config).then(res => {
      // console.log(res);
      classement_datas = res.data
    })
    return classement_datas;
  }
	async getAllMatches(obj) {
    let match_datas = '';
    var config = {
      'headers': { 'authorization': obj.token },
      'fromhost': 'mpp',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };
    let await_data = await axiosAPI.get(this.matches, config).then(res => {
      // console.log(res);
      match_datas = res.data
    })
    return match_datas;
  }
  async getAuth() {
    let auth_datas = '';
    let data = {
      'email': config.MPP_email,
      'password': config.MPP_MDP,
      'language': 'fr-FR'
    }
    let config = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };
    // console.log('a')
    let wait =  await axiosAPI.post(this.connnection, data, config).then(res => {
      // console.log(res.data);
      // console.log('b')
      auth_datas = res.data;

    }).catch(error => {
      auth_datas = error.data;
    })
    // console.log('c')

    return auth_datas;
  }
  renderClassement(obj, message, args) {
    // console.log('obj debug', obj)
    const embed = new discordAPI.RichEmbed()
    .setTitle(obj.name)
    .setURL('https://www.monpetitprono.com/rank/league/KDE46ZBD')
    .setThumbnail(obj.logo);

    obj.topRanking.forEach(user => {
      embed.addField("N ° "+ user.leagueRanking  +" "+ user.firstname +" "+ user.lastname +" ",
    "Avec un score total de "+ user.totalScore +" points, avec "+ user.goodForecasts +" bons pronos ainsi que "+ user.exactForecasts  +" scores exacts")
    })

    var instances_dependencies = {
      message : message,
      discord : discordAPI,
      args : args,
      embed: embed
    }
    Helper.sender(instances_dependencies);
  }
	render(array, message, args) {
		 // console.log(array)
     let embed;
     if(args.includes('match-to-come')) {
			 embed = new discordAPI.RichEmbed()

	     embed.setTitle('Les Matchs à venir !')
	     .setURL('https://www.monpetitprono.com/forecast/matches-to-come')
	     .setThumbnail('https://pbs.twimg.com/profile_images/571796008028237824/TqWbZ-ln_400x400.jpeg');

			 array.forEach(match => {
				 let labels_match = this.labelsTranslator(match)
				 embed.addField("Match "+ labels_match.home +" - "+ labels_match.away +"",
			 "Côtes: "+ match.quotation.home +" - "+ match.quotation.N +" - "+ match.quotation.away +"");
			 })
		 }
		 else if(args.includes('match-to-past')) {
			 embed = '';
			 embed += 'Les Matchs passés !<br><br>';
			 // embed += 'Le site : https://www.monpetitprono.com/forecast/pasted-matches';
			 // embed.setTitle('Les Matchs passés !')
	     // .setURL('https://www.monpetitprono.com/forecast/pasted-matches')
	     // .setThumbnail('https://pbs.twimg.com/profile_images/571796008028237824/TqWbZ-ln_400x400.jpeg');
			 array.forEach(match => {
				 let labels_match = this.labelsTranslator(match)
				 embed += "Match "+ labels_match.home +" - "+ labels_match.away +"";
				 embed += "Côtes: "+ match.quotation.home +" - "+ match.quotation.N +" - "+ match.quotation.away +"";
				//  embed.addField("Match "+ labels_match.home +" - "+ labels_match.away +"",
			 // "Côtes: "+ match.quotation.home +" - "+ match.quotation.N +" - "+ match.quotation.away +"");
			 })
		 }
		 else {
			 embed = new discordAPI.RichEmbed();
			 moment.locale('fr');
			 let labels = {
				 home: array[0].home,
				 away: array[0].away
			 }
			 let next_match_labels = this.labelsTranslator(labels);
			 embed.setTitle('Tout sur le match suivant !')
	     .setURL('https://www.monpetitprono.com/forecast/matches-to-come')
	     .setThumbnail('https://pbs.twimg.com/profile_images/571796008028237824/TqWbZ-ln_400x400.jpeg')
			 .addField(""+ next_match_labels.home +"-"+ next_match_labels.away +" dans :", moment(array[0].startDate).fromNow(true));
		 }


		 var instances_dependencies = {
       message : message,
       discord : discordAPI,
       args : args,
       embed: embed
     }
     Helper.sender(instances_dependencies);
	}
	async filterMatchsToPast(obj) {
		let filter_past = [];
		if(obj.results) {

				for (let match in obj.results) {
					// console.log('loop', obj.results[match])
					// console.log('typeof', typeof obj.results[match])
					if(typeof obj.results[match] === 'object' && obj.results[match].past === true && obj.results[match].home != null) {
						filter_past.push(obj.results[match]);
					}
				}
		}
		return filter_past;
	}
	async filterMatchsToCome(obj) {
		let filter_come = [];
		// console.log('obj passed',obj )
		if(obj.results) {

				for (let match in obj.results) {
					// console.log('loop', obj.results[match])
					// console.log('typeof', typeof obj.results[match])
					if(typeof obj.results[match] === 'object' && obj.results[match].past === false && obj.results[match].home != null) {
						filter_come.push(obj.results[match]);
					}
				}
		}
		return filter_come;
	}
	labelsTranslator(obj) {
		// console.log('obj labels', obj)
		let the_label = new Object();
    labels_pays.pays.forEach(object => {
			if(obj.home === object.label) {
				the_label.home = object.name
			}
			if(obj.away === object.label) {
				the_label.away = object.name
			}
		})
		return the_label;
	}

}

// console.log('module ?', module.exports = Facts)

module.exports = Prono;
