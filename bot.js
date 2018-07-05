var libs = require('./libs')
var autoload = require('./autoload')

libs.bot.on('ready', function () {
  console.log("Je suis connecté !")
  libs.bot.user.setActivity(`${libs.bot.guilds.size} servers`);
  // console.log('test', test)
})

libs.bot.on('message', message => {

  //Good Practice for your bot
  if(message.content.indexOf(libs.config.prefix) !== 0) return;

  const args = message.content.slice(libs.config.prefix.length).trim().split(/ +/g);
  // console.log('returning args', args)
  const command = args.shift().toLowerCase();

  let cmd = libs.bot.commands.get(command)

  if(cmd) {
    cmd.run(args, message)
  }


})















libs.bot.login(libs.config.token)
