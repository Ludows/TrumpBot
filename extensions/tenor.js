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
  async trending() {

  }
  async random() {

  }
  async search() {

  }
  async getMediaById() {

  }
  render(result, message, args) {
    let embed;
    if(typeof result === 'string') {
      embed = result;
    }
    else {
      embed = new discordAPI.RichEmbed()
      console.log('result ?', embed)
      // .setTitle(result.title);
      // if(result.image_original_url) {
      //   embed.setImage(result.image_original_url)
      // }
      // else {
      //   embed.setImage(result.images.original.url)
      // }
      // embed.setURL(result.bitly_url);
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
