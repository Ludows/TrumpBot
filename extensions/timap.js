var Sequelize = require('../libs').sequelize;
var dbDriver = require('../models/index').timap;
const Timap = require( '../models/timap/user')(dbDriver, Sequelize.DataTypes);
const Tasks = require( '../models/timap/tasks')(dbDriver, Sequelize.DataTypes);
const moment = require('moment');

const bot = require('../libs').bot

class timap {
    constructor(opts) {
        this.currentMessage = '';
    }
    // encrypt users
    async connect(collection) {
        
        
        var connection = await Timap.findOne({ username: collection.username });

        return connection;

        
    }
    unregister(message, args) {
        this.currentMessage = message;
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
        var curr_user = bot.users.get( message.author.id );
        console.log('message to connect timap table', curr_user)
        this.connect(curr_user).then((response) => {
            console.log('response from sequelize', response)
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
                    this.addTask(objectToSend);
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
    addTask(obj) {
        obj.hour = parseInt(obj.hour);
        obj.day = this.manageHours(obj.day);
        console.log('obj to addTask', obj);

        var that = this;

        
        Tasks.findOrCreate({
            where: obj
        }).spread( function(tag, created){
            console.log('created', created)
            if( created ){
                that.currentMessage.reply('Merci votre tache a été correctement affectée. Pour pouvoir la retirer au cas ou. l\'id de la tache est : '+ obj.task_id +'');
            }
            else {
                that.currentMessage.reply('Erreur, votre tache n\'a pas pu être sauvegardée. Veuillez recommencer.');
            }
        });

    }
    removeTask(obj) {
        console.log('test', obj)
        Tasks.destroy({
            where: obj
        }).spread( function(tag, detroyed){
            // console.log('created', created)
            if( detroyed ){
                that.currentMessage.reply('Merci votre tache a été correctement supprimée.');
            }
            else {
                that.currentMessage.reply('Erreur, votre tache n\'a pas pu être supprimée. Veuillez recommencer.');
            }
        });
    }


}
module.exports = timap;