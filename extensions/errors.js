var discordAPI = require('../libs').Discord;
var Helper = require('./utils');


var helper = new Helper();

class Error {
  constructor(message) {
    this.message = message
  }
  display(error) {
    var title;
    var description;
    switch (error.response.status) {
      case 503:
        title = '503 - Service indisponible';
        description = 'Veuillez refaire votre recherche';
        break;
      case 403:
        title = '403 - Accès Interdit';
        description = 'Désolé c\'est la vie.';
        break;
      case 404:
        title = '404 - Contenu Introuvable';
        description = 'Allez manges un cookie. Ca ira mieux.';
        break;
      default:

    }

    const embed = new discordAPI.RichEmbed()
    .setTitle(title)
    .setDescription(description)

    this.message.channel.send({embed});
  }

}

module.exports = Error
