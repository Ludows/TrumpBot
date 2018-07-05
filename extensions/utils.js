var axiosAPI = require('../libs').axios;
var cheerioAPI = require('../libs').cheerio;


function Utils() {}
Utils.prototype = {
  isSubcommand: function(subcommand, array) {
    var val = false;
    if (array === undefined) {
      throw new Error('La liste de sous commandes n\'est pas définie');
    }

    array.forEach(function(el) {
      if (el === subcommand) {
        val = true;
      }
    })
    return val;
  },
  isCrypto: function(query, obj) {
    var val = false;
    if (obj === undefined) {
      throw new Error('La liste de cryptomonnaies n\'est pas définie');
    }

    var values = Object.values(obj);
    // console.log(values)

    values.forEach(function(el) {
      if (el.toLowerCase().trim() === query) {
        val = true;
      }
    })
    return val;
  },
  idChecker: function(args) {
    var regexp = /(\d+(d)*)/gi;
    var theid;
    args.forEach(function(val) {
      theid = val.match(regexp);
    })

    return theid;
  },
  unique: function(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
      if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
        a.push(arr[i]);
    return a;
  },
  uniquelinkedto: function(arr, arr2) {
    var a = [];
    var b = [];
    for (var i = 0, l = arr.length; i < l; i++)
      if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
        a.push(arr[i]);
    b.push(arr2[i]);
    return [a, b];
  },
  isId: function(args) {
    var regexp = /(@\d+(d)*)/gi;
    var theid;
    args.forEach(function(val) {
      theid = val.match(regexp);
    })

    console.log('theid is', theid)

    if (theid === null) {
      return false;
    } else if (theid === undefined) {
      return false;
    } else {
      return true;
    }

  },
  isjQueryMethod(args, array) {
    var val = false;
    if (!array) {
      throw new Error('Il me faut un array d\'objets');
    }
    console.log('array', array)

    array.forEach(function(v) {
      if (v.slug === args) {
        val = true;
      }
    })

    console.log('is jquery method return ?', val)

    return val;
  },
  formatforSender: function(args, message, discord, embed) {
    var obj = new Object();
    obj.message = message
    obj.discord = discord
    obj.args = args
    // obj.indexforCheck = array
    obj.embed = embed

    return obj;
  },
  slugify: function(str) {
    var slug = str.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    return slug;
  },
  extend: function(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    // console.log('return a', a);
    return a;
  },
  sender: function(obj) {

    // EVOL sender

    // idChecker => boolean sur les args
    // @everyone => sur les args
    // @me  => sur les args
    //


    let embed = new Object();
    embed.embed = obj.embed;
    // console.log('Utils.prototype.isId(obj.args)', Utils.prototype.isId(obj.args))
    // console.log('typeof embed var', typeof obj.embed)

    if (typeof obj.embed === 'string') {
      embed = obj.embed
      console.log('string length', obj.embed.length);
    }

    // console.log('embed format', embed)

    if (Utils.prototype.isId(obj.args) != false) {
      var idFormated = Utils.prototype.idChecker(obj.args);
      // console.log('idFormated', idFormated.toString())
      if (typeof obj.embed === 'array') {
        obj.embed.forEach(function(val) {
          obj.message.guild.members.get(idFormated.toString()).send(val);
        })
      } else {
        obj.message.guild.members.get(idFormated.toString()).send(embed);
        obj.message.reply('Cela a bien été envoyé !');
      }

    } else if (obj.args.includes('@everyone') === true) {
      let allMembers = obj.message.guild.members;

      allMembers.forEach(function(element, index) {
        // console.log('element', element);
        if (element.user.bot === false) {

          if (typeof obj.embed === 'array') {
            obj.embed.forEach(function(val) {
              element.user.send(val);
            })
          } else {
            element.user.send(embed);
          }
        }

      })
      obj.message.reply('Cela a bien été envoyé à tous les membres !');
    } else if (obj.args.includes('@me') === true) {
      obj.message.reply('Rien que pour toi...')

      if (typeof obj.embed === 'array') {
        obj.embed.forEach(function(val) {
          obj.message.author.send(val);
        })
      } else {
        obj.message.author.send(embed);
      }
    } else {
      // obj.message.reply('Rien que pour toi... C\'est envoyé !')

      if (typeof obj.embed === 'array') {
        obj.embed.forEach(function(val) {
          obj.message.channel.send(val);
        })
      } else {
        obj.message.channel.send(embed);
      }

      console.log('sended')
    }
  },
  getRichEmbed: function() {
    // @todo
  }
}


module.exports = Utils
