var discordAPI = require('../libs').Discord;
var bot = require('../libs').bot;
var fsAPI = require('../libs').fs;
var config = require('../libs').config;
var Helpers = require('../libs').utils;
var decoder = require('html-encoder-decoder');
var _ = require('../libs').lodash;

var Sequelize = require('../libs').sequelize;
var dbDriver = require('../models/index').jdc;


const Media = require( '../models/jdc/media')(dbDriver, Sequelize.DataTypes);
const Tag = require( '../models/jdc/tag')(dbDriver, Sequelize.DataTypes);

var helper = new Helpers();

var wpAPI = require('../libs').WP;

class JoieDuCode {
  constructor() {
    this.wp = new wpAPI({
        endpoint: 'https://lesjoiesducode.fr/wp-json'
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
  getTags() {
    this.wp.tags().then(tag => {
      console.log('tag', tag);
    })
  }
  getTopic(topic) {
    let id;

    console.log('the topic', topic)

    // définition de l'id
    switch (topic.toLowerCase()) {
      case 'rage':
           id = 3;
        break;
      case 'fail':
           id = 4;
          break;
      case 'win':
           id = 5;
          break;
      case 'stagiaire':
           id = 6;
          break;
      case 'commercial':
          id = 7;
          break;
      case 'best':
          id = 11;
          break;
      case 'wtf':
          id = 8;
          break;
      case 'client':
          id = 9;
          break;
      case 'chef':
          id = 10;
          break;
      default:

    }


  }
  populate() {
    var self = this;
     this.getAll(this.wp.posts()).then(function(allPosts) {
      console.log('allPosts', allPosts.length)
      allPosts.forEach((post) => {
        // console.log('post', post)
         self.media.id(post.featured_media).then(isMedia => {
           Media.findOne({ source: format_src[1], title: decoder.decode(post.title.rendered) , link: post.link }).then((entry) => {
               // single random encounter
               if(!entry) {
                 Media.create({ source: format_src[1], title: decoder.decode(post.title.rendered) , link: post.link }).then(task => {
                   // you can now access the newly created task via the variable task
                   console.log('done');
                 })
               }

           });
         })




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

module.exports = JoieDuCode;
