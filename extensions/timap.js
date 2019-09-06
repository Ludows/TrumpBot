var Sequelize = require('../libs').sequelize;
var dbDriver = require('../models/index').timap;
const TimapUsers = require( '../models/timap/user')(dbDriver, Sequelize.DataTypes);
const Tasks = require( '../models/timap/tasks')(dbDriver, Sequelize.DataTypes);
const moment = require('moment');
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
var Helpers = require('./utils');
var discordAPI = require('../libs').Discord;
var Helper = new Helpers();
var Emojis = require('emojis')


const bot = require('../libs').bot

class timap {
    constructor(opts) {
        this.currentMessage = '';
        this.emojis = require('discord-emoji').objects;
    }
    // encrypt users
    async connect(collection) {
        
            
        
        var connection = await TimapUsers.findOne({ username: collection.username });

        return connection;

        
    }
    unregister(message, args) {
        this.currentMessage = message;
        this.currentArgs = args;
        var curr_user = bot.users.get( message.author.id );
        // console.log('message to connect timap table', curr_user)
        this.connect(curr_user).then((response) => {
            // console.log('response from sequelize', response)
            if(response) {
                // user found 
                var attrs = this.getAttributes(args);
                // console.log('attrs', attrs)
                
                // check des attributs requis 
                var check = this.mayThrowReplies('remove', attrs);
                if(check === true) {
                    return;
                }
                else {
                    // var 
                    var objectToSend = Object.assign({}, { task_id: attrs.taskId })    
                    this.removeTask(objectToSend);
                }

            }
            else {
                // no user found
            }
            // console.log('args from register', args);


        }).catch((err) => {
            console.log('err', err)
        })
    }
    register(message, args) {
        this.currentMessage = message;
        this.currentArgs = args;

        var curr_user = bot.users.get( message.author.id );
        // console.log('message to connect timap table', curr_user)
        this.connect(curr_user).then((response) => {
            // console.log('response from sequelize', response)
            if(response) {
                // user found 
                var attrs = this.getAttributes(args);
                console.log('attrs', attrs)
                
                // check des attributs requis 
                var check = this.mayThrowReplies('add', attrs);
                if(check === true) {
                    return;
                }
                else {
                    // var 
                    var objectToSend = Object.assign({}, attrs, { username: curr_user.username, task_id: this.generate_task_id(16) })  
                    this.addTask(objectToSend).then((str) => {
                        console.log('string executed', str)
                    });
                }

            }
            else {
                // no user found
            }
            // console.log('args from register', args);


        }).catch((err) => {
            console.log('err', err)
        })
        
    }
    randomNumber(length) {
        return Math.floor(Math.random() * length)
    }
    generate_task_id(length) {
        const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let text = "";
      
      for (let i = 0; i < length; i++) {
        text += possible.charAt(this.randomNumber(possible.length));
      }
      
      return text;
    }
    mayThrowReplies(label , obj) {
        let err = false;
        switch (label) {
            case 'add':
                if(!obj.task || !obj.hour || !obj.day) {
                    this.currentMessage.reply('Vous devez au minimum renseigner les attributes suivants task, hour, day');
                    err = true;
                }
                break;
            case 'remove':
                if(!obj.taskId) {
                    this.currentMessage.reply('Vous devez au minimum renseigner l\'attribut suivant : taskId');
                    err = true;
                }
                break;
        
            default:
                break;
        }
        
        return err;
    }
    getAttributes(array) {
        var obj = {};
        array.forEach((arg) => {
            if(arg.indexOf('=') > -1) {
               var verbs = arg.split('=');
               obj[verbs[0].trim()] = verbs[1].trim()
            }
        })
        return obj;
    }
    cron() {

    }
    async loadTasks(message, args) {
       var users = await TimapUsers.findAll();
       users.map(async (user) => {
            var TasksbyUser = await Tasks.findAll({where: {
                username: user.dataValues.username
            }})
            // console.log('Tasks by user', TasksbyUser);
       })
    }
    task() {

    }
    tasks() {
        // return this.tasks;
    }
    manageHours(string) {
        let rt;
        // console.log('manage hour', string)
        if(string === 'now') {
            // console.log('a')
          rt = moment().format();
        }
        else {
            // console.log('b')
            rt = moment(string); 
        }
        return rt;
    }
    async needUserSelection(html) {
        let rt;
        const embed = new discordAPI.RichEmbed()
        const selectedReactions = new Array();
        let $;
        $ = cheerio.load(html);
        var li = $('li');
        var that = this;

        var listingFieldsWithReactionsAttached = new Array();
        li.each(function(index, obj) {
            var text_libelle = $(obj).find('.libelleProjet').text();
		    console.log('text_libelle', text_libelle);

            // console.log('that.emojis', that.emojis);
            var first_level_keys = Object.keys(that.emojis);
            // console.log('first_level_keys', first_level_keys)
            var rand1 =  Math.floor(Math.random() * (Object.keys(that.emojis).length - 1));
            // console.log('rand1', rand1)

    
            
            var the_selected_emoji = {slug: first_level_keys[rand1], emoji : that.emojis[first_level_keys[rand1]]};

            
            
            embed.addField(text_libelle, ':'+the_selected_emoji.slug+':');
            selectedReactions.push(the_selected_emoji);
            listingFieldsWithReactionsAttached[index] = new Object();
            
            listingFieldsWithReactionsAttached[index].libelle = text_libelle;
            listingFieldsWithReactionsAttached[index].linkedReaction = the_selected_emoji;

            var attr1 = $(obj).attr('client_id');
            var attr2 = $(obj).attr('projet_id');

            if(typeof attr1 !== typeof undefined && attr1 !== false) {
                listingFieldsWithReactionsAttached[index].client_id = attr1;
            }

            if(typeof attr2 !== typeof undefined && attr2 !== false) {
                listingFieldsWithReactionsAttached[index].projet_id = attr2;
            }

    
        })

        // console.log('selectedReactions', selectedReactions)
        
        var instances_dependencies = {
            message : this.currentMessage,
            discord : discordAPI,
            args : this.currentArgs,
            embed: embed,
            reactions: selectedReactions,
            hooks : {
                reactionsAdded: (mess, reactionsAdded) => {
                    console.log('message id', mess.id)
                    console.log('reactionsAdded', reactionsAdded)
                    const filter = (reaction, user) => {
                        console.log('reaction in filter')
                        console.log('user filter')
                        return reactionsAdded.includes(reaction.emoji.name) && user.id === this.currentMessage.author.id;
                    };
                    
                    mess.awaitReactions(filter, { max: 1, time: 40000, errors: ['time'] })
                        .then(collected => {
                            console.log('collected succes', collected)
                            const reaction = collected.first();

                            console.log('listing', listingFieldsWithReactionsAttached)
                    
                            
                        })
                        .catch(collected => {
                            console.log('err collection', collected)
                            mess.reply('tu n\'as pas réagi à temps looser...');
                            mess.delete()
                        });
                }
            }
          }
          Helper.sender(instances_dependencies);

          

        rt = this.currentMessage
        // console.log('returning await reactions', rt);
        return rt;
          
    }
    async performRequest(obj) {
       let rt;
       rt = await axios(obj)
        return rt;
    }
    async manageProjects(string) {
        // console.log('manage task', string)
        var datas = { 'term': string.trim().toLowerCase(),'action': 'getListeClientBySearch'} 
        var getClientBySearch = await this.performRequest({
            method:'post',
            url: 'http://mediactive.timap.net/layouts/ajax_requests/projet.php',
            data: qs.stringify(datas),
            headers: {
                'Origin': 'http://mediactive.timap.net/', 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'PHPSESSID=tavk7enfbaul2ajsov8aicbfj0; identifyL=l.cointrel%40mediactive.fr; identifyP=mediactive',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}
        })
        console.log('getClientBySearch', getClientBySearch.data)
        let $;
        $ = cheerio.load(getClientBySearch.data)
        var li_s = $('li');

        
        // else {
            var client_id;
            var projet_id;
                if(li_s.length > 1) {
                    client_id = await this.needUserSelection(getClientBySearch.data); 
                }
                else {
                    client_id = li_s.attr('client_id');
                }

            var client_id_datas = { 'client_id': client_id ,'action': 'getListeVignetteByClientId'} 
            var getListeVignetteByClientId = await this.performRequest({
                method:'post',
                url: 'http://mediactive.timap.net/layouts/ajax_requests/projet.php',
                data: qs.stringify(client_id_datas),
                headers: {
                    'Origin': 'http://mediactive.timap.net/', 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': 'PHPSESSID=tavk7enfbaul2ajsov8aicbfj0; identifyL=l.cointrel%40mediactive.fr; identifyP=mediactive',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}
            })
            console.log('getListeVignetteByClientId', getListeVignetteByClientId.data)
            $ = cheerio.load(getListeVignetteByClientId.data);
            var tasks = $('li.task')

            if(tasks.length > 1) {
                projet_id = await this.needUserSelection(getListeVignetteByClientId.data); 
            }
            else {
                projet_id = tasks.attr('project_id');
            }
        // }

        return string;
    }
    async addTask(obj) {
        obj.hour = parseInt(obj.hour);
        obj.day = this.manageHours(obj.day);
        obj.task = await this.manageProjects(obj.task);
        console.log('obj to addTask', obj);

        var that = this;

        
        Tasks.findOrCreate({
            where: obj
        }).spread( function(tag, created){
            console.log('created', created)
            if( created ){
                that.currentMessage.reply('Merci votre tache a été correctement affectée. Pour pouvoir la retirer, la modifier au cas ou. l\'id de la tache est : '+ obj.task_id +'');
            }
            else {
                that.currentMessage.reply('Erreur, votre tache n\'a pas pu être sauvegardée. Veuillez recommencer.');
            }
        });

        return 'addTask executed';

    }
    removeTask(obj) {
        console.log('test', obj)
        
        var that = this;
        
        Tasks.destroy({
            where: obj
        }).then( function(detroyed){
            console.log('detroyed', detroyed)
            if( detroyed ){
                that.currentMessage.reply('Merci votre tache a été correctement supprimée.');
            }
            else {
                that.currentMessage.reply('Erreur, votre tache n\'a pas pu être supprimée. Veuillez recommencer.');
            }
        }).catch((err) => {
            that.currentMessage.reply('Erreur, votre tache n\'a pas pu être supprimée. Veuillez recommencer.');
        })
    }


}
module.exports = timap;