const discordAPI = require('../libs').Discord;
const Helpers = require('../libs').utils;
const decoder = require('../libs').HTMLDecoderEncoder;

const wpAPI = require('../libs').WP;


// !med jdc @identifiant
// !med jdc rage @identifiant
// !med jdc win @identifiant
// !med jdc fail @identifiant
// !med jdc wtf @identifiant
// !med jdc stagiaire @identifiant
// !med jdc client @identifiant
// !med jdc commercial @identifiant
// !med jdc chef @identifiant


class Joie_du_code {
  constructor() {
    this.wp = new wpAPI({
        endpoint: 'https://lesjoiesducode.fr/wp-json/'
    });
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

    // renderer
    switch (topic.toLowerCase()) {
      case 'rage':
      case 'fail':
      case 'win':
      case 'stagiaire':
      case 'commercial':
      case 'best':
      case 'wtf':
      case 'client':
      case 'chef':
          this.wp.posts().param('tags', id).perPage( 100 ).then(data => {
            console.log('post registered' , data);
          })
          .catch( error => {
            console.log('logs error', error)
          })
          break;
      default:

    }
    // console.log('args', topic)
    // console.log('this constructor', this)

    // this.wp.posts().perPage( 1 ).then(data => {
    //   console.log('post registered' , data);
    // })
    // .catch( error => {
    //   console.log('logs error', error)
    // })

    // this.wp.tags().id(13).then(data => {
    //   console.log('tags registered' , data);
    // })
    // .catch( error => {
    //   console.log('logs error', error)
    // })

  }
}

module.exports = Joie_du_code
