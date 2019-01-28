var giphyAPI = require('../libs').giphy;
var config = require('../libs').config;
var Helpers = require('../libs').utils;
var discordAPI = require('../libs').Discord;


var helper = new Helpers();


class GiphyAPI {
  constructor(opts) {
    this.options = Object.assign({limit: 30, apiCommand: 'giphy'}, opts)
  }
  async search(obj) {
    var txt_result = '';
    await giphyAPI.search({q:obj.query, limit: this.options.limit}).then((res) => {

      console.log('res', res);
      if(res.data.length > 0) {
        var datas = res.data;
        txt_result += 'Résultats pour '+ obj.query + '\n\n';
        datas.forEach((data) => {
          txt_result += config.prefix+ " "+ this.options.apiCommand + " " + data.id + '\n';
        })
      }
    });
    return txt_result;
  }
  async trend() {
    var txt_result_trd = '';
    await giphyAPI.trending({'limit': this.options.limit}).then((res) => {
      console.log(res);
      var datas = res.data;
      txt_result_trd += 'Les 30 derniers résultats pour la crême de la crême du gif animé !\n\n';
      datas.forEach((data) => {
        txt_result_trd += config.prefix+ " "+ this.options.apiCommand + " " + data.id + '\n';
      })
    });
    return txt_result_trd;
  }
  async random(obj) {
    let object;
    let result;
    if(!obj) {
      throw new error('Object query must be defined')
    }
    if(obj && obj.query === 'auto') {
      object = {limit: 1};
    }
    else {
      object = {tag:obj.query, limit: 1};
    }
    await giphyAPI.random(object).then((randomRes) => {
      result = randomRes.data;
    });
    return result;
  }
  async stickers(obj) {
    let ret;
    await giphyAPI.search({api: 'stickers', q: obj.query, 'limit': 1}).then(function(res) {
      ret = res.data[0];
      console.log(res.data[0]);
    });
    return ret;
  }
  render(result, message, args) {
    let embed;
    if(typeof result === 'string') {
      embed = result;
    }
    else {
      embed = new discordAPI.RichEmbed()
      .setTitle(result.title);
      if(result.image_original_url) {
        embed.setImage(result.image_original_url)
      }
      else {
        embed.setImage(result.images.original.url)
      }
      embed.setURL(result.bitly_url);
    }


    var instances_dependencies = {
      message : message,
      discord : discordAPI,
      args : args,
      embed: embed
    }
    helper.sender(instances_dependencies);
  }
  async getMediaById(id) {
    let resp;
    await giphyAPI.id(id).then(function (res) {
      console.log('res', res.data[0])
      resp = res.data[0];
    });
    return resp;
  }
}


module.exports = GiphyAPI;
