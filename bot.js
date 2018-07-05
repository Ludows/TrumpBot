const discordAPI = require('./libs').Discord
const conf = require('./libs').config
const bot = require('./libs').bot
const trap = require('./libs').trollTrap

let trapEmail = new trap();

const autoload = require('./autoload')

bot.on('ready', function () {
  console.log("Je suis connecté !")
  bot.user.setActivity(`${bot.guilds.size} servers`);
  // console.log('test', test)
})

bot.on('message', message => {

  //Good Practice for your bot
  const args = message.content.slice(conf.prefix.length).trim().split(/ +/g);

  // trapEmail.checkSpamWord(args);

  if(message.content.indexOf(conf.prefix) !== 0) return;

  // console.log('returning args', args)
  const command = args.shift().toLowerCase();

  let cmd = bot.commands.get(command)

  if(cmd) {
    cmd.run(args, message)
  }



})

bot.login(conf.token)
