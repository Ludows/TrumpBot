var discordAPI = require('../libs').Discord;
var bot = require('../libs').bot;
var fsAPI = require('../libs').fs;
var config = require('../libs').config;
var Helpers = require('../libs').utils;
var decoder = require('../libs').HTMLDecoderEncoder;


var helper = new Helpers();

var wpAPI = require('../libs').WP;

class Bonjourmadame {
  constructor() {
    this.wp = new wpAPI({
        endpoint: 'http://www.bonjourmadame.fr/wp-json'
    });
  }
  fetch(obj, func) {
    if(!obj) {
      throw new Error('Vous devez renseigner un objet avec la propriété random (true or false)');
    }
    else {
      if()
    }
  }
}
