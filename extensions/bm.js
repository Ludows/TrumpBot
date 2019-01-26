var discordAPI = require('../libs').Discord;
var bot = require('../libs').bot;
var fsAPI = require('../libs').fs;
var config = require('../libs').config;
var Helpers = require('../libs').utils;
var decoder = require('html-encoder-decoder');
var _ = require('../libs').lodash;

var Sequelize = require('../libs').sequelize;
var dbDriver = require('../models/index').sequelize;

// console.log('dbDriver', dbDriver)

const Media = require( '../models/media')(dbDriver, Sequelize.DataTypes);

var helper = new Helpers();

var wpAPI = require('../libs').WP;

class Bonjourmadame {
  constructor() {
    this.wp = new wpAPI({
        endpoint: 'http://www.bonjourmadame.fr/wp-json'
    });
  }
  getAll( request ) {
    var self = this;
    return request.then(function( response ) {
      if ( ! response._paging || ! response._paging.next ) {
        return response;
      }
      // Request the next page and return both responses as one collection
      return Promise.all([
        response,
        self.getAll( response._paging.next )
      ]).then(function( responses ) {
        return _.flatten( responses );
      });
    });
  }
  populate() {
     this.getAll(this.wp.posts()).then(function(allPosts) {
      // console.log('allPosts', allPosts.length)
      allPosts.forEach((post) => {
        // console.log('post', post)
        var postdate = new Date(post.date);
        var isWeekend = (postdate.getDay() === 6) || (postdate.getDay() === 0);
        if(!isWeekend) {

          var re = /src=['|"][^'|"]*?['|"]/gi;
          var src = post.content.rendered.match(re);
          var format_src = src[0].split('"');

          Media.findOne({ source: format_src[1], title: decoder.decode(post.title.rendered) , link: post.link }).then((entry) => {
              // single random encounter
              if(!entry) {
                Media.create({ source: format_src[1], title: decoder.decode(post.title.rendered) , link: post.link }).then(task => {
                  // you can now access the newly created task via the variable task
                  console.log('done');
                })
              }

          });


        }
      })
    })
  }
  async getMedia(obj, func) {
    let ret = undefined;
    if(!obj) {
      throw new Error('Vous devez renseigner un objet avec la propriété random (true or false)');
    }
    else {
      // console.log('obj', obj);
      if(obj.random === true) {
        await Media.findOne({ order: [
        [Sequelize.literal('RAND()')]
      ] }).then((entries) => {
            // single random encounter

            ret = entries;
        });
      }
      else if (obj.random === false) {
        await Media.findAll({
          limit: 1,
          order: [ [ 'createdAt', 'DESC' ]]
        }).then(function(entries){
          //only difference is that you get users list limited to 1
          //entries[0]
          ret = entries[0];
        });

      }
      else {
        throw new console.error('La propriété random est nécessaire.');
      }
    }
    return ret;
  }
  giveMedia(media, mess, arg) {
    let embed = new discordAPI.RichEmbed()
    .setTitle(media.dataValues.title)
    .setImage(media.dataValues.source)
    .setURL(media.dataValues.link);

    var instances_dependencies = {
      message : mess,
      discord : discordAPI,
      args : arg,
      embed: embed
    }
    helper.sender(instances_dependencies);
  }
}

module.exports = Bonjourmadame;
