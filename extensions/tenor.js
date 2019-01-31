var discordAPI = require('../libs').Discord;
var request = require('../libs').axios;
var path = require('../libs').path;
var decoder = require('html-encoder-decoder');
let config = require('../libs').config;
var Helpers = require('../libs').utils;

var helper = new Helpers();


// $ tenor suggestions => 30 suggestions ?
// $ tenor trending => 30 suggestions by id
// $ tenor trending => 30 suggestions by id
// $ tenor random term
class tenorApi {
  constructor(options) {
    this.opts = Object.assign({key: '', limit: 0}, options)
    this.protocol = 'https://'
    this.baseApi = 'api.tenor.com',
    this.versionApi = 'v1',
    this.endpoints = {
      suggestions: 'search_suggestions',
      trending: 'trending',
      random: 'random',
      search: 'search',
      gifs: 'gifs'
    }
  }
  getPath(name) {
    let endpt;
    for (var endpoint in this.endpoints) {
      console.log('endpoint', endpoint)
      if(name.includes(endpoint) === true) {
        endpt = this.endpoints[endpoint];
      }
    }
    let parameters = name.split('?');
    // console.log('endpt', endpt)
    return this.protocol + path.join(this.baseApi, this.versionApi, endpt+"?"+parameters[1])
  }
  normalizeSuggestions(array) {
    let formatedDatas = new Array();
    array.forEach(function(element) {
      var el = decoder.decode(element)
      if(element.indexOf(' ') > -1) {
        formatedDatas.push(el.replace(/ /g, '-'));
      }
      else {
        formatedDatas.push(el.replace(/-/g, ' '));
      }
    })

    return formatedDatas;
  }
  async suggestions(obj) {
    let rt = '';
    var url = this.getPath('suggestions?q='+obj.query+'&key='+this.opts.key+'&limit='+this.opts.limit);
    await request.get(url, { responseType: 'json' }).then((response) => {

     if(response.data.results.length > 0) {
       let all_sugg = this.normalizeSuggestions(response.data.results);
       rt += "Résultats pour "+obj.query+"\n\n";
       all_sugg.forEach((sug) => {
          rt += config.prefix + ' tnr ' + sug + '\n';
       })
     }


    })
    return rt;
  }
  async trend() {
    let rts = '';
    var url = this.getPath('trending?key='+this.opts.key+'&limit='+this.opts.limit);
    await request.get(url, { responseType: 'json' }).then((response) => {
      console.log('response', response.data)

     if(response.data.results.length > 0) {
       rts += "Résultats pour les gifs du moment ! \n\n";
       response.data.results.forEach((result) => {
        rts += config.prefix + ' tnr ' + result.id + (result.title.length > 0 ? " => "+ result.title+ '\n' : "\n");
       })
     }


    })
    return rts;
  }
  async random(obj) {
    let rt = '';
    var url = this.getPath('random?q='+obj.query+'&key='+this.opts.key+'&limit=1');
    await request.get(url, { responseType: 'json' }).then((response) => {
      console.log('response', response.data)
      rt = response.data.results[0];


    })
    return rt;
  }
  async search(obj) {
    let rt = '';
    var url = this.getPath('search?q='+obj.query+'&key='+this.opts.key+'&limit='+this.opts.limit);
    await request.get(url, { responseType: 'json' }).then((response) => {
      console.log('response', response.data)

      if(response.data.results.length > 0) {
        rt += "Résultats pour les gifs du moment ! \n\n";
        response.data.results.forEach((result) => {
          rt += config.prefix + ' tnr ' + result.id + (result.title.length > 0 ? " => "+ result.title+ '\n' : "\n");
        })
      }
      


    })
    return rt;
  }
  async getMediaById(idstr) {
    let rt = '';
    var url = this.getPath('gifs?ids='+idstr+'&key='+this.opts.key+'&limit=1');
    await request.get(url, { responseType: 'json' }).then((response) => {
      console.log('response', response.data)
      rt = response.data.results[0];


    })
    return rt;
  }
  render(result, message, args) {
    let embed;
    if(typeof result === 'string') {
      embed = result;
    }
    else {
      embed = new discordAPI.RichEmbed()
      console.log('result ?', result.media.length)
      if(result.title) {
        embed.setTitle(result.title);
      }
      if(result.media[0].tinygif) {
        embed.setImage(result.media[0].tinygif.url)
      }
      embed.setURL(result.itemurl);
    }


    var instances_dependencies = {
      message : message,
      discord : discordAPI,
      args : args,
      embed: embed
    }
    helper.sender(instances_dependencies);
  }

}
module.exports = tenorApi;
