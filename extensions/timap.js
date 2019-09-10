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
var Emojis = require('emojis');
var puppeteer = require('puppeteer');


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
                    var objectToSend = Object.assign({}, { task_identifier: attrs.taskId })    
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
    manageHour(string) {
        let rt = {};
        console.log('string manage hour', string)
        
        var check = this.mayThrowReplies('hour', {hour: string});
        if(check === true) {
            return;
        }
        else {
            // var 
            if(string.indexOf('h') > -1) {
                var hours = string.split('h')
                var the_number = parseInt(hours[1].trim())
                // var possiblesFormats = [15, 30, 45];
                var adjustement = '';

                switch (the_number) {
                    case 15:
                        adjustement += '.25';
                        break;
                    case 30:
                        adjustement += '.50';
                        break;
                    case 45:
                        adjustement += '.75';
                        break;
                }
                
                rt.hour = hours[0]+adjustement;
            
            }
            else {
                rt.hour = string;
            }
        }
        return rt;

    }
    register(message, args) {
        this.currentMessage = message;
        this.currentArgs = args;

        var curr_user = bot.users.get( message.author.id );
        // console.log('message to connect timap table', curr_user)
        this.connect(curr_user).then(async (response) => {
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
                    var objectToSend = Object.assign({}, attrs, { username: curr_user.username, task_identifier: this.generate_task_id(16) })  
                    console.log('a')
                    var the_operateur = await this.manageOperateur(response);
                    console.log('the_operateur', the_operateur)
                    var the_day = await this.manageTime(objectToSend.day);
                    console.log('the_day', the_day)
                    var check2 = this.mayThrowReplies('hour', {hour: objectToSend.hour});
                    if(check2 === true) {
                        return;
                    }
                    else {
                        var the_hours = await this.manageHour(objectToSend.hour);
                        console.log('the_hours', the_hours)
                        var manage = await this.manageProjects(objectToSend.task);
                        console.log('c')
                        var objectToSendFinal = Object.assign({}, objectToSend, the_operateur, the_day, the_hours, manage)
                        console.log('objectToSendFinal', objectToSendFinal)
                        var exec = await this.addTask(objectToSendFinal);
                    }   
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
            case 'hour':
                if(obj.hour.indexOf('h') > -1) {
                    var hours = obj.hour.split('h')
                    var count = 0;
                    var the_number = parseInt(hours[1].trim())
                    var possiblesFormats = [15, 30, 45]
    
                    for (let index = 0; index < possiblesFormats.length; index++) {
                        const element = possiblesFormats[index];
                        if(the_number === element) {
                            count++;
                            break;
                        }
                        
                    }
    
                    if(count === 0) {
                        err = true;
                        this.currentMessage.reply('Le format spécifié des heures n\'est pas concordant.');
                    }
                }
                else {
                    /// le cas de 8, 7 , 6 
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
    async prepareTask(object) {
            let rt = {};
    //    console.log('prepare function', object)
    //    users.map(async (user) => {
            var TaskToPrepare = await Tasks.findOne({where: {
                username: object.username, 
                task_identifier: object.task_identifier
            }})
            // console.log('TaskToPrepare', TaskToPrepare);
            // TaskToPrepare.forEach(async(task) => {
                var datas_to_send = { 'modeAction': 'add','action': 'formEditTask', 'task_id': 0, 'date': TaskToPrepare.dataValues.timestamp, 'project_id': TaskToPrepare.dataValues.projet_id , 'absolu': 0, 'action_id': 0 } 
                var ModaleTask = await this.performRequest({
                    method:'post',
                    url: 'http://mediactive.timap.net/layouts/ajax_requests/calendar.php',
                    data: qs.stringify(datas_to_send),
                    headers: {
                        'Origin': 'http://mediactive.timap.net/', 
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'PHPSESSID=s52kh9u280t3ii186ok0tpt975; identifyL=l.cointrel%40mediactive.fr; identifyP=mediactive',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}
                })
                // console.log('TaskSended', ModaleTask)

                let $;
                $ = cheerio.load(ModaleTask.data);

                var ListingCurrentTask = new Array();
                var select_options = $('select[name="ts[action_id]"]').children();
                var listSelectOptionsText = '';

                listSelectOptionsText += 'Les activités associées sont: \n\n';

                listSelectOptionsText += 'Veuillez inscrire le nombre attaché à votre activité. \n\n';

                select_options.each(function(index, obj) {
                    ListingCurrentTask[index] = new Object();
                    ListingCurrentTask[index].value = $(this).attr('value'); 
                    ListingCurrentTask[index].text = $(this).text();
                    ListingCurrentTask[index].trackedIndex = parseInt((index + 1));
                    listSelectOptionsText += ''+ (index + 1) +' - '+$(this).text()+' \n';
                })

                var instances_dependencies = {
                    message : this.currentMessage,
                    discord : discordAPI,
                    args : this.currentArgs,
                    embed: listSelectOptionsText          
                }
                try {
                    var mess = await Helper.sender(instances_dependencies);
                    try {
                        var responseCollection = await mess.channel.awaitMessages(response => response.content, {
                            max: 1,
                            time: 40000,
                            errors: ['time']
                        })
                        // console.log('ListingCurrentTask', ListingCurrentTask)
                        // console.log('responseCollection', ) 
                        var collection = responseCollection.first();             
                        
                        if(collection.author.id === this.currentMessage.author.id) {
                           var id_str_content = parseInt(collection.content);
                           for (let index = 0; index < ListingCurrentTask.length; index++) {
                               const curr = ListingCurrentTask[index];
                               if(curr.trackedIndex === id_str_content) {
                                   console.log('passed step')
                                   rt.action_id = curr.value;
                                   await mess.delete();
                                   await collection.delete();
                                   break;
                               }
                               
                           }
                           
                           var textforCommentaire = '';

                           textforCommentaire += 'Veuillez inscrire un commentaire pour votre tâche s\'il vous plait : ';

                           var instances_dependencies_2 = {
                                message : this.currentMessage,
                                discord : discordAPI,
                                args : this.currentArgs,
                                embed: textforCommentaire          
                            }
                            try {
                                var mess2 = await Helper.sender(instances_dependencies_2);
                                try {
                                    var responseCollection2 = await mess2.channel.awaitMessages(response => response.content, {
                                        max: 1,
                                        time: 40000,
                                        errors: ['time']
                                    })

                                    var response_for_commentaire = responseCollection2.first();
                                    if(response_for_commentaire.author.id === this.currentMessage.author.id) {
                                        rt.commentaire = response_for_commentaire.content;
                                        await mess2.delete();
                                        await response_for_commentaire.delete();
                                    }
                                }
                                catch(err) {
                                    console.log('erreur');
                                    mess2.reply('erreur');
                                }
                            }
                            catch(err) {
                                console.log('erreur');
                                this.currentMessage.reply('erreur');
                            }


                        }
                    }
                    catch(err) {
                        console.log('erreur');
                        mess.reply('erreur');
                    }
                }
                catch(err) {
                    console.log('erreur');
                    this.currentMessage.reply('erreur');
                }
                
                return rt;
            // })
    //    })
    }
    task() {

    }
    tasks() {
        // return this.tasks;
    }
    async manageOperateur(object) {
        // console.log('manageOperateur', object);
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.goto('http://mediactive.timap.net/page.php');
        await page.type('input[name=identifiant]', object.dataValues.email);
        await page.type('input[name=password]', object.dataValues.password);
        await page.click('input[name=submitLogin]');
        let op = await page.$eval('a[operateurid]', el => el.getAttribute('operateurid'));
        // console.log('operateur id', op)
        await page.close();
        return {operateur_id: op};
    }
    manageTime(string) {
        let rt = new Object();
        // console.log('manage hour', string)
        if(string === 'now') {
            // console.log('a')
        //   console.log('unix timestamp', moment().startOf('day').unix())
          rt.timestamp = moment().startOf('day').unix();
        //   console.log('correct day format', moment().format('L'))
          rt.day = moment().format('L');
        }
        else {
            // console.log('b')
            rt.day = moment(string).format('L'); 
            rt.timestamp = moment(string).startOf('day').unix();
        }
        return rt;
    }
    async needUserSelection(html) {
        let rt;
        const embed = new discordAPI.RichEmbed()
        const selectedReactionsObject = new Array();
        const selectedReactionsArray = new Array();
        let $;
        $ = cheerio.load(html);
        var li = $('li');
        var that = this;

        var listingFieldsWithReactionsAttached = new Array();
        var text_libelle;
        li.each(function(index, obj) {
            if($(this).hasClass('task') == false) {
                text_libelle = $(this).find('.libelleProjet').contents().eq(0).text()
            }
            else {
                text_libelle = $(this).find('.libelleProjet').text();
            }
            //  = $(this).find('.libelleProjet').text();
		    // console.log('text_libelle', text_libelle);

            // console.log('that.emojis', that.emojis);
            var first_level_keys = Object.keys(that.emojis);
            // console.log('first_level_keys', first_level_keys)
            var rand1 =  Math.floor(Math.random() * (Object.keys(that.emojis).length - 1));
            // console.log('rand1', rand1)

    
            
            var the_selected_emoji = {slug: first_level_keys[rand1], emoji : that.emojis[first_level_keys[rand1]]};

            
            
            embed.addField(text_libelle, ':'+the_selected_emoji.slug+':');
            selectedReactionsObject.push(the_selected_emoji);
            selectedReactionsArray.push(the_selected_emoji.emoji);
            listingFieldsWithReactionsAttached[index] = new Object();
            
            listingFieldsWithReactionsAttached[index].libelle = text_libelle;
            listingFieldsWithReactionsAttached[index].linkedReaction = the_selected_emoji;

            var attr1 = $(this).children().first().attr('clientid');
            var attr2 = $(this).children().first().attr('projetid');
            // console.log('attr1', attr1)
            // console.log('attr2', attr2) 

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
            embed: embed          
        }
          
        

        const filter = (reaction, user) => {
            // console.log('reaction in filter')
            // console.log('user filter')
            return selectedReactionsArray.includes(reaction.emoji.name) && user.id === this.currentMessage.author.id;
          };
          try {
            var mess = await Helper.sender(instances_dependencies);

            if(selectedReactionsArray && selectedReactionsArray.length > 0) {
    
                selectedReactionsArray.forEach(async (reaction) => {             
                  // console.log('emoji unicode ?', emojis.unicode(reaction))
    
                  
                  await mess.react(reaction);
                  // await arrayEmojis.push(reaction.emoji);
                })
                
              }


            var collected = await mess.awaitReactions(filter, { max: 1, time: 40000, errors: ['time'] });
                // console.log("ddfddf", debugTest)
                const reaction = collected.first();
                // console.log('reaction', reaction._emoji.name)

                // console.log('listing', listingFieldsWithReactionsAttached);

                listingFieldsWithReactionsAttached.forEach((field) => {
                    if(reaction._emoji.name === field.linkedReaction.emoji) {
                        // console.log('tracked');
                        rt = new Object();
                        
                        // rt.selected = true;
                        
                        if(field.client_id) {
                            rt.folder = field.libelle;
                            rt.client_id = field.client_id;
                        }
                        if(field.projet_id) {
                            rt.projet_id = field.projet_id;
                            rt.task = field.libelle;
                        }
                    }
                    else {
                        // rt.selected = false;
                    }
                })
                mess.delete()

        } catch(err) {
            console.log(err); // TypeError: failed to fetch
            console.log('err collection', collected)
            mess.reply('tu n\'as pas réagi à temps looser...');
            mess.delete()
        }
        

        

          

        // rt = 'yolo'
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
                'Cookie': 'PHPSESSID=s52kh9u280t3ii186ok0tpt975; identifyL=l.cointrel%40mediactive.fr; identifyP=mediactive',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}
        })
        // console.log('getClientBySearch', getClientBySearch.data)
        let $;
        $ = cheerio.load(getClientBySearch.data)
        var li_s = $('li');

        
        // else {
            //  response_for_user;
            var client_id;
            var projet_id;
            var response_for_user;
                if(li_s.length > 1) {
                    response_for_user = await this.needUserSelection(getClientBySearch.data); 
                    response_for_user.search = string.trim().toLowerCase();
                    // client_id = await this.needUserSelection(getClientBySearch.data); 
                    // console.log('response_for_user vignette projets', response_for_user)
                    }
                else {
                    response_for_user = new Object();
                    response_for_user.search = string.trim().toLowerCase();
                    response_for_user.client_id = li_s.children().first().attr('clientid');
                    response_for_user.folder = li_s.find('.libelleProjet').contents().eq(0).text()
                }
            
            

            var client_id_datas = { 'client_id': response_for_user.client_id ,'action': 'getListeVignetteByClientId'} 
            var getListeVignetteByClientId = await this.performRequest({
                method:'post',
                url: 'http://mediactive.timap.net/layouts/ajax_requests/projet.php',
                data: qs.stringify(client_id_datas),
                headers: {
                    'Origin': 'http://mediactive.timap.net/', 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': 'PHPSESSID=s52kh9u280t3ii186ok0tpt975; identifyL=l.cointrel%40mediactive.fr; identifyP=mediactive',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}
            })
            // console.log('getListeVignetteByClientId', getListeVignetteByClientId.data)
            $ = cheerio.load(getListeVignetteByClientId.data);
            var tasks = $('li.task')

            if(tasks.length > 1) {
                // projet_id = await this.needUserSelection(getListeVignetteByClientId.data); 
                response_for_user = Object.assign({}, response_for_user, await this.needUserSelection(getListeVignetteByClientId.data)); 
                    // client_id = await this.needUserSelection(getClientBySearch.data); 
                // console.log('response_for_user', response_for_user)
            }
            else {
                response_for_user.project_id = tasks.children().first().attr('projectid');
                response_for_user.task = tasks.find('.libelleProjet').text();
            }
        // }

        // console.log('receive datas from manage Projects', response_for_user);

        return response_for_user;
    }
    async addTask(obj) {
        
        if(obj.hour.indexOf('.') > -1) {
            obj.hour = parseFloat(obj.hour);  
        }
        else {
            obj.hour = parseInt(obj.hour);
        }
        obj.operateur_id = parseInt(obj.operateur_id);
        obj.client_id = parseInt(obj.client_id);
        obj.projet_id = parseInt(obj.projet_id);
        var that = this;

        
        Tasks.findOrCreate({
            where: obj
        }).spread(async function(tag, created){
            console.log('created', created)
            if( created ){
                // that.currentMessage.reply('Merci votre tache a été correctement affectée. Pour pouvoir la retirer, la modifier au cas ou. l\'id de la tache est : '+ obj.task_id +'');
                let prepareState = await that.prepareTask(obj)
                console.log('prepareState', prepareState)
                Tasks.update(
                    prepareState,
                    {where: {
                        task_identifier: obj.task_identifier
                    }}
                ).then(() => {
                    that.currentMessage.reply('Merci votre tache a été correctement affectée. Pour pouvoir la retirer, la modifier au cas ou. l\'id de la tache est : '+ obj.task_identifier +'');

                })

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