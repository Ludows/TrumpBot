var discordAPI = require('../libs').Discord;
var bot = require('../libs').bot;
var config = require('../libs').config;
var Helpers = require('../libs').utils;
var decoder = require('html-encoder-decoder');
var cheerioAPI = require('../libs').cheerio;
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
  getAll( request , label) {
    var self = this;
    return request.then(( response ) => {
      if ( ! response._paging || ! response._paging.next ) {
        return response;
      }
      // console.log('response', response);
      // console.log('response length', response.length)
      // On rentre dans le cas de la population de la table Tag
      response.forEach((res) => {
        if(label === 'tag') {
            Tag.findOne({ where: {realId: res.id, slug: res.slug , name: res.name}  }).then((tagEntry) => {
                // single random encounter
                if(!tagEntry) {
                  Tag.create({ realId: res.id, slug: res.slug , name: res.name }).then(taskdetata => {
                    // you can now access the newly created task via the variable task
                    console.log('done');
                  })
                }

            });
        }
        else if(label === 'post') {
          // On rentre dans le cas de la population de la table Media
          // console.log('res', res);

          var format_src;
          const $ = cheerioAPI.load(res.content.rendered);

          if($('video').length > 0) {
            // le cas d'un gif a recup
            //
            // on voit si on peut recup un gif
            if($('video').find('object').length > 0) {
              format_src = $('video').find('object').attr('data');
            }
            else {
              format_src = $('video').find('source').first().attr('src');
            }
          }
          else if($('video').length === 0) {

            format_src = $('img').attr('src');
          }
          else {
            format_src = "";
          }

          Media.findOne({ where: { source: format_src, title: decoder.decode(res.title.rendered) , link: res.link } }).then( async function (mediaentry) {
              // single random encounter
              var orm_obj;
              if(res.tags.length > 0) {
                let labels = new Array();
                res.tags.forEach((tag) => {
                  console.log('tag', tag)
                  Tag.findOne({ where: {realId: parseInt(tag) }  }).then((tagentry) => {

                    console.log('entry tag ?', tagentry);
                    labels.push(tagentry.dataValues.slug);
                    orm_obj = { source: format_src, title: decoder.decode(res.title.rendered) , tags: labels.join().toString(), link: res.link }
                    if(!mediaentry) {
                      Media.create(orm_obj).then(taskMedia => {
                        // you can now access the newly created task via the variable task
                        console.log('done');
                      })
                    }

                  })
                })
              }
              else {
                orm_obj = { source: format_src, title: decoder.decode(res.title.rendered) , tags: '', link: res.link }
                if(!mediaentry) {
                  Media.create(orm_obj).then(taskMedia => {
                    // you can now access the newly created task via the variable task
                    console.log('done');
                  })
                }
              }
          });

        }
      })

      // Request the next page and return both responses as one collection
      return Promise.all([
        response,
        self.getAll( response._paging.next , label)
      ]).then(async function( responses ) {
        return _.flatten( responses );
      });
    });
  }
  populateTags() {
    var self = this;
    this.getAll(self.wp.tags(), 'tag').then(taglist => {
      console.log('taglist', taglist)
    })

  }
  populatePosts() {
    var self = this;
    this.getAll(self.wp.posts(), 'post').then(post => {
      console.log('post', post)
    })

  }
  async getMedia(obj, func) {
    let ret = undefined;
    const Op = Sequelize.Op;
    if(!obj) {
      throw new Error('Vous devez renseigner un objet avec la propriété topic (true or false)');
    }
    else {
      // console.log('obj', obj);
      if(obj.topic === '') {
        await Media.findOne({ order: [
        [Sequelize.literal('RAND()')]
        ] }).then((entries) => {
            // single random encounter

            ret = entries;
        });
      }
      else {
        await Media.findOne({ where: {tags: {[Op.like]: obj.topic}  } , order: [
        [Sequelize.literal('RAND()')]
      ] }).then((entries) => {
            // single random encounter

            ret = entries;
        });
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
