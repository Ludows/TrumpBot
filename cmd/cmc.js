const coinNode = require('../libs').CoinMarketCap;
var fsAPI = require('../libs').fs;
var coinnames = require('../libs').coinnames;

var Helpers = require('../libs').utils;

var cryptos = require('../cryptos.json');

var helper = new Helpers();

var options = {
  events: true, // Enable event system
  refresh: 60, // Refresh time in seconds (Default: 60)
  convert: "USD" // Convert price to different currencies. (Default USD)
}

var coinmarketcap = new coinNode(options);
const discordAPI = require('../libs').Discord;

// fsAPI.readFileSync( module.exports.help.help , 'utf-8');

module.exports.run = function(args, message) {


    // console.log('typeof', typeof module.exports.help.help)
   if(typeof module.exports.help.subcommands === 'object') {

     var a = module.exports.help.subcommands;

     // console.log('subcommand ?', helper.isSubcommand(args[0], a))
     // console.log('is crypto ?',  helper.isCrypto(args[0], cryptos))
     if(helper.isSubcommand(args[0], a) === false && helper.isCrypto(args[0], cryptos) === false) {
        message.reply('Bravo ! t\'a toujours rien compris ! Allez la doc !');
        message.channel.send(cmc_bm);
        return;
     }


   }

   switch (args[0]) {
     case 'getlist':
       getListCoin(args, message)
       break;
     case 'onpercentchangeinoneday':
         getCoinWarningInOneDay(args[2], args[1])
         break;
     case 'onpercentchangeinsevenday':
         getCoinWarningInSevenDay(args[2], args[1])
         break;
     case 'onpercentinonehour':
         // getCoinWarningInSevenDay(args[2], args[1], message, args);
         break;
     case 'ongreaterthan':
         onGreaterThan(args[1], args[2], message);
         break;
     case 'onlesserthan':
         onLesserThan(args[1], args[2], message);
         break;
     case 'help':
         message.reply('les commandes coinmarketcap rien que pour toi mon grand !');
         message.author.send(cmc_bm);
         break;
     default:
         getCoinPrice(args, message)
         break;

   }
}

module.exports.help = {
  name: ['cmc', 'coinmarket', 'coinmarketcap'],
  subcommands: ['getlist', 'onpercentchangeinoneday', 'onpercentchangeinsevenday', 'onpercentinonehour', 'ongreaterthan', 'onlesserthan', 'help', '@everyone', '@me'],
  help: './help/cmc.txt'
}

var cmc_bm = fsAPI.readFileSync( module.exports.help.help , 'utf-8');


// console.log('coinmarketcap is here ?', coinmarketcap);
// console.log('coinNode is here ?', coinNode);
// this function send a notification message to the message author for 24h
// @todo not working today
function getCoinWarningInOneDay(percent, cryptomoney, message, args) {
  if(cryptomoney.length > 3) {
    message.reply('Veuillez remplir le symbole de la cryptomonnaie recherchée.');
  }
  let mot = 'gagné';
  if(percent.indexOf('-') != -1) {
    mot = 'perdu';
  }


  coinmarketcap.onPercentChange24h(cryptomoney, parseInt(percent), (coin, event) => {
    console.log('coin', coin);
    console.log('event', event);
    message.author.sendMessage(""+ message.author +" , faites attention la cryptomonnaie "+ coin.name +" a "+ mot + percent +" de sa valeur ces dernières 24h");
    if(percent.indexOf('-') != -1) {
      event.percent = event.percent - parseInt(percent);
    }
    else {
      event.percent = event.percent + parseInt(percent);
    }// Decrease the percentile change that the event needs to be fired.
  });
}


// this function send a notification message to the message author for 7d
// @todo not working today
function getCoinWarningInSevenDay(percent, cryptomoney, message, args) {
  if(cryptomoney.length > 3) {
    message.reply('Veuillez remplir le symbole de la cryptomonnaie recherchée.');
  }
  let mot = 'gagné';
  if(percent.indexOf('-') != -1) {
    mot = 'perdu';
  }

  coinmarketcap.onPercentChange7d(cryptomoney, parseInt(percent), (coin, event) => {
    console.log('coin', coin);
    console.log('event', event);
    message.author.sendMessage(""+ message.author +" , faites attention la cryptomonnaie "+ coin.name +" a "+ mot + percent +" de sa valeur ces dernières 24h");

    if(percent.indexOf('-') != -1) {
      event.percent = event.percent - parseInt(percent);
    }
    else {
      event.percent = event.percent + parseInt(percent);
    }
  });
}

// this function return in channel the top of cryptomonney today
// You can pass in args a number
// set a default number if not renseigned

function getListCoin(args, message) {
   if (!args[1]) {
     message.reply('Tu dois rechercher quelquechose comme ceci. ex : !med cmc getlist [number]');
   }

   coinmarketcap.multi(coins => {
        console.log(coins.getTop(parseInt(args[1]))); // Prints information about top 10 cryptocurrencies
        var arrayofCoins = coins.getTop(parseInt(args[1]));



        arrayofCoins.forEach(function(element, index){
            // statement
            const embed = new discordAPI.RichEmbed()
            embed.setTitle(element.name)
            .setURL('https://coinmarketcap.com/currencies/'+ element.id +'/')
            .addField('Prix USD: ', element.price_usd)
            .addField('Prix BTC: ', element.price_btc)

            var instances_dependencies = {
              message : message,
          		discord : discordAPI,
          		args : args,
              embed: embed
            }
            helper.sender(instances_dependencies);

            // message.channel.send({embed});
        });

    });
}

// this function return in channel all infos about a crypto

function getCoinPrice(args, message) {


   if (!args) {
     message.reply('Tu dois rechercher quelquechose comme ceci. ex : !med cmc [taCrypto]');
   }
   coinmarketcap.get(args[0], function(coin) {
        // console.log(coin); // Prints the price in USD of BTC at the moment.
        const embed = new discordAPI.RichEmbed()
        .setTitle(coin.name)
        .setURL('https://coinmarketcap.com/currencies/'+ coin.id +'/')
        .addField('Prix USD: ', coin.price_usd)
        .addField('Prix BTC: ', coin.price_btc)
        .addField('Rang: ', coin.rank)
        .addField('24h Volume USD: ', coin['24h_volume_usd'])
        .addField('Market Cap USD: ', coin['market_cap_usd'])
        .addField('Pourcentage change en 24h: ', coin['percent_change_24h'])
        .addField('Pourcentage change en 7d: ', coin['percent_change_7d'])
        .addField('Pourcentage change 1h: ', coin['percent_change_1h'])
        .addField('total_supply: ', coin['total_supply'])

        var instances_dependencies = {
          message : message,
          discord : discordAPI,
          args : args,
          embed: embed
        }
        helper.sender(instances_dependencies);
   });
}

function onGreaterThan(number,crypto, message) {
   if (!number) {
     message.reply('Tu dois rechercher quelquechose comme ceci. ex : !med cmc ongreaterthan [nombre]');
     return;
   }
   coinmarketcap.onGreater(crypto, parseInt(number), (coin, event) => {
    message.author.send(''+ crypto +' price is greater than '+ number +' of your defined currency');
   	event.price = event.price + 100; // Increase the price that the event needs to be fired.
    coinmarketcap.deleteEvent(event); // Deletes the event

   });
}

function onLesserThan(number,crypto, message) {
   if (!number) {
     message.reply('Tu dois rechercher quelquechose comme ceci. ex : !med cmc onlesserthan [nombre]');
     return;
   }
   coinmarketcap.onLesser(crypto, parseInt(number), (coin, event) => {
    message.author.send(''+ crypto +' price is lesser than '+ number +' of your defined currency');
   	event.price = event.price - 100; // Increase the price that the event needs to be fired.
    coinmarketcap.deleteEvent(event); // Deletes the event

   });
}


// isCrypto('Bitcoin');
